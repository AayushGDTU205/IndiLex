// Types for the Lawyer Dashboard

export interface UserReq {
  id: number;
  name: string;
  email: string;
  contact: number;
  caseDesc: string;
  userID: number;
  laywerID: number;
}

export interface ReviewedUserReq {
  id: number;
  name: string;
  email: string;
  contact: number;
  caseDesc: string;
  userID: number;
  laywerID: number;
  status: string;
}

export type ActiveTab = 'news' | 'cases' | 'accepted' | 'all';

export interface CaseCardProps {
  case: UserReq;
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
  loading?: boolean;
}

export interface ReviewedCaseCardProps {
  case: ReviewedUserReq;
}

export interface LawyerDashboardProps {
  // Add any props if needed for the main dashboard
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AcceptCaseRequest {
  caseID: number;
}

export interface RejectCaseRequest {
  caseID: number;
}