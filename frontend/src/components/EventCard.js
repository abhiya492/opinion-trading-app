import React from 'react';
import { Link } from 'react-router-dom';
import Badge from './Badge';

const EventCard = ({ event }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const formatNumber = (number) => {
    if (number >= 1000) {
      return `${(number / 1000).toFixed(1)}k`;
    }
    return number.toString();
  };
  
  // Generate a gradient background based on category
  const getCategoryColor = (category) => {
    const colors = {
      POLITICS: 'from-primary-500 to-primary-700',
      CRYPTO: 'from-green-500 to-green-700',
      TECH: 'from-blue-500 to-blue-700',
      ENTERTAINMENT: 'from-purple-500 to-purple-700',
      SCIENCE: 'from-indigo-500 to-indigo-700',
      ENVIRONMENT: 'from-teal-500 to-teal-700',
      SPORTS: 'from-pink-500 to-pink-700',
      ECONOMICS: 'from-yellow-500 to-yellow-700',
      DEFAULT: 'from-gray-500 to-gray-700',
    };
    
    return colors[category] || colors.DEFAULT;
  };
  
  // Generate days remaining text
  const getDaysRemaining = (endDateString) => {
    const endDate = new Date(endDateString);
    const now = new Date();
    const diffTime = endDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return 'Ended';
    }
    if (diffDays === 0) {
      return 'Ends today';
    }
    if (diffDays === 1) {
      return '1 day left';
    }
    return `${diffDays} days left`;
  };
  
  return (
    <div className="group bg-white rounded-lg shadow-md overflow-hidden hover-lift h-full flex flex-col">
      {/* Category Banner */}
      <div className={`h-2 bg-gradient-to-r ${getCategoryColor(event.category)}`}></div>
      
      <div className="p-5 flex-grow flex flex-col">
        {/* Category and Status */}
        <div className="flex justify-between items-center mb-3">
          <Badge variant="secondary" size="sm">{event.category}</Badge>
          {event.status === 'active' && (
            <span className="text-xs text-primary-600 font-medium">
              {getDaysRemaining(event.endDate)}
            </span>
          )}
          {event.status === 'resolved' && (
            <Badge variant="success" size="sm">Resolved</Badge>
          )}
          {event.status === 'cancelled' && (
            <Badge variant="danger" size="sm">Cancelled</Badge>
          )}
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
          {event.title}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
          {event.description}
        </p>
        
        {/* Trading Stats */}
        <div className="mt-auto">
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Current Probability</span>
              <span className="font-medium">{Math.round(event.yesPrice * 100)}% Yes</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full" 
                style={{ width: `${event.yesPrice * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>Volume: {formatNumber(event.volume)}</span>
            <span>Created: {formatDate(event.createdAt)}</span>
          </div>
        </div>
      </div>
      
      {/* Action Footer */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
        <Link 
          to={`/events/${event._id}`}
          className="block w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-center text-sm font-medium transition-colors"
        >
          Trade Now
        </Link>
      </div>
    </div>
  );
};

export default EventCard; 