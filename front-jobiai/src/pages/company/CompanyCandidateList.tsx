import { useEffect, useState } from 'react';
import { Download, Award } from 'lucide-react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ResumeCandidate } from '../../types';
import CVPreview from '../../components/CVPreview';

interface Quiz {
    _id: string;
    title: string;
    totalQuestions: number;
}

interface User {
    _id: string;
    name: string;
}

interface IQuizResponse {
    quizId: Quiz;
    candidateId: User;
    score: number;
    timeTaken: number;
    submittedAt: string;
}

type Candidacy = {
    _id: string;
    status: 'pending' | 'shortlisted' | 'rejected';
    appliedAt: string;
    quizResponse?: IQuizResponse;
    candidate: {
        _id: string;
        fullName: string;
        email: string;
        phone: string;
        experienceYears: string;
        cvUrl: string;
    };
};

export function CandidateList() {
    const { id: jobId } = useParams<{ id: string }>();
    const [candidacies, setCandidacies] = useState<Candidacy[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [jobTitle, setJobTitle] = useState("Job");
    const [isExporting, setIsExporting] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);

    const calculateExperienceYears = (experience: ResumeCandidate["experience"]) => {
        let totalYears = 0;
        experience.forEach((exp) => {
            const start = parseInt(exp.startYear);
            const end = exp.endYear.toLowerCase() === "present" ? new Date().getFullYear() : parseInt(exp.endYear);
            if (!isNaN(start) && !isNaN(end) && end >= start) {
                totalYears += end - start;
            }
        });
        return `${totalYears} years`;
    };

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get('http://localhost:5000/jobiai/api/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserRole(response.data.role);
            } catch (error) {
                console.error("Error fetching user role:", error);
            }
        };

        fetchUserRole();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!jobId) return;

            try {
                const token = localStorage.getItem("token");

                // 1. Get job title and quiz
                const [jobRes, quizRes] = await Promise.all([
                    axios.get(`http://localhost:5000/jobiai/api/job/${jobId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`http://localhost:5000/jobiai/api/quiz/job/${jobId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                setJobTitle(jobRes.data?.jobTitle || "Unknown Job");
                const quiz = quizRes.data;

                // 2. Get candidacies
                const candidacyRes = await axios.get(
                    `http://localhost:5000/jobiai/api/candidacy/job/${jobId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const allCandidacies = candidacyRes.data || [];

                // 3. Get all CVs
                const resumeRes = await axios.get(
                    `http://localhost:5000/jobiai/api/resume/all`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const allResumes = Array.isArray(resumeRes.data)
                    ? resumeRes.data
                    : resumeRes.data.resumes || [];
                console.log("quiz object at start:", quiz);

                // 4. Get test scores for each candidate if quiz exists
                const quizData = Array.isArray(quiz) && quiz.length > 0 ? quiz[0] : null;
                console.log("quizData:", quizData);

                const enrichedCandidacies = await Promise.all(allCandidacies.map(async (candidacy: any) => {
                    const resume = allResumes.find(
                        (r: ResumeCandidate) => String(r.createdBy) === String(candidacy.candidate)
                    );

                    let quizResponse;
                    if (quizData && quizData._id) {
                        console.log("Fetching quiz result for:", quiz._id, candidacy.candidate);
                        try {
                            const scoreRes = await axios.get(
                                `http://localhost:5000/jobiai/api/quiz/${quizData._id}/${candidacy.candidate}`,
                                { headers: { Authorization: `Bearer ${token}` } }
                            );
                            quizResponse = scoreRes.data;
                            console.log(quizResponse);
                        } catch (error) {
                            console.log(`No test score found for candidate ${candidacy.candidate}`);
                        }
                    }

                    return {
                        ...candidacy,
                        quizResponse,
                        resume,
                        candidate: {
                            _id: candidacy.candidate,
                            fullName: resume?.personalInfo.fullName || "N/A",
                            email: resume?.personalInfo.email || "N/A",
                            phone: resume?.personalInfo.phone || "N/A",
                            experienceYears: resume ? calculateExperienceYears(resume.experience) : "N/A",
                            cvUrl: resume?.resumeFileUrl || resume?.cvUrl || "",
                        },
                    };
                }));
                console.log("Final enriched candidacies:", enrichedCandidacies);

                setCandidacies(enrichedCandidacies);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Unable to load candidacies.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [jobId]);

    const handleExportResume = async (candidacy: any) => {
        setIsExporting(candidacy._id);

        try {
            const directUrl = candidacy.resume?.resumeFileUrl || candidacy.candidate.cvUrl;
            if (directUrl) {
                const link = document.createElement('a');
                link.href = directUrl;
                link.download = `${candidacy.candidate.fullName.replace(/\s+/g, '_')}_CV.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                setIsExporting(null);
                return;
            }

            if (!candidacy.resume) {
                throw new Error('No resume data available');
            }

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

            const cvPreview = <CVPreview data={candidacy.resume} />;
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
            pdf.save(`${candidacy.candidate.fullName.replace(/\s+/g, '_')}_CV.pdf`);

        } catch (error) {
            console.error('Error exporting resume:', error);
            setError('Failed to export CV');
        } finally {
            setIsExporting(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'accepted':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'pending':
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short'
        }).format(date);
    };

    const handleStatusChange = async (candidacyId: string, newStatus: string) => {
        if (userRole !== 'recruiter') return;

        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `http://localhost:5000/jobiai/api/candidacy/${candidacyId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setCandidacies(prev =>
                prev.map(c => c._id === candidacyId ? { ...c, status: newStatus as any } : c)
            );
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(`Unable to update status. Details: ${error.response?.data?.message || error.message}`);
            } else {
                setError("Unable to update status. An unknown error occurred.");
            }
        }
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (error) return <div className="text-center text-red-600 py-10">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Candidates for Job: {jobTitle}
                </h1>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Score</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CV</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {candidacies.map((candidacy) => (
                            <tr key={candidacy._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <div className="text-sm font-medium text-gray-900">{candidacy.candidate.fullName}</div>
                                        <div className="text-sm text-gray-500">{candidacy.candidate.email}</div>
                                        <div className="text-sm text-gray-500">{candidacy.candidate.phone}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {candidacy.candidate.experienceYears}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(candidacy.appliedAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {candidacy.quizResponse ? (
                                        <div className="flex items-center space-x-2">
                                            <Award className="h-4 w-4 text-yellow-500" />
                                            <span className="text-sm font-medium text-gray-900">
                                                Score: {candidacy.quizResponse.score}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                Time: {Math.round(candidacy.quizResponse.timeTaken / 60)} min
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-sm text-gray-500">Not taken</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {userRole === 'recruiter' ? (
                                        <select
                                            className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full border-0 ${getStatusColor(candidacy.status)}`}
                                            value={candidacy.status}
                                            onChange={(e) => handleStatusChange(candidacy._id, e.target.value)}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="accepted">Accepted</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    ) : (
                                        <span className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${getStatusColor(candidacy.status)}`}>
                                            {candidacy.status.charAt(0).toUpperCase() + candidacy.status.slice(1)}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <button
                                        className={`flex items-center text-indigo-600 hover:text-indigo-900 ${isExporting === candidacy._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={() => handleExportResume(candidacy)}
                                        disabled={isExporting === candidacy._id}
                                    >
                                        {isExporting === candidacy._id ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <Download className="h-5 w-5 mr-1"/>
                                                Export CV
                                            </>
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}