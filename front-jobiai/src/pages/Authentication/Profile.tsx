import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface UserProfile {
    email: string;
    name?: string;
}

export function Profile() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('Token:', token);

        if (!token) {
            console.log('No token, redirecting to login');
            navigate('/login');
            return;
        }

        try {
            const decodedToken: any = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            console.log('Decoded Token:', decodedToken);

            if (decodedToken.exp < currentTime) {
                console.log('Token expired, redirecting');
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }

            axios
                .get('http://localhost:5000/jobiai/api/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => {
                    console.log('Profile fetched:', res.data);
                    setUser(res.data);
                })
                .catch((err) => {
                    console.error('Error fetching profile:', err);
                    navigate('/login');
                });
        } catch (err) {
            console.error('Error decoding token:', err);
            localStorage.removeItem('token');
            navigate('/login');
        }
    }, [navigate]);


    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleChangePassword = async () => {
        if (newPassword.length < 6) {
            setMessage('Password must be at least 6 characters long.');
            setMessageType('error');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.put(
                'http://localhost:5000/jobiai/api/change-password',
                { newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage('Password updated successfully!');
            setMessageType('success');
            setTimeout(() => setMessage(''), 5000); // Clear message after 5 seconds
        } catch (err) {
            setMessage('Failed to update password.');
            setMessageType('error');
            setTimeout(() => setMessage(''), 5000); // Clear message after 5 seconds
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you sure you want to delete your account? This action is irreversible.')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete('http://localhost:5000/jobiai/api/delete-account', {
                headers: { Authorization: `Bearer ${token}` },
            });
            localStorage.removeItem('token');
            navigate('/register');
        } catch (err) {
            setMessage('Failed to delete account.');
            setMessageType('error');
            setTimeout(() => setMessage(''), 5000); // Clear message after 5 seconds
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold">My Account</h1>

            {message && <div className={`text-sm ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message}</div>}

            <div className="bg-white shadow rounded p-4">
                <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
                <p><strong>Email:</strong> {user.email}</p>
                {user.name && <p><strong>Name:</strong> {user.name}</p>}
            </div>

            <div className="bg-white shadow rounded p-4">
                <h2 className="text-xl font-semibold mb-2">Change Password</h2>
                <input
                    type="password"
                    className="border rounded p-2 w-full mb-2"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                    onClick={handleChangePassword}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Update Password
                </button>
            </div>

            <div className="bg-white shadow rounded p-4">
                <h2 className="text-xl font-semibold mb-2 text-red-600">Danger Zone</h2>
                <button
                    onClick={handleDeleteAccount}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                >
                    Delete My Account
                </button>
            </div>

            <button
                onClick={handleLogout}
                className="mt-4 bg-gray-600 text-white px-4 py-2 rounded"
            >
                Logout
            </button>
        </div>
    );
}
