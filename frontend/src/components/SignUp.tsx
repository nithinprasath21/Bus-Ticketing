import React, { useState } from 'react';
import { useRegisterMutation } from '../api/authApi';

interface SignUpProps {
  onNavigate: (view: 'signin') => void;
}

const SignUp: React.FC<SignUpProps> = ({ onNavigate }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'passenger',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [register, { isLoading }] = useRegisterMutation();

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^\d{10}$/.test(phone);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateEmail(form.email)) return setError('Invalid email format');
    if (!validatePhone(form.phone)) return setError('Phone must be 10 digits');

    try {
      const res: any = await register(form).unwrap();
      if (res.success) {
        setSuccess('Registration successful. You can now log in.');
        setForm({ name: '', email: '', phone: '', password: '', role: 'passenger' });
      } else {
        setError('Signup failed. Try again.');
      }
    } catch (err: any) {
      setError(err?.data?.message || 'An error occurred during signup.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-semibold text-white text-center mb-2">Sign Up</h2>
        <p className="text-sm text-gray-400 text-center mb-6">Create your account</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {['name', 'email', 'phone', 'password'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-300 mb-1 capitalize">
                {field} <span className="text-red-500">*</span>
              </label>
              <input
                type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                name={field}
                required
                value={(form as any)[field]}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full h-[42px] px-3 bg-gray-800 border border-gray-700 rounded-md text-sm text-white"
            >
              <option value="passenger">Passenger</option>
              <option value="operator">Operator</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-400">{success}</p>}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md transition"
            disabled={isLoading}
          >
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </button>
          <p className="text-sm text-gray-400 text-center mt-3">
            Already have an account?{' '}
            <button onClick={() => onNavigate('signin')} className="text-blue-400 hover:underline">
              Sign in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
