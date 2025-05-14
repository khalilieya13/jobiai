import { useEffect, useState } from 'react';
import axios from 'axios';

import {
  Users, UserCheck, UserX, Clock, Plus, Filter, Download, Eye, Trash2, Users2
} from 'lucide-react';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { useNavigate } from 'react-router-dom';



const COLORS = ['#FF5733', '#FFBD33', '#75FF33', '#33FF57']; // Couleurs vives // personnalisable






type Job = {
  _id: string;
  jobTitle: string;
  status: string;
  createdAt: string;
  department: string;
  applicationsCount?:number;
};
type CandidaciesByMonth = {
  month: number;
  count: number;
};

type CandidaciesByDepartment = {
  department: string;
  count: number;
};

type KPIStats = {
  totalCandidates: number;
  shortlisted: number;
  rejected: number;
  pending: number;
  candidaciesByMonth: CandidaciesByMonth[];
  candidaciesByDepartment: CandidaciesByDepartment[];
  statusCounts: {
    pending: number;
    accepted: number;
    rejected: number;
  };
};



export function CompanyDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const navigate = useNavigate();
  //const [filters, setFilters] = useState({ position: '', department: '', status: '', date: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState('');
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [filters, setFilters] = useState({
    position: '',
    department: '',
    status: '',
    date: ''
  });
  const [kpiStats, setKpiStats] = useState<KPIStats>({
    totalCandidates: 0,
    shortlisted: 0,
    rejected: 0,
    pending: 0,
    candidaciesByMonth: [],
    candidaciesByDepartment: [],
    statusCounts: { pending: 0, accepted: 0, rejected: 0 },
  });


  // Transforme les données KPI en format compatible avec les graphiques
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const chartData = Array.isArray(kpiStats.candidaciesByMonth)
      ? kpiStats.candidaciesByMonth.map(item => ({
        month: monthNames[item.month - 1],
        applications: item.count,
      }))
      : [];

  const departmentData = Array.isArray(kpiStats.candidaciesByDepartment)
      ? kpiStats.candidaciesByDepartment.map(item => ({
        department: item.department,
        applications: item.count,
      }))
      : [];



  const handleDelete = async () => {
    if (!jobToDelete) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/jobiai/api/job/${jobToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setJobs(jobs.filter((job) => job._id !== jobToDelete._id));
      setShowDeleteModal(false);
      setJobToDelete(null);
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };



  useEffect(() => {
    const fetchKpiData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/jobiai/api/dashboard/company/kpi', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Données KPI:', response.data);
        setKpiStats(response.data); // Update the kpiStats state with the fetched data
      } catch (error) {
        console.error('Erreur lors de la récupération des KPI:', error);
        setError('Erreur lors de la récupération des KPI');
      }
    };

    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/jobiai/api/job/all/companyJobs', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: filters, // Filters will be automatically handled
        });

        if (Array.isArray(response.data.jobs)) {
          const jobsData: Job[] = response.data.jobs;

          // Fetch applications count
          const jobsWithCounts = await Promise.all(
              jobsData.map(async (job) => {
                const response = await axios.get(`http://localhost:5000/jobiai/api/candidacy/job/${job._id}`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });
                return {
                  ...job,
                  applicationsCount: Array.isArray(response.data) ? response.data.length : 0,
                };
              })
          );

          setJobs(jobsWithCounts);
        } else {
          setError('Les données des jobs ne sont pas au format attendu.');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des jobs:', error);
        setError('Erreur lors de la récupération des jobs');
      } finally {
        setLoading(false); // Ensure loading is set to false when data is loaded
      }
    };


    fetchKpiData();
    fetchJobs(); // Can be separated, or you can make them sequential if needed
  }, [filters]);



  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Company Dashboard</h1>
          <button
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              onClick={() => navigate('/job/post')}
          >
            <Plus className="h-5 w-5 mr-2"/>
            Post New Job
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
            <Users className="h-12 w-12 text-indigo-600"/>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Candidates</p>
              <p className="text-2xl font-bold text-gray-900">{kpiStats.totalCandidates}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
            <UserCheck className="h-12 w-12 text-green-600"/>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Shortlisted</p>
              <p className="text-2xl font-bold text-gray-900">{kpiStats.shortlisted}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
            <UserX className="h-12 w-12 text-red-600"/>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">{kpiStats.rejected}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
            <Clock className="h-12 w-12 text-yellow-600"/>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">{kpiStats.pending}</p>
            </div>
          </div>
        </div>


        {/* Chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Line Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Application Trends (12 months)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="month"/>
                <YAxis/>
                <RechartsTooltip/>
                <Line type="monotone" dataKey="applications" stroke="#4f46e5" strokeWidth={3}/>
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Applications by Department</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                    data={departmentData}
                    dataKey="applications"
                    nameKey="department"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label={({percent, department}) =>
                        `${department} (${(percent * 100).toFixed(0)}%)`
                    }
                >
                  {departmentData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                  ))}
                </Pie>
                <RechartsTooltip/>
                <Legend/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>


        {/* Active Job Listings */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Active Job Listings</h2>
            <div className="flex items-center gap-4">
              <button className="flex items-center text-gray-600 hover:text-gray-900"
                      onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-5 w-5 mr-2"/>
                Filter
              </button>
              <button className="flex items-center text-gray-600 hover:text-gray-900">
                <Download className="h-5 w-5 mr-2"/>
                Export
              </button>
            </div>
          </div>

          {showFilters && (
              <div className="px-6 py-4 bg-gray-50 border-t border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input
                      type="text"
                      placeholder="Position"
                      className="block w-full rounded-md border-gray-300"
                      value={filters.position}
                      onChange={(e) => setFilters({...filters, position: e.target.value})}
                  />
                  <input
                      type="text"
                      placeholder="Department"
                      className="block w-full rounded-md border-gray-300"
                      value={filters.department}
                      onChange={(e) => setFilters({...filters, department: e.target.value})}
                  />
                  <input
                      type="text"
                      placeholder="Status"
                      className="block w-full rounded-md border-gray-300"
                      value={filters.status}
                      onChange={(e) => setFilters({...filters, status: e.target.value})}
                  />
                  <input
                      type="date"
                      className="block w-full rounded-md border-gray-300"
                      value={filters.date}
                      onChange={(e) => setFilters({...filters, date: e.target.value})}
                  />
                </div>

                {/* Bouton de reset juste en dessous des inputs */}
                <div className="mt-4 text-right">
                  <button
                      onClick={() => setFilters({position: '', department: '', status: '', date: ''})}
                      className="text-sm text-blue-600 hover:underline"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
          )}


          <div className="overflow-x-auto">
            {loading ? (
                <p className="p-6">Chargement des jobs...</p>
            ) : error ? (
                <p className="p-6 text-red-600">{error}</p>
            ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applications</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posted Date</th>
                    <th className="px-6 py-3 relative"><span className="sr-only">Actions</span></th>
                  </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                  {jobs.map((job) => (
                      <tr key={job._id}>
                        <td className="px-6 py-4">{job.jobTitle}</td>
                        <td className="px-6 py-4">{job.department || '-'}</td>
                        <td className="px-6 py-4">{job.applicationsCount || 0}</td>

                        <td className="px-6 py-4">
              <span
                  className={`px-2 py-1 text-sm font-medium rounded-full ${
                      job.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : job.status === 'Closed'
                              ? 'bg-red-100 text-red-700'
                              : job.status === 'Paused'
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-gray-100 text-gray-700'
                  }`}
              >
                {job.status}
              </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{new Date(job.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-3">
                            <button className="text-gray-400 hover:text-gray-900"
                                    onClick={() => navigate(`/job/${job._id}`)} title="View Details">
                              <Eye className="h-5 w-5"/>
                            </button>
                            <button
                                className="text-gray-400 hover:text-red-600"
                                title="Delete Job"
                                onClick={() => {
                                  setJobToDelete(job);
                                  setShowDeleteModal(true);
                                }}
                            >
                              <Trash2 className="h-5 w-5"/>
                            </button>

                            <button className="text-gray-400 hover:text-indigo-600"
                                    onClick={() => navigate(`/company/candidate/list/${job._id}`)}
                                    title="View Candidates">
                              <Users2 className="h-5 w-5"/>
                            </button>
                          </div>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
            )}
          </div>

        </div>
        {showDeleteModal && jobToDelete && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Are you sure?</h2>
                <p className="text-gray-600 mb-6">
                  Do you really want to delete the job "<strong>{jobToDelete.jobTitle}</strong>"? This action cannot be
                  undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                      onClick={() => {
                        setShowDeleteModal(false);
                        setJobToDelete(null);
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
        )}

      </div>
  );
}
