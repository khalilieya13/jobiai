
import { Briefcase, GraduationCap, MapPin } from 'lucide-react';

interface Candidate {
    id: string;
    name: string;
    title: string;
    location: string;
    experience: string;
    education: string;
    skills: string[];
    lastActive: string;
}

interface CandidateCardProps {
    candidate: Candidate;
}

export function CandidateCard({ candidate }: CandidateCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start">
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                            <p className="text-gray-600">{candidate.title}</p>
                        </div>
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                            Export CV
                        </button>
                    </div>

                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {candidate.location}
                        </div>
                        <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-1" />
                            {candidate.experience}
                        </div>
                        <div className="flex items-center">
                            <GraduationCap className="h-4 w-4 mr-1" />
                            {candidate.education}
                        </div>
                    </div>

                    <div className="mt-4">
                        <div className="flex flex-wrap gap-2">
                            {candidate.skills.map((skill) => (
                                <span
                                    key={skill}
                                    className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                                >
                  {skill}
                </span>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}