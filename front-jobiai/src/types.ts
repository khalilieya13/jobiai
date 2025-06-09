export interface Job {
  _id: string;
  jobTitle: string;
  company: Company;
  location: string;
  employmentType: string;
  department: string;
  workMode: string;
  experienceLevel: string;
  salaryRange: {
    min: number;
    max: number;
  };
  jobDescription: string;
  requirements: string[];
  createdAt: string;
  status: string;
}
export interface Company {
  _id: string;
  name: string;
  logo?: string;
  location: string;
  website?: string;
  size: string;
  industry: string;
  founded: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  createdBy: string;
}
export interface User {
  _id: string;
  email: string;
  password: string;
  role: "admin" | "candidate" | "recruiter";
  username: string;
}

export interface Application {
  _id: string;
  jobId: string;
  userId: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  appliedAt: string;
}
export interface ResumeCandidate {
  _id: string;
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    address: string;
    summary: string;
  };
  education: {
    title: string;
    type: 'diploma' | 'training';
    institution: string;
    startYear: string;
    endYear: string;
    description: string;
  }[];
  experience: {
    company: string;
    position: string;
    location: string;
    startYear: string;
    endYear: string;
    description: string;
  }[];
  skills: {
    name: string;
    level: number;
  }[];
  accreditations: {
    title: string;
    organization: string;
    year: string;
    description: string;
  }[];
  languages: {
    language: string;
    proficiency: string;
  }[];
  interests: string[];
  links: {
    title: string;
    url: string;
  }[];
  createdBy: string;
  resumeFileUrl?: string;

}
export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' ;
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
}

export interface Quiz {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  jobPostId: string;
  duration: number; // in minutes
  questions: Question[];
  createdAt: string;
  createdBy: string;
}
export interface CandidateResponse {
  quizId: string;
  candidateId: string;
  jobPostId: string;
  startedAt: string;
  completedAt?: string;
  answers: {
    questionId: string;
    answer: string | string[];
  }[];
  score?: number;
}
export interface IQuizResponse {
  quizId: Quiz;
  candidateId: User ; // fait référence à un User
  score: number;
  timeTaken: number;
  submittedAt: string;
}