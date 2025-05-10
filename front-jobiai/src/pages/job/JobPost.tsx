import { useState, useRef } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export function JobPost() {
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
    jobDescription: '',
    status: 'Active'
  });

  const [showTestPopup, setShowTestPopup] = useState(false);

  const createdJobIdRef = useRef<string | null>(null); // <- Ref to ensure correct ID

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // Handle skill add
  const handleSkillAdd = () => {
    if (formData.currentSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, prev.currentSkill.trim()],
        currentSkill: ''
      }));
    }
  };

  // Handle skill remove
  const handleSkillRemove = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(skill => skill !== skillToRemove)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
        !formData.jobTitle ||
        !formData.department ||
        !formData.location ||
        !formData.experienceLevel ||
        !formData.salaryRange.min ||
        !formData.salaryRange.max ||
        !formData.jobDescription ||
        !formData.workMode
    ) {
      setErrorMessage("All fields are required.");
      return;
    }

    setErrorMessage(null);

    const jobData = { ...formData };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
          'http://localhost:5000/jobiai/api/job/add',
          jobData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
      );

      if (response.status === 201) {
        const createdJob = response.data.job;
        console.log("Created Job Response:", createdJob); // Debug API response
        if (createdJob._id) {
          createdJobIdRef.current = createdJob._id; // Assign job ID to ref
        }

        setFormData({
          jobTitle: '',
          department: '',
          location: '',
          employmentType: 'full-time',
          workMode: 'on site',
          experienceLevel: '',
          salaryRange: { min: '', max: '' },
          requiredSkills: [],
          currentSkill: '',
          jobDescription: '',
          status: 'Active'
        });

        setShowTestPopup(true);
      }
    } catch (error) {
      console.error('Error posting the job:', error);
      alert('Failed to post the job.');
    }
  };

  const handleAddTest = () => {
    console.log("clicked YES", createdJobIdRef.current); // Debug job ID here
    if (createdJobIdRef.current) {
      navigate(`/test/create/${createdJobIdRef.current}`);
    } else {
      console.error("Job ID is undefined when trying to navigate");
    }
  };

  const handleClosePopup = () => {
    setShowTestPopup(false);
  };


  return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/*<div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Post a New Job</h1>
            <div className="flex gap-4">
              <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Save as Draft
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Publish Job
              </button>
            </div>
          </div>*/}

          {/* Error message */}
          {errorMessage && (
              <div className="bg-red-100 text-red-800 p-4 rounded-md mb-6">
                <span>{errorMessage}</span>
              </div>
          )}



          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>

              {/* Job Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Job Title
                </label>
                <input
                    type="text"
                    id="title"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={formData.jobTitle}
                    onChange={e => setFormData(prev => ({...prev, jobTitle: e.target.value}))}
                />
              </div>

              {/* Department and Location */}
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
                      onChange={e => setFormData(prev => ({...prev, department: e.target.value}))}
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
                      onChange={e => setFormData(prev => ({...prev, location: e.target.value}))}
                  />
                </div>
              </div>

              {/* Employment Type, Experience Level */}
              <div>
                <label htmlFor="workMode" className="block text-sm font-medium text-gray-700">
                  Work Mode
                </label>
                <select
                    id="workMode"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={formData.workMode}
                    onChange={e => setFormData(prev => ({...prev, workMode: e.target.value}))}
                >
                  <option value="on site">On Site</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                </select>
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
                      onChange={e => setFormData(prev => ({...prev, employmentType: e.target.value}))}
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
                  <select
                      id="experience"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      value={formData.experienceLevel}
                      onChange={e => setFormData(prev => ({...prev, experienceLevel: e.target.value}))}
                  >
                    <option value="">Select Experience Level</option>
                    <option value="Entry Level">Entry Level</option>
                    <option value="Mid Level">Mid Level</option>
                    <option value="Senior Level">Senior Level</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>

              </div>

              {/* Salary Range */}
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
                          salaryRange: {...prev.salaryRange, min: e.target.value}
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
                          salaryRange: {...prev.salaryRange, max: e.target.value}
                        }))}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Required Skills */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Required Skills</h2>
              <div className="flex gap-2">
                <input
                    type="text"
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Add a skill"
                    value={formData.currentSkill}
                    onChange={e => setFormData(prev => ({...prev, currentSkill: e.target.value}))}
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
                    <X className="h-4 w-4"/>
                  </button>
                </span>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                  id="status"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.status}
                  onChange={e => setFormData(prev => ({...prev, status: e.target.value}))}
              >
                <option value="Active">Active</option>
                <option value="Paused">Paused</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            {/* Job Description */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Job Description</h2>
              <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.jobDescription}
                  onChange={e => setFormData(prev => ({...prev, jobDescription: e.target.value}))}
                  placeholder="Enter job description..."
                  rows={4}
              />
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Post Job
              </button>

            </div>
          </form>
        </div>
        {/* Success Popup */}
        {showTestPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl shadow-xl w-96 text-center">
                <h2 className="text-xl font-semibold text-green-600 mb-4">Job posted successfully!</h2>
                <p className="mb-6">Would you like to add a test to this job?</p>
                <div className="flex justify-center gap-4">
                  <button
                      onClick={handleAddTest}
                      className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500"
                  >
                    Yes
                  </button>
                  <button
                      onClick={handleClosePopup}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}

