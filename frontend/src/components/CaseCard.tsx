import React from 'react';
import { 
  User,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface UserReq {
  id: number;
  name: string;
  email: string;
  contact: number;
  caseDesc: string;
  userID: number;
  laywerID: number;
}

interface CaseCardProps {
  case: UserReq;
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
  loading?: boolean;
}

const CaseCard: React.FC<CaseCardProps> = ({ 
  case: caseData, 
  onAccept, 
  onReject, 
  loading 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
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
        <div className="flex items-center space-x-1 text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
          <AlertCircle className="h-4 w-4" />
          <span className="text-xs font-medium">Pending</span>
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
      
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-2">Case Description:</h4>
        <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-md">
          {caseData.caseDesc}
        </p>
      </div>
      
      <div className="flex space-x-3">
        <button
          onClick={() => onAccept(caseData.id)}
          disabled={loading}
          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <CheckCircle className="h-4 w-4" />
          <span>Accept</span>
        </button>
        <button
          onClick={() => onReject(caseData.id)}
          disabled={loading}
          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <AlertCircle className="h-4 w-4" />
          <span>Reject</span>
        </button>
      </div>
    </div>
  );
};

export default CaseCard;