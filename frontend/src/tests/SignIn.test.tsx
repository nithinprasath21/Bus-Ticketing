import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SignIn from '../components/SignIn';
import { apiSlice } from '../api/apiSlice';
import { useLoginMutation } from '../api/authApi';

jest.mock('../api/authApi', () => ({
  ...jest.requireActual('../api/authApi'),
  useLoginMutation: jest.fn(),
}));

let mockStorageData: { [key: string]: string } = {};

const mockLocalStorage = {
  getItem: jest.fn((key: string): string | null => mockStorageData[key] || null),
  setItem: jest.fn((key: string, value: string): void => {
    mockStorageData[key] = value.toString();
  }),
  removeItem: jest.fn((key: string): void => {
    delete mockStorageData[key];
  }),
  clear: jest.fn((): void => {
    mockStorageData = {};
  }),
  get length(): number {
    return Object.keys(mockStorageData).length;
  },
  key: jest.fn((index: number): string | null => Object.keys(mockStorageData)[index] || null),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true
});

const createTestStore = () => {
  return configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });
};

const renderWithProviders = (
  ui: React.ReactElement,
  { store = createTestStore(), ...renderOptions } = {}
) => {
  return render(<Provider store={store}>{ui}</Provider>, renderOptions);
};

describe('SignIn Component', () => {
  let mockLogin: jest.Mock;
  let mockOnNavigate: jest.Mock;
  let mockOnLoginSuccess: jest.Mock;
  let defaultProps: {
    onNavigate: jest.Mock;
    onLoginSuccess: jest.Mock;
  };

  beforeEach(() => {
    mockStorageData = {};
    jest.clearAllMocks();

    mockLogin = jest.fn();
    (useLoginMutation as jest.Mock).mockReturnValue([
      mockLogin,
      { isLoading: false, error: null, isSuccess: false, isError: false },
    ]);

    mockOnNavigate = jest.fn();
    mockOnLoginSuccess = jest.fn();

    defaultProps = {
      onNavigate: mockOnNavigate,
      onLoginSuccess: mockOnLoginSuccess,
    };
  });


  test('renders the SignIn form correctly', () => {
    renderWithProviders(<SignIn {...defaultProps} />);
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    const passwordLabels = screen.getAllByLabelText(/password/i);
    expect(passwordLabels[0]).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /forgot password\?/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  test('allows user to type in email and password fields', () => {
    renderWithProviders(<SignIn {...defaultProps} />);
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText((content, element) => {
        return element?.tagName.toLowerCase() === 'input' && content.startsWith('Password');
    }) as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('handles successful login for a passenger', async () => {
    const token = 'test-token';
    const role = 'passenger';
    mockLogin.mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({ success: true, data: { token, role } }),
    });

    renderWithProviders(<SignIn {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'passenger@example.com' } });
    fireEvent.change(screen.getByLabelText((content, element) => element?.tagName.toLowerCase() === 'input' && content.startsWith('Password')), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({ email: 'passenger@example.com', password: 'password' });
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', token);
      expect(mockOnLoginSuccess).toHaveBeenCalledWith(role);
      expect(screen.queryByText(/login failed/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/an error occurred/i)).not.toBeInTheDocument();
    });
  });

  test('handles successful login for an operator', async () => {
    const token = 'operator-token';
    const role = 'operator';
    mockLogin.mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({ success: true, data: { token, role } }),
    });

    renderWithProviders(<SignIn {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'operator@example.com' } });
    fireEvent.change(screen.getByLabelText((content, element) => element?.tagName.toLowerCase() === 'input' && content.startsWith('Password')), { target: { value: 'opPassword' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({ email: 'operator@example.com', password: 'opPassword' });
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', token);
      expect(mockOnLoginSuccess).toHaveBeenCalledWith(role);
    });
  });


  test('handles login failure from API (res.success is false)', async () => {
    mockLogin.mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({ success: false }),
    });

    renderWithProviders(<SignIn {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText((content, element) => element?.tagName.toLowerCase() === 'input' && content.startsWith('Password')), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText('Login failed. Please try again.')).toBeInTheDocument();
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
      expect(mockOnLoginSuccess).not.toHaveBeenCalled();
    });
  });

  test('handles login failure due to server/network error', async () => {
    const errorMessage = 'Network error, please try again later.';
    mockLogin.mockReturnValue({
      unwrap: jest.fn().mockRejectedValue({ data: { message: errorMessage } }),
    });

    renderWithProviders(<SignIn {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText((content, element) => element?.tagName.toLowerCase() === 'input' && content.startsWith('Password')), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
      expect(mockOnLoginSuccess).not.toHaveBeenCalled();
    });
  });

  test('handles login failure with unknown role', async () => {
    const token = 'test-token';
    const role = 'guest';
    mockLogin.mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({ success: true, data: { token, role } }),
    });

    renderWithProviders(<SignIn {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'guest@example.com' } });
    fireEvent.change(screen.getByLabelText((content, element) => element?.tagName.toLowerCase() === 'input' && content.startsWith('Password')), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', token);
      expect(screen.getByText('Unknown role received.')).toBeInTheDocument();
      expect(mockOnLoginSuccess).not.toHaveBeenCalled();
    });
  });

  test('shows loading state when login is in progress', () => {
    const loginTriggerFn = jest.fn(() => new Promise(() => {}));

    (useLoginMutation as jest.Mock).mockReturnValue([
      loginTriggerFn,
      { isLoading: true, error: null, isSuccess: false, isError: false },
    ]);

    renderWithProviders(<SignIn {...defaultProps} />);
    const loadingButton = screen.getByRole('button', { name: /logging in\.\.\./i });
    expect(loadingButton).toBeInTheDocument();
    expect(loadingButton).toBeDisabled();
  });

  test('navigates to signup page when "Sign up" button is clicked', () => {
    renderWithProviders(<SignIn {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    expect(mockOnNavigate).toHaveBeenCalledWith('signup');
  });

  test('navigates to forgot password page when "Forgot password?" button is clicked', () => {
    renderWithProviders(<SignIn {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /forgot password\?/i }));
    expect(mockOnNavigate).toHaveBeenCalledWith('forgot');
  });

  test('form submission is prevented if fields are empty and shows HTML5 validation', () => {
    renderWithProviders(<SignIn {...defaultProps} />);
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);

    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockOnLoginSuccess).not.toHaveBeenCalled();

    expect(screen.getByLabelText(/email/i)).toBeRequired();
    expect(screen.getByLabelText((content, element) => element?.tagName.toLowerCase() === 'input' && content.startsWith('Password'))).toBeRequired();
  });
});
