import axios from 'axios';
import { useEffect, useState } from 'react';

import {
  PieChart, Pie, Cell, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import {
  Briefcase,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  ExternalLink
} from 'lucide-react';
import {useNavigate} from "react-router-dom";



const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];



type Candidacy = {
  _id: string;
  position: string;
  company: string;
  companyName:string;
  appliedAt: string;
  status: string;
  jobPost: {
    _id: string;
    jobTitle: string; // Le titre du poste
    idCompany: string;
  };

};


export function CandidateDashboard() {

  const [candidacies, setCandidacies] = useState<Candidacy[]>([]);

  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  const [candidacyToDelete, setCandidacyToDelete] = useState<Candidacy | null>(null);
  const [acceptedCompaniesData, setAcceptedCompaniesData] = useState<{ name: string; count: number }[]>([]);






  const handleDelete = async () => {
    if (!candidacyToDelete) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/jobiai/api/candidacy/${candidacyToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCandidacies(candidacies.filter((candidacy) => candidacy._id !== candidacyToDelete._id));
      setShowDeleteModal(false);
      setCandidacyToDelete(null);
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const [applicationStats, setApplicationStats] = useState({
    total: 0,
    accepted: 0,
    rejected: 0,
    pending: 0,
  });

  const [statusData, setStatusData] = useState([]);

  useEffect(() => {
    const fetchCandidacies = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/jobiai/api/candidacy/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const candidaciesWithCompanyName = await Promise.all(
            response.data.map(async (candidacy: Candidacy) => {
              if (!candidacy.jobPost || !candidacy.jobPost.idCompany) {
                return { ...candidacy, companyName: 'N/A' };
              }

              try {
                const companyResponse = await axios.get(
                    `http://localhost:5000/jobiai/api/company/${candidacy.jobPost.idCompany}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                return {
                  ...candidacy,
                  companyName: companyResponse.data.name || 'Non spécifiée',
                };
              } catch (error) {
                console.warn(`Erreur récupération compagnie:`, error);
                return { ...candidacy, companyName: 'Erreur de chargement' };
              }
            })
        );

        setCandidacies(candidaciesWithCompanyName);

        const total = candidaciesWithCompanyName.length;
        const accepted = candidaciesWithCompanyName.filter(c => c.status === 'accepted').length;
        const rejected = candidaciesWithCompanyName.filter(c => c.status === 'rejected').length;
        const pending = candidaciesWithCompanyName.filter(c => c.status === 'pending').length;

        setApplicationStats({ total, accepted, rejected, pending });

        // Graphique 1 : Statut global
        setStatusData([
          { status: 'accepted', value: accepted },
          { status: 'rejected', value: rejected },
          { status: 'pending', value: pending },
        ]);

        // Graphique 2 : Répartition des acceptations par entreprise
        const acceptedByCompany: { [company: string]: number } = {};
        candidaciesWithCompanyName.forEach(c => {
          if (c.status === 'accepted') {
            const company = c.companyName || 'Non spécifiée';
            acceptedByCompany[company] = (acceptedByCompany[company] || 0) + 1;
          }
        });

        const acceptedCompanies = Object.entries(acceptedByCompany).map(([name, count]) => ({
          name,
          count,
        }));

        setAcceptedCompaniesData(acceptedCompanies);

      } catch (err) {
        console.error('Erreur lors du chargement des candidatures :', err);
      }
    };

    fetchCandidacies();
  }, []);









  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
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
              <Briefcase className="h-12 w-12 text-indigo-600"/>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{applicationStats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Eye className="h-12 w-12 text-blue-600"/>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Applications rejected</p>
                <p className="text-2xl font-bold text-gray-900">{applicationStats.rejected}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <CheckCircle className="h-12 w-12 text-green-600"/>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Accepted</p>
                <p className="text-2xl font-bold text-gray-900">{applicationStats.accepted}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Clock className="h-12 w-12 text-yellow-600"/>
              <div className="ml-4">
                <p className="text-sm text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{applicationStats.pending}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Chart 1: Status Distribution */}
          <div className="bg-white shadow rounded p-4">
            <h2 className="text-xl font-semibold mb-2">Status Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ value, percent }) =>
                        `${(percent * 100).toFixed(0)}%`
                    }
                >
                  {statusData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <RechartsTooltip/>
                <Legend/>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 2: Companies that Accepted Me */}
          <div className="bg-white shadow rounded p-4">
            <h2 className="text-xl font-semibold mb-2">Companies That Accepted Me</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={acceptedCompaniesData}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" name="Accepted" />
              </BarChart>
            </ResponsiveContainer>
          </div>



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
              {candidacies.map((candidacy) => (
                  <tr key={candidacy._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {candidacy.jobPost?.jobTitle || 'Titre non disponible'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{candidacy.companyName || 'Entreprise inconnue'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(candidacy.appliedAt).toLocaleString('fr-FR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(candidacy.status)}`}>
        {candidacy.status}
      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <button
                            className="text-gray-400 hover:text-indigo-600"
                            onClick={() => candidacy.jobPost?._id && navigate(`/job/${candidacy.jobPost._id}`)}
                            title="View Job Details"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </button>
                        <button
                            className="text-gray-400 hover:text-red-600"
                            onClick={() => {
                              setCandidacyToDelete(candidacy);
                              setShowDeleteModal(true);
                            }}
                            title="Cancel Application"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                        <button
                            className="text-gray-400 hover:text-green-600"
                            title="View Resume"
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
        {showDeleteModal && candidacyToDelete && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Are you sure?</h2>
                <p className="text-gray-600 mb-6">
                  Do you really want to delete the job application "<strong>{candidacyToDelete._id}</strong>"? This
                  action cannot be
                  undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                      onClick={() => {
                        setShowDeleteModal(false);
                        setCandidacyToDelete(null);
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