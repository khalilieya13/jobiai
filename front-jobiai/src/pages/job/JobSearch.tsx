import { useEffect, useState } from 'react';
import axios from 'axios';
import { SearchBarJ } from '../../components/SearchBarJ.tsx';
import { JobCard } from '../../components/JobCard.tsx';
import { JobRecommendation } from '../../components/JobRecommendation.tsx';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const filters = {
  employmentType: ['full-time', 'part-time', 'contract', 'internship'],
  experience: ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'],
  salary: ['$0-$50k', '$50k-$100k', '$100k-$150k', '$150k+'],
  workMode: ['remote', 'hybrid', 'on site'],
};

interface Job {
  _id: string;
  jobTitle: string;
  company: string;
  location: string;
  employmentType: string;
  salaryRange: { min: number; max: number };
  jobDescription: string;
  postedAt: string;
  experienceLevel: string;
  workMode: string;
}

export function JobSearch() {
  const [showFilters, setShowFilters] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    employmentType: [] as string[],
    experience: [] as string[],
    salary: [] as string[],
    workMode: [] as string[],
  });
  const [searchQuery, setSearchQuery] = useState({ keyword: '', location: '' });

  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const keywordFromURL = searchParams.get('keyword') || location.state?.keyword || '';
    const locationFromURL = searchParams.get('location') || location.state?.location || '';

    setSearchQuery({ keyword: keywordFromURL, location: locationFromURL });
  }, [location]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/jobiai/api/job/all');
        const jobsFromAPI = res.data;

        const formattedJobs: Job[] = jobsFromAPI.map((job: any) => ({
          _id: job._id,
          jobTitle: job.jobTitle,
          company: job.idCompany?.name || 'Entreprise inconnue',
          location: job.location,
          employmentType: job.employmentType,
          workMode: job.workMode,
          salaryRange: { min: job.salaryRange?.min, max: job.salaryRange?.max },
          jobDescription: job.jobDescription,
          postedAt: new Date(job.updatedAt).toLocaleDateString('fr-FR'),
          experienceLevel: job.experienceLevel,
        }));

        setJobs(formattedJobs);
        setLoading(false);
      } catch (err) {
        setError('Failed to load jobs');
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchEmploymentType =
        selectedFilters.employmentType.length === 0 ||
        selectedFilters.employmentType.includes(job.employmentType);

    const matchWorkMode =
        selectedFilters.workMode.length === 0 || selectedFilters.workMode.includes(job.workMode);

    const matchExperience =
        selectedFilters.experience.length === 0 ||
        selectedFilters.experience.includes(job.experienceLevel);

    const matchSalary =
        selectedFilters.salary.length === 0 ||
        selectedFilters.salary.some((salaryRange) => {
          switch (salaryRange) {
            case '$0-$50k':
              return job.salaryRange.min >= 0 && job.salaryRange.max <= 50;
            case '$50k-$100k':
              return job.salaryRange.min >= 50 && job.salaryRange.max <= 100;
            case '$100k-$150k':
              return job.salaryRange.min >= 100 && job.salaryRange.max <= 150;
            case '$150k+':
              return job.salaryRange.min >= 150;
            default:
              return false;
          }
        });

    const matchSearchQuery =
        job.jobTitle.toLowerCase().includes(searchQuery.keyword.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.keyword.toLowerCase()) ||
        job.jobDescription.toLowerCase().includes(searchQuery.keyword.toLowerCase());

    const matchLocation = job.location.toLowerCase().includes(searchQuery.location.toLowerCase());

    return (
        matchEmploymentType &&
        matchWorkMode &&
        matchExperience &&
        matchSalary &&
        matchSearchQuery &&
        matchLocation
    );
  });

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Dream Job</h1>
          <SearchBarJ
              keyword={searchQuery.keyword}
              location={searchQuery.location}
              onSearch={(keyword, location) => setSearchQuery({ keyword, location })}
          />
        </div>

        {/* AI Job Recommendations Section */}
        <JobRecommendation />

        <div id="jobs-section" className="flex gap-8 mt-8">
          {/* Sidebar des filtres */}
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
                                value={option}
                                checked={selectedFilters[category as keyof typeof selectedFilters].includes(
                                    option
                                )}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setSelectedFilters((prev) => {
                                    const updated = [...(prev[category as keyof typeof prev] as string[])];
                                    if (checked) {
                                      updated.push(option);
                                    } else {
                                      const index = updated.indexOf(option);
                                      if (index > -1) updated.splice(index, 1);
                                    }
                                    return {
                                      ...prev,
                                      [category]: updated,
                                    };
                                  });
                                }}
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

          {/* Contenu principal */}
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

            {/* Liste des jobs */}
            <div className="space-y-6">
              {loading ? (
                  <p>Loading jobs...</p>
              ) : error ? (
                  <p className="text-red-500">{error}</p>
              ) : jobs.length === 0 ? (
                  <p>No jobs found.</p>
              ) : (
                  filteredJobs.map((job) => <JobCard key={job._id} job={job} />)
              )}
            </div>
          </div>
        </div>
      </div>
  );
}