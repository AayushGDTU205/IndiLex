import React, { useState, useEffect } from 'react';
import instance from '../utils/Axios';
import { 
  MapPin, 
  Briefcase,
  Scale,
  Mail,
  Calendar,
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import type { Lawyer } from '../types';

interface LawyersListProps {
  onSendCase?: (lawyer: Lawyer) => void;
  onContactLawyer?: (lawyer: Lawyer) => void;
  onViewProfile?: (lawyer: Lawyer) => void;
}

const LawyersList: React.FC<LawyersListProps> = ({ 
  onSendCase, 
}) => {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Fetch lawyers from API using configured axios instance
  const fetchLawyers = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError('');
      
      const response = await instance.get('/getLawyers',{
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
      
      if (response.data.success && response.data.data) {
        setLawyers(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch lawyers');
      }
    } catch (err: any) {
      // Enhanced error handling for axios
      let errorMessage = 'Failed to fetch lawyers';
      
      if (err.response) {
        // Server responded with error status
        errorMessage = `Server Error (${err.response.status}): ${
          err.response.data?.message || err.message
        }`;
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'Network Error: Unable to connect to server. Please check your internet connection.';
      } else if (err.code === 'ECONNABORTED') {
        // Request timeout
        errorMessage = 'Request timeout: Server is taking too long to respond.';
      } else {
        // Something else happened
        errorMessage = err.message || 'An unexpected error occurred';
      }
      
      setError(errorMessage);
      console.error('Error fetching lawyers:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLawyers();
  }, []);

  const handleRefresh = () => {
    fetchLawyers(true);
  };

  const calculateExperience = (practiceSince: number): string => {
    const currentYear = new Date().getFullYear();
    const experience = currentYear - practiceSince;
    return `${experience} years`;
  };

  const generateAvatar = (name: string): string => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=ffffff&size=150`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading lawyers...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4 text-sm">{error}</p>
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
          >
            {refreshing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // No lawyers found
  if (lawyers.length === 0) {
    return (
      <div className="text-center py-12">
        <Scale className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No lawyers found</h3>
        <p className="text-gray-600 mb-4">There are currently no verified lawyers available.</p>
        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
        >
          {refreshing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Verified Lawyers</h1>
          <p className="text-gray-600">Connect with qualified legal professionals ({lawyers.length} found)</p>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {refreshing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </>
          )}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lawyers.map(lawyer => (
          <div key={lawyer.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={generateAvatar(lawyer.name)}
                alt={lawyer.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{lawyer.name}</h3>
                <p className="text-blue-600 font-medium">{lawyer.Specialization}</p>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                {calculateExperience(lawyer.practiceSince)} experience
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                {lawyer.location}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Scale className="h-4 w-4 mr-2" />
                {lawyer.court}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Briefcase className="h-4 w-4 mr-2" />
                Bar: {lawyer.barLicenseNumber}
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                <span className="truncate">{lawyer.email}</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button 
                onClick={() => onSendCase?.(lawyer)}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Send Your Case
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LawyersList;