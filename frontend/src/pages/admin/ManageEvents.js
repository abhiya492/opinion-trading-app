import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Table from '../../components/Table';
import Tabs from '../../components/Tabs';
import FormInput from '../../components/FormInput';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';
import { formatDateTime } from '../../utils/formatters';

const ManageEvents = () => {
  const { user, isAdmin, token } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('active');
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Form states
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    category: 'politics',
    endDate: '',
    options: ['', ''],
    initialCredits: 100
  });
  
  const [settleForm, setSettleForm] = useState({
    outcomeIndex: '',
    outcome: ''
  });
  
  // Validation states
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }
    
    fetchEvents();
  }, [isAdmin, navigate]);
  
  useEffect(() => {
    filterEvents();
  }, [events, activeTab, searchTerm]);
  
  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('/api/events/admin', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setEvents(response.data.events);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch events. Please try again later.');
      setLoading(false);
      console.error('Error fetching events:', err);
    }
  };
  
  const filterEvents = () => {
    let filtered = [...events];
    
    // Filter by status
    if (activeTab === 'active') {
      filtered = filtered.filter(event => !event.isSettled && new Date(event.endDate) > new Date());
    } else if (activeTab === 'ended') {
      filtered = filtered.filter(event => !event.isSettled && new Date(event.endDate) <= new Date());
    } else if (activeTab === 'settled') {
      filtered = filtered.filter(event => event.isSettled);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(term) || 
        event.description.toLowerCase().includes(term) ||
        event.category.toLowerCase().includes(term)
      );
    }
    
    setFilteredEvents(filtered);
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!eventForm.title.trim()) errors.title = 'Title is required';
    if (!eventForm.description.trim()) errors.description = 'Description is required';
    if (!eventForm.category) errors.category = 'Category is required';
    if (!eventForm.endDate) errors.endDate = 'End date is required';
    if (new Date(eventForm.endDate) <= new Date()) errors.endDate = 'End date must be in the future';
    
    if (eventForm.options.some(option => !option.trim())) {
      errors.options = 'All options must be filled';
    }
    
    if (eventForm.options.length < 2) {
      errors.options = 'At least 2 options are required';
    }
    
    if (!eventForm.initialCredits || eventForm.initialCredits <= 0) {
      errors.initialCredits = 'Initial credits must be greater than 0';
    }
    
    return errors;
  };
  
  const validateSettleForm = () => {
    const errors = {};
    
    if (settleForm.outcomeIndex === '') {
      errors.outcomeIndex = 'Please select an outcome';
    }
    
    return errors;
  };
  
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      
      try {
        await axios.post('/api/events', eventForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        toast.success('Event created successfully!');
        setShowCreateModal(false);
        resetEventForm();
        fetchEvents();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to create event');
        console.error('Error creating event:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      
      try {
        await axios.put(`/api/events/${selectedEvent._id}`, eventForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        toast.success('Event updated successfully!');
        setShowEditModal(false);
        fetchEvents();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to update event');
        console.error('Error updating event:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  const handleDeleteEvent = async () => {
    setIsSubmitting(true);
    
    try {
      await axios.delete(`/api/events/${selectedEvent._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Event deleted successfully!');
      setShowDeleteModal(false);
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete event');
      console.error('Error deleting event:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSettleEvent = async (e) => {
    e.preventDefault();
    
    const errors = validateSettleForm();
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      
      try {
        await axios.post(`/api/events/${selectedEvent._id}/settle`, {
          outcomeIndex: parseInt(settleForm.outcomeIndex, 10)
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        toast.success('Event settled successfully!');
        setShowSettleModal(false);
        fetchEvents();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to settle event');
        console.error('Error settling event:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleOptionChange = (index, value) => {
    const newOptions = [...eventForm.options];
    newOptions[index] = value;
    setEventForm(prev => ({
      ...prev,
      options: newOptions
    }));
  };
  
  const addOption = () => {
    setEventForm(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };
  
  const removeOption = (index) => {
    if (eventForm.options.length <= 2) return;
    
    const newOptions = [...eventForm.options];
    newOptions.splice(index, 1);
    setEventForm(prev => ({
      ...prev,
      options: newOptions
    }));
  };
  
  const resetEventForm = () => {
    setEventForm({
      title: '',
      description: '',
      category: 'politics',
      endDate: '',
      options: ['', ''],
      initialCredits: 100
    });
    setFormErrors({});
  };
  
  const openEditModal = (event) => {
    setSelectedEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      category: event.category,
      endDate: new Date(event.endDate).toISOString().slice(0, 16),
      options: event.options.map(opt => opt.text),
      initialCredits: event.initialCredits
    });
    setShowEditModal(true);
  };
  
  const openDeleteModal = (event) => {
    setSelectedEvent(event);
    setShowDeleteModal(true);
  };
  
  const openSettleModal = (event) => {
    setSelectedEvent(event);
    setSettleForm({
      outcomeIndex: '',
      outcome: ''
    });
    setShowSettleModal(true);
  };
  
  const handleSettleOptionChange = (e) => {
    const index = e.target.value;
    setSettleForm({
      outcomeIndex: index,
      outcome: index !== '' ? selectedEvent.options[index].text : ''
    });
  };
  
  const columns = [
    {
      header: 'Event',
      accessor: 'title',
      render: (event) => (
        <div>
          <div className="font-medium text-gray-900">{event.title}</div>
          <div className="text-sm text-gray-500">{event.category}</div>
        </div>
      )
    },
    {
      header: 'Options',
      accessor: 'options',
      render: (event) => (
        <div className="flex flex-wrap gap-1">
          {event.options.map((option, index) => (
            <Badge 
              key={index}
              color={event.isSettled && event.outcome === index ? 'success' : 'default'}
            >
              {option.text}
            </Badge>
          ))}
        </div>
      )
    },
    {
      header: 'End Date',
      accessor: 'endDate',
      render: (event) => formatDateTime(event.endDate)
    },
    {
      header: 'Status',
      accessor: 'isSettled',
      render: (event) => {
        const now = new Date();
        const endDate = new Date(event.endDate);
        
        if (event.isSettled) {
          return <Badge color="success">Settled</Badge>;
        } else if (endDate <= now) {
          return <Badge color="warning">Ended</Badge>;
        } else {
          return <Badge color="primary">Active</Badge>;
        }
      }
    },
    {
      header: 'Actions',
      accessor: '_id',
      render: (event) => {
        const now = new Date();
        const endDate = new Date(event.endDate);
        
        return (
          <div className="flex space-x-2">
            {!event.isSettled && (
              <>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => openEditModal(event)}
                >
                  Edit
                </Button>
                
                {endDate <= now && (
                  <Button 
                    size="sm" 
                    variant="primary"
                    onClick={() => openSettleModal(event)}
                  >
                    Settle
                  </Button>
                )}
                
                <Button 
                  size="sm" 
                  variant="danger"
                  onClick={() => openDeleteModal(event)}
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        );
      }
    }
  ];
  
  const tabs = [
    { id: 'active', label: 'Active' },
    { id: 'ended', label: 'Ended' },
    { id: 'settled', label: 'Settled' }
  ];
  
  if (!isAdmin) {
    return null;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Events</h1>
        <Button onClick={() => {
          resetEventForm();
          setShowCreateModal(true);
        }}>
          Create New Event
        </Button>
      </div>
      
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <Tabs 
            tabs={tabs} 
            activeTab={activeTab} 
            onChange={setActiveTab}
          />
          
          <div className="mt-4 md:mt-0">
            <FormInput
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-auto"
            />
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <Alert type="error">{error}</Alert>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No events found. {activeTab === 'active' && (
              <button 
                className="text-primary hover:underline focus:outline-none"
                onClick={() => {
                  resetEventForm();
                  setShowCreateModal(true);
                }}
              >
                Create one?
              </button>
            )}
          </div>
        ) : (
          <Table
            columns={columns}
            data={filteredEvents}
            keyField="_id"
          />
        )}
      </Card>
      
      {/* Create Event Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Event"
      >
        <form onSubmit={handleCreateEvent}>
          <div className="space-y-4">
            <FormInput
              label="Title"
              name="title"
              value={eventForm.title}
              onChange={handleInputChange}
              error={formErrors.title}
              required
            />
            
            <FormInput
              label="Description"
              name="description"
              type="textarea"
              value={eventForm.description}
              onChange={handleInputChange}
              error={formErrors.description}
              required
            />
            
            <FormInput
              label="Category"
              name="category"
              type="select"
              value={eventForm.category}
              onChange={handleInputChange}
              error={formErrors.category}
              options={[
                { value: 'politics', label: 'Politics' },
                { value: 'sports', label: 'Sports' },
                { value: 'entertainment', label: 'Entertainment' },
                { value: 'technology', label: 'Technology' },
                { value: 'finance', label: 'Finance' },
                { value: 'other', label: 'Other' }
              ]}
              required
            />
            
            <FormInput
              label="End Date"
              name="endDate"
              type="datetime-local"
              value={eventForm.endDate}
              onChange={handleInputChange}
              error={formErrors.endDate}
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Options
              </label>
              {formErrors.options && (
                <p className="text-danger text-sm mt-1">{formErrors.options}</p>
              )}
              {eventForm.options.map((option, index) => (
                <div key={index} className="flex items-center mt-2">
                  <FormInput
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="flex-grow"
                  />
                  {eventForm.options.length > 2 && (
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      className="ml-2"
                      onClick={() => removeOption(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={addOption}
              >
                Add Option
              </Button>
            </div>
            
            <FormInput
              label="Initial Credits"
              name="initialCredits"
              type="number"
              value={eventForm.initialCredits}
              onChange={handleInputChange}
              error={formErrors.initialCredits}
              min="1"
              required
            />
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Spinner size="sm" className="mr-2" /> : null}
              Create Event
            </Button>
          </div>
        </form>
      </Modal>
      
      {/* Edit Event Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Event"
      >
        <form onSubmit={handleUpdateEvent}>
          <div className="space-y-4">
            <FormInput
              label="Title"
              name="title"
              value={eventForm.title}
              onChange={handleInputChange}
              error={formErrors.title}
              required
            />
            
            <FormInput
              label="Description"
              name="description"
              type="textarea"
              value={eventForm.description}
              onChange={handleInputChange}
              error={formErrors.description}
              required
            />
            
            <FormInput
              label="Category"
              name="category"
              type="select"
              value={eventForm.category}
              onChange={handleInputChange}
              error={formErrors.category}
              options={[
                { value: 'politics', label: 'Politics' },
                { value: 'sports', label: 'Sports' },
                { value: 'entertainment', label: 'Entertainment' },
                { value: 'technology', label: 'Technology' },
                { value: 'finance', label: 'Finance' },
                { value: 'other', label: 'Other' }
              ]}
              required
            />
            
            <FormInput
              label="End Date"
              name="endDate"
              type="datetime-local"
              value={eventForm.endDate}
              onChange={handleInputChange}
              error={formErrors.endDate}
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Options
              </label>
              {formErrors.options && (
                <p className="text-danger text-sm mt-1">{formErrors.options}</p>
              )}
              {eventForm.options.map((option, index) => (
                <div key={index} className="flex items-center mt-2">
                  <FormInput
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="flex-grow"
                  />
                  {eventForm.options.length > 2 && (
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      className="ml-2"
                      onClick={() => removeOption(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={addOption}
              >
                Add Option
              </Button>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Spinner size="sm" className="mr-2" /> : null}
              Update Event
            </Button>
          </div>
        </form>
      </Modal>
      
      {/* Delete Event Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Event"
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="mt-3 text-lg font-medium text-gray-900">
            Are you sure?
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            You are about to delete the event "{selectedEvent?.title}". This action cannot be undone.
          </p>
          
          <div className="mt-6 flex justify-center space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleDeleteEvent}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Spinner size="sm" className="mr-2" /> : null}
              Delete
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Settle Event Modal */}
      <Modal
        isOpen={showSettleModal}
        onClose={() => setShowSettleModal(false)}
        title="Settle Event"
      >
        <form onSubmit={handleSettleEvent}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event
              </label>
              <p className="text-gray-900 font-medium">{selectedEvent?.title}</p>
            </div>
            
            <FormInput
              label="Select Winning Outcome"
              name="outcomeIndex"
              type="select"
              value={settleForm.outcomeIndex}
              onChange={handleSettleOptionChange}
              error={formErrors.outcomeIndex}
              options={selectedEvent?.options.map((option, index) => ({
                value: index.toString(),
                label: option.text
              })) || []}
              required
            />
            
            {settleForm.outcome && (
              <Alert type="info">
                You are about to settle this event with the outcome: <strong>{settleForm.outcome}</strong>. 
                This will distribute winnings to users who predicted correctly and cannot be undone.
              </Alert>
            )}
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowSettleModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !settleForm.outcome}
            >
              {isSubmitting ? <Spinner size="sm" className="mr-2" /> : null}
              Settle Event
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageEvents; 