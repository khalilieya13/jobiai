import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBarJ } from '../components/SearchBarJ';
import { ResumeSection } from '../components/ResumeSection';
import { CreateCompanySection } from '../components/CreateCompanySection.tsx';

export function Home() {
    const [searchQuery, setSearchQuery] = useState({ keyword: '', location: '' });
    const navigate = useNavigate();

    const handleSearch = (keyword: string, location: string) => {
        const params = new URLSearchParams();
        if (keyword) params.append('keyword', keyword);
        if (location) params.append('location', location);
        setSearchQuery({ keyword, location });  // Mettez à jour l'état
        navigate(`/jobs?${params.toString()}`);  // Redirection avec la recherche
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-indigo-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                    <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
                        Find Your Dream Job Today
                    </h1>
                    <p className="text-xl text-center text-indigo-200 mb-10">
                        Search thousands of jobs from top companies
                    </p>
                    <div className="max-w-5xl mx-auto text-black">
                        <SearchBarJ
                            keyword={searchQuery.keyword}      // Ajoutez le keyword
                            location={searchQuery.location}    // Ajoutez la location
                            onSearch={handleSearch}            // Ajoutez la fonction onSearch
                        />
                    </div>
                </div>
            </div>

            {/* Action Sections */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ResumeSection />
                    <CreateCompanySection />
                </div>
            </div>
        </div>
    );
}
