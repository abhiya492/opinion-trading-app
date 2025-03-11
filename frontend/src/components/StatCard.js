import React from 'react';
import Card from './Card';

const StatCard = ({
  title,
  value,
  icon,
  change,
  changeType = 'neutral',
  footer,
  className = '',
}) => {
  // Change type classes
  const changeClasses = {
    positive: 'text-success',
    negative: 'text-danger',
    neutral: 'text-gray-500',
  };

  return (
    <Card className={`h-full ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {change && (
              <p className={`ml-2 flex items-baseline text-sm font-semibold ${changeClasses[changeType]}`}>
                {changeType === 'positive' && (
                  <svg
                    className="self-center flex-shrink-0 h-5 w-5 text-success"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {changeType === 'negative' && (
                  <svg
                    className="self-center flex-shrink-0 h-5 w-5 text-danger"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                <span className="sr-only">
                  {changeType === 'positive' ? 'Increased' : changeType === 'negative' ? 'Decreased' : 'No change'} by
                </span>
                {change}
              </p>
            )}
          </div>
        </div>
        {icon && <div className="bg-gray-100 p-3 rounded-full">{icon}</div>}
      </div>
      {footer && <div className="mt-4 text-sm text-gray-500">{footer}</div>}
    </Card>
  );
};

export default StatCard; 