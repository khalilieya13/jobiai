import { MapPin, Clock, BriefcaseIcon, Edit } from 'lucide-react';
import { Job } from '../types';
import { useNavigate } from "react-router-dom";

interface JobCardProps {
    job: Job;
}

export function JobCard({ job }: JobCardProps) {
    const navigate = useNavigate();

    // Get the user's role from the token
    const role = localStorage.getItem('token')
        ? JSON.parse(atob(localStorage.getItem('token')!.split('.')[1])).role
        : null;

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{job.jobTitle}</h3>
                    <p className="text-gray-600">{job.department}</p>
                </div>
                <div className="flex-shrink-0">
                    <BriefcaseIcon className="h-10 w-10 text-indigo-600" />
                </div>
            </div>

            <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {job.location}
                </div>
                <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {job.workMode}
                </div>
                <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {job.employmentType}
                </div>
            </div>

            <div className="mt-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {job.salaryRange ? `${job.salaryRange.min}k€ - ${job.salaryRange.max}k€` : 'Salary not specified'}
                </span>
            </div>

            <div className="mt-4 text-sm text-gray-600 line-clamp-2">
                {job.jobDescription}
            </div>

            <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">Posted {new Date(job.postedAt).toLocaleDateString()}</span>
                <div className="flex gap-2">
                    {role === 'recruiter' ? (
                        <button
                            onClick={() => navigate(`/job/edit/${job._id}`)}
                            className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors flex items-center gap-2"
                        >
                            <Edit className="h-4 w-4" />
                            Edit
                        </button>
                    ) : role === 'candidate' ? (
                        <button
                            onClick={() => navigate(`/job/${job._id}`)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                        >
                            Apply Now
                        </button>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
