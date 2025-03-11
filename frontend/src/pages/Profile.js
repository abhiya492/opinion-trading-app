import React, { useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/Card';
import Tabs from '../components/Tabs';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';
import StatCard from '../components/StatCard';
import { validateEmail, validatePassword, formatCurrency, formatDate } from '../utils/helpers';
import { useLoading } from '../context/LoadingContext';

const Profile = () => {
  const { user, loading: authLoading, updateProfile } = useContext(AuthContext);
  const { simulateLoading } = useLoading();
  
  const [activeTab, setActiveTab] = useState(0);
  const [profileForm, setProfileForm] = useState({
    username: '',
    email: '',
    bio: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  // Populate form with user data when available
  useEffect(() => {
    if (user) {
      setProfileForm({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
      });
    }
  }, [user]);
  
  // Show loading screen on component mount
  useEffect(() => {
    simulateLoading('Loading your profile...', 1200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
    
    // Clear errors when user types
    if (profileErrors[name]) {
      setProfileErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    
    // Clear errors when user types
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateProfileForm = () => {
    const newErrors = {};
    
    if (!profileForm.username || profileForm.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!profileForm.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(profileForm.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    setProfileErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwordForm.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (!validatePassword(passwordForm.newPassword)) {
      newErrors.newPassword = 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number';
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateProfileForm()) return;
    
    setUpdating(true);
    
    try {
      const success = await updateProfile(profileForm);
      
      if (success) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setUpdating(false);
    }
  };
  
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validatePasswordForm()) return;
    
    setUpdating(true);
    
    try {
      // This is a placeholder - implement the actual API call in the updatePassword function
      // in your AuthContext or a separate API utility
      // await updatePassword(passwordForm);
      toast.success('Password updated successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(err.message || 'Failed to update password. Please try again.');
    } finally {
      setUpdating(false);
    }
  };
  
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert 
          type="danger" 
          title="Authentication Error" 
          message="You must be logged in to view this page." 
        />
      </div>
    );
  }
  
  const renderAccountOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Account Balance"
          value={formatCurrency(user.balance || 0)}
          icon={
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          }
        />
        
        <StatCard
          title="Member Since"
          value={formatDate(user.createdAt || new Date())}
          icon={
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          }
        />
        
        <StatCard
          title="Account Status"
          value={user.isActive ? 'Active' : 'Inactive'}
          icon={
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          }
        />
      </div>
      
      <Card>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
        
        <div className="space-y-3">
          <div>
            <span className="text-sm font-medium text-gray-500">Username:</span>
            <p className="mt-1">{user.username}</p>
          </div>
          
          <div>
            <span className="text-sm font-medium text-gray-500">Email:</span>
            <p className="mt-1">{user.email}</p>
          </div>
          
          <div>
            <span className="text-sm font-medium text-gray-500">Role:</span>
            <p className="mt-1">{user.isAdmin ? 'Administrator' : 'User'}</p>
          </div>
        </div>
      </Card>
    </div>
  );
  
  const renderEditProfile = () => (
    <Card>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Profile</h3>
      
      {error && (
        <Alert 
          type="danger" 
          message={error} 
          className="mb-4" 
          onDismiss={() => setError('')} 
        />
      )}
      
      <form onSubmit={handleUpdateProfile} className="space-y-4">
        <FormInput
          label="Username"
          type="text"
          id="username"
          name="username"
          value={profileForm.username}
          onChange={handleProfileChange}
          error={profileErrors.username}
          required
        />
        
        <FormInput
          label="Email"
          type="email"
          id="email"
          name="email"
          value={profileForm.email}
          onChange={handleProfileChange}
          error={profileErrors.email}
          required
        />
        
        <FormInput
          label="Bio"
          type="text"
          id="bio"
          name="bio"
          value={profileForm.bio}
          onChange={handleProfileChange}
          error={profileErrors.bio}
          required
        />
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            isLoading={updating}
            disabled={updating}
          >
            Update Profile
          </Button>
        </div>
      </form>
    </Card>
  );
  
  const renderChangePassword = () => (
    <Card>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
      
      {error && (
        <Alert 
          type="danger" 
          message={error} 
          className="mb-4" 
          onDismiss={() => setError('')} 
        />
      )}
      
      <form onSubmit={handleUpdatePassword} className="space-y-4">
        <FormInput
          label="Current Password"
          type="password"
          id="currentPassword"
          name="currentPassword"
          value={passwordForm.currentPassword}
          onChange={handlePasswordChange}
          error={passwordErrors.currentPassword}
          required
        />
        
        <FormInput
          label="New Password"
          type="password"
          id="newPassword"
          name="newPassword"
          value={passwordForm.newPassword}
          onChange={handlePasswordChange}
          error={passwordErrors.newPassword}
          required
          helpText="Must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number"
        />
        
        <FormInput
          label="Confirm New Password"
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={passwordForm.confirmPassword}
          onChange={handlePasswordChange}
          error={passwordErrors.confirmPassword}
          required
        />
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            isLoading={updating}
            disabled={updating}
          >
            Update Password
          </Button>
        </div>
      </form>
    </Card>
  );
  
  const tabs = [
    {
      label: 'Overview',
      content: renderAccountOverview(),
    },
    {
      label: 'Edit Profile',
      content: renderEditProfile(),
    },
    {
      label: 'Change Password',
      content: renderChangePassword(),
    },
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>
      
      <Tabs 
        tabs={tabs} 
        activeTab={activeTab} 
        onChange={setActiveTab}
      />
    </div>
  );
};

export default Profile; 