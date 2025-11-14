import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import {useNavigate} from 'react-router-dom'

const MyProfile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    userType: 'personal'
  });

  const navigate = useNavigate()

  // Initialize form data when user context is available
  useEffect(() => {
    if (user) {
      console.log('🎯 Initializing form data from user context:', user);
      setFormData({
        firstName: user.firstName || user.first_name || '',
        lastName: user.lastName || user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        companyName: user.companyName || user.company_name || '',
        userType: user.userType || user.user_type || 'personal'
      });
      setFetchLoading(false);
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setFetchLoading(true);
      setErrorMessage('');
      
      console.log('🔄 Fetching user data from API...');
      
      const response = await authService.getCurrentUser();
      console.log('📦 API Response:', response);
      
      if (response && response.data && response.data.user) {
        const userData = response.data.user;
        setFormData({
          firstName: userData.firstName || userData.first_name || '',
          lastName: userData.lastName || userData.last_name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          companyName: userData.companyName || userData.company_name || '',
          userType: userData.userType || userData.user_type || 'personal'
        });
        console.log('✅ Form data updated from API');
      }
    } catch (error) {
      console.error('❌ Error fetching user data:', error);
      // Don't show error if we have context data
      if (!user) {
        setErrorMessage('Failed to load user data. Please try again.');
      }
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setEditing(true);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleCancel = () => {
    // Reset form to current user data
    if (user) {
      setFormData({
        firstName: user.firstName || user.first_name || '',
        lastName: user.lastName || user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        companyName: user.companyName || user.company_name || '',
        userType: user.userType || user.user_type || 'personal'
      });
    }
    setEditing(false);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      console.log('📝 Updating user profile:', formData);

      // Prepare data for API
      const updateData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        companyName: formData.userType === 'corporate' ? formData.companyName.trim() : '',
        userType: formData.userType
      };

      console.log('🔄 Sending update data:', updateData);

      // Real API call to update profile
      const response = await authService.updateProfile(updateData);
      console.log('📦 Update API Response:', response);
      
      if (response && response.success) {
        // Update user context with new data
        if (updateUser && response.user) {
          updateUser(response.user);
        }
        
        setSuccessMessage(response.message || 'Profile updated successfully');
        setEditing(false);
        console.log('✅ Profile updated successfully');
      } else {
        setErrorMessage(response.message || 'Failed to update profile');
      }

    } catch (error) {
      console.error('❌ Error updating profile:', error);
      setErrorMessage(
        error.response?.data?.message || 
        error.message || 
        'Failed to update profile. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Show loading only if we have no user data at all
  if (fetchLoading && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">User Not Found</h3>
            <p>Please log in to view your profile.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {errorMessage}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-black px-6 py-8 text-gold">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold">
                  {formData.firstName?.charAt(0) || 'U'}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {formData.firstName} {formData.lastName}
                  </h2>
                  <p className="text-white">{formData.email}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                    {formData.userType === 'corporate' ? 'Corporate' : 'Personal'}
                  </span>
                </div>
              </div>
              
              {/* Edit/Save Buttons */}
              <div className="flex space-x-3">
                {!editing ? (
                  <button
                    onClick={handleEdit}
                    className="bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="bg-gold text-white px-4 py-2 rounded-lg font-semibold hover:bg-gold/70 transition-colors focus:outline-none focus:ring-1 focus:ring-white focus:ring-offset-1 focus:ring-offset-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </span>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={loading}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="p-6">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    disabled={!editing}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      !editing ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                    placeholder="Enter your first name"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    disabled={!editing}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      !editing ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={!editing}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      !editing ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                    placeholder="Enter your email address"
                  />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!editing}
                  className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    !editing ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  placeholder="+254712345678"
                />
              </div>

              {/* Account Type */}
              <div>
                <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type
                </label>
                <select
                  id="userType"
                  name="userType"
                  value={formData.userType}
                  onChange={handleInputChange}
                  disabled={!editing}
                  className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    !editing ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                >
                  <option value="personal">Personal</option>
                  <option value="corporate">Corporate</option>
                </select>
              </div>

              {/* Company Name (only for corporate accounts) */}
              {formData.userType === 'corporate' && (
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required={formData.userType === 'corporate'}
                    disabled={!editing}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      !editing ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                    placeholder="Enter your company name"
                  />
                </div>
              )}

              {/* Account Information (Read-only) */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Member Since:</span>
                    <p className="text-gray-900 font-medium">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">User ID:</span>
                    <p className="text-gray-900 font-mono text-xs">{user?.id || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Additional Options */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Delivery History Card */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Delivery History</h3>
            <p className="text-gray-600 mb-4">View your past deliveries and track current orders.</p>
            <button 
                onClick={()=>{navigate('/dashboard'); window.scrollTo(0,0)}}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              View Delivery History
            </button>
          </div>

          {/* Account Settings Card */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Settings</h3>
            <p className="text-gray-600 mb-4">Manage your password and notification preferences.</p>
            <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              Account Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;