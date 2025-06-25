import React from 'react';
import { CheckCircle } from 'lucide-react';
import ReviewedCaseCard from './ReviewedCaseCard';

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

interface AcceptedCasesTabProps {
  acceptedCases: ReviewedUserReq[];
}

const AcceptedCasesTab: React.FC<AcceptedCasesTabProps> = ({ acceptedCases }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Accepted Cases</h2>
        <div className="text-sm text-gray-500">
          {acceptedCases.length} accepted cases
        </div>
      </div>
      
      {acceptedCases.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No accepted cases</h3>
          <p className="text-gray-500">Cases you accept will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {acceptedCases.map((caseData) => (
            <ReviewedCaseCard key={caseData.id} case={caseData} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AcceptedCasesTab;