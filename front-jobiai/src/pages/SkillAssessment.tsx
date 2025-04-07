import  { useState } from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

const assessments = [
  {
    id: 1,
    title: 'JavaScript Fundamentals',
    description: 'Test your knowledge of JavaScript basics, including variables, functions, and control flow.',
    duration: '45 minutes',
    questions: 30,
    difficulty: 'Intermediate'
  },
  {
    id: 2,
    title: 'React Development',
    description: 'Assess your React skills, including components, hooks, and state management.',
    duration: '60 minutes',
    questions: 35,
    difficulty: 'Advanced'
  },
  {
    id: 3,
    title: 'CSS & Responsive Design',
    description: 'Evaluate your CSS skills and understanding of responsive web design principles.',
    duration: '40 minutes',
    questions: 25,
    difficulty: 'Intermediate'
  }
];

export function SkillAssessment() {
  const [selectedTest, setSelectedTest] = useState<number | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Skill Assessments</h1>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            
            <AlertCircle className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Available</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>
      </div>

      {/* Available Assessments */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-6">Available Assessments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments.map((assessment) => (
            <div
              key={assessment.id}
              className={`border rounded-lg p-6 cursor-pointer transition-all ${
                selectedTest === assessment.id
                  ? 'border-indigo-500 ring-2 ring-indigo-200'
                  : 'border-gray-200 hover:border-indigo-500'
              }`}
              onClick={() => setSelectedTest(assessment.id)}
            >
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {assessment.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4">{assessment.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {assessment.duration}
                </div>
                <div>{assessment.questions} questions</div>
              </div>
              <div className="mt-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {assessment.difficulty}
                </span>
              </div>
              {selectedTest === assessment.id && (
                <button className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
                  Start Assessment
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Completed Assessments */}
      <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-6">Completed Assessments</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assessment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Certificate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                {
                  name: 'Python Programming',
                  score: '92%',
                  percentile: '95th',
                  date: '2024-03-10',
                },
                {
                  name: 'Data Structures',
                  score: '88%',
                  percentile: '85th',
                  date: '2024-03-05',
                },
              ].map((assessment, i) => (
                <tr key={i}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {assessment.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{assessment.score}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{assessment.percentile}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{assessment.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-indigo-600 hover:text-indigo-900">
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}