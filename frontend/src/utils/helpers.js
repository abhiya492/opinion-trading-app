// Date formatting
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatDateTime = (dateString) => {
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Currency formatting
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

// Percentage formatting
export const formatPercentage = (value) => {
  return `${(value * 100).toFixed(2)}%`;
};

// Probability to odds conversion
export const probabilityToOdds = (probability) => {
  if (probability <= 0 || probability >= 1) return 'N/A';
  
  // American odds format
  if (probability < 0.5) {
    // Underdog (positive odds)
    return `+${Math.round((1 / probability - 1) * 100)}`;
  } else {
    // Favorite (negative odds)
    return `-${Math.round((probability / (1 - probability)) * 100)}`;
  }
};

// Validation helpers
export const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return re.test(password);
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Calculate time remaining
export const getTimeRemaining = (endDate) => {
  const total = Date.parse(endDate) - Date.now();
  
  if (total <= 0) {
    return { expired: true, days: 0, hours: 0, minutes: 0 };
  }
  
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  
  return {
    expired: false,
    days,
    hours,
    minutes,
    seconds
  };
};

// Format time remaining as string
export const formatTimeRemaining = (timeObj) => {
  if (timeObj.expired) return 'Expired';
  
  if (timeObj.days > 0) {
    return `${timeObj.days}d ${timeObj.hours}h remaining`;
  } else if (timeObj.hours > 0) {
    return `${timeObj.hours}h ${timeObj.minutes}m remaining`;
  } else {
    return `${timeObj.minutes}m ${timeObj.seconds}s remaining`;
  }
};

// Get status color class based on event status
export const getStatusColorClass = (status) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'text-success';
    case 'pending':
      return 'text-warning';
    case 'settled':
      return 'text-primary';
    case 'cancelled':
      return 'text-danger';
    default:
      return 'text-gray-500';
  }
};

// Calculate profit/loss for a trade
export const calculatePnL = (trade) => {
  if (!trade.settled) return 0;
  
  if (trade.outcome === 'win') {
    return trade.potentialPayout - trade.amount;
  } else if (trade.outcome === 'loss') {
    return -trade.amount;
  }
  
  return 0;
}; 