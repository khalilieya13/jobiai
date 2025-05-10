import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
/*
interface Candidate {
    _id: string;
    name: string;
    email: string;
    phone: string;
    appliedDate: string;
    experience: string;
    status: 'Pending' | 'Shortlisted' | 'Rejected';
    cvUrl: string;
    jobId: string;
}*/
type Candidacy = {
    _id: string;
    status: 'pending' | 'shortlisted' | 'rejected';
    appliedAt: string;
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
    console.log("🪪 jobId dans useParams:", jobId);

    const [candidacies, setCandidacies] = useState<Candidacy[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [jobTitle, setJobTitle] = useState("Job");


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
        const fetchData = async () => {
            if (!jobId) return;

            try {
                const token = localStorage.getItem("token");

                // 1. Récupérer le titre du job
                const jobRes = await axios.get(
                    `http://localhost:5000/jobiai/api/job/${jobId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setJobTitle(jobRes.data?.jobTitle || "Unknown Job");

                // 2. Récupérer les candidatures liées à ce job
                const candidacyRes = await axios.get(
                    `http://localhost:5000/jobiai/api/candidacy/job/${jobId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const allCandidacies = candidacyRes.data || [];
                console.log("Candidatures:", allCandidacies);

                // 3. Récupérer tous les CVs
                const resumeRes = await axios.get(
                    `http://localhost:5000/jobiai/api/resume/all`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const allResumes = Array.isArray(resumeRes.data)
                    ? resumeRes.data
                    : resumeRes.data.resumes || [];
                console.log("CVs:", allResumes);

                // 4. Enrichir chaque candidature avec les infos du CV
                const enriched = allCandidacies.map((candidacy: any) => {
                    const resume = allResumes.find(
                        (r: ResumeCandidate) => String(r.createdBy) === String(candidacy.candidate)
                    );

                    return {
                        ...candidacy,
                        candidate: {
                            _id: candidacy.candidate,
                            fullName: resume?.personalInfo.fullName || "N/A",
                            email: resume?.personalInfo.email || "N/A",
                            phone: resume?.personalInfo.phone || "N/A",
                            experienceYears: resume ? calculateExperienceYears(resume.experience) : "N/A",
                            cvUrl: resume?.cvUrl || "",
                        },
                    };
                });

                setCandidacies(enriched);
            } catch (error) {
                console.error("Erreur lors de la récupération complète :", error);
                setError("Impossible de charger les candidatures.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [jobId]);










    const getStatusColor = (status: string) => {
        switch (status) {
            case 'accepted':
                return 'bg-green-100 text-green-800'; // Vert pour "Accepted"
            case 'rejected':
                return 'bg-red-100 text-red-800'; // Rouge pour "Rejected"
            case 'pending':
            default:
                return 'bg-yellow-100 text-yellow-800'; // Jaune pour "Pending"
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
        console.log(`Updating status for candidacy ${candidacyId} to ${newStatus}`);
        try {
            const token = localStorage.getItem("token");

            // Envoi de la requête PUT pour mettre à jour le statut de la candidature
            const response = await axios.put(
                `http://localhost:5000/jobiai/api/candidacy/${candidacyId}`,  // Utilisation de candidacyId ici
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Mise à jour du statut localement si la mise à jour est réussie
            setCandidacies((prevCandidacies) =>
                prevCandidacies.map((candidacy) =>
                    candidacy._id === candidacyId
                        ? { ...candidacy, status: newStatus }
                        : candidacy
                )
            );
            console.log("Candidature mise à jour avec succès:", response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Erreur API:", error.response?.data || error.message);
                setError(`Impossible de mettre à jour le statut. Détails: ${error.response?.data?.message || error.message}`);
            } else {
                console.error("Erreur inconnue:", error);
                setError("Impossible de mettre à jour le statut. Une erreur inconnue s'est produite.");
            }
        }
    };



    if (loading) return <div className="text-center py-10">Chargement...</div>;
    if (error) return <div className="text-center text-red-600 py-10">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Candidates for Job : {jobTitle}
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CV</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {candidacies.map((candidacy) => (
                            <tr key={candidacy._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <div
                                            className="text-sm font-medium text-gray-900">{candidacy.candidate.fullName}</div>
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
                                    <select
                                        className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full border-0 ${getStatusColor(candidacy.status)}`}
                                        value={candidacy.status}
                                        onChange={(e) => handleStatusChange(candidacy._id, e.target.value)}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="accepted">Accepted</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <button
                                        className="flex items-center text-indigo-600 hover:text-indigo-900"
                                        onClick={() => window.open(candidacy.candidate.cvUrl, '_blank')}
                                    >
                                        <Download className="h-5 w-5 mr-1"/>
                                        Export CV
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
