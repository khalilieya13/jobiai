import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Clock } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { Quiz, CandidateResponse } from '../../types';

interface QuizTakerProps {
    quiz: Quiz;
    candidateId: string;
    onComplete: (score:number,timeTaken:number) => void;
}

const QuizTaker: React.FC<QuizTakerProps> = ({ quiz, candidateId, onComplete }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState<CandidateResponse>({
        quizId: quiz.id,
        candidateId,
        jobPostId: quiz.jobPostId,
        startedAt: new Date().toISOString(),
        answers: [],
    });
    const [timeRemaining, setTimeRemaining] = useState(quiz.duration * 60);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentQuestion = quiz.questions[currentQuestionIndex];

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining(prevTime => {
                if (prevTime <= 0) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const handleAnswerChange = (answer: string | string[]) => {
        const existingAnswerIndex = responses.answers.findIndex(
            a => a.questionId === currentQuestion.id
        );

        const updatedAnswers = [...responses.answers];

        if (existingAnswerIndex >= 0) {
            updatedAnswers[existingAnswerIndex].answer = answer;
        } else {
            updatedAnswers.push({
                questionId: currentQuestion.id,
                answer,
            });
        }

        setResponses(prev => ({
            ...prev,
            answers: updatedAnswers,
        }));
    };

    const getCurrentAnswer = () => {
        const answer = responses.answers.find(a => a.questionId === currentQuestion.id);
        return answer ? answer.answer : '';
    };

    const handleSubmit = () => {
        setIsSubmitting(true);

        let score = 0;
        let total=0;

        responses.answers.forEach((answerObj) => {
            const question = quiz.questions.find(q => q.id === answerObj.questionId);

            if (!question) return;

            const correctAnswer = question.correctAnswer;
            const candidateAnswer = answerObj.answer;

            if (question.type === 'multiple-choice' || question.type === 'true-false') {
                if (candidateAnswer === correctAnswer?.toString()) {
                    score += question.points;
                }
                total+=question.points;
            }
        });

        const totalTimeTaken = quiz.duration * 60 - timeRemaining;
        score=(score/total)*100;
        onComplete(score,totalTimeTaken);
    };


    return (
        <div className="space-y-6">
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">{quiz.title}</h2>
                    <div className="flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">{formatTime(timeRemaining)}</span>
                    </div>
                </div>
                <p className="text-gray-600 mb-4">{quiz.description}</p>
                <div className="flex justify-between text-sm text-gray-500">
                    <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
                    <span>{currentQuestion.points} point{currentQuestion.points > 1 ? 's' : ''}</span>
                </div>
            </Card>

            <Card>
                <h3 className="text-lg font-medium mb-6">{currentQuestion.text}</h3>

                {currentQuestion.type === 'multiple-choice' && (
                    <div className="space-y-3">
                        {currentQuestion.options?.map((option, idx) => (
                            <div key={idx} className="flex items-center">
                                <input
                                    type="radio"
                                    id={`option-${idx}`}
                                    name={`question-${currentQuestion.id}`}
                                    value={option}
                                    checked={getCurrentAnswer() === option}
                                    onChange={() => handleAnswerChange(option)}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                />
                                <label htmlFor={`option-${idx}`} className="ml-3 block text-gray-700">
                                    {option}
                                </label>
                            </div>
                        ))}
                    </div>
                )}

                {currentQuestion.type === 'true-false' && (
                    <div className="space-y-3">
                        {['true', 'false'].map((option) => (
                            <div key={option} className="flex items-center">
                                <input
                                    type="radio"
                                    id={`option-${option}`}
                                    name={`question-${currentQuestion.id}`}
                                    value={option}
                                    checked={getCurrentAnswer() === option}
                                    onChange={() => handleAnswerChange(option)}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                />
                                <label htmlFor={`option-${option}`} className="ml-3 block text-gray-700 capitalize">
                                    {option}
                                </label>
                            </div>
                        ))}
                    </div>
                )}

                {currentQuestion.type === 'short-answer' && (
                    <textarea
                        value={getCurrentAnswer() as string}
                        onChange={(e) => handleAnswerChange(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        rows={6}
                        placeholder="Type your answer here..."
                    />
                )}
            </Card>

            <div className="flex justify-between items-center">
                <Button
                    variant="outline"
                    onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                    disabled={currentQuestionIndex === 0}
                    leftIcon={<ChevronLeft className="h-5 w-5" />}
                >
                    Previous
                </Button>

                {currentQuestionIndex < quiz.questions.length - 1 ? (
                    <Button
                        onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                        rightIcon={<ChevronRight className="h-5 w-5" />}
                    >
                        Next
                    </Button>
                ) : (
                    <Button
                        onClick={handleSubmit}
                        isLoading={isSubmitting}
                    >
                        Submit
                    </Button>
                )}
            </div>
        </div>
    );
};

export default QuizTaker;