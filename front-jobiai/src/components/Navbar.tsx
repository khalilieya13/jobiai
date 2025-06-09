import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Briefcase, Bell } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

import NotificationComponent from "./Notification";
import NotificationBadge from "./NotificationBadge";

type JwtPayload = {
    id: string;
    role: string;
    email: string;
};

interface Notification {
    _id: string;
    message: string;
    link: string;
    read: boolean;
}

export function Navbar() {
    const [user, setUser] = useState<JwtPayload | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Fetch user from token
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

        setDropdownOpen(false); // Close dropdown on page change
    }, [location]);

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    // Handle protected route navigation
    const handleProtectedClick = async (path: string) => {
        if (!user) {
            navigate('/login');
            return;
        }

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
                    navigate('/job/post');
                } else {
                    navigate('/company/profile/creation');
                }
            } catch (error) {
                navigate('/company/profile/creation');
            }
        } else {
            navigate(path);
        }
    };

    // Handle clicks outside the dropdowns to close them
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
                notificationRef.current && !notificationRef.current.contains(event.target as Node)
            ) {
                setDropdownOpen(false);
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationsUpdate = (updatedNotifications: Notification[]) => {
        setNotifications(updatedNotifications);
    };

    // Count unread notifications
    const unreadCount = notifications.filter(n => !n.read).length;

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
                        <Link to="/companies" className="text-gray-700 hover:text-indigo-600 text-sm font-medium">
                            Search companies
                        </Link>
                        <button
                            onClick={() => handleProtectedClick('/candidates')}
                            className="text-gray-700 hover:text-indigo-600 text-sm font-medium"
                        >
                            Search Resume
                        </button>
                        <button
                            onClick={() => handleProtectedClick('/resume')}
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
                                <div className="relative" ref={notificationRef}>
                                    <button
                                        className="relative flex items-center justify-center h-8 w-8 rounded-full hover:bg-gray-100 transition-colors"
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        aria-label="Notifications"
                                    >
                                        <Bell className="h-5 w-5 text-indigo-600" />
                                        <NotificationBadge count={unreadCount} />
                                    </button>

                                    {/* Notification dropdown panel */}
                                    <NotificationComponent
                                        visible={showNotifications}
                                        onClose={() => setShowNotifications(false)}
                                        onNotificationsUpdate={handleNotificationsUpdate}
                                    />
                                </div>

                                {/* Avatar Button */}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDropdownOpen(!dropdownOpen);
                                    }}
                                    className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-bold"
                                >
                                    {user.email?.charAt(0).toUpperCase()}
                                </button>

                                {/* Dropdown Menu */}
                                {dropdownOpen && (
                                    <div
                                        className="absolute right-0 top-12 w-48 bg-white border rounded-md shadow-lg py-1 z-50">
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
                                                Edit Company Profile
                                            </Link>
                                        )}



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