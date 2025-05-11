import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const API_URL = 'http://localhost:5000/jobiai/api';

export function Profile() {
    const [user, setUser] = useState<{ email: string; name?: string } | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            setError('Not authenticated');
            setLoading(false);
            navigate('/login');
            return;
        }

        try {
            const decodedToken: any = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decodedToken.exp < currentTime) {
                localStorage.removeItem('token');
                setError('Session expired');
                setLoading(false);
                navigate('/login');
                return;
            }

            axios.get(`${API_URL}/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    setUser(response.data);
                    setName(response.data.name || '');
                    setLoading(false);
                })
                .catch(() => {
                    setError('Failed to load profile');
                    setLoading(false);
                });
        } catch (err) {
            setError('Invalid token');
            setLoading(false);
            navigate('/login');
        }
    }, [navigate]);

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `${API_URL}/profile`,
                { name },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setIsEditing(false);
            alert('Profile updated successfully');
        } catch (error) {
            alert('Failed to update profile');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/delete-account`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            localStorage.removeItem('token');
            navigate('/register');
        } catch (error) {
            alert('Failed to delete account');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (error || !user) {
        return <div className="flex justify-center items-center min-h-screen">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full space-y-6">
                <div className="bg-indigo-600 text-white p-8 rounded-xl shadow-lg text-center">
                    <h1 className="text-3xl font-bold">My Profile</h1>
                    <p className="mt-2 text-indigo-200">Manage your account settings</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">Personal Information</h2>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="text-indigo-600 hover:text-indigo-500 font-medium"
                            >
                                Edit
                            </button>
                        ) : (
                            <div className="space-x-3">
                                <button
                                    onClick={handleSave}
                                    className="text-green-600 hover:text-green-500 font-medium"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => {
                                        setName(user.name || '');
                                        setIsEditing(false);
                                    }}
                                    className="text-red-600 hover:text-red-500 font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Enter your name"
                                />
                            ) : (
                                <p className="text-gray-900 px-4 py-2">{user.name || 'Not provided'}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <p className="text-gray-900 px-4 py-2">{user.email}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Security</h2>
                    <button
                        onClick={() => navigate('/reset-password')}
                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-500 transition-colors font-medium"
                    >
                        Change Password
                    </button>
                </div>

                <div className="flex flex-col space-y-3">
                    <button
                        onClick={handleLogout}
                        className="w-full bg-white text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-lg border border-gray-200"
                    >
                        Sign Out
                    </button>

                    <button
                        onClick={handleDeleteAccount}
                        className="w-full bg-white text-red-600 py-3 px-4 rounded-lg hover:bg-red-50 transition-colors font-medium shadow-lg border border-red-200"
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
}