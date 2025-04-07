import React from 'react';
import { SearchBar } from '../components/SearchBar';
import { JobCard } from '../components/JobCard';
import { Briefcase, Users, Building2, Trophy } from 'lucide-react';

const featuredJobs = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'Paris, France',
    type: 'Full-time',
    salary: '€60k - €80k',
    description: 'We are looking for an experienced Frontend Developer to join our team and help build amazing user experiences.',
    requirements: ['5+ years React experience', 'TypeScript', 'UI/UX knowledge'],
    postedAt: '2 days ago'
  },
  {
    id: '2',
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    location: 'Remote',
    type: 'Full-time',
    salary: '€55k - €75k',
    description: 'Join our fast-growing startup and work on cutting-edge technologies.',
    requirements: ['Node.js', 'React', 'PostgreSQL'],
    postedAt: '1 day ago'
  }
];

const stats = [
  { icon: Briefcase, label: 'Active Jobs', value: '2,000+' },
  { icon: Users, label: 'Candidates', value: '50,000+' },
  { icon: Building2, label: 'Companies', value: '1,000+' },
  { icon: Trophy, label: 'Successful Hires', value: '10,000+' }
];

export function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
            Find Your Dream Job with AI-Powered Matching
          </h1>
          <p className="text-xl text-center text-indigo-200 mb-12">
            Connect with top companies and opportunities tailored just for you
          </p>
          <div className="max-w-4xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-4">
                <stat.icon className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Jobs Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Jobs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}