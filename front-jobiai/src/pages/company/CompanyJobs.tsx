import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Eye, Building2, MapPin, Clock, Briefcase } from 'lucide-react';
import { jobAPI, companyAPI } from '../../api';
import { Job, Company } from '../../types';

const CompanyJobs = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [company, setCompany] = useState<Company | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                if (!id) {
                    throw new Error('Company ID is required');
                }

                const [jobsRes, companyRes] = await Promise.all([
                    jobAPI.getByCompany(id),
                    companyAPI.getById(id)
                ]);

                if (Array.isArray(jobsRes.data)) {
                    setJobs(jobsRes.data);
                } else if (jobsRes.data && typeof jobsRes.data === 'object') {
                    const jobsArray = jobsRes.data.jobs || [];
                    setJobs(jobsArray);
                } else {
                    console.error('Jobs data is not in expected format:', jobsRes.data);
                    setJobs([]);
                }

                setCompany(companyRes.data);
            } catch (err: any) {
                console.error('Error fetching data:', err);
                setError(err.message || 'Failed to fetch data. Please try again.');
                setJobs([]);
                setCompany(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleDeleteJob = async (jobId: string) => {
        try {
            await jobAPI.delete(jobId);
            setJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
        } catch (err: any) {
            console.error('Error deleting job:', err);
            setError(err.message || 'Failed to delete job. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-indigo-600">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-red-600 text-center">
                    <p className="text-xl font-semibold mb-2">Error</p>
                    <p>{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Jobs at {company?.name || 'Company'}
                    </h1>
                </div>

                {company && (
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <div className="flex items-start">
                            {company.logo ? (
                                <img
                                    src={company.logo}
                                    alt={`${company.name} logo`}
                                    className="h-12 w-12 rounded-full object-cover mr-4"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.onerror = null;
                                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=6366f1&color=fff`;
                                    }}
                                />
                            ) : (
                                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                                    <Building2 className="h-6 w-6 text-indigo-600" />
                                </div>
                            )}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">{company.name}</h2>
                                <p className="text-gray-600 mb-2">{company.industry}</p>
                                <p className="text-gray-600">{company.location}</p>
                                <div className="mt-3">
                                    <button
                                        onClick={() => navigate(`/company/${company._id}`)}
                                        className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                                    >
                                        View Company Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">
                            All Jobs ({jobs.length})
                        </h2>
                    </div>

                    {jobs.length > 0 ? (
                        <div className="divide-y divide-gray-200">
                            {jobs.map((job) => (
                                <div key={job._id} className="p-6 hover:bg-gray-50">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                                                {job.jobTitle}
                                            </h3>
                                            <p className="text-gray-600 mb-2">{job.department}</p>

                                            <div className="flex flex-wrap gap-2 mb-3">
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <MapPin className="h-4 w-4 mr-1" />
                                                    {job.location}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Clock className="h-4 w-4 mr-1" />
                                                    {job.employmentType}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Briefcase className="h-4 w-4 mr-1" />
                                                    {job.workMode}
                                                </div>
                                            </div>

                                            <p className="text-sm text-gray-600">
                                                Salary: ${job.salaryRange?.min.toLocaleString()} - ${job.salaryRange?.max.toLocaleString()} per year
                                            </p>
                                        </div>

                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => navigate(`/job/${job._id}`)}
                                                className="p-2 text-indigo-600 hover:text-indigo-900 rounded-full hover:bg-gray-100"
                                                title="View Job Details"
                                            >
                                                <Eye className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteJob(job._id)}
                                                className="p-2 text-red-600 hover:text-red-900 rounded-full hover:bg-gray-100"
                                                title="Delete Job"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 mb-4">No jobs found for this company</p>
                            <button
                                onClick={() => navigate(-1)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            >
                                Go Back
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompanyJobs;