export interface Lawyer {
  id: number;
  name: string;
  email: string;
  location: string;
  address: string;
  barLicenseNumber: string;
  Specialization: string;
  court: string;
  practiceSince: number;
}

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    id: string;
    name: string;
  };
  author?: string;
  content?: string;
}

export interface LawyerFormData {
  fullName: string;
  email: string;
  phone: string;
  barCouncilId: string;
  practiceAreas: string[];
  experience: string;
  education: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  bio: string;
  fees: string;
}

export interface UserReq {
  id?: number;
  name: string;
  email: string;
  contact: number;
  caseDesc: string;
  userID?: number;
  laywerID: number;
}

export interface CaseFormData {
  name: string;
  email: string;
  contact: string;
  caseDesc: string;
  lawyerID: number;
}

export type ActiveTab = 'lawyers' | 'news' | 'register';