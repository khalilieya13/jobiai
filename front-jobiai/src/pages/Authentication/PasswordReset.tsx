import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/jobiai/api';

export function PasswordReset() {
    const [step, setStep] = useState<'request' | 'verify' | 'change'>('request');
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRequestCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post(`${API_URL}/request-password-reset`, { email });
            alert('Verification code sent to your email');
            setStep('verify');
        } catch (error) {
            alert('Failed to send verification code');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post(`${API_URL}/verify-reset-code`, { email, code: verificationCode });
            alert('Code verified successfully');
            setStep('change');
        } catch (error) {
            alert('Invalid verification code');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            await axios.post(`${API_URL}/reset-password`, {
                email,
                code: verificationCode,
                newPassword
            });
            alert('Password changed successfully');
            navigate('/profile');
        } catch (error) {
            alert('Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-md mx-auto">
                <button
                    onClick={() => navigate('/profile')}
                    className="text-indigo-600 hover:text-indigo-500 mb-6"
                >
                    ← Back to Profile
                </button>

                <div className="bg-indigo-600 text-white p-6 rounded-lg mb-6">
                    <h1 className="text-2xl font-bold">
                        {step === 'request' && 'Request Verification Code'}
                        {step === 'verify' && 'Verify Code'}
                        {step === 'change' && 'Set New Password'}
                    </h1>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    {step === 'request' && (
                        <form onSubmit={handleRequestCode} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-500 disabled:opacity-50"
                            >
                                {loading ? 'Sending...' : 'Send Verification Code'}
                            </button>
                        </form>
                    )}

                    {step === 'verify' && (
                        <form onSubmit={handleVerifyCode} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Verification Code</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                />
                                <p className="mt-2 text-sm text-gray-500">
                                    We've sent a code to {email}
                                </p>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-500 disabled:opacity-50"
                            >
                                {loading ? 'Verifying...' : 'Verify Code'}
                            </button>
                        </form>
                    )}

                    {step === 'change' && (
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        minLength={6}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2"
                                    >
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    minLength={6}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-500 disabled:opacity-50"
                            >
                                {loading ? 'Changing...' : 'Change Password'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}