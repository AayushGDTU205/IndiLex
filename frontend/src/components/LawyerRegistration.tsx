import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import type { LawyerFormData,User } from '../types';
import instance from '../utils/Axios';


// Updated interface to match backend model


interface LawyerRegistrationProps {
  onSubmit?: (data: LawyerFormData) => void;
  user:User;
}

const LawyerRegistration: React.FC<LawyerRegistrationProps> = ({ onSubmit,user }) => {
  const [formData, setFormData] = useState<LawyerFormData>({
    name: user.name,
    email: user.email,
    location: '',
    address: '',
    barLicenseNumber: '',
    Specialization: '',
    court: '',
    practiceSince: ''
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Create axios instance (you might want to move this to a separate config file)
  const specializationOptions: string[] = [
    'Civil Law', 'Criminal Law', 'Family Law', 'Corporate Law', 
    'Property Law', 'Labour Law', 'Tax Law', 'Immigration Law',
    'Intellectual Property', 'Environmental Law'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    
    // Clear previous messages
    setError('');
    setSuccessMessage('');
    
    // Basic validation
    const requiredFields = ['name', 'email', 'location', 'address', 'barLicenseNumber', 'Specialization', 'court', 'practiceSince'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof LawyerFormData]);
    
    if (missingFields.length > 0) {
      setError(`Please fill all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsLoading(true);

    try {
      const response = await instance.post('/LaywerFillUp', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;

      if (data.success) {
        console.log('Registration successful:', data.data);
        setSuccessMessage('Registration submitted successfully! We will review your application and get back to you.');
        
        // Call the optional onSubmit prop if provided
        onSubmit?.(formData);
        
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          location: '',
          address: '',
          barLicenseNumber: '',
          Specialization: '',
          court: '',
          practiceSince: ''
        });
        
      } else {
        console.log('Registration failed:', data.message);
        setError(data.message || 'Registration failed');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Register as a Lawyer</h1>
        <p className="text-gray-600">Join our network of verified legal professionals</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl">
        <div className="space-y-6">
          {/* Error and Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700 text-sm">{successMessage}</p>
            </div>
          )}

          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  readOnly
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, State"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bar License Number *
                </label>
                <input
                  type="text"
                  name="barLicenseNumber"
                  value={formData.barLicenseNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {specializationOptions.map(area => (
                    <label key={area} className="flex items-center space-x-2">
                        <input
                        type="radio"
                        name="Specialization"
                        value={area}
                        checked={formData.Specialization === area}
                        onChange={handleInputChange}
                        required
                        className="text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="text-sm text-gray-700">{area}</span>
                    </label>
                    ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Court *
                  </label>
                  <input
                    type="text"
                    name="court"
                    value={formData.court}
                    onChange={handleInputChange}
                    placeholder="e.g., Delhi High Court, Supreme Court"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Practicing Since (Year) *
                  </label>
                  <input
                    type="number"
                    name="practiceSince"
                    value={formData.practiceSince}
                    onChange={handleInputChange}
                    placeholder="e.g., 2015"
                    min="1950"
                    max={new Date().getFullYear()}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Office/Practice Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                rows={3}
                placeholder="Enter your complete office or practice address"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`px-8 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              <UserPlus className="h-4 w-4" />
              <span>{isLoading ? 'Submitting...' : 'Submit Registration'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawyerRegistration;