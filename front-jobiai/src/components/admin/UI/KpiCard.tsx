import React from 'react';

interface KpiCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon }) => {
    return (
        <div className="rounded-lg border bg-indigo-50 border-indigo-200 p-6 transition-all duration-300 hover:shadow-md">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
                </div>
                <div className="rounded-lg p-2 bg-white border border-gray-100 shadow-sm">
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default KpiCard;