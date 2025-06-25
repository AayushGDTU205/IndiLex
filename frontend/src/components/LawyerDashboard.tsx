import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  Briefcase, 
  CheckCircle, 
  FileText, 
  Newspaper, 
  User,
  LogOut
} from 'lucide-react';


import PendingCasesTab from './PendingCasesTab';
import AcceptedCasesTab from './AcceptedCasesTab';
import AllCasesTab from './AllCasesTab';
import NewsSection from './NewsSection'; 


import type { UserReq, ReviewedUserReq, ActiveTab } from '../types/lawyer';
import instance from '../utils/Axios';
import LogoutConfirmation from './LogoutConfirmation';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const LawyerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('cases');
  const [pendingCases, setPendingCases] = useState<UserReq[]>([]);
  const [reviewedCases, setReviewedCases] = useState<ReviewedUserReq[]>([]);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch=useDispatch();
  const navigate=useNavigate();
  
  useEffect(() => {
    fetchPendingCases();
    fetchReviewedCases();
  }, []);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };
  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
  };
  const handleLogoutConfirm =async () => {
    setIsLogoutModalOpen(false);
    // Add your logout logic here
   try{
    const response=await instance.post('/logout');
    if(response.status===200){
      dispatch({ type: 'LOGOUT_USER', payload: response.data.data });
      navigate('/login');
    }
   }
   catch(error){
    console.log(error);
   }
    console.log('User logged out');
  };
  const fetchPendingCases = async () => {
    try {
      
     
      const response= await instance.get('/lawyer/getCases');
      setPendingCases(response.data.data);
    } catch (error) {
      console.error('Error fetching pending cases:', error);
    }
  };

  const fetchReviewedCases = async () => {
    try {
     
      
      const response=await instance.get('/lawyer/getRevCases');
      setReviewedCases(response.data.data);
    } catch (error) {
      console.error('Error fetching reviewed cases:', error);
    }
  };

  const handleAcceptCase = async (caseId: number) => {
    setLoading(true);
    try {
      
      const response=await instance.post('/lawyer/accept',{caseID:caseId});
      const caseToMove = pendingCases.find(c => c.id === caseId);
      if (caseToMove) {
        const reviewedCase: ReviewedUserReq = {
          ...caseToMove,
          status: 'Accepted'
        };
        setReviewedCases(prev => [...prev, reviewedCase]);
        setPendingCases(prev => prev.filter(c => c.id !== caseId));
      }
    } catch (error) {
      console.error('Error accepting case:', error);
      
    } finally {
      setLoading(false);
    }
  };

  const handleRejectCase = async (caseId: number) => {
    setLoading(true);
    try {
      
      const response=await instance.post('/lawyer/reject',{caseID:caseId});
      console.log(response.data.data);
      const caseToMove = pendingCases.find(c => c.id === caseId);
      if (caseToMove) {
        const reviewedCase: ReviewedUserReq = {
          ...caseToMove,
          status: 'Rejected'
        };
        setReviewedCases(prev => [...prev, reviewedCase]);
        setPendingCases(prev => prev.filter(c => c.id !== caseId));
      }
    } catch (error) {
      console.error('Error rejecting case:', error);
      
    } finally {
      setLoading(false);
    }
  };

  const acceptedCases = reviewedCases.filter(c => c.status === 'Accepted');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Scale className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">IndiLex</span>
              <span className="text-sm text-gray-500 ml-2">Lawyer Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <User className="h-5 w-5" />
                <span>Welcome, Lawyer</span>
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

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('news')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                activeTab === 'news'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Newspaper className="h-4 w-4" />
              <span>Legal News</span>
            </button>
            <button
              onClick={() => setActiveTab('cases')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                activeTab === 'cases'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Briefcase className="h-4 w-4" />
              <span>Pending Cases</span>
              {pendingCases.length > 0 && (
                <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                  {pendingCases.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('accepted')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                activeTab === 'accepted'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <CheckCircle className="h-4 w-4" />
              <span>Accepted Cases</span>
              {acceptedCases.length > 0 && (
                <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                  {acceptedCases.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                activeTab === 'all'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>All Cases</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'news' && <NewsSection />}
        
        {activeTab === 'cases' && (
          <PendingCasesTab
            pendingCases={pendingCases}
            onAcceptCase={handleAcceptCase}
            onRejectCase={handleRejectCase}
            loading={loading}
          />
        )}
        
        {activeTab === 'accepted' && (
          <AcceptedCasesTab acceptedCases={acceptedCases} />
        )}
        
        {activeTab === 'all' && (
          <AllCasesTab reviewedCases={reviewedCases} />
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

export default LawyerDashboard;