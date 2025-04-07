import { useEffect, useState } from 'react';
import {Bell, Lock, User, Globe, Mail} from 'lucide-react';
import axios from 'axios';

const tabs = [
  { name: 'Profile', icon: User },
  { name: 'Notifications', icon: Bell },
  { name: 'Security', icon: Lock },
  { name: 'Preferences', icon: Globe }
];

const defaultNotifications = {
  email: true,
  push: true,
  jobAlerts: true,
  marketing: false
};

export function CandidateProfileEdition() {
  const [activeTab, setActiveTab] = useState('Profile');
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    skills: [] as string[],
    notifications: defaultNotifications,
    language: 'en',
    timezone: 'UTC+1'
  });
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCandidateProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/jobiai/api/candidate/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          setProfile({
            ...response.data,
            notifications: {
              ...defaultNotifications,
              ...(response.data.notifications || {})
            },
            skills: response.data.skills || []
          });
          setCandidateId(response.data._id);
        }
      } catch (err) {
        console.error("Aucun profil trouvé, l'utilisateur peut en créer un.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidateProfile();
  }, []);

  const handleProfileSubmit = async () => {
    try {
      setError('');
      setSuccess('');
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Token d\'authentification manquant');
        return;
      }

      let response;
      const profileData = {
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
        bio: profile.bio,
        skills: profile.skills,
        notifications: profile.notifications
      };

      if (candidateId) {
        response = await axios.put(`http://localhost:5000/jobiai/api/candidate/${candidateId}`, profileData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        response = await axios.post('http://localhost:5000/jobiai/api/candidate/add', profileData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCandidateId(response.data._id);
      }

      if (response.data) {
        setSuccess('Profil mis à jour avec succès !');
      }
    } catch (err) {
      setError('Échec de la mise à jour du profil. Veuillez réessayer.');
      console.error('Erreur:', err);
    }
  };

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
    );
  }

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map(({ name, icon: Icon }) => (
                  <button
                      key={name}
                      className={`flex-1 px-4 py-4 text-center border-b-2 font-medium text-sm ${
                          activeTab === name
                              ? 'border-indigo-500 text-indigo-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                      onClick={() => setActiveTab(name)}
                  >
                    <div className="flex items-center justify-center">
                      <Icon className="h-5 w-5 mr-2" />
                      {name}
                    </div>
                  </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'Profile' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Update your personal information and how it appears on your profile.
                    </p>
                  </div>

                  {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                      </div>
                  )}

                  {success && (
                      <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                        {success}
                      </div>
                  )}

                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <input
                          type="text"
                          value={profile.fullName}
                          onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <input
                          type="text"
                          value={profile.address}
                          onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Bio
                      </label>
                      <textarea
                          rows={4}
                          value={profile.bio}
                          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Skills (comma-separated)
                      </label>
                      <input
                          type="text"
                          value={profile.skills.join(', ')}
                          onChange={(e) => setProfile({ ...profile, skills: e.target.value.split(',').map(skill => skill.trim()) })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="e.g. JavaScript, React, Node.js"
                      />
                    </div>
                  </div>
                </div>
            )}

            {activeTab === 'Notifications' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Manage how you receive notifications and updates.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(profile.notifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </p>
                            <p className="text-sm text-gray-500">
                              Receive notifications about {key.toLowerCase()} updates.
                            </p>
                          </div>
                          <button
                              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                  value ? 'bg-indigo-600' : 'bg-gray-200'
                              }`}
                              onClick={() =>
                                  setProfile({
                                    ...profile,
                                    notifications: {
                                      ...profile.notifications,
                                      [key]: !value
                                    }
                                  })
                              }
                          >
                      <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              value ? 'translate-x-5' : 'translate-x-0'
                          }`}
                      />
                          </button>
                        </div>
                    ))}
                  </div>
                </div>
            )}

            {activeTab === 'Security' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Manage your account security and authentication methods.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <button className="w-full flex justify-between items-center px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50">
                        <div className="flex items-center">
                          <Lock className="h-5 w-5 text-gray-400 mr-3" />
                          <div className="text-left">
                            <p className="font-medium text-gray-900">Change Password</p>
                            <p className="text-sm text-gray-500">
                              Update your account password
                            </p>
                          </div>
                        </div>
                        <span className="text-gray-400">&rarr;</span>
                      </button>
                    </div>

                    <div>
                      <button className="w-full flex justify-between items-center px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50">
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 text-gray-400 mr-3" />
                          <div className="text-left">
                            <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                            <p className="text-sm text-gray-500">
                              Add an extra layer of security
                            </p>
                          </div>
                        </div>
                        <span className="text-gray-400">&rarr;</span>
                      </button>
                    </div>
                  </div>
                </div>
            )}

            {activeTab === 'Preferences' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Account Preferences</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Customize your account settings and preferences.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Language
                      </label>
                      <select
                          value={profile.language}
                          onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      >
                        <option value="en">English</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="es">Spanish</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Time Zone
                      </label>
                      <select
                          value={profile.timezone}
                          onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      >
                        <option value="UTC-8">Pacific Time (UTC-8)</option>
                        <option value="UTC-5">Eastern Time (UTC-5)</option>
                        <option value="UTC+0">UTC</option>
                        <option value="UTC+1">Central European Time (UTC+1)</option>
                      </select>
                    </div>
                  </div>
                </div>
            )}

            {/* Save Button */}
            <div className="mt-6 flex justify-end">
              <button
                  onClick={handleProfileSubmit}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                {candidateId ? 'Update Profile' : 'Create Profile'}
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}