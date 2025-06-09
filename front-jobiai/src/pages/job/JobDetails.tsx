import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Briefcase, MapPin, Clock, Award, DollarSign, Trash2,
    Globe, Mail, Phone, Building, PenSquare, FileCheck, FilePlus, TestTube
} from 'lucide-react';

interface CompanyData {
    name: string;
    logo: string;
    location: string;
    website: string;
    size: string;
    description: string;
    industry: string;
    founded: string;
    email: string;
    phone: string;
    address: string;
    _id: string;
}

interface JobData {
    _id: string;
    jobTitle: string;
    department: string;
    location: string;
    employmentType: string;
    workMode: string;
    experienceLevel: string;
    salaryRange: {
        min: string;
        max: string;
    };
    requiredSkills: string[];
    jobDescription: string;
    idCompany: CompanyData;
    createdAt: string;
}

export function JobDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState<JobData | null>(null);
    const [matchScore, setMatchScore] = useState<number | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [jobToDelete, setJobToDelete] = useState<JobData | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showTestModal, setShowTestModal] = useState(false);
    const [userRole, setUserRole] = useState<string>('guest');
    const [hasResume, setHasResume] = useState<boolean>(false);
    const [hasTest, setHasTest] = useState<boolean>(false);
    const [isApplying, setIsApplying] = useState(false);
    const [showNoResumeModal, setShowNoResumeModal] = useState(false);


    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };

    useEffect(() => {
        const fetchUserRole = () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setUserRole('guest');
                return;
            }

            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(
                    atob(base64)
                        .split('')
                        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                        .join('')
                );

                const decoded = JSON.parse(jsonPayload);
                if (decoded.exp && decoded.exp * 1000 < Date.now()) {
                    setUserRole('guest');
                } else {
                    setUserRole(decoded.role || 'guest');
                }
            } catch (e) {
                console.error('Error decoding token:', e);
                setUserRole('guest');
            }
        };

        const checkResume = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const resumeResponse = await axios.get(
                    'http://localhost:5000/jobiai/api/resume/',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (resumeResponse.data && Object.keys(resumeResponse.data).length > 0) {
                    setHasResume(true);
                }
            } catch (err) {
                console.error('Error fetching resume:', err);
            }
        };

        const checkTest = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token || !id) return;

                const response = await axios.get(
                    `http://localhost:5000/jobiai/api/quiz/job/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.data && response.data.length > 0) {
                    setHasTest(true);
                }
            } catch (err) {
                console.error('Error checking test:', err);
            }
        };
        const fetchMatchScore = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token || !id) return;

                const response = await axios.get(
                    `http://localhost:5000/jobiai/api/recommendation/match/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setMatchScore(response.data.matchingScore); // suppose que tu reçois { matchScore: 0.7 }
            } catch (err) {
                console.error("Failed to fetch match score:", err);
            }
        };



        const fetchJobDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(
                    `http://localhost:5000/jobiai/api/job/${id}`,
                    {
                        headers: token ? {
                            Authorization: `Bearer ${token}`,
                        } : {},
                    }
                );
                setJob(response.data);
                setIsLoading(false);
            } catch (err) {
                setError('Failed to load job details');
                setIsLoading(false);
            }
        };

        fetchUserRole();
        fetchJobDetails();
        if (userRole === 'recruiter' || userRole === 'candidate') {
            checkTest();
        }
        if (userRole === 'candidate') {
            checkResume();
            fetchMatchScore();
        }
    }, [id, userRole]);

    const handleDelete = async () => {
        if (!jobToDelete) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(
                `http://localhost:5000/jobiai/api/job/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            navigate('/');
        } catch (err) {
            setError('Failed to delete job');
        }
    };

    const handleApplyClick = () => {
        if (!hasResume) {
            setShowNoResumeModal(true); // Show the nice modal
            return;
        }

        if (hasTest) {
            setShowTestModal(true);
        } else {
            handleDirectApply();
        }
    };




    const handleDirectApply = async () => {
        try {
            setIsApplying(true);
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:5000/jobiai/api/candidacy/apply',
                { jobPost: id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            navigate('/candidate/dashboard');
        } catch (err) {
            console.error('Error applying to job:', err);
            setError('Failed to apply to job');
        } finally {
            setIsApplying(false);
        }
    };

    const handleTestConfirm = () => {
        navigate(`/test/taker/${id}`);
    };

    const renderTestSection = () => {
        if (userRole !== 'recruiter' && userRole !== 'candidate') return null;

        if (hasTest) {
            return (
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <TestTube className="h-8 w-8 text-emerald-500 mr-4" />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Test Available</h3>
                                <p className="text-gray-600">
                                    {userRole === 'recruiter'
                                        ? 'This job posting has an active test for candidates'
                                        : 'This position requires completing a skills assessment test'}
                                </p>
                            </div>
                        </div>
                        {userRole === 'recruiter' && (
                            <button
                                onClick={() => navigate(`/test/create/${id}`)}
                                className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-md hover:bg-emerald-100 transition-colors"
                            >
                                Modify Test
                            </button>
                        )}
                        {userRole === 'candidate' && (
                            <button
                                onClick={handleApplyClick}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                                disabled={isApplying}
                            >
                                <Briefcase className="w-5 h-5 mr-2" />
                                Apply to Job
                            </button>
                        )}
                    </div>
                </div>
            );
        }

        if (userRole === 'recruiter') {
            return (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <TestTube className="h-8 w-8 text-gray-400 mr-4" />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">No Test Available</h3>
                                <p className="text-gray-600">Create a test to evaluate candidates for this position</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate(`/test/create/${id}`)}
                            className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors"
                        >
                            Create Test
                        </button>
                    </div>
                </div>
            );
        }

        return null;
    };

    const renderAIMatching = () => {
        if (userRole !== 'candidate') return null;

        if (!hasResume) {
            return (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <FilePlus className="h-8 w-8 text-indigo-500 mr-4" />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Create your resume</h3>
                                <p className="text-gray-600">
                                    Create your resume to see how well you match with this job opportunity
                                </p>
                            </div>
                        </div>
                        <a
                            href="/resume"
                            className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors"
                        >
                            Create Resume
                        </a>
                    </div>
                </div>
            );
        }
        const roundedScore = matchScore !== null ? Math.round(matchScore * 100) : 0;



        return (
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <FileCheck className="h-8 w-8 text-indigo-500 mr-4" />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">AI Matching</h3>
                            <p className="text-gray-600">
                                Your profile matches {roundedScore}% of the requirements for this position
                            </p>
                        </div>
                    </div>
                    <div className="relative h-16 w-16">
                        <div className="absolute inset-0 rounded-full bg-gray-200"></div>
                        <div
                            className="absolute inset-0 rounded-full bg-indigo-600"
                            style={{
                                clipPath: `polygon(0 0, 100% 0, 100% 100%, 0% 100%)`,
                                background: `conic-gradient(#4f46e5 ${roundedScore}%, transparent 0)`
                            }}
                        ></div>
                        <div className="absolute inset-0 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold">{roundedScore}%</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900">Error</h2>
                    <p className="mt-2 text-gray-600">{error || 'Job not found'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {renderAIMatching()}
                {renderTestSection()}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold text-gray-900">{job.jobTitle}</h1>
                                <span className="text-sm text-gray-500">• Posted {formatDate(job.createdAt)}</span>
                            </div>
                            <p className="text-gray-600">{job.department}</p>
                        </div>
                        <div className="flex space-x-3">
                            {userRole === 'recruiter' && (
                                <>
                                    <button
                                        onClick={() => navigate(`/job/edition/${id}`)}
                                        className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors"
                                    >
                                        <PenSquare className="w-4 h-4 mr-2"/>
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            setJobToDelete(job);
                                            setShowDeleteModal(true);
                                        }}
                                        className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2"/>
                                        Delete
                                    </button>
                                </>
                            )}
                            {userRole === 'candidate' && !hasTest && (
                                <button
                                    onClick={handleApplyClick}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                                    disabled={isApplying}
                                >
                                    <Briefcase className="w-5 h-5 mr-2" />
                                    {isApplying ? 'Applying...' : 'Apply to Job'}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <div className="flex items-center">
                            <MapPin className="w-5 h-5 text-gray-400 mr-3"/>
                            <div>
                                <p className="text-sm text-gray-500">Location</p>
                                <p className="font-medium text-gray-900">{job.location}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Briefcase className="w-5 h-5 text-gray-400 mr-3"/>
                            <div>
                                <p className="text-sm text-gray-500">Employment Type</p>
                                <p className="font-medium text-gray-900">{job.employmentType}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Clock className="w-5 h-5 text-gray-400 mr-3"/>
                            <div>
                                <p className="text-sm text-gray-500">Work Mode</p>
                                <p className="font-medium text-gray-900">{job.workMode}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Award className="w-5 h-5 text-gray-400 mr-3"/>
                            <div>
                                <p className="text-sm text-gray-500">Experience Level</p>
                                <p className="font-medium text-gray-900">{job.experienceLevel}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <DollarSign className="w-5 h-5 text-gray-400 mr-3"/>
                            <div>
                                <p className="text-sm text-gray-500">Salary Range</p>
                                <p className="font-medium text-gray-900">
                                    ${job.salaryRange.min} - ${job.salaryRange.max}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Required Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {job.requiredSkills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
                        <div className="prose max-w-none">
                            <p className="text-gray-600 whitespace-pre-wrap">{job.jobDescription}</p>
                        </div>
                    </div>
                </div>

                {/* Company Information */}
                <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center space-x-4 mb-6">
                        <div
                            className="flex items-center space-x-4 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                            onClick={() => navigate(`/company/${job.idCompany._id}`)}
                        >
                            <img
                                src={job.idCompany.logo}
                                alt={job.idCompany.name}
                                className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{job.idCompany.name}</h2>
                                <p className="text-gray-500">{job.idCompany.industry}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">About the Company</h3>
                            <p className="text-gray-600">{job.idCompany.description}</p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                            <div className="space-y-3">
                                <div className="flex items-center text-gray-600">
                                    <Globe className="h-5 w-5 mr-3"/>
                                    <a href={job.idCompany.website} target="_blank" rel="noopener noreferrer"
                                       className="text-indigo-600 hover:text-indigo-800">
                                        {job.idCompany.website}
                                    </a>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Mail className="h-5 w-5 mr-3"/>
                                    <a href={`mailto:${job.idCompany.email}`}
                                       className="text-indigo-600 hover:text-indigo-800">
                                        {job.idCompany.email}
                                    </a>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Phone className="h-5 w-5 mr-3"/>
                                    <a href={`tel:${job.idCompany.phone}`}
                                       className="text-indigo-600 hover:text-indigo-800">
                                        {job.idCompany.phone}
                                    </a>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Building className="h-5 w-5 mr-3"/>
                                    <span>{job.idCompany.address}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && jobToDelete && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Delete Job</h2>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this job posting? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setJobToDelete(null);
                                }}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Test Confirmation Modal */}
            {showTestModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Take the Test</h2>
                        <p className="text-gray-600 mb-6">
                            To apply for this position, you need to complete a skills assessment test. Would you like to take the test now?
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowTestModal(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleTestConfirm}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            >
                                Yes, Take Test
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showNoResumeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Resume Required</h2>
                        <p className="text-gray-600 mb-6">
                            You need to create or upload your resume before applying to this job.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowNoResumeModal(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setShowNoResumeModal(false);
                                    navigate("/resume");
                                }}
                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            >
                                Go to Resume
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default JobDetails;