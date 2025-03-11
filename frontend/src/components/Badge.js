import React from 'react';

const Badge = ({ children, variant = 'primary', size = 'md', className = '' }) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full whitespace-nowrap';
  
  const sizeClasses = {
    xs: 'text-xs px-1.5 py-0.5',
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };
  
  const variantClasses = {
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
    light: 'bg-gray-50 text-gray-600 border border-gray-200',
    dark: 'bg-gray-700 text-white',
  };
  
  const classes = `
    ${baseClasses}
    ${sizeClasses[size] || sizeClasses.md}
    ${variantClasses[variant] || variantClasses.primary}
    ${className}
  `;
  
  return (
    <span className={classes.trim()}>
      {children}
    </span>
  );
};

export default Badge; 