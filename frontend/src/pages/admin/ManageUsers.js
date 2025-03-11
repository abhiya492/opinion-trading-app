import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Table from '../../components/Table';
import FormInput from '../../components/FormInput';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';
import { formatDateTime } from '../../utils/formatters';

const ManageUsers = () => {
  const { user, isAdmin, token } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Form states
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    isAdmin: false
  });
  
  const [creditsForm, setCreditsForm] = useState({
    amount: 0,
    reason: ''
  });
  
  // Validation states
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }
    
    fetchUsers();
  }, [isAdmin, navigate]);
  
  useEffect(() => {
    filterUsers();
  }, [users, searchTerm]);
  
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('/api/users/admin', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUsers(response.data.users);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch users. Please try again later.');
      setLoading(false);
      console.error('Error fetching users:', err);
    }
  };
  
  const filterUsers = () => {
    if (!searchTerm) {
      setFilteredUsers(users);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(term) || 
      user.email.toLowerCase().includes(term)
    );
    
    setFilteredUsers(filtered);
  };
  
  const validateUserForm = () => {
    const errors = {};
    
    if (!userForm.name.trim()) errors.name = 'Name is required';
    if (!userForm.email.trim()) errors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(userForm.email)) errors.email = 'Email is invalid';
    
    return errors;
  };
  
  const validateCreditsForm = () => {
    const errors = {};
    
    if (!creditsForm.amount) errors.amount = 'Amount is required';
    if (creditsForm.amount <= 0) errors.amount = 'Amount must be greater than 0';
    if (!creditsForm.reason.trim()) errors.reason = 'Reason is required';
    
    return errors;
  };
  
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    
    const errors = validateUserForm();
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      
      try {
        await axios.put(`/api/users/${selectedUser._id}`, userForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        toast.success('User updated successfully!');
        setShowEditModal(false);
        fetchUsers();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to update user');
        console.error('Error updating user:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  const handleAddCredits = async (e) => {
    e.preventDefault();
    
    const errors = validateCreditsForm();
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      
      try {
        await axios.post(`/api/users/${selectedUser._id}/credits`, creditsForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        toast.success(`${creditsForm.amount} credits added to ${selectedUser.name}'s account`);
        setShowCreditsModal(false);
        fetchUsers();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to add credits');
        console.error('Error adding credits:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  const handleDeleteUser = async () => {
    setIsSubmitting(true);
    
    try {
      await axios.delete(`/api/users/${selectedUser._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('User deleted successfully!');
      setShowDeleteModal(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
      console.error('Error deleting user:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleCreditsInputChange = (e) => {
    const { name, value } = e.target;
    setCreditsForm(prev => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value
    }));
  };
  
  const openEditModal = (user) => {
    setSelectedUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    });
    setShowEditModal(true);
  };
  
  const openCreditsModal = (user) => {
    setSelectedUser(user);
    setCreditsForm({
      amount: 100,
      reason: ''
    });
    setShowCreditsModal(true);
  };
  
  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };
  
  const columns = [
    {
      header: 'User',
      accessor: 'name',
      render: (user) => (
        <div>
          <div className="font-medium text-gray-900">{user.name}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
      )
    },
    {
      header: 'Credits',
      accessor: 'credits',
      render: (user) => (
        <div className="font-medium">{user.credits}</div>
      )
    },
    {
      header: 'Role',
      accessor: 'isAdmin',
      render: (user) => (
        <Badge color={user.isAdmin ? 'primary' : 'default'}>
          {user.isAdmin ? 'Admin' : 'User'}
        </Badge>
      )
    },
    {
      header: 'Joined',
      accessor: 'createdAt',
      render: (user) => formatDateTime(user.createdAt)
    },
    {
      header: 'Actions',
      accessor: '_id',
      render: (user) => (
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => openEditModal(user)}
          >
            Edit
          </Button>
          
          <Button 
            size="sm" 
            variant="primary"
            onClick={() => openCreditsModal(user)}
          >
            Add Credits
          </Button>
          
          {user._id !== user._id && ( // Prevent self-deletion
            <Button 
              size="sm" 
              variant="danger"
              onClick={() => openDeleteModal(user)}
            >
              Delete
            </Button>
          )}
        </div>
      )
    }
  ];
  
  if (!isAdmin) {
    return null;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
      </div>
      
      <Card className="mb-6">
        <div className="mb-4">
          <FormInput
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-96"
          />
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <Alert type="error">{error}</Alert>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No users found.
          </div>
        ) : (
          <Table
            columns={columns}
            data={filteredUsers}
            keyField="_id"
          />
        )}
      </Card>
      
      {/* Edit User Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit User"
      >
        <form onSubmit={handleUpdateUser}>
          <div className="space-y-4">
            <FormInput
              label="Name"
              name="name"
              value={userForm.name}
              onChange={handleInputChange}
              error={formErrors.name}
              required
            />
            
            <FormInput
              label="Email"
              name="email"
              type="email"
              value={userForm.email}
              onChange={handleInputChange}
              error={formErrors.email}
              required
            />
            
            <div className="flex items-center">
              <input
                id="isAdmin"
                name="isAdmin"
                type="checkbox"
                checked={userForm.isAdmin}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-900">
                Admin privileges
              </label>
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
              Update User
            </Button>
          </div>
        </form>
      </Modal>
      
      {/* Add Credits Modal */}
      <Modal
        isOpen={showCreditsModal}
        onClose={() => setShowCreditsModal(false)}
        title="Add Credits"
      >
        <form onSubmit={handleAddCredits}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User
              </label>
              <p className="text-gray-900 font-medium">{selectedUser?.name}</p>
              <p className="text-gray-500 text-sm">{selectedUser?.email}</p>
              <p className="text-gray-700 mt-1">Current Credits: <span className="font-medium">{selectedUser?.credits}</span></p>
            </div>
            
            <FormInput
              label="Amount to Add"
              name="amount"
              type="number"
              value={creditsForm.amount}
              onChange={handleCreditsInputChange}
              error={formErrors.amount}
              min="1"
              required
            />
            
            <FormInput
              label="Reason"
              name="reason"
              type="textarea"
              value={creditsForm.reason}
              onChange={handleCreditsInputChange}
              error={formErrors.reason}
              placeholder="Explain why credits are being added..."
              required
            />
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreditsModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Spinner size="sm" className="mr-2" /> : null}
              Add Credits
            </Button>
          </div>
        </form>
      </Modal>
      
      {/* Delete User Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete User"
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
            You are about to delete the user "{selectedUser?.name}". This action cannot be undone and will delete all associated data including trades and activity history.
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
              onClick={handleDeleteUser}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Spinner size="sm" className="mr-2" /> : null}
              Delete User
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageUsers; 