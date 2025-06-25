import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  MapPin, 
  Calendar, 
  Briefcase, 
  Mail, 
  FileText, 
  Building,
  Check,
  X,
  User,
  Clock,
  AlertCircle,
  LogOut
} from 'lucide-react';
import type { LawyerRequest } from '../types';
import instance from '../utils/Axios';
import axios from 'axios';
import LogoutConfirmation from './LogoutConfirmation';


const AdminDashboard: React.FC = () => {
  const [lawyerRequests, setLawyerRequests] = useState<LawyerRequest[]>([]);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    
    const fetchLawyerRequests = async () => {
      try {
        
        const response=await instance.get('/admin/getLawyerReq',{
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        },
    });
        
        console.log(response.data.data);
        setLawyerRequests(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching lawyer requests:', error);
        setLoading(false);
      }
    };

    fetchLawyerRequests();
  }, []);

   const handleApprove = async (request: LawyerRequest) => {
    setProcessingIds(prev => new Set(prev).add(request.id));
    
    try {
      const response = await instance.post('/admin/acceptLawyerReq', {
        reqID: request.id
      },{
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        },
    });
      
      
      setLawyerRequests(prev => prev.filter(req => req.id !== request.id));
      
      
      console.log('Successfully approved lawyer:', request.name);
      
    } catch (error) {
      console.error('Error approving lawyer:', error);
      
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.message 
        ? error.response.data.message 
        : 'Failed to approve lawyer request';
      alert(`Failed to approve lawyer: ${errorMessage}`);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(request.id);
        return newSet;
      });
    }
  };
  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };
  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
  };
  const handleLogoutConfirm = () => {
    setIsLogoutModalOpen(false);
    // Add your logout logic here
    console.log('User logged out');
    // For example:
    // - Clear user data from Redux store
    // - Clear localStorage/sessionStorage
    // - Redirect to login page
    // - Call logout API endpoint
  };
  const handleReject = async (request: LawyerRequest) => {
    setProcessingIds(prev => new Set(prev).add(request.id));
    
    try {
      const response = await instance.post('/admin/rejectLawyerReq', {
        reqID: request.id
      },{
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        },
    });
      
      
      setLawyerRequests(prev => prev.filter(req => req.id !== request.id));
      
      
      console.log('Successfully rejected lawyer:', request.name);
      
    } catch (error) {
      console.error('Error rejecting lawyer:', error);
      
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.message 
        ? error.response.data.message 
        : 'Failed to reject lawyer request';
      alert(`Failed to reject lawyer: ${errorMessage}`);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(request.id);
        return newSet;
      });
    }
  };

  const getExperienceYears = (practiceSince: number) => {
    return new Date().getFullYear() - practiceSince;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lawyer requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Scale className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">IndiLex</span>
              <span className="text-sm text-gray-500 ml-2">Admin Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <User className="h-5 w-5" />
                <span>Admin</span>
              </div>
              <button 
                onClick={handleLogoutClick} 
                className="text-gray-500 hover:text-red-600 transition-colors">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lawyer Verification Requests</h1>
          <p className="text-gray-600">Review and approve lawyer registration requests</p>
          
          {lawyerRequests.length > 0 && (
            <div className="mt-4 flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>{lawyerRequests.length} pending request{lawyerRequests.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {lawyerRequests.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pending requests</h3>
            <p className="text-gray-500">All lawyer verification requests have been processed.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {lawyerRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{request.name}</h3>
                    <p className="text-gray-600 flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      {request.email}
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleApprove(request)}
                      disabled={processingIds.has(request.id)}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center space-x-2"
                    >
                      {processingIds.has(request.id) ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleReject(request)}
                      disabled={processingIds.has(request.id)}
                      className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center space-x-2"
                    >
                      {processingIds.has(request.id) ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                      <span>Reject</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Location</p>
                        <p className="text-sm text-gray-600">{request.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Building className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Address</p>
                        <p className="text-sm text-gray-600">{request.address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Bar License</p>
                        <p className="text-sm text-gray-600 font-mono">{request.barLicenseNumber}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Briefcase className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Specialization</p>
                        <p className="text-sm text-gray-600">{request.Specialization}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Scale className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Court</p>
                        <p className="text-sm text-gray-600">{request.court}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Experience</p>
                        <p className="text-sm text-gray-600">
                          {getExperienceYears(request.practiceSince)} years (Since {request.practiceSince})
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">User ID: {request.userId}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <LogoutConfirmation
        isOpen={isLogoutModalOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
};

export default AdminDashboard;