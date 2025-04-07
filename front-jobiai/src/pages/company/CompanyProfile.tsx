import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Globe, Users, Mail, Phone, Camera } from 'lucide-react';
import axios from 'axios';

export function CompanyProfile() {
  const navigate = useNavigate();

  // Déclare un état pour les données de l'entreprise
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true); // Gérer le chargement
  const [error, setError] = useState<string | null>(null); // Gérer les erreurs

  // Utilisation de useEffect pour récupérer les données au chargement du composant
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const token = localStorage.getItem('token'); // Récupère le token dans le localStorage
        const response = await axios.get('http://localhost:5000/jobiai/api/company', {
          headers: {
            Authorization: `Bearer ${token}`, // Ajout du token dans l'en-tête
          },
        });
        setCompany(response.data); // Met à jour l'état avec les données de l'entreprise
        setLoading(false); // Arrête le chargement
      } catch (err) {
        setError('Erreur lors de la récupération des données.'); // Gérer les erreurs
        setLoading(false); // Arrête le chargement
      }
    };

    fetchCompany();
  }, []); // Cette fonction sera exécutée une seule fois lors du premier rendu

  // Si les données sont en cours de chargement
  if (loading) {
    return <div>Loading...</div>;
  }

  // Si une erreur est survenue
  if (error) {
    return <div>{error}</div>;
  }

  // Si les données de l'entreprise sont récupérées
  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Company Header */}
              <div className="flex items-start space-x-4 mb-6">
                <div className="relative">
                  <img
                      src={company.logo}
                      alt={company.name}
                      className="w-24 h-24 rounded-lg object-cover"
                  />
                  <button className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-sm">
                    <Camera className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {company.location}
                    </div>
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-1" />
                      {company.website}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {company.size}
                    </div>
                  </div>
                </div>
                <button
                    onClick={() => navigate('/company/profile/edition')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Edit Profile
                </button>
              </div>

              {/* About */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
                <p className="text-gray-600 mb-4">{company.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">Industry:</span>{' '}
                    <span className="text-gray-600">{company.industry}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Founded:</span>{' '}
                    <span className="text-gray-600">{company.founded}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-5 w-5 mr-2" />
                  {company.email}
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-5 w-5 mr-2" />
                  {company.phone}
                </div>
                <div className="flex items-center text-gray-600">
                  <Building2 className="h-5 w-5 mr-2" />
                  {company.address}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500">Open Positions</div>
                  <div className="text-2xl font-bold text-gray-900">*****</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Total Employees</div>
                  <div className="text-2xl font-bold text-gray-900">******</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Average Response Time</div>
                  <div className="text-2xl font-bold text-gray-900">********</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
