import React, { useState } from 'react';
import { Upload, Check, AlertCircle, Loader2, FileUp } from 'lucide-react';

const ResumeUploadSection: React.FC = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [uploadedPdfUrl, setUploadedPdfUrl] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        title: '',
        email: '',
        phone: '',
        address: '',
        summary: ''
    });
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };




    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length) {
            processFile(files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const processFile = (file: File) => {
        if (file && file.type === 'application/pdf') {
            if (file.size > 10 * 1024 * 1024) { // 10MB in bytes
                setFile(null);
                setUploadStatus('error');
                setErrorMessage('File size exceeds 10MB limit.');
                return;
            }
            setFile(file);
            setUploadStatus('idle');
            setErrorMessage('');
            setUploadedPdfUrl(null);
        } else {
            setFile(null);
            setUploadStatus('error');
            setErrorMessage('Please upload a PDF file only.');
        }
    };

    const uploadFile = async () => {
        if (!file) return;

        setUploading(true);

        const formDataObj = new FormData();
        formDataObj.append('file', file);

        // 🔽 Append form fields
        Object.entries(formData).forEach(([key, value]) => {
            formDataObj.append(key, value);
        });

        try {
            const token = localStorage.getItem('token');
            const uploadResponse = await fetch('http://localhost:5000/jobiai/api/resume/upload-pdf', {
                method: 'POST',
                body: formDataObj,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!uploadResponse.ok) throw new Error('Upload failed');

            const { pdfUrl } = await uploadResponse.json();
            setUploadedPdfUrl(pdfUrl);
            setUploadStatus('success');
        } catch (error) {
            console.error('Upload error:', error);
            setUploadStatus('error');
            setErrorMessage('Failed to upload resume. Please try again.');
        } finally {
            setUploading(false);
        }
    };



    const resetForm = () => {
        setFile(null);
        setUploadStatus('idle');
        setErrorMessage('');
        setUploadedPdfUrl(null);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-indigo-600 mb-6">
                Upload Your Resume
            </h2>

            <p className="text-gray-600 mb-8">
                Upload your resume in PDF format to apply for positions.
                Make sure your resume is up to date and clearly highlights your skills and experience.
            </p>

            <div
                className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 transition-all duration-300 ${
                    isDragging
                        ? 'border-indigo-600 bg-indigo-50'
                        : file
                            ? 'border-green-500 bg-green-50'
                            : uploadStatus === 'error'
                                ? 'border-red-400 bg-red-50'
                                : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                {uploadStatus === 'success' ? (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <Check className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-green-700 mb-2">Resume Uploaded Successfully!</h3>
                        <p className="text-gray-600 mb-4">Your resume has been uploaded.</p>
                        {uploadedPdfUrl && (
                            <a
                                href={uploadedPdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:text-indigo-800 font-medium mb-4"
                            >
                                View Uploaded Resume
                            </a>
                        )}
                        <button
                            onClick={resetForm}
                            className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                            Upload Another Resume
                        </button>
                    </div>
                ) : uploadStatus === 'error' ? (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <AlertCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-red-700 mb-2">Upload Failed</h3>
                        <p className="text-gray-600 mb-4">{errorMessage}</p>
                        <button
                            onClick={resetForm}
                            className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                            Try Again
                        </button>
                    </div>
                ) : file ? (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                            <FileUp className="w-8 h-8 text-indigo-600"/>
                        </div>
                        <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                            {file.name}
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <input type="text" name="fullName" value={formData.fullName}
                                   onChange={handleInputChange} placeholder="Full Name"
                                   className="border border-gray-300 p-2 rounded"/>
                            <input type="text" name="title" value={formData.title} onChange={handleInputChange}
                                   placeholder="Title" className="border border-gray-300 p-2 rounded"/>
                            <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                                   placeholder="Email" className="border border-gray-300 p-2 rounded"/>
                            <input type="text" name="phone" value={formData.phone} onChange={handleInputChange}
                                   placeholder="Phone" className="border border-gray-300 p-2 rounded"/>
                            <input type="text" name="address" value={formData.address} onChange={handleInputChange}
                                   placeholder="Address" className="border border-gray-300 p-2 rounded"/>
                            <textarea name="summary" value={formData.summary} onChange={handleInputChange}
                                      placeholder="Summary" rows={3}
                                      className="border border-gray-300 p-2 rounded col-span-1 md:col-span-2"/>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                onClick={uploadFile}
                                disabled={uploading}
                                className={`bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg flex items-center gap-2 transition-colors ${
                                    uploading ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin"/>
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-5 h-5"/>
                                        Upload
                                    </>
                                )}
                            </button>

                            <button
                                onClick={resetForm}
                                disabled={uploading}
                                className="border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-2 px-6 rounded-lg"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>

                ) : (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                            <Upload className="w-8 h-8 text-indigo-600"/>
                        </div>
                        <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                            Drop your resume here
                        </h3>
                        <p className="text-gray-500 mb-6">
                            or click to browse files (PDF only)
                        </p>

                        <label
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg flex items-center gap-2 transition-colors cursor-pointer">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <Upload className="w-5 h-5"/>
                            Select Resume
                        </label>
                    </div>
                )}
            </div>

            <div className="text-sm text-gray-500">
                <p className="mb-2 font-medium">Upload Requirements:</p>
                <ul className="list-disc list-inside space-y-1">
                    <li>PDF format only</li>
                    <li>Maximum file size: 10MB</li>
                    <li>Clear, professional formatting</li>
                    <li>Up-to-date information</li>
                </ul>
            </div>
        </div>
    );
};

export default ResumeUploadSection;