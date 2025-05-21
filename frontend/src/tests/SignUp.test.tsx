import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SignUp from '../components/SignUp';
import { apiSlice } from '../api/apiSlice';
import { useRegisterMutation } from '../api/authApi';

jest.mock('../api/authApi', () => ({
  ...jest.requireActual('../api/authApi'),
  useRegisterMutation: jest.fn(),
}));

const createTestStore = () => configureStore({
  reducer: { [apiSlice.reducerPath]: apiSlice.reducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
});

const renderWithProviders = (ui: React.ReactElement, { store = createTestStore(), ...renderOptions } = {}) => (
  render(<Provider store={store}>{ui}</Provider>, renderOptions)
);

describe('SignUp Component Tests', () => {
  let mockRegister: jest.Mock;
  let mockOnNavigate: jest.Mock;
  let defaultProps: { onNavigate: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();
    mockRegister = jest.fn();
    (useRegisterMutation as jest.Mock).mockReturnValue([
      mockRegister,
      { isLoading: false, error: null, isSuccess: false, isError: false },
    ]);
    mockOnNavigate = jest.fn();
    defaultProps = { onNavigate: mockOnNavigate };
  });

  test('renders the "Sign Up" heading', () => {
    renderWithProviders(<SignUp {...defaultProps} />);
    expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument();
  });

  test('renders all input fields and the select field', () => {
    renderWithProviders(<SignUp {...defaultProps} />);
    expect(screen.getByTestId('signup-name')).toBeInTheDocument();
    expect(screen.getByTestId('signup-email')).toBeInTheDocument();
    expect(screen.getByTestId('signup-phone')).toBeInTheDocument();
    expect(screen.getByTestId('signup-password')).toBeInTheDocument();
    expect(screen.getByTestId('signup-role')).toBeInTheDocument();
  });

  test('updates form state on input change for name field', () => {
    renderWithProviders(<SignUp {...defaultProps} />);
    const nameInput = screen.getByTestId('signup-name') as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    expect(nameInput.value).toBe('John Doe');
  });

  test('updates form state on input change for email field', () => {
    renderWithProviders(<SignUp {...defaultProps} />);
    const emailInput = screen.getByTestId('signup-email') as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
  });

  test('updates form state on input change for phone field', () => {
    renderWithProviders(<SignUp {...defaultProps} />);
    const phoneInput = screen.getByTestId('signup-phone') as HTMLInputElement;
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    expect(phoneInput.value).toBe('1234567890');
  });

  test('updates form state on input change for password field', () => {
    renderWithProviders(<SignUp {...defaultProps} />);
    const passwordInput = screen.getByTestId('signup-password') as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(passwordInput.value).toBe('password123');
  });

  test('updates form state on select change for role field', () => {
    renderWithProviders(<SignUp {...defaultProps} />);
    const roleSelect = screen.getByTestId('signup-role') as HTMLSelectElement;
    fireEvent.change(roleSelect, { target: { value: 'operator' } });
    expect(roleSelect.value).toBe('operator');
  });

  test('calls the register mutation with form data on successful submission', async () => {
    mockRegister.mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({ success: true }),
    });
    renderWithProviders(<SignUp {...defaultProps} />);
    fireEvent.change(screen.getByTestId('signup-name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByTestId('signup-email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('signup-phone'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByTestId('signup-password'), { target: { value: 'securePass' } });
    fireEvent.change(screen.getByTestId('signup-role'), { target: { value: 'admin' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        password: 'securePass',
        role: 'admin',
      });
    });
  });

  test('displays success message after successful registration', async () => {
    mockRegister.mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({ success: true }),
    });
    renderWithProviders(<SignUp {...defaultProps} />);
    fireEvent.change(screen.getByTestId('signup-name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByTestId('signup-email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('signup-phone'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByTestId('signup-password'), { target: { value: 'securePass' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/registration successful\. you can now log in\./i)).toBeInTheDocument();
    });
  });

  test('displays error message after failed registration', async () => {
    mockRegister.mockReturnValue({
      unwrap: jest.fn().mockRejectedValue({ data: { message: 'Signup failed from API' } }),
    });
    renderWithProviders(<SignUp {...defaultProps} />);
    fireEvent.change(screen.getByTestId('signup-name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByTestId('signup-email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('signup-phone'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByTestId('signup-password'), { target: { value: 'securePass' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/signup failed from api/i)).toBeInTheDocument();
    });
  });

  test('displays generic error message if API error has no message', async () => {
    mockRegister.mockReturnValue({
      unwrap: jest.fn().mockRejectedValue({ data: {} }),
    });
    renderWithProviders(<SignUp {...defaultProps} />);
    fireEvent.change(screen.getByTestId('signup-name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByTestId('signup-email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('signup-phone'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByTestId('signup-password'), { target: { value: 'securePass' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/an error occurred during signup\./i)).toBeInTheDocument();
    });
  });

  test('navigates to signin page when "Already have an account? Sign in" button is clicked', () => {
    renderWithProviders(<SignUp {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(mockOnNavigate).toHaveBeenCalledWith('signin');
  });

  test('disables the submit button while loading', () => {
    (useRegisterMutation as jest.Mock).mockReturnValue([
      mockRegister,
      { isLoading: true, error: null, isSuccess: false, isError: false },
    ]);
    renderWithProviders(<SignUp {...defaultProps} />);
    expect(screen.getByRole('button', { name: /signing up\.\.\./i })).toBeDisabled();
  });

  test('enables the submit button when not loading', () => {
    renderWithProviders(<SignUp {...defaultProps} />);
    expect(screen.getByRole('button', { name: /sign up/i })).toBeEnabled();
  });
});