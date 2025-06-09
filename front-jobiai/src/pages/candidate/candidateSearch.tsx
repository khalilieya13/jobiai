import { useEffect, useState } from 'react';
import axios from 'axios';
import { SearchBar } from '../../components/candidate/SearchBar';
import { CandidateCard } from '../../components/candidate/CandidateCard';
import { CandidateRecommendation } from '../../components/CandidateRecommendation';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { ResumeCandidate } from '../../types';

const filters = {
    experience: ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'],
    education: ["Bachelor's", "Master's", 'PhD', 'Other'],
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'Java', 'DevOps'],
};

const mapExperienceToLevel = (years: number): string => {
    if (years < 2) return 'Entry Level';
    if (years >= 2 && years < 5) return 'Mid Level';
    if (years >= 5 && years < 10) return 'Senior Level';
    return 'Executive';
};

export function CandidateSearch() {
    const [showFilters, setShowFilters] = useState(false);
    const [resumes, setResumes] = useState<ResumeCandidate[]>([]);
    const [activeFilters, setActiveFilters] = useState<{
        experience: string[];
        education: string[];
        skills: string[];
    }>({
        experience: [],
        education: [],
        skills: [],
    });
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState('');

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/jobiai/api/resume/all', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setResumes(response.data);
            } catch (error) {
                console.error('Error fetching resumes:', error);
            }
        };

        fetchResumes();
    }, []);

    const handleFilterChange = (category: keyof typeof filters, option: string) => {
        setActiveFilters((prev) => {
            const options = prev[category];
            const newOptions = options.includes(option)
                ? options.filter((item) => item !== option)
                : [...options, option];

            return { ...prev, [category]: newOptions };
        });
    };

    const handleSearch = (query: string, location: string) => {
        setQuery(query);
        setLocation(location);

        // Scroll to the candidates section
        const candidatesSection = document.getElementById('candidates-section');
        if (candidatesSection) {
            candidatesSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const filteredResumes = resumes.filter((resume) => {
        const totalExperience = resume.experience.reduce((total, exp) => {
            const startYear = parseInt(exp.startYear);
            const endYear = exp.endYear ? parseInt(exp.endYear) : new Date().getFullYear();
            return total + (endYear - startYear);
        }, 0);

        const matchExperience =
            activeFilters.experience.length === 0 ||
            activeFilters.experience.some((exp) => mapExperienceToLevel(totalExperience) === exp);

        const matchEducation =
            activeFilters.education.length === 0 ||
            activeFilters.education.some((edu) =>
                resume.education.some(e => e.title.toLowerCase().includes(edu.toLowerCase()))
            );

        const matchSkills =
            activeFilters.skills.length === 0 ||
            activeFilters.skills.some((skill) =>
                resume.skills.some(s => s.name.toLowerCase().includes(skill.toLowerCase()))
            );

        const matchLocation =
            location === '' ||
            (resume.personalInfo.address &&
                resume.personalInfo.address.toLowerCase().includes(location.toLowerCase()));

        const matchQuery =
            query === '' ||
            resume.personalInfo.fullName.toLowerCase().includes(query.toLowerCase()) ||
            resume.personalInfo.title.toLowerCase().includes(query.toLowerCase()) ||
            resume.skills.some((skill) => skill.name.toLowerCase().includes(query.toLowerCase()));

        return matchExperience && matchEducation && matchSkills && matchQuery && matchLocation;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Top Talent</h1>
                <SearchBar onSearch={handleSearch} />
            </div>

            {/* AI Candidate Recommendations Section */}
            <CandidateRecommendation />

            <div id="candidates-section" className="flex gap-8">
                <div className={`w-64 shrink-0 ${showFilters ? 'block' : 'hidden'} md:block`}>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Filters</h2>
                            <Filter className="h-5 w-5 text-gray-500" />
                        </div>

                        {Object.entries(filters).map(([category, options]) => (
                            <div key={category} className="mb-6">
                                <h3 className="text-sm font-medium text-gray-900 mb-2 capitalize">{category}</h3>
                                <div className="space-y-2">
                                    {options.map((option) => (
                                        <label key={option} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                checked={activeFilters[category as keyof typeof filters].includes(option)}
                                                onChange={() =>
                                                    handleFilterChange(category as keyof typeof filters, option)
                                                }
                                            />
                                            <span className="ml-2 text-sm text-gray-700">{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <button
                            className="md:hidden flex items-center text-gray-700"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <SlidersHorizontal className="h-5 w-5 mr-2" />
                            Filters
                        </button>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">Sort by:</span>
                            <select className="text-sm border-gray-300 rounded-md">
                                <option>Most Relevant</option>
                                <option>Recently Active</option>
                                <option>Experience: High to Low</option>
                                <option>Experience: Low to High</option>
                            </select>
                        </div>
                    </div>

                    {filteredResumes.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm p-10 text-center">
                            <p className="text-gray-500 text-lg">No candidates match your current filters.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredResumes.map((resume) => (
                                <CandidateCard
                                    key={resume._id}
                                    resume={resume}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}