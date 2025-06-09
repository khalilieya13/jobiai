import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import {  Search } from 'lucide-react';
import { SearchBarJ } from '../../components/SearchBarJ';
import { CompanyCard } from '../../components/CompanyCard';
import { Company } from '../../types';

export function CompaniesPage() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const keyword = searchParams.get('keyword') || '';
    const location = searchParams.get('location') || '';

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:5000/jobiai/api/company/all');
                setCompanies(response.data);
                setFilteredCompanies(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching companies:', err);
                setError('Failed to load companies. Please try again later.');
                setLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    useEffect(() => {
        if (companies.length === 0) return;

        let filtered = [...companies];

        if (keyword) {
            const lowercaseKeyword = keyword.toLowerCase();
            filtered = filtered.filter(
                company =>
                    company.name.toLowerCase().includes(lowercaseKeyword) ||
                    company.industry.toLowerCase().includes(lowercaseKeyword) ||
                    company.description.toLowerCase().includes(lowercaseKeyword)
            );
        }

        if (location) {
            const lowercaseLocation = location.toLowerCase();
            filtered = filtered.filter(
                company => company.location.toLowerCase().includes(lowercaseLocation)
            );
        }

        setFilteredCompanies(filtered);
    }, [companies, keyword, location]);

    const handleSearch = (newKeyword: string, newLocation: string) => {
        navigate(`/companies?keyword=${encodeURIComponent(newKeyword)}&location=${encodeURIComponent(newLocation)}`);
    };

    const handleCompanyClick = (companyId: string) => {
        navigate(`/company/${companyId}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[300px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Companies</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Discover and connect with companies that match your interests and location preferences.
                </p>
            </div>

            <div className="mb-8">
                <SearchBarJ
                    onSearch={handleSearch}
                    keyword={keyword}
                    location={location}
                />
            </div>

            {error ? (
                <div className="text-center text-red-600 py-8">
                    <p>{error}</p>
                </div>
            ) : filteredCompanies.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No companies found</h3>
                    <p className="text-gray-600">
                        Try adjusting your search criteria or browse all companies.
                    </p>
                    {keyword || location ? (
                        <button
                            onClick={() => navigate('/companies')}
                            className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                            Clear search filters
                        </button>
                    ) : null}
                </div>
            ) : (
                <>
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {filteredCompanies.length} {filteredCompanies.length === 1 ? 'Company' : 'Companies'} {keyword || location ? 'Found' : ''}
                        </h2>
                        {keyword || location ? (
                            <button
                                onClick={() => navigate('/companies')}
                                className="text-sm text-indigo-600 hover:text-indigo-800"
                            >
                                Clear filters
                            </button>
                        ) : null}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredCompanies.map(company => (
                            <CompanyCard
                                key={company._id}
                                company={company}
                                onClick={() => handleCompanyClick(company._id)}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}