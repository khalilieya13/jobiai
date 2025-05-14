import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Briefcase, Bell } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

type JwtPayload = {
    id: string;
    role: string;
    email: string;
};

export function Navbar() {
    const [user, setUser] = useState<JwtPayload | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode<JwtPayload>(token);
                setUser(decoded);
            } catch (e) {
                console.error('Invalid token');
                setUser(null);
            }
        } else {
            setUser(null);
        }

        // ✅ Ferme le dropdown à chaque changement de page
        setDropdownOpen(false);
    }, [location]);


    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    const handleProtectedClick = async (path: string) => {
        if (!user) {
            // Utilisateur non connecté : rediriger vers login
            navigate('/login');
            return;
        }

        // Si utilisateur est connecté, on vérifie les cas spécifiques
        if (path === '/job/post') {
            if (user.role !== 'recruiter') {
                alert('Only recruiters can post a job.');
                return;
            }

            try {
                const res = await axios.get('http://localhost:5000/jobiai/api/company', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });

                if (res.data) {
                    // Si une compagnie existe : aller à /job/post
                    navigate('/job/post');
                } else {
                    // Sinon, rediriger vers création de compagnie
                    navigate('/company/profile/creation');
                }
            } catch (error) {
                // En cas d'erreur API, rediriger quand même vers création de compagnie
                navigate('/company/profile/creation');
            }
        } else {
            // Pour les autres routes protégées
            navigate(path);
        }
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <Briefcase className="h-8 w-8 text-indigo-600" />
                        <span className="ml-2 text-xl font-bold text-gray-900">JobiAI</span>
                    </Link>

                    {/* Navigation links */}
                    <div className="hidden md:flex md:items-center md:space-x-6">
                        <Link to="/jobs" className="text-gray-700 hover:text-indigo-600 text-sm font-medium">
                            Search Job
                        </Link>
                        <button
                            onClick={() => handleProtectedClick('/candidates')}
                            className="text-gray-700 hover:text-indigo-600 text-sm font-medium"
                        >
                            Search Resume
                        </button>
                        <button
                            onClick={() => handleProtectedClick('/cv-builder')}
                            className="text-gray-700 hover:text-indigo-600 text-sm font-medium"
                        >
                            Create Resume
                        </button>
                        <span
                            onClick={() => handleProtectedClick('/job/post')}
                            className="text-gray-700 hover:text-indigo-600 text-sm font-medium cursor-pointer"
                        >
                             Post Job
                        </span>


                        {/* User actions */}
                        {!user ? (
                            <div className="flex items-center space-x-2 ml-4">
                                <Link
                                    to="/login"
                                    className="text-indigo-600 hover:text-indigo-700 px-3 py-2 text-sm font-medium"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        ) : (
                            <div className="relative ml-4 flex items-center space-x-4" ref={dropdownRef}>
                                {/* Notification Icon */}
                                <Bell className="h-6 w-6 text-indigo-600 cursor-pointer"/>

                                {/* Avatar Button */}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation(); // important si clic imbriqué
                                        setDropdownOpen((prev) => !prev); // toggle seulement au clic
                                    }}
                                    className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-bold"
                                >
                                    {user.email?.charAt(0).toUpperCase()}
                                </button>


                                {/* Dropdown Menu */}
                                {dropdownOpen && (
                                    <div
                                        className="absolute right-0 top-12 w-48 bg-white border rounded-md shadow-lg py-1 z-50">
                                        {/* Dashboard */}
                                        <Link
                                            to={
                                                user.role === 'recruiter'
                                                    ? '/company/dashboard'
                                                    : user.role === 'admin'
                                                        ? '/admin/dashboard'
                                                        : '/candidate/dashboard'
                                            }
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Dashboard
                                        </Link>


                                        {/* Profile */}
                                        <Link
                                            to="/account"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Profile
                                        </Link>

                                        {/* Modify Resume (Candidat uniquement) */}
                                        {user.role === 'candidate' && (
                                            <Link
                                                to="/cv-builder"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Modify Resume
                                            </Link>
                                        )}

                                        {/* Modify Company Profile (Recruteur uniquement) */}
                                        {user.role === 'recruiter' && (
                                            <Link
                                                to="/company/profile/edition"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Modify Company Profile
                                            </Link>
                                        )}

                                        {/* Settings */}
                                        <Link
                                            to="/settings"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Settings
                                        </Link>

                                        {/* Log out */}
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        >
                                            Log out
                                        </button>
                                    </div>
                                )}

                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
