import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BriefcaseIcon, MapPin, ArrowRight } from 'lucide-react';

interface RecommendedJob {
    _id: string;
    jobTitle: string;
    department: string;
    location: string;
    workMode: string;
    employmentType: string;
    idCompany: {
        name: string;
        logo: string;
        industry: string;
    };
    matchingScore: number;
}

export function JobRecommendation() {
    const [recommendations, setRecommendations] = useState<RecommendedJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Please log in to see personalized job recommendations');
                    setLoading(false);
                    return;
                }

                const response = await axios.get('http://localhost:5000/jobiai/api/recommendation/jobs', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // Take only the top 3 recommendations
                const topRecommendations = response.data.slice(0, 3);
                setRecommendations(topRecommendations);
                setLoading(false);
            } catch (err: any) {
                console.error('Failed to fetch job recommendations', err);
                if (err.response?.status === 401) {
                    setError('Please log in to see personalized job recommendations');
                } else if (err.response?.status === 403) {
                    setError('Access denied. This feature is only available for candidates.');
                } else {
                    setError('Failed to load job recommendations. Please try again later.');
                }
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    if (loading) {
        return (
            <div className="my-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Job Recommendations</h2>
                <div className="animate-pulse grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-lg shadow-sm p-6 h-64">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                            <div className="h-24 bg-gray-200 rounded mb-4"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="my-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Job Recommendations</h2>
                <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-lg text-center">
                    <p className="text-indigo-700 mb-4">{error}</p>
                    {error.includes('log in') && (
                        <button
                            onClick={() => navigate('/login')}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                        >
                            Log In
                        </button>
                    )}
                </div>
            </div>
        );
    }

    if (recommendations.length === 0) {
        return null; // Don't show the section if there are no recommendations
    }

    return (
        <div className="my-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Job Recommendations</h2>
            <p className="text-gray-600 mb-6">
                Based on your profile and preferences, we found these jobs that might be a perfect match for you.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendations.map((job) => (
                    <div
                        key={job._id}
                        className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-300 border border-transparent hover:border-indigo-100"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{job.jobTitle}</h3>
                                <p className="text-gray-600 text-sm">{job.idCompany?.name || 'Company'}</p>
                            </div>
                            <div className="flex-shrink-0">
                                <BriefcaseIcon className="h-8 w-8 text-indigo-600" />
                            </div>
                        </div>

                        <div className="mt-2 flex items-center space-x-3 text-xs text-gray-500">
                            <div className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {job.location}
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700">Match Score</span>
                                <span className="text-sm font-semibold text-indigo-600">{Math.round(job.matchingScore * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-indigo-600 h-2 rounded-full"
                                    style={{ width: `${Math.round(job.matchingScore * 100)}%` }}
                                ></div>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate(`/job/${job._id}`)}
                            className="mt-5 w-full flex items-center justify-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 transition-colors group"
                        >
                            View Details
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}