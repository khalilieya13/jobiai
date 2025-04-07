export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  postedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  type: 'candidate' | 'recruiter';
  avatar?: string;
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  appliedAt: string;
}