import React from 'react';

const FormInput = ({
  label,
  type = 'text',
  id,
  name,
  value,
  onChange,
  placeholder = '',
  error = '',
  required = false,
  disabled = false,
  className = '',
  labelClassName = '',
  inputClassName = '',
  helpText = '',
  ...rest
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className={`block text-gray-700 font-medium mb-2 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-3 py-2 border ${
          error ? 'border-danger' : 'border-gray-300'
        } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : ''
        } ${inputClassName}`}
        {...rest}
      />
      
      {helpText && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-danger">{error}</p>
      )}
    </div>
  );
};

export default FormInput; 