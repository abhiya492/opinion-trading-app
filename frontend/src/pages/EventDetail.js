import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext, useAuth } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import PlaceTrade from '../components/PlaceTrade';
import Table from '../components/Table';
import { getEvent, placeTrade, settleEvent } from '../utils/api';
import { 
  formatDate, 
  formatDateTime, 
  formatTimeRemaining, 
  getTimeRemaining, 
  getStatusColorClass, 
  formatCurrency 
} from '../utils/helpers';
import { useLoading } from '../context/LoadingContext';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useContext(AuthContext);
  const { joinEvent, leaveEvent, subscribeToEventUpdates, subscribeToOddsUpdates } = useContext(SocketContext);
  const { setLoading, simulateLoading } = useLoading();
  const { isAuthenticated } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [trades, setTrades] = useState([]);
  const [countdownInterval, setCountdownInterval] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [settlingEvent, setSettlingEvent] = useState(false);
  const [selectedCorrectOption, setSelectedCorrectOption] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [tradeAmount, setTradeAmount] = useState(10);
  const [tradeType, setTradeType] = useState('yes');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  
  // Fetch event data on mount and join event room for real-time updates
  useEffect(() => {
    fetchEventData();
    
    // Join event room for socket updates
    joinEvent(id);
    
    // Subscribe to event updates
    const unsubscribeEvent = subscribeToEventUpdates(id, (updatedEvent) => {
      setEvent(updatedEvent);
    });
    
    // Subscribe to odds updates
    const unsubscribeOdds = subscribeToOddsUpdates(id, (updatedOdds) => {
      setEvent((prevEvent) => {
        if (!prevEvent) return null;
        
        return {
          ...prevEvent,
          options: prevEvent.options.map((option) => {
            const updatedOption = updatedOdds.find((o) => o._id === option._id);
            return updatedOption ? { ...option, ...updatedOption } : option;
          }),
        };
      });
    });
    
    // Clean up on unmount
    return () => {
      leaveEvent(id);
      if (unsubscribeEvent) unsubscribeEvent();
      if (unsubscribeOdds) unsubscribeOdds();
      if (countdownInterval) clearInterval(countdownInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  
  // Set up countdown timer when event data is loaded
  useEffect(() => {
    if (event && event.endDate && !event.settled) {
      // Clear existing interval
      if (countdownInterval) clearInterval(countdownInterval);
      
      // Setup initial time remaining
      updateTimeRemaining();
      
      // Set up interval for countdown
      const interval = setInterval(updateTimeRemaining, 1000);
      setCountdownInterval(interval);
      
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event?.endDate, event?.settled]);
  
  const updateTimeRemaining = () => {
    if (!event || !event.endDate) return;
    
    const remaining = getTimeRemaining(event.endDate);
    setTimeRemaining(remaining);
  };
  
  const fetchEventData = async () => {
    setLoadingData(true);
    setError('');
    
    try {
      await simulateLoading('Loading event details...');
      
      // Mock data for demonstration
      const mockEvent = {
        _id: id,
        title: 'Will Bitcoin reach $100,000 by the end of 2024?',
        description: 'This market predicts whether the price of Bitcoin (BTC) will reach or exceed $100,000 USD at any point before midnight UTC on December 31, 2024, according to the average price across major exchanges (Coinbase, Binance, Kraken).',
        category: 'CRYPTO',
        createdAt: '2023-08-15T12:00:00Z',
        endDate: '2024-12-31T23:59:59Z',
        creator: {
          _id: 'user123',
          username: 'crypto_oracle',
          avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
        },
        status: 'active',
        yesPrice: 0.65,
        noPrice: 0.35,
        volume: 25750,
        tags: ['Bitcoin', 'Cryptocurrency', 'Price Prediction'],
        imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d',
        marketRules: [
          'This market resolves to YES if Bitcoin reaches or exceeds $100,000 USD on any major exchange.',
          'This market resolves to NO if Bitcoin does not reach $100,000 USD by the end date.',
          'If trading is suspended on all major exchanges, the resolution may be delayed.',
          'The price reference will be based on spot prices, not futures contracts.'
        ],
        tradeHistory: [
          { id: 1, user: 'alice92', type: 'BUY', outcome: 'YES', shares: 100, price: 0.62, timestamp: '2023-11-05T14:23:45Z' },
          { id: 2, user: 'btcmaxi', type: 'BUY', outcome: 'YES', shares: 500, price: 0.63, timestamp: '2023-11-04T09:12:30Z' },
          { id: 3, user: 'skeptic01', type: 'BUY', outcome: 'NO', shares: 300, price: 0.36, timestamp: '2023-11-03T21:45:12Z' },
          { id: 4, user: 'trader_joe', type: 'SELL', outcome: 'YES', shares: 150, price: 0.65, timestamp: '2023-11-02T11:33:27Z' },
          { id: 5, user: 'future_seer', type: 'BUY', outcome: 'YES', shares: 200, price: 0.64, timestamp: '2023-11-01T17:55:41Z' },
        ],
        comments: [
          { id: 101, user: 'crypto_oracle', text: 'The adoption rate of Bitcoin is accelerating with institutional investment.', timestamp: '2023-10-15T08:23:19Z', likes: 12 },
          { id: 102, user: 'skeptic01', text: 'I think this is overly optimistic given the regulatory headwinds.', timestamp: '2023-10-16T13:45:32Z', likes: 5 },
          { id: 103, user: 'btcmaxi', text: 'Bitcoin to the moon! 100k is conservative.', timestamp: '2023-10-18T17:12:44Z', likes: 8 },
          { id: 104, user: 'researcher99', text: 'Historical patterns suggest a possible peak in Q3 2024.', timestamp: '2023-10-20T11:32:55Z', likes: 15 },
        ],
        relatedEvents: [
          { id: 'evt1', title: 'Will Ethereum outperform Bitcoin in 2024?', yesPrice: 0.48 },
          { id: 'evt2', title: 'Will the US approve a Bitcoin spot ETF in 2024?', yesPrice: 0.72 },
          { id: 'evt3', title: 'Will Bitcoin mining difficulty double by end of 2024?', yesPrice: 0.55 },
        ]
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setEvent(mockEvent);
      setTrades(mockEvent.tradeHistory || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching event:", err);
      setError("Failed to load event details. Please try again later.");
    } finally {
      setLoadingData(false);
    }
  };
  
  const handlePlaceTrade = async (tradeData) => {
    try {
      const response = await placeTrade(tradeData);
      
      if (response.success) {
        toast.success('Trade placed successfully!');
        return true;
      } else {
        toast.error(response.message || 'Failed to place trade');
        return false;
      }
    } catch (error) {
      toast.error(error.message || 'Error placing trade');
      throw error;
    }
  };
  
  const handleSettleEvent = async () => {
    if (!selectedCorrectOption) {
      toast.error('Please select the correct outcome');
      return;
    }
    
    setSettlingEvent(true);
    
    try {
      const response = await settleEvent(id, selectedCorrectOption);
      
      if (response.success) {
        toast.success('Event settled successfully');
        setEvent(response.data);
      } else {
        toast.error(response.message || 'Failed to settle event');
      }
    } catch (error) {
      toast.error(error.message || 'Error settling event');
    } finally {
      setSettlingEvent(false);
    }
  };
  
  const handleTradeSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    
    await simulateLoading(`Processing ${tradeType.toUpperCase()} trade...`);
    
    // Simulate successful trade
    alert(`Trade successfully placed: ${tradeAmount} shares of ${tradeType.toUpperCase()}`);
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <Link to="/dashboard" className="text-primary-600 hover:underline mt-2 inline-block">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  if (!event) {
    return null;
  }
  
  // Format status badge
  const getStatusBadge = () => {
    return (
      <Badge
        variant={
          event.status === 'active' ? 'success' :
          event.status === 'pending' ? 'warning' :
          event.status === 'settled' ? 'primary' : 'danger'
        }
        className={getStatusColorClass(event.status)}
      >
        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
      </Badge>
    );
  };
  
  // Columns for trades table
  const tradeColumns = [
    {
      header: 'User',
      accessor: 'user.username',
      render: (trade) => trade.user.username,
    },
    {
      header: 'Prediction',
      accessor: 'option.text',
      render: (trade) => trade.option.text,
    },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (trade) => formatCurrency(trade.amount),
    },
    {
      header: 'Potential Payout',
      accessor: 'potentialPayout',
      render: (trade) => formatCurrency(trade.potentialPayout),
    },
    {
      header: 'Date',
      accessor: 'createdAt',
      render: (trade) => formatDate(trade.createdAt),
    },
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:space-x-6">
        {/* Event details */}
        <div className="md:w-2/3">
          <div className="mb-6">
            <Link to="/dashboard" className="text-primary hover:underline">
              &larr; Back to Dashboard
            </Link>
          </div>
          
          <Card>
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
              {getStatusBadge()}
            </div>
            
            <p className="text-gray-700 mb-6">{event.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Category</h3>
                <p className="mt-1 text-lg">{event.category}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Created By</h3>
                <p className="mt-1 text-lg">{event.createdBy.username}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Created Date</h3>
                <p className="mt-1 text-lg">{formatDateTime(event.createdAt)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">End Date</h3>
                <p className="mt-1 text-lg">{formatDateTime(event.endDate)}</p>
              </div>
            </div>
            
            {timeRemaining && !event.settled && (
              <div className={`p-3 mb-6 rounded-md ${
                timeRemaining.expired ? 'bg-red-50 text-danger' : 'bg-yellow-50 text-warning'
              }`}>
                <h3 className="font-medium">
                  {timeRemaining.expired ? 'Event Ended' : 'Time Remaining'}
                </h3>
                <p className="text-lg font-semibold">
                  {formatTimeRemaining(timeRemaining)}
                </p>
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Predictions</h3>
              <div className="space-y-3">
                {event.options.map((option) => (
                  <div 
                    key={option._id} 
                    className={`p-4 rounded-md ${
                      event.settled && event.correctOption === option._id
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{option.text}</span>
                        {event.settled && event.correctOption === option._id && (
                          <Badge variant="success" className="ml-2">Correct</Badge>
                        )}
                      </div>
                      <span className="text-lg font-semibold">
                        {(option.probability * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {isAdmin() && !event.settled && (
              <div className="border-t pt-4 mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Admin Actions</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Settle Event</h4>
                  <div className="flex flex-col space-y-2 mb-4">
                    <label className="text-sm text-gray-700">Select Correct Outcome:</label>
                    <select
                      value={selectedCorrectOption}
                      onChange={(e) => setSelectedCorrectOption(e.target.value)}
                      className="form-input"
                    >
                      <option value="">-- Select Option --</option>
                      {event.options.map((option) => (
                        <option key={option._id} value={option._id}>
                          {option.text}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button 
                    onClick={handleSettleEvent} 
                    variant="primary"
                    isLoading={settlingEvent}
                    disabled={settlingEvent || !selectedCorrectOption}
                  >
                    Settle Event
                  </Button>
                </div>
              </div>
            )}
          </Card>
          
          {trades.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Trades</h2>
              <Table
                columns={tradeColumns}
                data={trades}
                emptyMessage="No trades for this event yet"
              />
            </div>
          )}
        </div>
        
        {/* Place trade sidebar */}
        <div className="md:w-1/3 mt-6 md:mt-0">
          {user ? (
            <PlaceTrade 
              event={event} 
              onPlaceTrade={handlePlaceTrade} 
              userBalance={user.balance}
            />
          ) : (
            <Card>
              <div className="text-center py-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Want to trade on this event?
                </h3>
                <p className="text-gray-500 mb-4">
                  Sign in or create an account to place trades.
                </p>
                <div className="space-x-2">
                  <Link to="/login">
                    <Button variant="primary">Sign In</Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="outline">Register</Button>
                  </Link>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;