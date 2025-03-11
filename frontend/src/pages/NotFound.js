import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <h1 className="text-9xl font-extrabold text-primary">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mt-4">Page Not Found</h2>
          <p className="mt-2 text-lg text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
          <Link to="/">
            <Button variant="primary">
              Go Home
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline">
              Go to Dashboard
            </Button>
          </Link>
        </div>
        
        <div className="mt-8 text-gray-500">
          <p>
            Think this is a mistake? <a href="mailto:support@opiniontrading.com" className="text-primary hover:underline">Contact support</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 