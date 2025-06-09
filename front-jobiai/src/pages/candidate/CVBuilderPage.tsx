import React, { useState } from 'react';
import CVCreationSection from '../../components/resume/CVCreationSection';
import ResumeUploadSection from '../../components/resume/ResumeUploadSection';
import { Star, Sparkles } from 'lucide-react';

export const CVBuilderPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'create' | 'upload'>('create');

    return (
        <div className="container mx-auto px-4 py-10 max-w-6xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 text-indigo-600 text-center">
                Resume Builder
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto text-center mb-12">
                Create a professional resume or upload your existing one
            </p>

            <div className="mb-8 flex justify-center">
                <div className="flex rounded-lg overflow-hidden shadow-md">
                    <button
                        className={`px-6 py-3 font-medium text-lg flex items-center gap-2 transition-colors duration-300 ${
                            activeTab === 'create'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white text-indigo-600 hover:bg-indigo-50'
                        }`}
                        onClick={() => setActiveTab('create')}
                    >
                        <Sparkles className="w-5 h-5" />
                        Create Resume
                    </button>
                    <button
                        className={`px-6 py-3 font-medium text-lg flex items-center gap-2 transition-colors duration-300 ${
                            activeTab === 'upload'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white text-indigo-600 hover:bg-indigo-50'
                        }`}
                        onClick={() => setActiveTab('upload')}
                    >
                        <Star className="w-5 h-5" />
                        Upload Resume
                    </button>
                </div>
            </div>

            <div className="transition-all duration-500">
                {activeTab === 'create' ? (
                    <CVCreationSection />
                ) : (
                    <ResumeUploadSection />
                )}
            </div>
        </div>
    );
};

export default CVBuilderPage;