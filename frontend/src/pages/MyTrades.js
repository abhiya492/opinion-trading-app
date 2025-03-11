import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import Card from '../components/Card';
import Tabs from '../components/Tabs';
import TradeCard from '../components/TradeCard';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import { getUserTrades, cancelTrade } from '../utils/api';
import { calculatePnL, formatCurrency } from '../utils/helpers';
import { useLoading } from '../context/LoadingContext';
import Badge from '../components/Badge';

const MyTrades = () => {
  const { user } = useContext(AuthContext);
  const { subscribeToTradeUpdates } = useContext(SocketContext);
  const { simulateLoading } = useLoading();
  
  const [trades, setTrades] = useState([]);
  const [filteredTrades, setFilteredTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [cancellingTradeId, setCancellingTradeId] = useState(null);
  const [stats, setStats] = useState({
    totalTrades: 0,
    activeTrades: 0,
    settledTrades: 0,
    winningTrades: 0,
    losingTrades: 0,
    totalPnL: 0,
  });
  
  // Show loading screen on component mount
  useEffect(() => {
    simulateLoading('Loading your trades...', 1500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Fetch trades on initial load
  useEffect(() => {
    fetchTrades();
  }, []);
  
  // Subscribe to trade updates
  useEffect(() => {
    const handleTradeUpdate = (updatedTrade) => {
      setTrades((prevTrades) => {
        // Check if the trade exists in the current list
        const tradeIndex = prevTrades.findIndex((t) => t._id === updatedTrade._id);
        
        if (tradeIndex >= 0) {
          // Update existing trade
          const newTrades = [...prevTrades];
          newTrades[tradeIndex] = updatedTrade;
          return newTrades;
        }
        
        // Add new trade if it belongs to the user
        if (updatedTrade.user._id === user._id) {
          return [updatedTrade, ...prevTrades];
        }
        
        return prevTrades;
      });
    };
    
    const unsubscribe = subscribeToTradeUpdates(handleTradeUpdate);
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [subscribeToTradeUpdates, user._id]);
  
  // Filter trades when tabs change or trades are updated
  useEffect(() => {
    filterTrades();
  }, [activeTab, trades]);
  
  // Calculate stats when trades change
  useEffect(() => {
    calculateStats();
  }, [trades]);
  
  const fetchTrades = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await getUserTrades();
      
      if (response.success) {
        setTrades(response.data);
      } else {
        setError(response.message || 'Failed to fetch trades');
      }
    } catch (err) {
      setError('Error loading trades. Please try again later.');
      toast.error('Error loading trades');
    } finally {
      setLoading(false);
    }
  };
  
  const filterTrades = () => {
    switch (activeTab) {
      case 0: // All trades
        setFilteredTrades(trades);
        break;
      case 1: // Active trades
        setFilteredTrades(trades.filter(trade => !trade.settled && !trade.cancelled));
        break;
      case 2: // Settled trades
        setFilteredTrades(trades.filter(trade => trade.settled));
        break;
      case 3: // Won trades
        setFilteredTrades(trades.filter(trade => trade.settled && trade.outcome === 'win'));
        break;
      case 4: // Lost trades
        setFilteredTrades(trades.filter(trade => trade.settled && trade.outcome === 'loss'));
        break;
      case 5: // Cancelled trades
        setFilteredTrades(trades.filter(trade => trade.cancelled));
        break;
      default:
        setFilteredTrades(trades);
    }
  };
  
  const calculateStats = () => {
    const newStats = {
      totalTrades: trades.length,
      activeTrades: trades.filter(trade => !trade.settled && !trade.cancelled).length,
      settledTrades: trades.filter(trade => trade.settled).length,
      winningTrades: trades.filter(trade => trade.settled && trade.outcome === 'win').length,
      losingTrades: trades.filter(trade => trade.settled && trade.outcome === 'loss').length,
      totalPnL: trades.reduce((total, trade) => total + calculatePnL(trade), 0),
    };
    
    setStats(newStats);
  };
  
  const handleCancelTrade = async (tradeId) => {
    setCancellingTradeId(tradeId);
    
    try {
      const response = await cancelTrade(tradeId);
      
      if (response.success) {
        // Update the trade in the list
        setTrades((prevTrades) => 
          prevTrades.map((trade) => 
            trade._id === tradeId ? { ...trade, cancelled: true } : trade
          )
        );
        
        toast.success('Trade cancelled successfully');
      } else {
        toast.error(response.message || 'Failed to cancel trade');
      }
    } catch (error) {
      toast.error(error.message || 'Error cancelling trade');
    } finally {
      setCancellingTradeId(null);
    }
  };
  
  const renderStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      <Card className="text-center p-4">
        <h3 className="text-sm font-medium text-gray-500">Total Trades</h3>
        <p className="mt-1 text-2xl font-semibold">{stats.totalTrades}</p>
      </Card>
      
      <Card className="text-center p-4">
        <h3 className="text-sm font-medium text-gray-500">Active Trades</h3>
        <p className="mt-1 text-2xl font-semibold">{stats.activeTrades}</p>
      </Card>
      
      <Card className="text-center p-4">
        <h3 className="text-sm font-medium text-gray-500">Settled Trades</h3>
        <p className="mt-1 text-2xl font-semibold">{stats.settledTrades}</p>
      </Card>
      
      <Card className="text-center p-4">
        <h3 className="text-sm font-medium text-gray-500">Winning Trades</h3>
        <p className="mt-1 text-2xl font-semibold text-success">{stats.winningTrades}</p>
      </Card>
      
      <Card className="text-center p-4">
        <h3 className="text-sm font-medium text-gray-500">Losing Trades</h3>
        <p className="mt-1 text-2xl font-semibold text-danger">{stats.losingTrades}</p>
      </Card>
      
      <Card className="text-center p-4">
        <h3 className="text-sm font-medium text-gray-500">Total P&L</h3>
        <p className={`mt-1 text-2xl font-semibold ${stats.totalPnL >= 0 ? 'text-success' : 'text-danger'}`}>
          {formatCurrency(stats.totalPnL)}
        </p>
      </Card>
    </div>
  );
  
  const renderTradesList = () => {
    if (filteredTrades.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No trades found</h3>
          <p className="text-gray-500 mb-6">
            {activeTab === 0
              ? "You haven't placed any trades yet."
              : "You don't have any trades in this category."}
          </p>
          <Link to="/dashboard">
            <Button variant="primary">Browse Events</Button>
          </Link>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrades.map((trade) => (
          <TradeCard 
            key={trade._id} 
            trade={trade} 
            onCancelTrade={handleCancelTrade}
          />
        ))}
      </div>
    );
  };
  
  const tabs = [
    {
      label: `All (${trades.length})`,
      content: renderTradesList(),
    },
    {
      label: `Active (${stats.activeTrades})`,
      content: renderTradesList(),
    },
    {
      label: `Settled (${stats.settledTrades})`,
      content: renderTradesList(),
    },
    {
      label: `Won (${stats.winningTrades})`,
      content: renderTradesList(),
    },
    {
      label: `Lost (${stats.losingTrades})`,
      content: renderTradesList(),
    },
    {
      label: `Cancelled (${trades.filter(t => t.cancelled).length})`,
      content: renderTradesList(),
    },
  ];
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-center text-gray-500">Please log in to view your trades.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Trades</h1>
      
      {error && (
        <Alert 
          type="danger" 
          message={error} 
          className="mb-6" 
          onDismiss={() => setError('')} 
        />
      )}
      
      {renderStats()}
      
      <Tabs 
        tabs={tabs} 
        activeTab={activeTab} 
        onChange={setActiveTab}
      />
    </div>
  );
};

export default MyTrades; 