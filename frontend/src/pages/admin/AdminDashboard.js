import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';
import Card from '../../components/Card';
import StatCard from '../../components/StatCard';
import Button from '../../components/Button';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';
import Table from '../../components/Table';
import { getAdminStats, getAllTrades } from '../../utils/api';
import { formatCurrency, formatDate } from '../../utils/helpers';

const AdminDashboard = () => {
  const { user, isAdmin } = useContext(AuthContext);
  
  const [stats, setStats] = useState(null);
  const [recentTrades, setRecentTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Fetch admin stats on mount
  useEffect(() => {
    fetchAdminData();
  }, []);
  
  const fetchAdminData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch stats
      const statsResponse = await getAdminStats();
      
      if (statsResponse.success) {
        setStats(statsResponse.data);
      } else {
        setError(statsResponse.message || 'Failed to fetch admin statistics');
      }
      
      // Fetch recent trades
      const tradesResponse = await getAllTrades({ limit: 10 });
      
      if (tradesResponse.success) {
        setRecentTrades(tradesResponse.data.trades || []);
      } else {
        toast.error('Failed to fetch recent trades');
      }
    } catch (err) {
      setError('Error loading admin data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (!user || !isAdmin()) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert 
          type="danger" 
          title="Access Denied" 
          message="You do not have permission to access this page." 
        />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert 
          type="danger" 
          title="Error" 
          message={error} 
        />
        <div className="mt-4">
          <Button onClick={fetchAdminData}>Retry</Button>
        </div>
      </div>
    );
  }
  
  // Columns for trades table
  const tradeColumns = [
    {
      header: 'User',
      accessor: 'user.username',
      render: (trade) => (
        <Link 
          to={`/admin/users/${trade.user._id}`} 
          className="text-primary hover:underline"
        >
          {trade.user.username}
        </Link>
      ),
    },
    {
      header: 'Event',
      accessor: 'event.title',
      render: (trade) => (
        <Link 
          to={`/events/${trade.event._id}`} 
          className="text-primary hover:underline"
        >
          {trade.event.title}
        </Link>
      ),
    },
    {
      header: 'Option',
      accessor: 'option.text',
      render: (trade) => trade.option.text,
    },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (trade) => formatCurrency(trade.amount),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (trade) => {
        if (trade.cancelled) return 'Cancelled';
        if (trade.settled) return trade.outcome === 'win' ? 'Won' : 'Lost';
        return 'Active';
      },
    },
    {
      header: 'Date',
      accessor: 'createdAt',
      render: (trade) => formatDate(trade.createdAt),
    },
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="space-x-2">
          <Link to="/admin/events">
            <Button variant="outline">Manage Events</Button>
          </Link>
          <Link to="/admin/users">
            <Button variant="outline">Manage Users</Button>
          </Link>
        </div>
      </div>
      
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers.toString()}
            icon={
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            }
            change={`+${stats.newUsersToday}`}
            changeType="positive"
            footer="New users today"
          />
          
          <StatCard
            title="Total Events"
            value={stats.totalEvents.toString()}
            icon={
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            }
            change={`+${stats.newEventsToday}`}
            changeType="positive"
            footer="New events today"
          />
          
          <StatCard
            title="Total Trades"
            value={stats.totalTrades.toString()}
            icon={
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            }
            change={`+${stats.newTradesToday}`}
            changeType="positive"
            footer="New trades today"
          />
          
          <StatCard
            title="Active Events"
            value={stats.activeEvents.toString()}
            icon={
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            }
          />
          
          <StatCard
            title="Pending Settlement"
            value={stats.pendingSettlementEvents.toString()}
            icon={
              <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            }
            footer={
              <Link to="/admin/events?status=pending_settlement" className="text-primary hover:underline">
                View pending events
              </Link>
            }
          />
          
          <StatCard
            title="Platform Balance"
            value={formatCurrency(stats.platformBalance)}
            icon={
              <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            }
          />
        </div>
      )}
      
      {/* Recent Activity */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Trades</h2>
          <Link to="/admin/trades" className="text-primary hover:underline">
            View all trades
          </Link>
        </div>
        
        <Table
          columns={tradeColumns}
          data={recentTrades}
          emptyMessage="No trades found"
        />
      </Card>
    </div>
  );
};

export default AdminDashboard; 