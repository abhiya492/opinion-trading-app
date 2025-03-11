import axios from 'axios';

// Events API
export const getEvents = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const url = `/api/events${queryParams ? `?${queryParams}` : ''}`;
    const res = await axios.get(url);
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error fetching events'
    };
  }
};

export const getEvent = async (id) => {
  try {
    const res = await axios.get(`/api/events/${id}`);
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error fetching event'
    };
  }
};

export const createEvent = async (eventData) => {
  try {
    const res = await axios.post('/api/events', eventData);
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error creating event'
    };
  }
};

export const updateEvent = async (id, eventData) => {
  try {
    const res = await axios.put(`/api/events/${id}`, eventData);
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error updating event'
    };
  }
};

export const settleEvent = async (id, correctOption) => {
  try {
    const res = await axios.post(`/api/events/${id}/settle`, { correctOption });
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error settling event'
    };
  }
};

// Trades API
export const getUserTrades = async () => {
  try {
    const res = await axios.get('/api/trades/my-trades');
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error fetching trades'
    };
  }
};

export const getTrade = async (id) => {
  try {
    const res = await axios.get(`/api/trades/${id}`);
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error fetching trade'
    };
  }
};

export const placeTrade = async (tradeData) => {
  try {
    const res = await axios.post('/api/trades', tradeData);
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error placing trade'
    };
  }
};

export const cancelTrade = async (id) => {
  try {
    const res = await axios.post(`/api/trades/${id}/cancel`);
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error cancelling trade'
    };
  }
};

// Admin API
export const getUsers = async () => {
  try {
    const res = await axios.get('/api/admin/users');
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error fetching users'
    };
  }
};

export const updateUserStatus = async (id, isActive) => {
  try {
    const res = await axios.put(`/api/admin/users/${id}/status`, { isActive });
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error updating user status'
    };
  }
};

export const getAllTrades = async () => {
  try {
    const res = await axios.get('/api/admin/trades');
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error fetching all trades'
    };
  }
};

export const settleEventTrades = async (eventId) => {
  try {
    const res = await axios.post(`/api/admin/events/${eventId}/settle-trades`);
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error settling trades'
    };
  }
};

export const getAdminStats = async () => {
  try {
    const res = await axios.get('/api/admin/stats');
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error fetching admin stats'
    };
  }
}; 