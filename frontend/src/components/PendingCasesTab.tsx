import React from 'react';
import { Briefcase } from 'lucide-react';
import CaseCard from './CaseCard';

interface UserReq {
  id: number;
  name: string;
  email: string;
  contact: number;
  caseDesc: string;
  userID: number;
  laywerID: number;
}

interface PendingCasesTabProps {
  pendingCases: UserReq[];
  onAcceptCase: (caseId: number) => void;
  onRejectCase: (caseId: number) => void;
  loading: boolean;
}

const PendingCasesTab: React.FC<PendingCasesTabProps> = ({
  pendingCases,
  onAcceptCase,
  onRejectCase,
  loading
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Pending Case Requests</h2>
        <div className="text-sm text-gray-500">
          {pendingCases.length} pending requests
        </div>
      </div>
      
      {pendingCases.length === 0 ? (
        <div className="text-center py-12">
          <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No pending cases</h3>
          <p className="text-gray-500">All case requests have been reviewed.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
          {pendingCases.map((caseData) => (
            <CaseCard
              key={caseData.id}
              case={caseData}
              onAccept={onAcceptCase}
              onReject={onRejectCase}
              loading={loading}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingCasesTab;