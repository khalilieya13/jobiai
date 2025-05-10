
import QuizCreator from '../../components/recruiter/QuizCreator';
import { Quiz } from '../../types';
import axios from 'axios';
import { useParams } from "react-router-dom";

export function TestCreation() {
    const { jobId } = useParams();

    const handleSaveQuiz = async (quiz: Quiz) => {
        try {
            console.log('📤 Données envoyées au backend:', quiz);
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/jobiai/api/quiz/add', quiz, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log('✅ Quiz créé avec succès:', response.data);
            alert('Quiz créé avec succès !');
            // Tu peux aussi faire une redirection ici si tu veux, par exemple :
            // navigate('/recruiter/dashboard');
        } catch (error: any) {
            console.error('❌ Erreur lors de la création du quiz:', error.response?.data || error.message);
            alert('Erreur lors de la création du quiz.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">


            <main>
                <QuizCreator
                    jobPostId={jobId || ''}
                    onSave={handleSaveQuiz}
                />
            </main>


        </div>
    );
}
