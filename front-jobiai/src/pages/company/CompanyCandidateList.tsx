
import { Download, ArrowLeft } from 'lucide-react';

interface Candidate {
    id: number;
    name: string;
    email: string;
    phone: string;
    appliedDate: string;
    experience: string;
    status: 'Pending' | 'Shortlisted' | 'Rejected';
    cvUrl: string;
}

interface CandidateListProps {
    jobTitle: string;
    onBack: () => void;
}

export function CandidateList({ jobTitle, onBack }: CandidateListProps) {
    const candidates: Candidate[] = [
        {
            id: 1,
            name: "Sarah Johnson",
            email: "sarah.j@example.com",
            phone: "+1 234 567 8901",
            appliedDate: "2024-03-18T14:30:00",
            experience: "5 years",
            status: "Pending",
            cvUrl: "#"
        },
        {
            id: 2,
            name: "Michael Chen",
            email: "m.chen@example.com",
            phone: "+1 234 567 8902",
            appliedDate: "2024-03-17T09:15:00",
            status: "Shortlisted",
            experience: "7 years",
            cvUrl: "#"
        },
        {
            id: 3,
            name: "Emma Wilson",
            email: "emma.w@example.com",
            phone: "+1 234 567 8903",
            appliedDate: "2024-03-16T16:45:00",
            status: "Rejected",
            experience: "3 years",
            cvUrl: "#"
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Shortlisted':
                return 'bg-green-100 text-green-800';
            case 'Rejected':
                return 'bg-red-100 text-red-800';
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

    const handleStatusChange = (candidateId: number, newStatus: string) => {
        console.log(`Updating status for candidate ${candidateId} to ${newStatus}`);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center mb-8">
                <button
                    onClick={onBack}
                    className="mr-4 text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="text-3xl font-bold text-gray-900">
                    Candidates for {jobTitle}
                </h1>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Candidate
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Experience
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Applied
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                CV
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {candidates.map((candidate) => (
                            <tr key={candidate.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <div className="text-sm font-medium text-gray-900">
                                            {candidate.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {candidate.email}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {candidate.phone}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {candidate.experience}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(candidate.appliedDate)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                        className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full border-0 ${getStatusColor(candidate.status)}`}
                                        value={candidate.status}
                                        onChange={(e) => handleStatusChange(candidate.id, e.target.value)}
                                    >
                                        <option value="Pending" className="bg-yellow-100 text-yellow-800">Pending</option>
                                        <option value="Shortlisted" className="bg-green-100 text-green-800">Shortlisted</option>
                                        <option value="Rejected" className="bg-red-100 text-red-800">Rejected</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <button
                                        className="flex items-center text-indigo-600 hover:text-indigo-900"
                                        onClick={() => window.open(candidate.cvUrl, '_blank')}
                                    >
                                        <Download className="h-5 w-5 mr-1" />
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