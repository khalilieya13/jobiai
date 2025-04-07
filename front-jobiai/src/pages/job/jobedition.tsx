import { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { useParams } from 'react-router-dom';

export function UpdateJobPost() {
    const { id } = useParams(); // Get the job ID from URL parameters

    const [formData, setFormData] = useState({
        jobTitle: '',
        department: '',
        location: '',
        employmentType: 'full-time',
        workMode: 'on site',
        experienceLevel: '',
        salaryRange: { min: '', max: '' },
        requiredSkills: [] as string[],
        currentSkill: '',
        jobDescription: ''
    });

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch existing job data
    useEffect(() => {
        const fetchJobData = async () => {
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

                setFormData({
                    ...response.data,
                    currentSkill: '',
                });
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching job data:', error);
                setErrorMessage('Failed to load job data');
                setIsLoading(false);
            }
        };

        if (id) {
            fetchJobData();
        }
    }, [id]);

    const handleSkillAdd = () => {
        if (formData.currentSkill.trim()) {
            setFormData(prev => ({
                ...prev,
                requiredSkills: [...prev.requiredSkills, prev.currentSkill.trim()],
                currentSkill: ''
            }));
        }
    };

    const handleSkillRemove = (skillToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            requiredSkills: prev.requiredSkills.filter(skill => skill !== skillToRemove)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.jobTitle || !formData.department || !formData.location || !formData.experienceLevel || !formData.salaryRange.min || !formData.salaryRange.max || !formData.jobDescription) {
            setErrorMessage("All fields are required.");
            return;
        }

        setErrorMessage(null);

        const jobData = {
            ...formData,
            jobDescription: formData.jobDescription,
        };

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `http://localhost:5000/jobiai/api/job/${id}`,
                jobData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                setSuccessMessage('Job updated successfully!');
            }
        } catch (error) {
            console.error('Error updating the job:', error);
            setErrorMessage('Failed to update the job.');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Update Job Post</h1>
                </div>

                {errorMessage && (
                    <div className="bg-red-100 text-red-800 p-4 rounded-md mb-6">
                        <span>{errorMessage}</span>
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-100 text-green-800 p-4 rounded-md mb-6">
                        <span>{successMessage}</span>
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>

                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Job Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={formData.jobTitle}
                                onChange={e => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                                    Department
                                </label>
                                <input
                                    type="text"
                                    id="department"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={formData.department}
                                    onChange={e => setFormData(prev => ({ ...prev, department: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    id="location"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={formData.location}
                                    onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                                    Employment Type
                                </label>
                                <select
                                    id="type"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={formData.employmentType}
                                    onChange={e => setFormData(prev => ({ ...prev, employmentType: e.target.value }))}
                                >
                                    <option value="full-time">Full Time</option>
                                    <option value="part-time">Part Time</option>
                                    <option value="Permanent contract">Permanent Contract</option>
                                    <option value="Fixed-term contract">Fixed-term contract</option>
                                    <option value="internship">Internship</option>
                                    <option value="Apprenticeship">Apprenticeship</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                                    Experience Level
                                </label>
                                <input
                                    type="text"
                                    id="experience"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    placeholder="e.g., 3-5 years"
                                    value={formData.experienceLevel}
                                    onChange={e => setFormData(prev => ({ ...prev, experienceLevel: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Salary Range
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Min"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={formData.salaryRange.min}
                                        onChange={e => setFormData(prev => ({
                                            ...prev,
                                            salaryRange: { ...prev.salaryRange, min: e.target.value }
                                        }))}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Max"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={formData.salaryRange.max}
                                        onChange={e => setFormData(prev => ({
                                            ...prev,
                                            salaryRange: { ...prev.salaryRange, max: e.target.value }
                                        }))}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900">Required Skills</h2>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                placeholder="Add a skill"
                                value={formData.currentSkill}
                                onChange={e => setFormData(prev => ({ ...prev, currentSkill: e.target.value }))}
                                onKeyPress={e => e.key === 'Enter' && handleSkillAdd()}
                            />
                            <button
                                type="button"
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                onClick={handleSkillAdd}
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.requiredSkills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                                >
                  {skill}
                                    <button
                                        type="button"
                                        className="ml-2 inline-flex items-center"
                                        onClick={() => handleSkillRemove(skill)}
                                    >
                    <X className="h-4 w-4" />
                  </button>
                </span>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900">Job Description</h2>
                        <textarea
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={formData.jobDescription}
                            onChange={e => setFormData(prev => ({ ...prev, jobDescription: e.target.value }))}
                            placeholder="Enter job description..."
                            rows={4}
                        />
                    </div>

                    <div className="mt-6">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                            Update Job
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}