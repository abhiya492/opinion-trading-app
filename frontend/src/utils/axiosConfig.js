import axios from 'axios';

// Function to find an available backend port
const findBackendPort = async () => {
  const basePorts = [3000, 3001, 3002, 3003, 3004, 3005];
  
  for (const port of basePorts) {
    try {
      // Try to connect to this port
      const response = await fetch(`http://localhost:${port}/api/health`, { 
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        mode: 'cors',
        timeout: 1000
      });
      
      if (response.ok) {
        console.log(`Connected to backend at port: ${port}`);
        return port;
      }
    } catch (error) {
      console.log(`Port ${port} check failed, trying next...`);
    }
  }
  
  // Default fallback
  console.warn('Could not detect backend port, using default 3000');
  return 3000;
};

// Set up Axios defaults
const configureAxios = async () => {
  try {
    const port = await findBackendPort();
    axios.defaults.baseURL = `http://localhost:${port}`;
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    
    // Add auth token to requests if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    // Add response interceptor for handling token expiration
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
    
    console.log('Axios configured successfully');
  } catch (error) {
    console.error('Error configuring Axios:', error);
  }
};

export default configureAxios; 