export interface Lawyer {
  id: number;
  name: string;
  specialization: string;
  experience: string;
  rating: number;
  location: string;
  phone: string;
  email: string;
  cases: number;
  image: string;
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

export type ActiveTab = 'lawyers' | 'news' | 'register';