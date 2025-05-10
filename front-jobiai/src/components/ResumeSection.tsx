
import { FileText, ArrowRight } from 'lucide-react';

export function ResumeSection() {
    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                    <FileText className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="ml-5">
                    <h3 className="text-xl font-semibold text-gray-900">Want to create your resume?</h3>
                    <p className="mt-2 text-gray-600">
                        Build a professional resume that gets noticed by employers.
                        Our easy-to-use resume builder helps you create a standout resume in minutes.
                    </p>
                    <div className="mt-4">
                        <a href="/cv-builder" className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition-colors duration-150">
                            Create Resume <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}