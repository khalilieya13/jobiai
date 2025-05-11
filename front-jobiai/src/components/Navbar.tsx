import {Link, useLocation, useNavigate} from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';


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

    const location = useLocation(); // 👈 track URL changes

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
            setUser(null); // 👈 clear state if no token
        }
    }, [location]); // 👈 re-run when URL changes


    const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  // Close dropdown when clicking outside
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
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <Briefcase className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">JobiAI</span>
              </Link>
            </div>

            <div className="hidden md:flex md:items-center md:space-x-6">
              <Link to="/jobs" className="text-gray-700 hover:text-indigo-600 text-sm font-medium">
                Search Job
              </Link>
              <Link to="/candidates" className="text-gray-700 hover:text-indigo-600 text-sm font-medium">
                Search Resume
              </Link>
              <Link to="/cv-builder" className="text-gray-700 hover:text-indigo-600 text-sm font-medium">
                Create Resume
              </Link>
              <Link to="/job/post" className="text-gray-700 hover:text-indigo-600 text-sm font-medium">
                Post Job
              </Link>
              <Link to="/company/dashboard" className="text-gray-700 hover:text-indigo-600 text-sm font-medium">
                Company Dashboard
              </Link>
              <Link to="/candidate/dashboard" className="text-gray-700 hover:text-indigo-600 text-sm font-medium">
                Candidate Dashboard
              </Link>

              {!user ? (
                  <div className="flex items-center space-x-2 ml-4">
                    <Link to="/login" className="text-indigo-600 hover:text-indigo-700 px-3 py-2 text-sm font-medium">
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
                  <div className="relative ml-4" ref={dropdownRef}>
                      <button
                          onClick={() => setDropdownOpen(!dropdownOpen)}
                          className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-bold focus:outline-none"
                      >
                          {user.email?.charAt(0).toUpperCase()}
                      </button>


                      {dropdownOpen && (
                          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-1 z-50">
                              <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                  Profile
                              </Link>
                              <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                  Settings
                              </Link>
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
