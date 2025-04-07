import React, { useState } from 'react';
import { SearchBar } from '../components/SearchBar';
import { JobCard } from '../components/JobCard';
import { Filter, SlidersHorizontal } from 'lucide-react';

const filters = {
  jobType: ['Full-time', 'Part-time', 'Contract', 'Internship'],
  experience: ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'],
  salary: ['$0-$50k', '$50k-$100k', '$100k-$150k', '$150k+'],
  remote: ['Remote', 'Hybrid', 'On-site']
};

export function JobSearch() {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Dream Job</h1>
        <SearchBar />
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <div className={`w-64 shrink-0 ${showFilters ? 'block' : 'hidden'} md:block`}>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Filter className="h-5 w-5 text-gray-500" />
            </div>

            {Object.entries(filters).map(([category, options]) => (
              <div key={category} className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2 capitalize">
                  {category.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <div className="space-y-2">
                  {options.map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <button
              className="md:hidden flex items-center text-gray-700"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              Filters
            </button>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select className="text-sm border-gray-300 rounded-md">
                <option>Most Relevant</option>
                <option>Newest</option>
                <option>Salary: High to Low</option>
                <option>Salary: Low to High</option>
              </select>
            </div>
          </div>

          <div className="space-y-6">
            {/* Sample jobs - replace with real data */}
            {[1, 2, 3, 4, 5].map((i) => (
              <JobCard
                key={i}
                job={{
                  id: i.toString(),
                  title: 'Senior Frontend Developer',
                  company: 'TechCorp Inc.',
                  location: 'Paris, France',
                  type: 'Full-time',
                  salary: '€60k - €80k',
                  description: 'We are looking for an experienced Frontend Developer to join our team and help build amazing user experiences.',
                  requirements: ['5+ years React experience', 'TypeScript', 'UI/UX knowledge'],
                  postedAt: '2 days ago'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}