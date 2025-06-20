import React, { useState } from 'react';
import type { ActiveTab, Lawyer, LawyerFormData } from '../types';
import LawyersList from './LawyerList';
import NewsSection from './NewsSection';
import LawyerRegistration from './LawyerRegistration';
import { verifiedLawyers } from '../data/mockData';
import { 
  Scale, 
  Users, 
  Newspaper, 
  UserPlus, 
  User,
  LogOut
} from 'lucide-react';
// import instance from '../utils/Axios';


const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('lawyers');
  const handleContactLawyer = (lawyer: Lawyer) => {
  alert(`Contacting ${lawyer.name}. In a real app, this would open a contact form or messaging interface.`);
};

const handleViewProfile = (lawyer: Lawyer) => {
  alert(`Viewing profile of ${lawyer.name}. In a real app, this would show detailed profile information.`);
};

const handleLawyerRegistration = (data: LawyerFormData) => {
  console.log('Lawyer registration submitted:', data);
  // In a real app, you would send this data to your backend API
};
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Scale className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">IndiLex</span>
              <span className="text-sm text-gray-500 ml-2">Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <User className="h-5 w-5" />
                <span>Welcome, User</span>
              </div>
              <button className="text-gray-500 hover:text-red-600 transition-colors">
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
              onClick={() => setActiveTab('lawyers')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                activeTab === 'lawyers'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Verified Lawyers</span>
            </button>
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
              onClick={() => setActiveTab('register')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                activeTab === 'register'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <UserPlus className="h-4 w-4" />
              <span>Register as Lawyer</span>
            </button>
          </div>
        </div>
      </nav> 
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  {activeTab === 'lawyers' && (
    <LawyersList 
      lawyers={ verifiedLawyers}
      onContactLawyer={handleContactLawyer}
      onViewProfile={handleViewProfile}
    />
  )}
  
  {activeTab === 'news' && (
    <NewsSection />
  )}
  
  {activeTab === 'register' && (
    <LawyerRegistration 
      onSubmit={handleLawyerRegistration}
    />
  )}
</main>
    </div>
    
  )
}

export default Dashboard;