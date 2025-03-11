import React from 'react';
import { Link } from 'react-router-dom';
import Card from './Card';
import Badge from './Badge';
import Button from './Button';
import { formatDate, formatCurrency, calculatePnL } from '../utils/helpers';

const TradeCard = ({ trade, onCancelTrade }) => {
  const pnl = calculatePnL(trade);
  
  const getTradeStatusBadge = () => {
    if (trade.cancelled) {
      return <Badge variant="danger">Cancelled</Badge>;
    }
    
    if (trade.settled) {
      return trade.outcome === 'win' ? 
        <Badge variant="success">Won</Badge> : 
        <Badge variant="danger">Lost</Badge>;
    }
    
    return <Badge variant="info">Active</Badge>;
  };
  
  return (
    <Card
      className="h-full flex flex-col transition-transform duration-200 hover:shadow-lg"
      title={
        <div className="flex justify-between items-center">
          <Link to={`/events/${trade.event._id}`} className="text-lg font-semibold text-gray-800 hover:text-primary">
            {trade.event.title}
          </Link>
          {getTradeStatusBadge()}
        </div>
      }
      footer={
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {formatDate(trade.createdAt)}
          </div>
          {!trade.cancelled && !trade.settled && (
            <Button 
              variant="danger" 
              size="sm" 
              onClick={() => onCancelTrade(trade._id)}
            >
              Cancel Trade
            </Button>
          )}
        </div>
      }
    >
      <div className="flex-grow">
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Your Prediction:</h4>
          <div className="p-3 bg-gray-50 rounded-md">
            <div className="flex justify-between items-center">
              <span className="font-medium">{trade.option.text}</span>
              <span className="text-sm">
                {(trade.option.probability * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="text-xs font-medium text-gray-500 mb-1">Amount</h4>
            <p className="font-medium">{formatCurrency(trade.amount)}</p>
          </div>
          <div>
            <h4 className="text-xs font-medium text-gray-500 mb-1">Potential Payout</h4>
            <p className="font-medium">{formatCurrency(trade.potentialPayout)}</p>
          </div>
        </div>
        
        {trade.settled && (
          <div className="mt-2">
            <h4 className="text-xs font-medium text-gray-500 mb-1">Profit/Loss</h4>
            <p className={`font-medium ${pnl >= 0 ? 'text-success' : 'text-danger'}`}>
              {pnl >= 0 ? '+' : ''}{formatCurrency(pnl)}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TradeCard; 