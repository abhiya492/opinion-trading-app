import React, { useState, useEffect } from 'react';
import FormSelect from './FormSelect';
import FormInput from './FormInput';
import Button from './Button';
import Alert from './Alert';
import { formatCurrency, probabilityToOdds } from '../utils/helpers';

const PlaceTrade = ({ event, onPlaceTrade, userBalance = 0 }) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [amount, setAmount] = useState('');
  const [potentialPayout, setPotentialPayout] = useState(0);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when event changes
  useEffect(() => {
    setSelectedOption('');
    setAmount('');
    setPotentialPayout(0);
    setError('');
  }, [event._id]);

  // Calculate potential payout when option or amount changes
  useEffect(() => {
    if (selectedOption && amount && !isNaN(amount) && amount > 0) {
      const option = event.options.find(opt => opt._id === selectedOption);
      if (option) {
        // Calculate payout based on probability
        // Lower probability = higher payout
        const payout = amount / option.probability;
        setPotentialPayout(payout);
      }
    } else {
      setPotentialPayout(0);
    }
  }, [selectedOption, amount, event.options]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validate inputs
    if (!selectedOption) {
      setError('Please select an option');
      return;
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > userBalance) {
      setError('Insufficient balance');
      return;
    }

    const option = event.options.find(opt => opt._id === selectedOption);
    if (!option) {
      setError('Invalid option selected');
      return;
    }

    setIsSubmitting(true);

    // Submit trade
    onPlaceTrade({
      eventId: event._id,
      optionId: selectedOption,
      amount: parseFloat(amount),
      potentialPayout
    })
      .then(() => {
        // Reset form on success
        setSelectedOption('');
        setAmount('');
      })
      .catch(err => {
        setError(err.message || 'Failed to place trade');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  // Check if event is tradeable
  const isTradeable = event.status === 'active' && !event.settled;

  // Prepare options for select
  const optionChoices = event.options.map(option => ({
    value: option._id,
    label: `${option.text} (${(option.probability * 100).toFixed(1)}% / ${probabilityToOdds(option.probability)})`,
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Place a Trade</h3>
      
      {!isTradeable && (
        <Alert 
          type="warning" 
          title="Trading Unavailable" 
          message="This event is not available for trading at the moment."
        />
      )}
      
      {error && (
        <Alert 
          type="danger" 
          message={error} 
          className="mb-4"
          onDismiss={() => setError('')}
        />
      )}
      
      <form onSubmit={handleSubmit}>
        <FormSelect
          label="Select Your Prediction"
          id="selectedOption"
          name="selectedOption"
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          options={optionChoices}
          disabled={!isTradeable || isSubmitting}
          required
        />
        
        <FormInput
          label="Amount"
          type="number"
          id="amount"
          name="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          disabled={!isTradeable || isSubmitting}
          required
          min="1"
          step="0.01"
          helpText={`Available Balance: ${formatCurrency(userBalance)}`}
        />
        
        {potentialPayout > 0 && (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Potential Payout
            </label>
            <div className="p-3 bg-gray-50 rounded-md text-lg font-semibold text-success">
              {formatCurrency(potentialPayout)}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Potential Profit: {formatCurrency(potentialPayout - amount)}
            </p>
          </div>
        )}
        
        <Button
          type="submit"
          fullWidth
          disabled={!isTradeable || isSubmitting}
          isLoading={isSubmitting}
        >
          Place Trade
        </Button>
      </form>
    </div>
  );
};

export default PlaceTrade; 