import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Award, Check, ArrowRight } from 'lucide-react';

const CVCreationSection: React.FC = () => {
    const navigate = useNavigate();
    const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

    const features = [
        {
            title: "ATS-Optimized Templates",
            description: "Our templates are designed to pass Applicant Tracking Systems with ease",
            icon: <Check className="w-6 h-6 text-indigo-500" />
        },
        {
            title: "AI-Powered Suggestions",
            description: "Get smart content suggestions based on your experience and the job you're applying for",
            icon: <Sparkles className="w-6 h-6 text-indigo-500" />
        },
        {
            title: "Industry-Specific Keywords",
            description: "Automatically include relevant keywords for your industry to increase your match rate",
            icon: <Award className="w-6 h-6 text-indigo-500" />
        }
    ];

    const handleStartBuilding = () => {
        navigate('/cv-builder');
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-indigo-600 mb-6">
                Create Your Professional Resume
            </h2>

            <p className="text-gray-600 mb-8">
                Build an ATS-optimized resume that gets past the bots and impresses hiring managers.
                Our easy-to-use builder creates polished, professional resumes in minutes.
            </p>

            <div className="space-y-6 mb-8">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="flex items-start gap-4 p-4 rounded-lg transition-all duration-300"
                        style={{
                            backgroundColor: hoveredFeature === index ? 'rgba(79, 70, 229, 0.05)' : 'transparent',
                            transform: hoveredFeature === index ? 'translateX(8px)' : 'none'
                        }}
                        onMouseEnter={() => setHoveredFeature(index)}
                        onMouseLeave={() => setHoveredFeature(null)}
                    >
                        <div className="mt-1">{feature.icon}</div>
                        <div>
                            <h3 className="font-semibold text-lg text-indigo-600">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={handleStartBuilding}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg flex items-center gap-2 transition-colors duration-300"
            >
                Start Building Now
                <ArrowRight className="w-5 h-5" />
            </button>
        </div>
    );
};

export default CVCreationSection;