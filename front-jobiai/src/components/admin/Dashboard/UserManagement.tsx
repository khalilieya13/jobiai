import React, { useState } from 'react';
import { Search, Trash2 } from 'lucide-react';
import { User } from '../../../types';

interface UserManagementProps {
    users: User[];
    onDeleteUser: (userId: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, onDeleteUser }) => {
    console.log("Users:", users);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = users.filter(user =>
        (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );


    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    Add User
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                    <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'recruiter' ? 'bg-indigo-100 text-indigo-800' :
                          user.role === 'admin' ? 'bg-red-100 text-red-800' :
                              'bg-purple-100 text-purple-800'
                  }`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center space-x-2">
                                    {user.role === 'recruiter' ? (
                                        <>
                                            <button className="px-2 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700">
                                                Company
                                            </button>
                                            <button className="px-2 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700">
                                                Jobs
                                            </button>
                                        </>
                                    ) : user.role === 'candidate' ? (
                                        <button className="px-2 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700">
                                            Resume
                                        </button>
                                    ) : null}
                                    <button
                                        className="text-red-600 hover:text-red-900"
                                        onClick={() => onDeleteUser(user._id)}
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {filteredUsers.length === 0 && (
                <div className="text-center py-10">
                    <p className="text-gray-500">No users found matching your search criteria</p>
                </div>
            )}

            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-700">
                        Showing <span className="font-medium">{filteredUsers.length}</span> of{' '}
                        <span className="font-medium">{users.length}</span> users
                    </div>
                    <div>
                        <button className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Export Users
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;