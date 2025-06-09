import { useEffect, useState } from 'react';
import axios from 'axios';
import {  MapPin, Download, Building2, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CVPreview from './CVPreview';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ResumeCandidate, Job } from '../types';

interface RecommendedCandidate {
    resume: ResumeCandidate;
    job: Job;
    matchingScore: number;
}

export function CandidateRecommendation() {
    const [recommendations, setRecommendations] = useState<RecommendedCandidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isExporting, setIsExporting] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Please log in to see candidate recommendations');
                    setLoading(false);
                    return;
                }

                const response = await axios.get('http://localhost:5000/jobiai/api/recommendation/company/resumes', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setRecommendations(response.data);
                setLoading(false);
            } catch (err: any) {
                console.error('Failed to fetch candidate recommendations', err);
                if (err.response?.status === 401) {
                    setError('Please log in to see candidate recommendations');
                } else if (err.response?.status === 403) {
                    setError('Access denied. This feature is only available for recruiters.');
                } else {
                    setError('Failed to load candidate recommendations. Please try again later.');
                }
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    const handleExportResume = async (resume: ResumeCandidate) => {
        setIsExporting(resume._id);
        try {
            // If resume has a file URL, download it directly
            if (resume.resumeFileUrl) {
                const link = document.createElement('a');
                link.href = resume.resumeFileUrl;
                link.download = `${resume.personalInfo.fullName.replace(/\s+/g, '_')}_CV.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                return;
            }

            // Otherwise, generate PDF from CV preview
            const container = document.createElement('div');
            container.style.position = 'fixed';
            container.style.top = '-9999px';
            container.style.left = '-9999px';
            container.style.width = '210mm';
            container.style.height = '297mm';
            container.style.background = '#ffffff';
            document.body.appendChild(container);

            const previewElement = document.createElement('div');
            container.appendChild(previewElement);

            const cvPreview = <CVPreview data={resume} />;
            const root = await import('react-dom/client').then(m => m.createRoot(previewElement));
            root.render(cvPreview);

            await new Promise(resolve => setTimeout(resolve, 100));

            const canvas = await html2canvas(previewElement, {
                scale: 2,
                useCORS: true,
                logging: false,
                width: 794,
                height: 1123,
                backgroundColor: '#ffffff'
            });

            root.unmount();
            document.body.removeChild(container);

            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                compress: true
            });

            pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
            pdf.save(`${resume.personalInfo.fullName.replace(/\s+/g, '_')}_CV.pdf`);
        } catch (error) {
            console.error('Error exporting resume:', error);
        } finally {
            setIsExporting(null);
        }
    };

    if (loading) {
        return (
            <div className="my-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Candidate Recommendations</h2>
                <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-lg shadow-sm p-6 h-96">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                            <div className="h-24 bg-gray-200 rounded mb-4"></div>
                            <div className="h-24 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="my-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Candidate Recommendations</h2>
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
        return null;
    }

    return (
        <div className="my-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Candidate Recommendations</h2>
            <p className="text-gray-600 mb-6">
                Here are the best matching candidates for your job postings.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((recommendation) => (

                    <div
                        key={`${recommendation.job._id}-${recommendation.resume._id}`}
                        className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-300 border border-transparent hover:border-indigo-100"
                    >
                        {/* Job Information */}
                        <div className="border-b border-gray-100 pb-4 mb-4">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900">{recommendation.job.jobTitle}</h4>
                                    <p className="text-gray-600 text-sm">{recommendation.job.department}</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <Building2 className="h-6 w-6 text-gray-400" />
                                </div>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                                <MapPin className="h-4 w-4 mr-1" />
                                {recommendation.job.location}
                            </div>
                            <p className="text-gray-600 text-sm mt-2 line-clamp-2">{recommendation.job.jobDescription}</p>
                        </div>

                        {/* Candidate Information */}
                        <div>
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h4 className="text-md font-semibold text-gray-900">{recommendation.resume.personalInfo.fullName}</h4>
                                    <p className="text-gray-600 text-sm">{recommendation.resume.personalInfo.title}</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <GraduationCap className="h-6 w-6 text-indigo-600" />
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm line-clamp-2 mb-4">{recommendation.resume.personalInfo.summary}</p>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {recommendation.resume.skills.slice(0, 3).map((skill) => (
                                    <span
                                        key={skill.name}
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                                    >
                    {skill.name}
                  </span>
                                ))}
                            </div>

                            <div className="mt-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Match Score</span>
                                    <span className="text-sm font-semibold text-indigo-600">
                    {Math.round(recommendation.matchingScore * 100)}%
                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-indigo-600 h-2 rounded-full"
                                        style={{ width: `${Math.round(recommendation.matchingScore * 100)}%` }}
                                    ></div>
                                </div>
                            </div>

                            <button
                                onClick={() => handleExportResume(recommendation.resume)}
                                disabled={isExporting === recommendation.resume._id}
                                className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-indigo-600 text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {isExporting === recommendation.resume._id ? (
                                    <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Exporting...
                  </span>
                                ) : (
                                    <>
                                        <Download className="h-4 w-4 mr-2" />
                                        Export CV
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}