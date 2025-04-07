import React from 'react';
import { Link } from 'react-router-dom';
import { BriefcaseIcon, UserCircle, Bell } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <BriefcaseIcon className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">JobiAI</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/jobs" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900">
                Jobs
              </Link>
              <Link to="/companies" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                Companies
              </Link>
              <Link to="/resources" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                Resources
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-gray-500 hover:text-gray-900 font-medium">
              Sign in
            </Link>
            <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}