import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuizCreator from '../../components/recruiter/QuizCreator';
import { Quiz } from '../../types';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

export function TestCreation() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [existingQuiz, setExistingQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuiz = async () => {
            if (!jobId) return;

            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5000/jobiai/api/quiz/job/${jobId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data && response.data.length > 0) {
                    const quiz = response.data[0];
                    setExistingQuiz(quiz);
                }
            } catch (error: any) {
                console.error('Error loading quiz:', error);
                if (error.response?.status !== 404) {
                    setError('Failed to load quiz data');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [jobId]);

    const handleDeleteQuiz = async () => {
        if (!existingQuiz?._id) return;

        if (window.confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/jobiai/api/quiz/${existingQuiz._id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                alert('Quiz deleted successfully!');
                navigate(`/job/${jobId}`);
            } catch (error: any) {
                console.error('Error deleting quiz:', error);
                alert('Failed to delete quiz. Please try again.');
            }
        }
    };

    const handleSaveQuiz = async (quiz: Quiz) => {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            const quizToSave = {
                ...quiz,
                jobPostId: jobId
            };

            let response;
            if (existingQuiz?._id) {
                response = await axios.put(
                    `http://localhost:5000/jobiai/api/quiz/${existingQuiz._id}`,
                    quizToSave,
                    { headers }
                );
                console.log('Quiz updated successfully:', response.data);
                alert('Quiz updated successfully!');
            } else {
                response = await axios.post(
                    'http://localhost:5000/jobiai/api/quiz/add',
                    quizToSave,
                    { headers }
                );
                console.log('Quiz created successfully:', response.data);
                alert('Quiz created successfully!');
            }

            navigate(`/job/${jobId}`);
        } catch (error: any) {
            console.error('Error saving quiz:', error.response?.data || error.message);
            alert(existingQuiz ? 'Error updating quiz.' : 'Error creating quiz.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {existingQuiz ? 'Edit Quiz' : 'Create New Quiz'}
                    </h1>
                    {existingQuiz && (
                        <button
                            onClick={handleDeleteQuiz}
                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                            <Trash2 size={16} />
                            Delete Quiz
                        </button>
                    )}
                </div>
                <QuizCreator
                    jobPostId={jobId || ''}
                    onSave={handleSaveQuiz}
                    initialQuiz={existingQuiz}
                />
            </main>
        </div>
    );
}