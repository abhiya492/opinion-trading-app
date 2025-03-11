import React from 'react';

const FormTextarea = ({
  label,
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
  textareaClassName = '',
  helpText = '',
  rows = 4,
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
      
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={`w-full px-3 py-2 border ${
          error ? 'border-danger' : 'border-gray-300'
        } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : ''
        } ${textareaClassName}`}
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

export default FormTextarea;
