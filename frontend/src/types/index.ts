export interface User{
    id:number,
    name:string,
    email:string,
    password:string,
    formStatus:string,
    isLawyer:boolean,
    isAdmin:boolean,
    isLoggedIn:boolean
}

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
  snippet: string;
  link: string;
  imageUrl?: string;
  date: string;
  source: string;
  position: number;
}

export interface LawyerFormData {
  name: string;
  email: string;
  location: string;
  address: string;
  barLicenseNumber: string;
  Specialization: string;
  court: string;
  practiceSince: string;
}

export interface LawyerRequest {
  id: number;
  name: string;
  email: string;
  location: string;
  address: string;
  barLicenseNumber: string;
  Specialization: string;
  court: string;
  practiceSince: number;
  userId: number;
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