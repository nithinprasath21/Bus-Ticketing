import React, { useState } from "react";
import api from "../api";

interface SignInProps {
  onNavigate: (view: "signup" | "forgot" | "passenger" | "operator" | "admin") => void;
  onLoginSuccess: (role: "passenger" | "operator" | "admin") => void;
}

const SignIn: React.FC<SignInProps> = ({ onNavigate, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });

      if (res.data.success) {
        const { token, role } = res.data.data;
        localStorage.setItem("token", token);

        if (["passenger", "operator", "admin"].includes(role)) {
          onLoginSuccess(role as "passenger" | "operator" | "admin");
        } else {
          setError("Unknown role received.");
        }
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "An error occurred during login.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-semibold text-white text-center mb-2">Login</h2>
        <p className="text-sm text-gray-400 text-center mb-6">
          Enter your email below to login
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-gray-300 block mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded-md text-white text-sm"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm text-gray-300">
                Password <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => onNavigate("forgot")}
                className="text-sm text-blue-400 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded-md text-white text-sm"
            />
          </div>
  
          {error && <p className="text-sm text-red-500">{error}</p>}
  
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
          >
            Login
          </button>
  
          <div className="text-sm text-center text-gray-400 mt-4">
            Don't have an account?{" "}
            <button
              className="text-blue-400 hover:underline"
              onClick={() => onNavigate("signup")}
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );  
};

export default SignIn;
