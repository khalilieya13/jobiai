
import { Briefcase } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-white border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center mb-4 md:mb-0">
                        <Briefcase className="h-6 w-6 text-indigo-600" />
                        <span className="ml-2 text-lg font-bold text-gray-900">JobiAI</span>
                    </div>

                    <div className="flex space-x-6">
                        <a href="#" className="text-sm text-gray-500 hover:text-indigo-600">About</a>
                        <a href="#" className="text-sm text-gray-500 hover:text-indigo-600">Contact</a>
                        <a href="#" className="text-sm text-gray-500 hover:text-indigo-600">Privacy</a>
                        <a href="#" className="text-sm text-gray-500 hover:text-indigo-600">Terms</a>
                    </div>

                    <p className="text-sm text-gray-400 mt-4 md:mt-0">
                        © {new Date().getFullYear()} JobiAI
                    </p>
                </div>
            </div>
        </footer>
    );
}