import React, { useState } from 'react';
import { FaArrowLeft, FaUser, FaLock, FaGoogle, FaGithub } from 'react-icons/fa';
import axios from 'axios';

const Login = ({ navigateTo, onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5400/bot/v1/auth/login', formData);
      
      if (response.status === 200) {
        onLogin(response.data.user, response.data.token);
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.data?.error) {
        setErrors({ general: error.response.data.error });
      } else {
        setErrors({ general: 'Login failed. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl">
          {/* Header */}
          <div className="flex items-center mb-2">
            <button 
              onClick={() => navigateTo('home')}
              className="text-white mr-4 p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <FaArrowLeft />
            </button>
            <h2 className="text-2xl font-bold text-white">Sign In to BotSpoof</h2>
          </div>
          <p className="text-indigo-200 mb-8 ml-12">Welcome back! Please enter your details.</p>

          {/* Social Login Buttons */}
          <div className="flex gap-4 mb-6">
            <button className="flex-1 flex items-center justify-center gap-2 bg-white/10 text-white py-2.5 rounded-lg hover:bg-white/20 transition-colors">
              <FaGoogle />
              <span>Google</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-white/10 text-white py-2.5 rounded-lg hover:bg-white/20 transition-colors">
              <FaGithub />
              <span>GitHub</span>
            </button>
          </div>

          <div className="relative flex items-center my-6">
            <div className="flex-1 border-t border-white/20"></div>
            <span className="px-3 text-sm text-indigo-200">or continue with email</span>
            <div className="flex-1 border-t border-white/20"></div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            {errors.general && (
              <div className="mb-4 p-3 bg-red-500/20 text-red-200 rounded-lg text-sm">
                {errors.general}
              </div>
            )}
            
            <div className="mb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-indigo-300" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              {errors.email && <p className="mt-1 text-red-400 text-sm">{errors.email}</p>}
            </div>

            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-indigo-300" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              {errors.password && <p className="mt-1 text-red-400 text-sm">{errors.password}</p>}
            </div>

            <div className="flex justify-between items-center mb-6">
              <label className="flex items-center text-indigo-200">
                <input type="checkbox" className="rounded bg-white/5 border-white/10 text-indigo-600 focus:ring-indigo-500" />
                <span className="ml-2 text-sm">Remember me</span>
              </label>
              <button type="button" className="text-sm text-indigo-300 hover:text-indigo-100">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-indigo-200">
              Don't have an account?{' '}
              <button 
                onClick={() => navigateTo('register')}
                className="text-white font-medium hover:text-indigo-100"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;