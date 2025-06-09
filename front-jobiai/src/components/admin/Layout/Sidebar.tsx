import React from 'react';
import {
    LayoutDashboard,
    Users,
    Building,
    Briefcase,
    LogOut,
} from 'lucide-react';

interface SidebarProps {
    activeSection: 'dashboard' | 'users' | 'companies' | 'jobs';
    setActiveSection: (section: 'dashboard' | 'users' | 'companies' | 'jobs') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
    const navItems = [
        {
            id: 'dashboard',
            name: 'Dashboard',
            icon: <LayoutDashboard size={20} />,
            action: () => setActiveSection('dashboard')
        },
        {
            id: 'users',
            name: 'Users',
            icon: <Users size={20} />,
            action: () => setActiveSection('users')
        },
        {
            id: 'companies',
            name: 'Companies',
            icon: <Building size={20} />,
            action: () => setActiveSection('companies')
        },
        {
            id: 'jobs',
            name: 'Jobs',
            icon: <Briefcase size={20} />,
            action: () => setActiveSection('jobs')
        }

    ];

    return (
        <div className="bg-white w-64 shadow-md flex-shrink-0 hidden md:block">
            <div className="h-16 flex items-center justify-center border-b border-gray-200">
                <h1 className="text-xl font-bold text-indigo-600">RecruitAdmin</h1>
            </div>

            <nav className="mt-5 px-2">
                <div className="space-y-1">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={item.action}
                            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full ${
                                activeSection === item.id
                                    ? 'bg-indigo-50 text-indigo-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            <div className={`mr-3 ${
                                activeSection === item.id ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
                            }`}>
                                {item.icon}
                            </div>
                            {item.name}
                        </button>
                    ))}
                </div>
            </nav>

            <div className="absolute bottom-0 w-64 border-t border-gray-200">
                <div className="px-4 py-4">
                    <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                            A
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-700">Admin User</p>
                            <p className="text-xs text-gray-500">admin@gmail.com</p>
                        </div>
                    </div>
                    <button className="mt-3 flex items-center text-sm text-gray-500 hover:text-gray-700">
                        <LogOut size={16} className="mr-2" />
                        Sign out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;