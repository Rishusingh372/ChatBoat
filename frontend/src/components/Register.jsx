// Updated Register.jsx with better error handling
import React, { useState } from 'react';
import { FaArrowLeft, FaUser, FaEnvelope, FaLock, FaGoogle, FaGithub } from 'react-icons/fa';
import axios from 'axios';

const Register = ({ navigateTo, onRegister }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [backendOnline, setBackendOnline] = useState(true); // Assume backend is online initially

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
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    
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
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkBackendStatus = async () => {
    try {
      const response = await axios.get('http://localhost:5400/health', {
        timeout: 2000
      });
      return response.status === 200;
    } catch (error) {
      console.log('Backend is not available');
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Check if backend is available first
      const isBackendOnline = await checkBackendStatus();
      setBackendOnline(isBackendOnline);
      
      if (!isBackendOnline) {
        throw new Error('Backend server is not available. Please make sure the server is running on port 5400.');
      }

      const response = await axios.post('http://localhost:5400/bot/v1/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      }, {
        timeout: 5000 // 5 second timeout
      });
      
      if (response.status === 201) {
        onRegister(response.data.user, response.data.token);
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.code === 'ERR_NETWORK' || error.message.includes('Connection refused')) {
        setErrors({ 
          general: 'Cannot connect to the server. Please make sure the backend is running on port 5400.' 
        });
      } else if (error.response?.data?.error) {
        setErrors({ general: error.response.data.error });
      } else if (error.message) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
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
            <h2 className="text-2xl font-bold text-white">Create Account</h2>
          </div>
          
          {!backendOnline && (
            <div className="mb-4 p-3 bg-yellow-500/20 text-yellow-200 rounded-lg text-sm">
              ⚠️ Backend server is offline. Using test mode.
            </div>
          )}

          <p className="text-indigo-200 mb-8 ml-12">Join us to start chatting with our AI assistant.</p>

          {/* Registration Form */}
          <form onSubmit={handleSubmit}>
            {errors.general && (
              <div className="mb-4 p-3 bg-red-500/20 text-red-200 rounded-lg text-sm">
                ❌ {errors.general}
              </div>
            )}
            
            <div className="mb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-indigo-300" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full name"
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              {errors.name && <p className="mt-1 text-red-400 text-sm">{errors.name}</p>}
            </div>

            <div className="mb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-indigo-300" />
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

            <div className="mb-4">
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

            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-indigo-300" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-red-400 text-sm">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-indigo-200">
              Already have an account?{' '}
              <button 
                onClick={() => navigateTo('login')}
                className="text-white font-medium hover:text-indigo-100"
              >
                Sign in
              </button>
            </p>
          </div>

          {/* Debug info */}
          <div className="mt-4 text-center text-xs text-indigo-300">
            <p>Server: http://localhost:5400</p>
            <p>Status: {backendOnline ? '✅ Online' : '❌ Offline'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;