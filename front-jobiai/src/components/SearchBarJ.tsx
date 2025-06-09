import { useState, useEffect } from 'react';

interface SearchBarJProps {
    onSearch: (keyword: string, location: string) => void;
    keyword?: string;
    location?: string;
}

export function SearchBarJ({ onSearch, keyword = '', location = '' }: SearchBarJProps) {
    const [localKeyword, setLocalKeyword] = useState(keyword);
    const [localLocation, setLocalLocation] = useState(location);

    // Sync with props if they change
    useEffect(() => {
        setLocalKeyword(keyword);
        setLocalLocation(location);
    }, [keyword, location]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(localKeyword, localLocation);

        // Scroll to the jobs section
        const jobsSection = document.getElementById('jobs-section');
        if (jobsSection) {
            jobsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg shadow-md"
        >
            <input
                type="text"
                placeholder="Job title, keyword, or company"
                value={localKeyword}
                onChange={(e) => setLocalKeyword(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-md"
            />
            <input
                type="text"
                placeholder="Location"
                value={localLocation}
                onChange={(e) => setLocalLocation(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-md"
            />
            <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
            >
                Search
            </button>
        </form>
    );
}