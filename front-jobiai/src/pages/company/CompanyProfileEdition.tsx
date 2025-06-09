import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

interface Company {
    _id: string;
    name: string;
    logo?: string;
    location: string;
    website?: string;
    size: string;
    industry: string;
    founded: string;
    description: string;
    email: string;
    phone: string;
    address: string;
}

export function CompanyProfileEdition() {
    const navigate = useNavigate();
    const [company, setCompany] = useState<Company | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setLogoFile(file);
            const preview = URL.createObjectURL(file);
            setPreviewImage(preview);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png']
        },
        maxFiles: 1,
        multiple: false
    });

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/jobiai/api/company', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCompany(response.data);
                if (response.data.logo) {
                    setPreviewImage(response.data.logo);
                }
                setLoading(false);
            } catch (err) {
                setError('Failed to load company data');
                setLoading(false);
            }
        };

        fetchCompany();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!company) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            let logoUrl = company.logo;

            if (logoFile) {
                const formData = new FormData();
                formData.append('logo', logoFile);

                const uploadResponse = await axios.post(
                    'http://localhost:5000/jobiai/api/company/upload-logo',
                    formData,
                    { headers: { ...headers, 'Content-Type': 'multipart/form-data' } }
                );

                logoUrl = uploadResponse.data.logoUrl;
            }

            await axios.put(
                `http://localhost:5000/jobiai/api/company/${company._id}`,
                { ...company, logo: logoUrl },
                { headers }
            );

            navigate('/company/profile');
        } catch (err) {
            setError('Failed to update company profile');
        } finally {
            setIsSubmitting(false);
        }
    };

    const removeImage = () => {
        setPreviewImage(null);
        setLogoFile(null);
        if (company) {
            setCompany({ ...company, logo: undefined });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-indigo-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!company) return null;

    return (
        <div className="min-h-screen bg-indigo-50 py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center justify-between bg-white p-6 rounded-lg shadow-sm border border-indigo-100">
                    <button
                        onClick={() => navigate('/company/profile')}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back to Profile
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Edit Company Profile</h1>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="bg-white rounded-lg shadow-sm border border-indigo-100 overflow-hidden">
                        {/* Logo Upload Section - Small and Centered */}
                        <div className="w-fit mx-auto pt-8">
                            {previewImage ? (
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-lg overflow-hidden">
                                        <img
                                            src={previewImage}
                                            alt="Company logo preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute -top-1 -right-1 bg-red-100 rounded-full p-1 hover:bg-red-200 transition-colors"
                                    >
                                        <X className="w-3 h-3 text-red-600" />
                                    </button>
                                </div>
                            ) : (
                                <div
                                    {...getRootProps()}
                                    className={`w-16 h-16 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors
                                    ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-500'}`}
                                >
                                    <input {...getInputProps()} />
                                    <Upload className="w-4 h-4 text-gray-400 mb-0.5" />
                                    <p className="text-[10px] text-gray-500 text-center">Logo</p>
                                </div>
                            )}
                        </div>

                        <div className="p-8">
                            {/* Basic Information */}
                            <div className="mb-8">
                                <h2 className="text-lg font-semibold mb-6">Basic Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Company Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={company.name}
                                            onChange={(e) => setCompany({ ...company, name: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={company.location}
                                            onChange={(e) => setCompany({ ...company, location: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Industry
                                        </label>
                                        <input
                                            type="text"
                                            name="industry"
                                            value={company.industry}
                                            onChange={(e) => setCompany({ ...company, industry: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Founded Year
                                        </label>
                                        <input
                                            type="text"
                                            name="founded"
                                            value={company.founded}
                                            onChange={(e) => setCompany({ ...company, founded: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Website
                                        </label>
                                        <input
                                            type="url"
                                            name="website"
                                            value={company.website}
                                            onChange={(e) => setCompany({ ...company, website: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Company Size
                                        </label>
                                        <select
                                            name="size"
                                            value={company.size}
                                            onChange={(e) => setCompany({ ...company, size: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="1-10 employees">1-10 employees</option>
                                            <option value="11-50 employees">11-50 employees</option>
                                            <option value="51-200 employees">51-200 employees</option>
                                            <option value="201-500 employees">201-500 employees</option>
                                            <option value="501-1000 employees">501-1000 employees</option>
                                            <option value="1000+ employees">1000+ employees</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-8">
                                <h2 className="text-lg font-semibold mb-6">Company Description</h2>
                                <textarea
                                    name="description"
                                    value={company.description}
                                    onChange={(e) => setCompany({ ...company, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            {/* Contact Information */}
                            <div>
                                <h2 className="text-lg font-semibold mb-6">Contact Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={company.email}
                                            onChange={(e) => setCompany({ ...company, email: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={company.phone}
                                            onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={company.address}
                                            onChange={(e) => setCompany({ ...company, address: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-4 p-6 bg-gray-50 border-t border-indigo-100">
                            <button
                                type="button"
                                onClick={() => navigate('/company/profile')}
                                className="px-8 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                            >
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}