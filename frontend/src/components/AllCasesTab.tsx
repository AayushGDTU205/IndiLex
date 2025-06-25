import React from 'react';
import { FileText } from 'lucide-react';
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

interface AllCasesTabProps {
  reviewedCases: ReviewedUserReq[];
}

const AllCasesTab: React.FC<AllCasesTabProps> = ({ reviewedCases }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">All Cases</h2>
        <div className="text-sm text-gray-500">
          {reviewedCases.length} total cases
        </div>
      </div>
      
      {reviewedCases.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No cases yet</h3>
          <p className="text-gray-500">Reviewed cases will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {reviewedCases.map((caseData) => (
            <ReviewedCaseCard key={caseData.id} case={caseData} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllCasesTab;