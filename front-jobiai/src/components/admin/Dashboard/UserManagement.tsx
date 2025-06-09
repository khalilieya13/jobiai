import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Trash2, Building2, Download } from 'lucide-react';
import { User } from '../../../types';
import { companyAPI, resumeAPI } from '../../../api';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import CVPreview from '../../CVPreview';

interface UserManagementProps {
    users: User[];
    onDeleteUser: (userId: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, onDeleteUser }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
    const [error, setError] = useState<string | null>(null);
    const [isExporting, setIsExporting] = useState<string | null>(null);

    const filteredUsers = users.filter(user =>
        (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleViewCompany = async (userId: string) => {
        try {
            setLoading({ ...loading, [userId]: true });
            const response = await companyAPI.getByUserId(userId);
            console.log('Company response:', response.data);

            if (response.data && response.data.company && response.data.company._id) {
                navigate(`/company/${response.data.company._id}`);
            } else {
                console.error('Company data not found in response:', response.data);
            }
        } catch (error) {
            console.error('Error fetching company:', error);
        } finally {
            setLoading({ ...loading, [userId]: false });
        }
    };

    const handleExportResume = async (userId: string, username: string) => {
        setIsExporting(userId);
        setError(null);

        try {
            const response = await resumeAPI.getByUserId(userId);
            console.log('Resume response:', response.data);

            const resumeData = response.data;
            const fileName = `${username || 'resume'}_CV.pdf`.replace(/[^a-zA-Z0-9]/g, '_');

            if (resumeData.resumeFileUrl) {
                const link = document.createElement('a');
                link.href = resumeData.resumeFileUrl;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                setIsExporting(null);
                return;
            }

            const container = document.createElement('div');
            container.style.position = 'fixed';
            container.style.top = '-9999px';
            container.style.left = '-9999px';
            container.style.width = '210mm';
            container.style.height = '297mm';
            container.style.background = '#ffffff';
            document.body.appendChild(container);

            const previewElement = document.createElement('div');
            container.appendChild(previewElement);

            const cvPreview = <CVPreview data={resumeData} />;
            const root = await import('react-dom/client').then(m => m.createRoot(previewElement));
            root.render(cvPreview);

            await new Promise(resolve => setTimeout(resolve, 100));

            const canvas = await html2canvas(previewElement, {
                scale: 2,
                useCORS: true,
                logging: false,
                width: 794,
                height: 1123,
                backgroundColor: '#ffffff'
            });

            root.unmount();
            document.body.removeChild(container);

            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                compress: true
            });

            pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
            pdf.save(fileName);

        } catch (error) {
            console.error('Error exporting resume:', error);
            setError('Failed to export CV');
        } finally {
            setIsExporting(null);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    Add User
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                    <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    user.role === 'recruiter' ? 'bg-indigo-100 text-indigo-800' :
                                        user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                            'bg-purple-100 text-purple-800'
                                }`}>
                                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center space-x-2">
                                    {user.role === 'recruiter' && (
                                        <button
                                            onClick={() => handleViewCompany(user._id)}
                                            className="flex items-center px-2 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                                            disabled={loading[user._id]}
                                        >
                                            <Building2 className="h-4 w-4 mr-1" />
                                            {loading[user._id] ? 'Loading...' : 'Company'}
                                        </button>
                                    )}
                                    {user.role === 'candidate' && (
                                        <button
                                            onClick={() => handleExportResume(user._id, user.username)}
                                            className="flex items-center px-2 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                                            disabled={isExporting === user._id}
                                        >
                                            <Download className="h-4 w-4 mr-1" />
                                            {isExporting === user._id ? 'Exporting...' : 'Resume'}
                                        </button>
                                    )}
                                    <button
                                        className="text-red-600 hover:text-red-900"
                                        onClick={() => onDeleteUser(user._id)}
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {filteredUsers.length === 0 && (
                <div className="text-center py-10">
                    <p className="text-gray-500">No users found matching your search criteria</p>
                </div>
            )}

            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-700">
                        Showing <span className="font-medium">{filteredUsers.length}</span> of{' '}
                        <span className="font-medium">{users.length}</span> users
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;