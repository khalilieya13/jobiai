import { Building2, MapPin, Users } from 'lucide-react';
import { Company } from '../types';

interface CompanyCardProps {
    company: Company;
    onClick: () => void;
}

export function CompanyCard({ company, onClick }: CompanyCardProps) {
    return (
        <div
            onClick={onClick}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all hover:shadow-lg hover:translate-y-[-2px]"
        >
            <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-md flex items-center justify-center flex-shrink-0">
                    {company.logo ? (
                        <img src={company.logo} alt={company.name} className="w-14 h-14 object-contain" />
                    ) : (
                        <Building2 className="w-8 h-8 text-indigo-600" />
                    )}
                </div>
                <div>
                    <h3 className="font-semibold text-lg text-gray-900">{company.name}</h3>
                    <div className="flex items-center gap-1 text-gray-500">
                        <MapPin size={14} />
                        <span className="text-sm">{company.location}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
        <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full">
          {company.industry}
        </span>
                <span className="px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded-full flex items-center gap-1">
          <Users size={12} />
                    {company.size}
        </span>
            </div>

            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {company.description}
            </p>

            <div className="text-indigo-600 text-sm font-medium hover:underline">
                View details
            </div>
        </div>
    );
}