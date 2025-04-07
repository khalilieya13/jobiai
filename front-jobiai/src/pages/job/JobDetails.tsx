import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Briefcase, MapPin, Clock, Award, DollarSign, Trash2, PenSquare,
    Building2, Globe, Users, Mail, Phone, Building
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
}

interface JobData {
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
}

export function JobDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState<JobData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(
                    `http://localhost:5000/jobiai/api/job/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setJob(response.data);
                setIsLoading(false);
            } catch (err) {
                setError('Failed to load job details');
                setIsLoading(false);
            }
        };

        fetchJobDetails();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this job post?')) {
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
                navigate('/'); // Navigate to jobs list after deletion
            } catch (err) {
                setError('Failed to delete job');
            }
        }
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Job Details */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            {/* Header */}
                            <div className="bg-indigo-600 px-6 py-8 text-white">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h1 className="text-3xl font-bold">{job.jobTitle}</h1>
                                        <p className="mt-2 text-indigo-100">{job.department}</p>
                                    </div>
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => navigate(`/job/edition/${id}`)}
                                            className="flex items-center px-4 py-2 bg-white text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
                                        >
                                            <PenSquare className="w-4 h-4 mr-2" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Job Details */}
                            <div className="px-6 py-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="flex items-center">
                                        <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Location</p>
                                            <p className="font-medium text-gray-900">{job.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <Briefcase className="w-5 h-5 text-gray-400 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Employment Type</p>
                                            <p className="font-medium text-gray-900">{job.employmentType}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="w-5 h-5 text-gray-400 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Work Mode</p>
                                            <p className="font-medium text-gray-900">{job.workMode}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <Award className="w-5 h-5 text-gray-400 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Experience Level</p>
                                            <p className="font-medium text-gray-900">{job.experienceLevel}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <DollarSign className="w-5 h-5 text-gray-400 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Salary Range</p>
                                            <p className="font-medium text-gray-900">
                                                ${job.salaryRange.min} - ${job.salaryRange.max}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Required Skills */}
                                <div className="mb-8">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Required Skills</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {job.requiredSkills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                                            >
                        {skill}
                      </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Job Description */}
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h2>
                                    <div className="prose max-w-none">
                                        <p className="text-gray-600 whitespace-pre-wrap">{job.jobDescription}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Company Information */}
                    <div className="space-y-6">
                        {/* Company Profile Card */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="flex items-center space-x-4 mb-6">
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

                            <div className="space-y-4">
                                <div className="flex items-center text-gray-600">
                                    <Globe className="h-5 w-5 mr-3" />
                                    <a href={job.idCompany.website} target="_blank" rel="noopener noreferrer"
                                       className="text-indigo-600 hover:text-indigo-800">
                                        {job.idCompany.website}
                                    </a>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Users className="h-5 w-5 mr-3" />
                                    <span>{job.idCompany.size} employees</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Building className="h-5 w-5 mr-3" />
                                    <span>Founded in {job.idCompany.founded}</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">About the Company</h3>
                                <p className="text-gray-600">{job.idCompany.description}</p>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-center text-gray-600">
                                    <Mail className="h-5 w-5 mr-3" />
                                    <a href={`mailto:${job.idCompany.email}`} className="text-indigo-600 hover:text-indigo-800">
                                        {job.idCompany.email}
                                    </a>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Phone className="h-5 w-5 mr-3" />
                                    <a href={`tel:${job.idCompany.phone}`} className="text-indigo-600 hover:text-indigo-800">
                                        {job.idCompany.phone}
                                    </a>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Building2 className="h-5 w-5 mr-3" />
                                    <span>{job.idCompany.address}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}