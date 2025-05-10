import { Search, MapPin } from 'lucide-react';
import { useState } from 'react';
interface SearchBarProps {
    onSearch: (query: string, location: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState('');

    const handleSearch = () => {
        onSearch(query, location);
    };

    return (
        <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by skill, title, or keyword"
                    className="flex-1 border-none focus:ring-0 text-gray-900 placeholder-gray-500"
                />
                <div className="h-6 w-px bg-gray-200" />
                <MapPin className="h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Location"
                    className="w-48 border-none focus:ring-0 text-gray-900 placeholder-gray-500"
                />
            </div>
            <button
                onClick={handleSearch}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
                Search
            </button>
        </div>
    );
}
