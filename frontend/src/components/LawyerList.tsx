import React from 'react';
import { 
  Star, 
  MapPin, 
  Briefcase,
  FileText
} from 'lucide-react';
import type { Lawyer } from '../types';

interface LawyersListProps {
  lawyers: Lawyer[];
  onContactLawyer?: (lawyer: Lawyer) => void;
  onViewProfile?: (lawyer: Lawyer) => void;
}

const LawyersList: React.FC<LawyersListProps> = ({ 
  lawyers, 
  onContactLawyer, 
  onViewProfile 
}) => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Verified Lawyers</h1>
        <p className="text-gray-600">Connect with qualified legal professionals</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lawyers.map(lawyer => (
          <div key={lawyer.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={lawyer.image}
                alt={lawyer.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{lawyer.name}</h3>
                <p className="text-blue-600 font-medium">{lawyer.specialization}</p>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Briefcase className="h-4 w-4 mr-2" />
                {lawyer.experience} experience
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                {lawyer.location}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <FileText className="h-4 w-4 mr-2" />
                {lawyer.cases} cases handled
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-900 ml-1">{lawyer.rating}</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button 
                onClick={() => onContactLawyer?.(lawyer)}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Contact
              </button>
              <button 
                onClick={() => onViewProfile?.(lawyer)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LawyersList;