import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { handleFieldErrors, handleAxiosError} from '../errorHandler.tsx'; // Importer les fonctions de gestion des erreurs

export function CompanyProfileCreation() {
    const navigate = useNavigate();
    const [company, setCompany] = useState({
        name: '',
        logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=100',
        location: '',
        website: '',
        size: '1-10 employees',
        industry: '',
        founded: '',
        description: '',
        email: '',
        phone: '',
        address: '',
    });

    const [error, setError] = useState<string>(''); // État pour gérer les erreurs
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // État pour gérer l'état de soumission

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation des champs obligatoires
        const validationError = handleFieldErrors(company);
        if (validationError) {
            setError(validationError);
            return; // Si un champ est vide ou une erreur se produit, on arrête l'envoi
        }
        setIsSubmitting(true);
        setError(''); // Réinitialiser l'erreur avant l'envoi
        try {
            const token = localStorage.getItem('token'); // Récupérer le token depuis localStorage
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.post(
                'http://localhost:5000/jobiai/api/company/add',
                company,
                { headers }
            );

            // Réponse réussie, on redirige vers la page d'accueil
            console.log(response.data);
            navigate('/');  // Rediriger vers la page d'accueil
        } catch (axiosError) {
            console.error('Erreur lors de la création de l\'entreprise:', axiosError);
            setError(handleAxiosError(axiosError)); // Utilisation de la fonction de gestion des erreurs Axios
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCompany(prev => ({ ...prev, [name]: value }));

        // Réinitialiser l'erreur si l'utilisateur commence à saisir dans un champ
        if (error) {
            setError('');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6 flex items-center">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Profile
                </button>
            </div>

            {/* Affichage du message d'erreur */}
            {error && (
                <div className="bg-red-500 text-white p-4 rounded-md mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Cover and Logo Section */}
                <div className="space-y-6">
                    <div className="flex items-center space-x-6">
                        <div className="relative">
                            <img
                                src={company.logo}
                                alt={company.name}
                                className="w-24 h-24 rounded-lg object-cover"
                            />
                            <button type="button" className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-sm">
                                <Camera className="h-4 w-4 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Basic Information */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                            <input
                                type="text"
                                name="name"
                                value={company.name}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={company.location}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                            <input
                                type="text"
                                name="website"
                                value={company.website}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                            <select
                                name="size"
                                value={company.size}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option>1-10 employees</option>
                                <option>11-50 employees</option>
                                <option>51-200 employees</option>
                                <option>201-500 employees</option>
                                <option>501-1000 employees</option>
                                <option>1000-5000 employees</option>
                                <option>5000+ employees</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* About Section */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-6">About Company</h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                name="description"
                                value={company.description}
                                onChange={handleChange}
                                rows={4}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                                <input
                                    type="text"
                                    name="industry"
                                    value={company.industry}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Founded Year</label>
                                <input
                                    type="text"
                                    name="founded"
                                    value={company.founded}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={company.email}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={company.phone}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={company.address}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        disabled={isSubmitting} // Disable the button while submitting
                    >
                        {isSubmitting ? 'Submitting...' : 'Save '}
                    </button>
                </div>
            </form>
        </div>
    );
}
