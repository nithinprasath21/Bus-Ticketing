import React, { useState } from 'react';
import { useForgotPasswordMutation } from '../api/authApi';

interface ForgotPasswordProps {
  onNavigate: (view: 'signin') => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onNavigate }) => {
  const [form, setForm] = useState({
    email: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.email || !form.newPassword || !form.confirmPassword) {
      return setError('All fields are required');
    }
    if (form.newPassword !== form.confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      const res: any = await forgotPassword({
        email: form.email,
        newPassword: form.newPassword,
      }).unwrap();

      if (res.success) {
        setSuccess('Password reset successful');
        setForm({ email: '', newPassword: '', confirmPassword: '' });
      } else {
        setError('Reset failed. Try again.');
      }
    } catch (err: any) {
      setError(err?.data?.message || 'An error occurred.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-semibold text-white text-center mb-2">Reset Password</h2>
        <p className="text-sm text-gray-400 text-center mb-6">Enter your details to reset password</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              New Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="newPassword"
              required
              value={form.newPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-400">{success}</p>}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md transition"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
          <p className="text-sm text-gray-400 text-center mt-3">
            Back to{' '}
            <button onClick={() => onNavigate('signin')} className="text-blue-400 hover:underline">
              Sign in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
