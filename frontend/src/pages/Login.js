import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import Card from '../components/Card';
import Alert from '../components/Alert';
import { validateEmail } from '../utils/helpers';

const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useContext(AuthContext);
  const { startLoading, stopLoading, forceStopLoading } = useLoading();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  
  // Force stop any existing loading when component mounts or unmounts
  useEffect(() => {
    forceStopLoading();
    return () => forceStopLoading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear errors when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    startLoading('Signing you in...');
    
    try {
      const result = await login(formData);
      
      if (result.success) {
        toast.success('Login successful!');
        stopLoading();
        
        // Add a small delay before navigating to ensure loading state is cleared
        setTimeout(() => {
          // Use replace instead of push to prevent back button issues
          navigate('/dashboard', { 
            state: { fromLogin: true },
            replace: true 
          });
        }, 100);
      } else {
        throw new Error(result.message || 'Login failed');
      }
    } catch (error) {
      setApiError(error.message || 'Failed to login. Please check your credentials.');
      stopLoading();
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">Sign In</h1>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-primary hover:text-primary-dark">
              create a new account
            </Link>
          </p>
        </div>
        
        {apiError && (
          <Alert 
            type="danger" 
            message={apiError} 
            className="mb-4" 
            onDismiss={() => setApiError('')} 
          />
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            label="Email"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            autoComplete="email"
          />
          
          <FormInput
            label="Password"
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
            autoComplete="current-password"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>
            
            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-primary hover:text-primary-dark">
                Forgot your password?
              </Link>
            </div>
          </div>
          
          <Button 
            type="submit" 
            fullWidth 
            isLoading={isLoading}
            disabled={isLoading}
          >
            Sign In
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login; 