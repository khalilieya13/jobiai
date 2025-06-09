import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Briefcase, Download, GraduationCap, MapPin } from 'lucide-react';
import { ResumeCandidate } from '../../types';
import CVPreview from '../CVPreview';

interface CandidateCardProps {
    resume: ResumeCandidate;
}

export function CandidateCard({ resume }: CandidateCardProps) {
    const [isExporting, setIsExporting] = useState(false);
    const [exportError, setExportError] = useState<string | null>(null);

    const handleExportResume = async () => {
        setIsExporting(true);
        setExportError(null);

        try {
            // If we have a direct URL to the resume file, download it directly
            if (resume.resumeFileUrl) {
                const link = document.createElement('a');
                link.href = resume.resumeFileUrl;
                link.download = `${resume.personalInfo.fullName.replace(/\s+/g, '_')}_CV.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                setIsExporting(false);
                return;
            }

            // Create a temporary container and make it visible but off-screen
            const container = document.createElement('div');
            container.style.position = 'fixed';
            container.style.top = '-9999px';
            container.style.left = '-9999px';
            container.style.width = '210mm';
            container.style.height = '297mm';
            container.style.background = '#ffffff';
            document.body.appendChild(container);

            // Render the CV preview in the container
            const previewElement = document.createElement('div');
            container.appendChild(previewElement);

            // Create a new instance of CVPreview and render it
            const cvPreview = <CVPreview data={resume} />;
            // @ts-ignore - React 18 createRoot
            const root = await import('react-dom/client').then(m => m.createRoot(previewElement));
            root.render(cvPreview);

            // Wait for the content to be rendered
            await new Promise(resolve => setTimeout(resolve, 100));

            // Generate canvas
            const canvas = await html2canvas(previewElement, {
                scale: 2,
                useCORS: true,
                logging: false,
                width: 794, // A4 width at 96 DPI
                height: 1123, // A4 height at 96 DPI
                backgroundColor: '#ffffff'
            });

            // Clean up
            root.unmount();
            document.body.removeChild(container);

            // Create PDF
            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                compress: true
            });

            pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
            pdf.save(`${resume.personalInfo.fullName.replace(/\s+/g, '_')}_CV.pdf`);

        } catch (error) {
            console.error('Error exporting resume:', error);
            setExportError(error instanceof Error ? error.message : 'Failed to export CV');
        } finally {
            setIsExporting(false);
        }
    };

    const totalExperience = resume.experience.reduce((total, exp) => {
        const startYear = parseInt(exp.startYear);
        const endYear = exp.endYear ? parseInt(exp.endYear) : new Date().getFullYear();
        return total + (endYear - startYear);
    }, 0);

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start">
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">{resume.personalInfo.fullName}</h3>
                            <p className="text-gray-600">{resume.personalInfo.title}</p>
                        </div>
                        <button
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:bg-indigo-400"
                            onClick={handleExportResume}
                            disabled={isExporting}
                        >
                            {isExporting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Download className="h-4 w-4" />
                                    Export CV
                                </>
                            )}
                        </button>
                    </div>

                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {resume.personalInfo.address || 'N/A'}
                        </div>
                        <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-1" />
                            {totalExperience} years
                        </div>
                        <div className="flex items-center">
                            <GraduationCap className="h-4 w-4 mr-1" />
                            {resume.education[0]?.title} - {resume.education[0]?.institution}
                        </div>
                    </div>

                    <div className="mt-4">
                        <div className="flex flex-wrap gap-2">
                            {resume.skills.map((skill) => (
                                <span
                                    key={skill.name}
                                    className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                                >
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {exportError && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {exportError}
                </div>
            )}
        </div>
    );
}