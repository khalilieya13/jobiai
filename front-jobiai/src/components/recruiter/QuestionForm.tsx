import React, { useState, useEffect } from 'react';
import { PlusCircle, MinusCircle, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import { Question } from '../../types';

interface QuestionFormProps {
    question: Question;
    onUpdate: (updatedQuestion: Question) => void;
    onDelete: () => void;
    index: number;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
                                                       question,
                                                       onUpdate,
                                                       onDelete,
                                                       index
                                                   }) => {
    const [localQuestion, setLocalQuestion] = useState<Question>(question);

    useEffect(() => {
        setLocalQuestion(question);
    }, [question]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const updatedQuestion = { ...localQuestion, [name]: value };
        setLocalQuestion(updatedQuestion);
        onUpdate(updatedQuestion);
    };

    const handleOptionChange = (index: number, value: string) => {
        const updatedOptions = [...(localQuestion.options || [])];
        updatedOptions[index] = value;

        const updatedQuestion = { ...localQuestion, options: updatedOptions };
        setLocalQuestion(updatedQuestion);
        onUpdate(updatedQuestion);
    };

    const addOption = () => {
        const updatedOptions = [...(localQuestion.options || []), ''];
        const updatedQuestion = { ...localQuestion, options: updatedOptions };
        setLocalQuestion(updatedQuestion);
        onUpdate(updatedQuestion);
    };

    const removeOption = (index: number) => {
        const updatedOptions = [...(localQuestion.options || [])];
        updatedOptions.splice(index, 1);

        const updatedQuestion = { ...localQuestion, options: updatedOptions };
        setLocalQuestion(updatedQuestion);
        onUpdate(updatedQuestion);
    };

    return (
        <div className="border border-gray-200 rounded-lg p-6 mb-6 bg-white">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Question {index + 1}</h3>
                <Button
                    variant="ghost"
                    onClick={onDelete}
                    leftIcon={<Trash2 className="h-4 w-4 text-red-500" />}
                    className="text-red-500 hover:bg-red-50"
                    size="sm"
                >
                    Remove
                </Button>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question Text
                </label>
                <textarea
                    name="text"
                    value={localQuestion.text || ''}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    rows={2}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Question Type
                    </label>
                    <select
                        name="type"
                        value={localQuestion.type || 'multiple-choice'}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="true-false">True/False</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Points
                    </label>
                    <input
                        type="number"
                        name="points"
                        value={localQuestion.points || 1}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        min="1"
                    />
                </div>
            </div>

            {localQuestion.type === 'multiple-choice' && (
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Answer Options
                        </label>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={addOption}
                            leftIcon={<PlusCircle className="h-4 w-4" />}
                        >
                            Add Option
                        </Button>
                    </div>

                    {(localQuestion.options || []).map((option, idx) => (
                        <div key={idx} className="flex items-center mb-2">
                            <input
                                type="text"
                                value={option || ''}
                                onChange={(e) => handleOptionChange(idx, e.target.value)}
                                className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder={`Option ${idx + 1}`}
                            />
                            <Button
                                variant="ghost"
                                onClick={() => removeOption(idx)}
                                className="ml-2"
                                size="sm"
                                leftIcon={<MinusCircle className="h-4 w-4 text-red-500" />}
                            />
                        </div>
                    ))}
                </div>
            )}

            {(localQuestion.type === 'multiple-choice' || localQuestion.type === 'true-false') && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Correct Answer
                    </label>
                    {localQuestion.type === 'true-false' ? (
                        <select
                            name="correctAnswer"
                            value={localQuestion.correctAnswer || ''}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Select correct answer</option>
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </select>
                    ) : (
                        <select
                            name="correctAnswer"
                            value={localQuestion.correctAnswer || ''}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Select correct answer</option>
                            {(localQuestion.options || []).map((option, idx) => (
                                <option key={idx} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            )}
        </div>
    );
};

export default QuestionForm;