import { useEffect, useState } from 'react';
import { Users, UserCheck, Briefcase, FileText, CheckCircle } from 'lucide-react';
import KpiCard from '../UI/KpiCard';
import { authAPI, jobAPI, candidacyAPI } from '../../../api';

const KpiSection = () => {
    const [stats, setStats] = useState({
        totalUsers: '0',
        totalCandidates: '0',
        totalRecruiters: '0',
        totalJobs: '0',
        totalApplications: '0',
        acceptedApplications: '0'
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [usersRes, jobsRes, candidaciesRes] = await Promise.all([
                    authAPI.getAllUsers(),
                    jobAPI.getAll(),
                    candidacyAPI.getAll()
                ]);

                const users = usersRes.data;
                const candidates = users.filter((user: { role: string }) => user.role === 'candidate');
                const recruiters = users.filter((user: { role: string }) => user.role === 'recruiter');

                // Log the candidacies data to understand the structure
                console.log('Candidacies Response:', candidaciesRes.data);

                // Use the object properties directly
                setStats({
                    totalUsers: users.length.toString(),
                    totalCandidates: candidates.length.toString(),
                    totalRecruiters: recruiters.length.toString(),
                    totalJobs: jobsRes.data.length.toString(),
                    totalApplications: candidaciesRes.data.totalCandidacies.toString(),
                    acceptedApplications: candidaciesRes.data.acceptedCandidacies.toString()
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchStats();
    }, []);

    const kpis = [
        {
            id: 1,
            title: 'Total Users',
            value: stats.totalUsers,
            icon: <Users className="h-6 w-6 text-indigo-600" />,
        },
        {
            id: 2,
            title: 'Total Candidates',
            value: stats.totalCandidates,
            icon: <Users className="h-6 w-6 text-indigo-600" />,
        },
        {
            id: 3,
            title: 'Total Recruiters',
            value: stats.totalRecruiters,
            icon: <UserCheck className="h-6 w-6 text-indigo-600" />,
        },
        {
            id: 4,
            title: 'Total Jobs',
            value: stats.totalJobs,
            icon: <Briefcase className="h-6 w-6 text-indigo-600" />,
        },
        {
            id: 5,
            title: 'Total Applications',
            value: stats.totalApplications,
            icon: <FileText className="h-6 w-6 text-indigo-600" />,
        },
        {
            id: 6,
            title: 'Accepted Applications',
            value: stats.acceptedApplications,
            icon: <CheckCircle className="h-6 w-6 text-indigo-600" />,
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kpis.map(kpi => (
                <KpiCard
                    key={kpi.id}
                    title={kpi.title}
                    value={kpi.value}
                    icon={kpi.icon}
                />
            ))}
        </div>
    );
};

export default KpiSection;
