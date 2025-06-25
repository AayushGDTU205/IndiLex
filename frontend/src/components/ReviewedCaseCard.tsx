import React from 'react';
import { 
  User,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface ReviewedUserReq {
  id: number;
  name: string;
  email: string;
  contact: number;
  caseDesc: string;
  userID: number;
  laywerID: number;
  status: string;
}

interface ReviewedCaseCardProps {
  case: ReviewedUserReq;
}

const ReviewedCaseCard: React.FC<ReviewedCaseCardProps> = ({ case: caseData }) => {
  const isAccepted = caseData.status === 'Accepted';
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{caseData.name}</h3>
            <p className="text-sm text-gray-500">Case ID: #{caseData.id}</p>
          </div>
        </div>
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
          isAccepted 
            ? 'text-green-600 bg-green-50' 
            : 'text-red-600 bg-red-50'
        }`}>
          {isAccepted ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <span className="text-xs font-medium">{caseData.status}</span>
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-2 text-gray-600">
          <Mail className="h-4 w-4" />
          <span className="text-sm">{caseData.email}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Phone className="h-4 w-4" />
          <span className="text-sm">+91 {caseData.contact}</span>
        </div>
      </div>
      
      <div>
        <h4 className="font-medium text-gray-900 mb-2">Case Description:</h4>
        <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-md">
          {caseData.caseDesc}
        </p>
      </div>
    </div>
  );
};

export default ReviewedCaseCard;