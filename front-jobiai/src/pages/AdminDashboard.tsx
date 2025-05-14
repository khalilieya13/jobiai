import  { useState, useEffect } from 'react';
import Sidebar from '../components/admin/Layout/Sidebar';
import KpiSection from '../components/admin/Dashboard/KpiSection';
import UserManagement from '../components/admin/Dashboard/UserManagement';
import { User, Job } from '../types';
import { authAPI, jobAPI,companyAPI } from '../api';
import { Trash2, Eye } from 'lucide-react';

const AdminDashboard = () => {
    const [activeSection, setActiveSection] = useState<'dashboard' | 'users' | 'companies' | 'jobs'>('dashboard');
    const [selectedUserType, setSelectedUserType] = useState<'all' | 'recruiters' | 'candidates'>('all');
    const [users, setUsers] = useState<User[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Ajout de l'appel pour récupérer les entreprises
                const [usersRes, jobsRes, companiesRes] = await Promise.all([
                    authAPI.getAllUsers(),
                    jobAPI.getAll(),
                    companyAPI.getAll()  // Ajout de la récupération des entreprises
                ]);

                // Log des réponses pour vérifier la structure des données
                console.log("Users Response:", usersRes.data);
                console.log("Jobs Response:", jobsRes.data);
                console.log("Companies Response:", companiesRes.data);  // Log des entreprises

                // Vérification et mise à jour du state pour les utilisateurs
                if (Array.isArray(usersRes.data)) {
                    setUsers(usersRes.data);
                } else {
                    console.error('Users data is not an array:', usersRes.data);
                    setUsers([]);  // Réinitialisation des utilisateurs si la réponse n'est pas un tableau
                }

                // Vérification et mise à jour du state pour les jobs
                if (Array.isArray(jobsRes.data)) {
                    // Normalize the jobs by replacing `idCompany` with a `company` field
                    const jobsWithCompany = jobsRes.data.map(job => ({
                        ...job,
                        company: job.idCompany,
                    }));

                    setJobs(jobsWithCompany);
                } else {
                    console.error('Jobs data is not an array:', jobsRes.data);
                    setJobs([]);
                }

                // Vérification et mise à jour du state pour les entreprises
                if (Array.isArray(companiesRes.data)) {
                    setCompanies(companiesRes.data);
                } else {
                    console.error('Companies data is not an array:', companiesRes.data);
                    setCompanies([]);  // Réinitialisation des entreprises si la réponse n'est pas un tableau
                }
            } catch (err: any) {
                console.error('Error fetching data:', err);
                setError(err.message || 'Failed to fetch data. Please check your connection and try again.');
                setUsers([]);
                setJobs([]);
                setCompanies([]);  // Réinitialisation des entreprises en cas d'erreur
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    const handleDeleteUser = async (userId: string) => {
        try {
            await authAPI.deleteAccount();
            setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
        } catch (err: any) {
            console.error('Error deleting user:', err);
            setError(err.message || 'Failed to delete user. Please try again.');
        }
    };

    const handleDeleteJob = async (jobId: string) => {
        try {
            await jobAPI.delete(jobId);
            setJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
        } catch (err: any) {
            console.error('Error deleting job:', err);
            setError(err.message || 'Failed to delete job. Please try again.');
        }
    };

    const getFilteredUsers = () => {
        if (!Array.isArray(users)) {
            console.error('Users is not an array:', users);
            return [];
        }

        if (selectedUserType === 'recruiters') {
            return users.filter(user => user.role === 'recruiter');
        }
        if (selectedUserType === 'candidates') {
            return users.filter(user => user.role === 'candidate');
        }
        return users;
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-indigo-600">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-red-600 text-center">
                    <p className="text-xl font-semibold mb-2">Error</p>
                    <p>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

            <div className="flex-1 overflow-hidden">
                <main className="h-full overflow-y-auto p-4 md:p-6">
                    {activeSection === 'dashboard' && (
                        <>
                            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
                            <KpiSection />

                            <div className="mt-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setSelectedUserType('all')}
                                            className={`px-3 py-1 rounded-md ${selectedUserType === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                                        >
                                            All
                                        </button>
                                        <button
                                            onClick={() => setSelectedUserType('recruiters')}
                                            className={`px-3 py-1 rounded-md ${selectedUserType === 'recruiters' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                                        >
                                            Recruiters
                                        </button>
                                        <button
                                            onClick={() => setSelectedUserType('candidates')}
                                            className={`px-3 py-1 rounded-md ${selectedUserType === 'candidates' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                                        >
                                            Candidates
                                        </button>
                                    </div>
                                </div>
                                <UserManagement users={getFilteredUsers()} onDeleteUser={handleDeleteUser} />
                            </div>
                        </>
                    )}

                    {activeSection === 'users' && (
                        <>
                            <h1 className="text-2xl font-bold text-gray-800 mb-6">User Management</h1>
                            <div className="flex space-x-2 mb-4">
                                <button
                                    onClick={() => setSelectedUserType('all')}
                                    className={`px-3 py-1 rounded-md ${selectedUserType === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setSelectedUserType('recruiters')}
                                    className={`px-3 py-1 rounded-md ${selectedUserType === 'recruiters' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                                >
                                    Recruiters
                                </button>
                                <button
                                    onClick={() => setSelectedUserType('candidates')}
                                    className={`px-3 py-1 rounded-md ${selectedUserType === 'candidates' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                                >
                                    Candidates
                                </button>
                            </div>
                            <UserManagement users={getFilteredUsers()} onDeleteUser={handleDeleteUser} />
                        </>
                    )}

                    {activeSection === 'companies' && (
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-6">Companies Management</h1>
                            <div className="bg-white rounded-lg shadow p-6">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jobs</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {companies.map((company) => (
                                        <tr key={company.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                                        {company.name.charAt(0)}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{company.name}</div>
                                                        <div className="text-sm text-gray-500">{company.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{company.industry}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {jobs.filter(job => job.company === company.id).length} active jobs
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <button className="text-indigo-600 hover:text-indigo-900">
                                                    <Eye className="h-5 w-5" />
                                                </button>
                                                <button className="text-red-600 hover:text-red-900">
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                                <button className="px-2 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700">
                                                    View Jobs
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeSection === 'jobs' && (
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-6">Jobs Management</h1>
                            <div className="bg-white rounded-lg shadow p-6">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {jobs.map(job => (
                                        <tr key={job._id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{job.jobTitle}</div>
                                                <div className="text-sm text-gray-500">{job.department}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{job.company?.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {job.location}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <button
                                                    className="text-red-600 hover:text-red-900"
                                                    onClick={() => handleDeleteJob(job._id)}
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                                <button className="text-indigo-600 hover:text-indigo-900">
                                                    <Eye className="h-5 w-5" />
                                                </button>
                                                <button className="px-2 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700">
                                                    View Applications
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;