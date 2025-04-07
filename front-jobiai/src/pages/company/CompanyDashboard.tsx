import  { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  Users2
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface CompanyDashboardProps {
  onViewCandidates: (jobTitle: string) => void;
}

const stats = {
  totalCandidates: 156,
  shortlisted: 45,
  rejected: 32,
  pending: 79
};

const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Applications Received',
      data: [30, 45, 60, 75, 90, 156],
      borderColor: 'rgb(79, 70, 229)',
      tension: 0.4
    }
  ]
};

const positions = [
  'Senior Frontend Developer',
  'Full Stack Engineer',
  'UI/UX Designer',
  'Product Manager',
  'DevOps Engineer'
];

export function CompanyDashboard({ onViewCandidates }: CompanyDashboardProps) {
  const [filters, setFilters] = useState({
    position: '',
    department: '',
    status: '',
    date: ''
  });

  const [showFilters, setShowFilters] = useState(false);

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Company Dashboard</h1>
          <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            <Search className="h-5 w-5 mr-2" />
            Post New Job
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Users className="h-12 w-12 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Candidates</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCandidates}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <UserCheck className="h-12 w-12 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Shortlisted</p>
                <p className="text-2xl font-bold text-gray-900">{stats.shortlisted}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <UserX className="h-12 w-12 text-red-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Clock className="h-12 w-12 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Application Trends</h2>
          <Line data={chartData} options={{ responsive: true }} />
        </div>

        {/* Active Job Listings */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Active Job Listings</h2>
            <div className="flex items-center gap-4">
              <button
                  className="flex items-center text-gray-600 hover:text-gray-900"
                  onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-5 w-5 mr-2" />
                Filter
              </button>
              <button className="flex items-center text-gray-600 hover:text-gray-900">
                <Download className="h-5 w-5 mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
              <div className="px-6 py-4 bg-gray-50 border-t border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <select
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      value={filters.position}
                      onChange={(e) => setFilters({ ...filters, position: e.target.value })}
                  >
                    <option value="">All Positions</option>
                    {positions.map((pos) => (
                        <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                  <select
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      value={filters.department}
                      onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                  >
                    <option value="">All Departments</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Design">Design</option>
                  </select>
                  <select
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  >
                    <option value="">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Paused">Paused</option>
                    <option value="Closed">Closed</option>
                  </select>
                  <input
                      type="date"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      value={filters.date}
                      onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                  />
                </div>
              </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applications
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Posted Date
                </th>
                <th className="px-6 py-3 relative">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {[
                {
                  position: 'Senior Frontend Developer',
                  department: 'Engineering',
                  applications: 45,
                  status: 'Active',
                  date: '2024-03-15'
                },
                {
                  position: 'Product Manager',
                  department: 'Product',
                  applications: 32,
                  status: 'Active',
                  date: '2024-03-14'
                },
                {
                  position: 'UI/UX Designer',
                  department: 'Design',
                  applications: 28,
                  status: 'Paused',
                  date: '2024-03-13'
                }
              ].map((job, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{job.position}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{job.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{job.applications}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                          className="text-sm rounded-full px-2 py-1 border-0 bg-transparent focus:ring-2 focus:ring-indigo-500"
                          defaultValue={job.status}
                          onChange={(e) => console.log(`Status changed to ${e.target.value}`)}
                      >
                        <option value="Active">Active</option>
                        <option value="Paused">Paused</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {job.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <button
                            className="text-gray-400 hover:text-gray-900"
                            title="View Details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                            className="text-gray-400 hover:text-red-600"
                            title="Delete Job"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                        <button
                            className="text-gray-400 hover:text-indigo-600"
                            title="View Candidates"
                            onClick={() => onViewCandidates(job.position)}
                        >
                          <Users2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
}