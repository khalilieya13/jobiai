import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import QuizTaker from '../../components/candidate/QuizTaker';
import { Quiz } from '../../types';
import {jwtDecode} from "jwt-decode";


export function TestResponse() {
    const { jobPostId } = useParams(); // Si tu passes le jobPostId dans l'URL
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const navigate = useNavigate(); // For navigation after success
    interface DecodedToken {
        id: string;
        // Ajoute d'autres champs si nécessaires (email, role, etc.)
    }

    let candidateId = '';

    const token = localStorage.getItem('token');
    if (token) {
        const decoded = jwtDecode<DecodedToken>(token);
        candidateId = decoded.id;
    }


    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/jobiai/api/quiz/job/${jobPostId}`);
                const quizData = res.data;

                if (!quizData || !Array.isArray(quizData) || quizData.length === 0) {
                    console.error("Aucun quiz trouvé pour ce jobPostId", quizData);
                    setQuiz(null);
                    return;
                }

                const quiz = quizData[0]; // Prendre le premier quiz dans le tableau

                const formattedQuiz: Quiz = {
                    id: quiz._id, // Utilise _id dans la réponse de l'API
                    title: quiz.title,
                    description: quiz.description,
                    jobPostId: quiz.jobPostId,
                    duration: quiz.duration,
                    createdAt: quiz.createdAt,
                    createdBy: quiz.createdBy,
                    questions: quiz.questions ? quiz.questions.map((q: any, index: number) => ({
                        id: q.id || `q-${index}`,
                        text: q.text,
                        type: q.type,
                        points: q.points,
                        options: q.options,
                        correctAnswer: q.correctAnswer
                    })) : []
                };

                setQuiz(formattedQuiz);
            } catch (error) {
                console.error('Erreur lors du chargement du quiz :', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [jobPostId]);

    const handleQuizComplete = async (score: number, timeTaken: number) => {
        try {
            const token = localStorage.getItem('token');

            if (!quiz) {
                alert("Quiz non chargé");
                return;
            }

            await axios.post(
                `http://localhost:5000/jobiai/api/quiz/quiz-response/${quiz.id}`,
                {
                    candidateId,
                    score,
                    timeTaken,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Then apply to the job
            await axios.post(
                `http://localhost:5000/jobiai/api/candidacy/apply`,
                { jobPost: quiz.jobPostId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSuccessMessage('Réponses envoyées et candidature enregistrée !');
            setTimeout(() => navigate('/candidate/dashboard'), 2000);
        } catch (error) {
            console.error(error);
            alert("Une erreur est survenue pendant la soumission.");
        }
    };


    if (loading) return <p>Chargement du test...</p>;
    if (!quiz) return <p>Aucun quiz trouvé.</p>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <main className="flex-grow">
                {/* Show success message */}
                {successMessage && (
                    <div className="bg-green-100 text-green-800 p-4 rounded-md mb-6">
                        <span>{successMessage}</span>
                    </div>
                )}
                <QuizTaker quiz={quiz} onComplete={handleQuizComplete} candidateId={candidateId} />
            </main>
        </div>
    );
}
