
import { Line } from 'react-chartjs-2';
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
import {
  Briefcase,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  ExternalLink
} from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const applicationStats = {
  total: 25,
  viewed: 18,
  inProgress: 8,
  accepted: 3,
  rejected: 4
};

const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Applications',
      data: [4, 6, 8, 12, 15, 25],
      borderColor: 'rgb(79, 70, 229)',
      tension: 0.4
    }
  ]
};

export function CandidateDashboard() {
  const handleTakeTest = (applicationId: number) => {
    console.log(`Starting test for application ${applicationId}`);
  };

  const handleViewJob = (applicationId: number) => {
    console.log(`Viewing job details for application ${applicationId}`);
  };

  const handleCancelApplication = (applicationId: number) => {
    console.log(`Cancelling application ${applicationId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Viewed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Candidate Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Briefcase className="h-12 w-12 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{applicationStats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Eye className="h-12 w-12 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Applications Viewed</p>
                <p className="text-2xl font-bold text-gray-900">{applicationStats.viewed}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <CheckCircle className="h-12 w-12 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Accepted</p>
                <p className="text-2xl font-bold text-gray-900">{applicationStats.accepted}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Clock className="h-12 w-12 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{applicationStats.inProgress}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Application Activity</h2>
          <Line data={chartData} options={{ responsive: true }} />
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Applications</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {[
                {
                  id: 1,
                  position: 'Senior Frontend Developer',
                  company: 'TechCorp Inc.',
                  date: '2024-03-15',
                  status: 'In Progress'
                },
                {
                  id: 2,
                  position: 'Full Stack Engineer',
                  company: 'StartupXYZ',
                  date: '2024-03-14',
                  status: 'Viewed'
                },
                {
                  id: 3,
                  position: 'UI/UX Designer',
                  company: 'DesignCo',
                  date: '2024-03-13',
                  status: 'Accepted'
                }
              ].map((application) => (
                  <tr key={application.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {application.position}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{application.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{application.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <button
                            className="text-gray-400 hover:text-indigo-600"
                            onClick={() => handleViewJob(application.id)}
                            title="View Job Details"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </button>
                        <button
                            className="text-gray-400 hover:text-red-600"
                            onClick={() => handleCancelApplication(application.id)}
                            title="Cancel Application"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                        <button
                            className="text-gray-400 hover:text-green-600"
                            onClick={() => handleTakeTest(application.id)}
                            title="Take Test"
                        >
                          <FileText className="h-5 w-5" />
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