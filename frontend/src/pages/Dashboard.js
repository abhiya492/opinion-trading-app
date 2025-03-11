import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import { useLoading } from '../context/LoadingContext';
import EventCard from '../components/EventCard';
import EventFilters from '../components/EventFilters';
import Pagination from '../components/Pagination';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import { getEvents } from '../utils/api';

// Define categories for the filter buttons
const EVENT_CATEGORIES = [
  'POLITICS',
  'CRYPTO',
  'TECH',
  'ENTERTAINMENT',
  'SCIENCE',
  'ENVIRONMENT',
  'SPORTS',
  'ECONOMICS'
];

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { subscribeToEventUpdates, connected, connectionError, attemptReconnect } = useContext(SocketContext);
  const { stopLoading, forceStopLoading } = useLoading();
  const location = useLocation();
  const navigate = useNavigate();
  const hasInitializedRef = useRef(false);
  
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortOption, setSortOption] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalEvents: 0,
  });
  
  // Immediately stop any global loaders when the dashboard mounts
  useEffect(() => {
    // One-time loading state cleanup when the component mounts
    const clearLoading = () => {
      forceStopLoading();
    };
    
    // Call immediately and with a slight delay to catch any race conditions
    clearLoading();
    const timerId = setTimeout(clearLoading, 100);
    
    return () => {
      clearTimeout(timerId);
      clearLoading();
    };
  }, [forceStopLoading]);
  
  // Modified version of fetchEvents to avoid render loops
  const fetchEvents = useCallback(async () => {
    // Don't set loading state if we're already loading to avoid flicker
    if (!loading) {
      setLoading(true);
    }
    setError('');
    
    try {
      // Real API call instead of mock data
      const response = await getEvents({
        page: pagination.currentPage,
        limit: 12,
        search: filters.search,
        category: filters.category,
        status: filters.status,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      });
      
      if (response.success) {
        // If no events from API, add some sample events
        if (!response.data.events || response.data.events.length === 0) {
          const sampleEvents = [
            {
              _id: 'sample1',
              title: 'Will AI Surpass Human Intelligence by 2025?',
              description: 'Experts debate the timeline for artificial general intelligence reaching human-level capabilities.',
              category: 'TECH',
              status: 'active',
              createdAt: new Date().toISOString(),
              endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
              yesPrice: 0.65,
              volume: 15000,
              options: [{ text: 'Yes' }, { text: 'No' }]
            },
            {
              _id: 'sample2',
              title: 'Bitcoin to Reach $100,000 in 2024',
              description: 'Analyzing the possibility of Bitcoin reaching the $100k milestone this year.',
              category: 'CRYPTO',
              status: 'active',
              createdAt: new Date().toISOString(),
              endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
              yesPrice: 0.45,
              volume: 25000,
              options: [{ text: 'Yes' }, { text: 'No' }]
            },
            {
              _id: 'sample3',
              title: 'SpaceX Successful Mars Landing in 2024',
              description: 'Will SpaceX achieve its goal of landing on Mars this year?',
              category: 'SCIENCE',
              status: 'active',
              createdAt: new Date().toISOString(),
              endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
              yesPrice: 0.30,
              volume: 18000,
              options: [{ text: 'Yes' }, { text: 'No' }]
            },
            {
              _id: 'sample4',
              title: 'Global Temperature Rise Exceeds 1.5°C in 2024',
              description: 'Will global average temperature increase surpass the critical 1.5°C threshold this year?',
              category: 'ENVIRONMENT',
              status: 'active',
              createdAt: new Date().toISOString(),
              endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days from now
              yesPrice: 0.70,
              volume: 12000,
              options: [{ text: 'Yes' }, { text: 'No' }]
            }
          ];
          
          setEvents(sampleEvents);
          setPagination({
            currentPage: 1,
            totalPages: 1,
            totalEvents: sampleEvents.length
          });
        } else {
          setEvents(response.data.events || []);
          setPagination({
            currentPage: response.data.currentPage || 1,
            totalPages: response.data.totalPages || 1,
            totalEvents: response.data.totalEvents || 0
          });
        }
      } else {
        setError(response.message || 'Failed to fetch events');
        toast.error(response.message || 'Failed to fetch events');
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('An unexpected error occurred. Please try again.');
      toast.error('Failed to load events. Please refresh the page.');
    } finally {
      setLoading(false);
      // Ensure global loader is stopped
      forceStopLoading();
    }
  }, [pagination.currentPage, filters, forceStopLoading, loading]); // Include only stable dependencies
  
  // Fetch events when filters or pagination changes
  useEffect(() => {
    // Use a stable fetch function
    fetchEvents();
  }, [fetchEvents]); // Only depends on fetchEvents which has its own dependencies
  
  // Subscribe to real-time event updates - with more robust error handling
  useEffect(() => {
    let unsubscribe = () => {};
    
    if (connected) {
      try {
        unsubscribe = subscribeToEventUpdates((updatedEvent) => {
          setEvents((prevEvents) => {
            // Check if the event exists in the current list
            const eventIndex = prevEvents.findIndex((e) => e._id === updatedEvent._id);
            
            if (eventIndex >= 0) {
              // Update existing event
              const newEvents = [...prevEvents];
              newEvents[eventIndex] = updatedEvent;
              return newEvents;
            } else {
              // Add new event if it matches current filters
              return [...prevEvents, updatedEvent];
            }
          });
        });
      } catch (err) {
        console.error('Error subscribing to event updates:', err);
      }
    }
    
    return () => {
      try {
        if (unsubscribe) unsubscribe();
      } catch (err) {
        console.error('Error unsubscribing from event updates:', err);
      }
    };
  }, [connected, subscribeToEventUpdates]);
  
  // Update filters when search query changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      search: searchQuery
    }));
  }, [searchQuery]);
  
  const handlePageChange = (page) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };
  
  const handleFilterChange = (newFilters) => {
    // Reset to page 1 when filters change
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));
    setFilters(newFilters);
  };
  
  const handleSearch = () => {
    // Trigger a search with current filters
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));
    fetchEvents();
  };
  
  // Function to handle category filter changes
  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    setFilters(prev => ({
      ...prev,
      category: category === 'ALL' ? '' : category
    }));
  };
  
  // Add a manual reconnect handler
  const handleManualReconnect = () => {
    toast.info("Attempting to reconnect...");
    attemptReconnect();
  };
  
  // Render a connection status message if needed
  const renderConnectionStatus = () => {
    if (!connected && connectionError) {
      return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Live updates unavailable. You'll need to refresh for the latest events.
                <button 
                  onClick={handleManualReconnect}
                  className="ml-2 font-medium underline text-yellow-700 hover:text-yellow-600"
                >
                  Try reconnecting
                </button>
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Discover Events</h1>
      
      {renderConnectionStatus()}
      
      <div className="mb-8">
        <div className="flex flex-wrap gap-4 mb-4">
          {EVENT_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${selectedCategory === category 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              {category}
            </button>
          ))}
          <button
            onClick={() => handleCategoryFilter('ALL')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${selectedCategory === 'ALL' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            All Categories
          </button>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="ending_soon">Ending Soon</option>
            <option value="most_traded">Most Traded</option>
          </select>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="text-xl font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600">Try changing your filters or search query</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
          
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="inline-flex rounded-md shadow">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className={`px-4 py-2 text-sm font-medium rounded-l-md 
                    ${pagination.currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  Previous
                </button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 text-sm font-medium 
                      ${pagination.currentPage === page 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className={`px-4 py-2 text-sm font-medium rounded-r-md 
                    ${pagination.currentPage === pagination.totalPages 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard; 