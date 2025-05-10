
import { Briefcase, ArrowRight } from 'lucide-react';

export function CreateCompanySection() {
    return (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start">
                <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-full">
                    <Briefcase className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="ml-5">
                    <h3 className="text-xl font-semibold text-gray-900">Want to create your company profile?</h3>
                    <p className="mt-2 text-gray-600">
                        Reach thousands of qualified candidates. Start with creating your  company profile and
                        get applications from the right talent.
                    </p>
                    <div className="mt-4">
                        <a href="/company/profile/creation" className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition-colors duration-150">
                            Create company profile <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}