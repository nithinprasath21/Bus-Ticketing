import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ForgotPassword from '../components/ForgotPassword';
import { apiSlice } from '../api/apiSlice';
import { useForgotPasswordMutation } from '../api/authApi';

jest.mock('../api/authApi', () => ({
  ...jest.requireActual('../api/authApi'),
  useForgotPasswordMutation: jest.fn(),
}));

const createTestStore = () => configureStore({
  reducer: { [apiSlice.reducerPath]: apiSlice.reducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
});

const renderWithProviders = (ui: React.ReactElement, { store = createTestStore(), ...renderOptions } = {}) => (
  render(<Provider store={store}>{ui}</Provider>, renderOptions)
);

describe('ForgotPassword Component Tests', () => {
  let mockForgotPassword: jest.Mock;
  let mockOnNavigate: jest.Mock;
  let defaultProps: { onNavigate: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();
    mockForgotPassword = jest.fn();
    (useForgotPasswordMutation as jest.Mock).mockReturnValue([
      mockForgotPassword,
      { isLoading: false, error: null, isSuccess: false, isError: false },
    ]);
    mockOnNavigate = jest.fn();
    defaultProps = { onNavigate: mockOnNavigate };
  });

  test('renders the "Reset Password" heading', () => {
    renderWithProviders(<ForgotPassword {...defaultProps} />);
    expect(screen.getByRole('heading', { name: /reset password/i })).toBeInTheDocument();
  });

  test('renders all input fields and the submit button', () => {
    renderWithProviders(<ForgotPassword {...defaultProps} />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  test('updates form state on input change', () => {
    renderWithProviders(<ForgotPassword {...defaultProps} />);
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const newPasswordInput = screen.getByLabelText(/new password/i) as HTMLInputElement;
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i) as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');

    fireEvent.change(newPasswordInput, { target: { value: 'newPass123' } });
    expect(newPasswordInput.value).toBe('newPass123');

    fireEvent.change(confirmPasswordInput, { target: { value: 'newPass123' } });
    expect(confirmPasswordInput.value).toBe('newPass123');
  });

  test('displays "Passwords do not match" error if new password and confirm password do not match', async () => {
    renderWithProviders(<ForgotPassword {...defaultProps} />);
    const newPasswordInput = screen.getByLabelText(/new password/i) as HTMLInputElement;
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i) as HTMLInputElement;

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } }); // Ensure email is filled
    fireEvent.change(newPasswordInput, { target: { value: 'newPass123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'differentPass' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeVisible();
    });
    expect(mockForgotPassword).not.toHaveBeenCalled();
  });

  test('calls the forgotPassword mutation with email and newPassword on successful validation', async () => {
    mockForgotPassword.mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({ success: true }),
    });
    renderWithProviders(<ForgotPassword {...defaultProps} />);
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const newPasswordInput = screen.getByLabelText(/new password/i) as HTMLInputElement;
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i) as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(newPasswordInput, { target: { value: 'newSecurePass' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newSecurePass' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(mockForgotPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        newPassword: 'newSecurePass',
      });
    });
  });

  test('displays success message after successful password reset', async () => {
    mockForgotPassword.mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({ success: true }),
    });
    renderWithProviders(<ForgotPassword {...defaultProps} />);
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const newPasswordInput = screen.getByLabelText(/new password/i) as HTMLInputElement;
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i) as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(newPasswordInput, { target: { value: 'newSecurePass' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newSecurePass' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(screen.getByText(/password reset successful/i)).toBeVisible();
    });
  });

  test('displays error message after failed password reset', async () => {
    mockForgotPassword.mockReturnValue({
      unwrap: jest.fn().mockRejectedValue({ data: { message: 'Reset failed from API' } }),
    });
    renderWithProviders(<ForgotPassword {...defaultProps} />);
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const newPasswordInput = screen.getByLabelText(/new password/i) as HTMLInputElement;
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i) as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(newPasswordInput, { target: { value: 'newSecurePass' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newSecurePass' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(screen.getByText(/reset failed from api/i)).toBeVisible();
    });
  });

  test('displays generic error message if API error has no message', async () => {
    mockForgotPassword.mockReturnValue({
      unwrap: jest.fn().mockRejectedValue({ data: {} }),
    });
    renderWithProviders(<ForgotPassword {...defaultProps} />);
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const newPasswordInput = screen.getByLabelText(/new password/i) as HTMLInputElement;
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i) as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(newPasswordInput, { target: { value: 'newSecurePass' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newSecurePass' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(screen.getByText(/an error occurred\./i)).toBeVisible();
    });
  });

  test('disables the submit button while loading', () => {
    (useForgotPasswordMutation as jest.Mock).mockReturnValue([
      mockForgotPassword,
      { isLoading: true, error: null, isSuccess: false, isError: false },
    ]);
    renderWithProviders(<ForgotPassword {...defaultProps} />);
    expect(screen.getByRole('button', { name: /sending\.\.\./i })).toBeDisabled();
  });

  test('enables the submit button when not loading', () => {
    renderWithProviders(<ForgotPassword {...defaultProps} />);
    expect(screen.getByRole('button', { name: /send/i })).toBeEnabled();
  });

  test('navigates to signin page when "Sign in" button is clicked', () => {
    renderWithProviders(<ForgotPassword {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(mockOnNavigate).toHaveBeenCalledWith('signin');
  });
});