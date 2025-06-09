import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Building2, MapPin, Globe, Users, Mail, Phone, Search, Plus, BriefcaseIcon, Edit } from 'lucide-react';
import axios from 'axios';
import { Company, Job } from '../../types';
import { JobCard } from '../../components/JobCard';

export function CompanyProfile() {
  const navigate = useNavigate();
  const { id: companyIdFromUrl } = useParams<{ id: string }>();

  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [jobStats, setJobStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    averageApplications: 0
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role);
      } catch (err) {
        console.error('Error parsing token:', err);
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        let companyResponse;
        let jobsResponse;

        if (userRole === 'recruiter') {
          [companyResponse, jobsResponse] = await Promise.all([
            axios.get('http://localhost:5000/jobiai/api/company', { headers }),
            axios.get('http://localhost:5000/jobiai/api/job/all/companyJobs', { headers })
          ]);
        } else {
          if (!companyIdFromUrl) {
            throw new Error('Company ID is required');
          }

          [companyResponse, jobsResponse] = await Promise.all([
            axios.get(`http://localhost:5000/jobiai/api/company/${companyIdFromUrl}`),
            axios.get(`http://localhost:5000/jobiai/api/job/by-company/${companyIdFromUrl}`)
          ]);
        }

        setCompany(companyResponse.data);

        const jobsData = userRole === 'recruiter'
            ? (jobsResponse.data.jobs || [])
            : (jobsResponse.data || []);

        setJobs(jobsData);
        setFilteredJobs(jobsData);

        const activeJobs = jobsData.filter((job: Job) => job.status === 'Active').length;
        setJobStats({
          totalJobs: jobsData.length,
          activeJobs,
          averageApplications: Math.round(jobsData.length * 1.5)
        });

        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load company data. Please try again later.');
        setLoading(false);
      }
    };

    if (userRole !== undefined || companyIdFromUrl) {
      fetchData();
    }
  }, [userRole, companyIdFromUrl]);

  useEffect(() => {
    if (!Array.isArray(jobs) || jobs.length === 0) return;

    const filtered = jobs.filter(job =>
        job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.jobDescription.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredJobs(filtered);
  }, [searchTerm, jobs]);

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="bg-red-50 text-red-700 p-4 rounded-lg">
            <p>{error}</p>
          </div>
        </div>
    );
  }

  if (!company) {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg">
            <p>Company not found</p>
          </div>
        </div>
    );
  }

  // @ts-ignore
  return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Company Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {company.logo ? (
                        <img src={company.logo} alt={company.name} className="w-16 h-16 object-contain" />
                    ) : (
                        <Building2 className="w-10 h-10 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-gray-600">
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-1" />
                        <span>{company.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Users size={16} className="mr-1" />
                        <span>{company.size}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {userRole === 'recruiter' && (
                    <button
                        onClick={() => navigate('/company/profile/edition')}
                        className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                    >
                      <Edit size={16} />
                      Edit Profile
                    </button>
                )}
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3 text-gray-900">About</h2>
                <p className="text-gray-700">{company.description}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3 text-gray-900">Industry</h2>
                <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full">
                  {company.industry}
                </div>
              </div>
            </div>

            {/* Jobs Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Open Positions</h2>
                {userRole === 'recruiter' && (
                    <button
                        onClick={() => navigate('/job/post')}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      <Plus size={16} className="mr-2" />
                      Post New Job
                    </button>
                )}
              </div>

              <div className="mb-6">
                <div className="relative">
                  <input
                      type="text"
                      placeholder="Search jobs by title, department, or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
              </div>

              <div className="space-y-6">
                {!Array.isArray(filteredJobs) || filteredJobs.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {!Array.isArray(jobs) || jobs.length === 0
                            ? 'No jobs have been posted yet.'
                            : 'Try adjusting your search terms.'}
                      </p>
                    </div>
                ) : (
                    filteredJobs.map((job) => (
                        <JobCard
                            key={job._id}
                            job={{
                              ...job,
                              postedAt: job.createdAt
                            }}
                        />
                    ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-5 w-5 mr-3 text-indigo-600" />
                  <a href={`mailto:${company.email}`} className="hover:text-indigo-600 transition-colors duration-200">
                    {company.email}
                  </a>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-5 w-5 mr-3 text-indigo-600" />
                  <a href={`tel:${company.phone}`} className="hover:text-indigo-600 transition-colors duration-200">
                    {company.phone}
                  </a>
                </div>
                <div className="flex items-center text-gray-600">
                  <Building2 className="h-5 w-5 mr-3 text-indigo-600" />
                  <span>{company.address}</span>
                </div>
                {company.website && (
                    <div className="flex items-center text-gray-600">
                      <Globe className="h-5 w-5 mr-3 text-indigo-600" />
                      <a
                          href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-indigo-600 transition-colors duration-200"
                      >
                        {company.website}
                      </a>
                    </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Total Jobs</h3>
                  <BriefcaseIcon className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="text-2xl font-bold text-indigo-600">{jobStats.totalJobs}</div>
                <div className="text-sm text-gray-500">Posted positions</div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Active Jobs</h3>
                  <BriefcaseIcon className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">{jobStats.activeJobs}</div>
                <div className="text-sm text-gray-500">Currently active</div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Average Applications</h3>
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-600">{jobStats.averageApplications}</div>
                <div className="text-sm text-gray-500">Per position</div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

