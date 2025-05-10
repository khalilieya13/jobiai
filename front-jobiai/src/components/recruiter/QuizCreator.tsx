import React, { useState } from 'react';
import { PlusCircle, Save } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import Button from '../ui/Button';
import Card from '../ui/Card';
import QuestionForm from './QuestionForm';
import { Quiz, Question } from '../../types';

interface QuizCreatorProps {
    jobPostId: string;
    onSave: (quiz: Quiz) => void;
}

const QuizCreator: React.FC<QuizCreatorProps> = ({ jobPostId, onSave }) => {
    const [quiz, setQuiz] = useState<Quiz>({
        id: uuidv4(),
        title: '',
        description: '',
        jobPostId,
        duration: 30,
        questions: [],
        createdAt: new Date().toISOString(),
        createdBy: 'current-user',
    });

    const addQuestion = () => {
        const newQuestion: Question = {
            id: uuidv4(),
            text: '',
            type: 'multiple-choice',
            options: ['', ''],
            correctAnswer: '',
            points: 1,
        };

        setQuiz(prev => ({
            ...prev,
            questions: [...prev.questions, newQuestion]
        }));
    };

    const updateQuestion = (index: number, updatedQuestion: Question) => {
        const updatedQuestions = [...quiz.questions];
        updatedQuestions[index] = updatedQuestion;

        setQuiz(prev => ({
            ...prev,
            questions: updatedQuestions
        }));
    };

    const removeQuestion = (index: number) => {
        const updatedQuestions = [...quiz.questions];
        updatedQuestions.splice(index, 1);

        setQuiz(prev => ({
            ...prev,
            questions: updatedQuestions
        }));
    };

    const handleQuizDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setQuiz(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveQuiz = () => {
        onSave(quiz);
    };

    return (
        <div className="space-y-6">
            <Card>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Assessment Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={quiz.title}
                            onChange={handleQuizDetailsChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="e.g., Frontend Developer Skills Assessment"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={quiz.description}
                            onChange={handleQuizDetailsChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            rows={3}
                            placeholder="Brief description of what skills will be tested"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Time Limit (minutes)
                        </label>
                        <input
                            type="number"
                            name="duration"
                            value={quiz.duration}
                            onChange={handleQuizDetailsChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            min="5"
                        />
                    </div>
                </div>
            </Card>

            <div className="space-y-6">
                {quiz.questions.map((question, index) => (
                    <QuestionForm
                        key={question.id}
                        question={question}
                        onUpdate={(updatedQuestion) => updateQuestion(index, updatedQuestion)}
                        onDelete={() => removeQuestion(index)}
                        index={index}
                    />
                ))}

                <div className="flex justify-center">
                    <Button
                        variant="outline"
                        onClick={addQuestion}
                        leftIcon={<PlusCircle className="h-5 w-5" />}
                    >
                        Add Question
                    </Button>
                </div>
            </div>

            <div className="flex justify-end">
                <Button
                    onClick={handleSaveQuiz}
                    leftIcon={<Save className="h-5 w-5" />}
                    disabled={!quiz.title || !quiz.description || quiz.questions.length === 0}
                >
                    Save Assessment
                </Button>
            </div>
        </div>
    );
};

export default QuizCreator;