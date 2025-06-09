import axios from 'axios';
import React, { useState } from 'react';
import { Phone, Mail, Download, User, Briefcase, GraduationCap, Award, Globe, Heart, Languages } from 'lucide-react';
import { useEffect } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import CVPreview from "../../components/CVPreview.tsx";
const languageLevels = [
  'Native',
  'Fluent',
  'Advanced',
  'Intermediate',
  'Basic'
];

interface CVData {
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    address: string;
    summary: string;
  };
  education: {
    title: string;
    type: 'diploma' | 'training';
    institution: string;
    startYear: string;
    endYear: string;
    description: string;
  }[];
  experience: {
    company: string;
    position: string;
    location: string;
    startYear: string;
    endYear: string;
    description: string;
  }[];
  skills: {
    name: string;
    level: number;
  }[];
  accreditations: {
    title: string;
    organization: string;
    year: string;
    description: string;
  }[];
  languages: {
    language: string;
    proficiency: string;
  }[];
  interests: string[];
  links: {
    title: string;
    url: string;
  }[];
}

 export function CVBuilder() {
   const [cvData, setCVData] = useState<CVData>({
    _id: "temp-id", // ou un uuid, ou vide
    createdBy: "current-user-id",
    personalInfo: {
      fullName: '',
      title: '',
      email: '',
      phone: '',
      address: '',
      summary: ''
    },
    education: [{
      title: '',
      type: 'diploma',
      institution: '',
      startYear: '',
      endYear: '',
      description: ''
    }],
    experience: [{
      company: '',
      position: '',
      location: '',
      startYear: '',
      endYear: '',
      description: ''
    }],
    skills: [{
      name: '',
      level: 3
    }],
    accreditations: [{
      title: '',
      organization: '',
      year: '',
      description: ''
    }],
    languages: [{
      language: '',
      proficiency: 'Intermediate'
    }],
    interests: [''],
    links: [{
      title: '',
      url: ''
    }]
  });

   const handleExportPDF = async () => {
     const element = document.getElementById('cv-content');
     if (!element) return;

     const canvas = await html2canvas(element);
     const imgData = canvas.toDataURL('image/png');

     const pdf = new jsPDF('p', 'mm', 'a4');
     const imgProps = pdf.getImageProperties(imgData);
     const pdfWidth = pdf.internal.pageSize.getWidth();
     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

     pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
     pdf.save('myresume.pdf');
   };

  const [resumeId, setResumeId] = useState<string | null>(null);
   useEffect(() => {
     const fetchResume = async () => {
       try {
         const token = localStorage.getItem('token');
         const res = await axios.get('http://localhost:5000/jobiai/api/resume/', {
           headers: {
             Authorization: `Bearer ${token}`
           }
         });

         if (res.data) {
           setCVData(res.data);
           setResumeId(res.data._id); // on garde l'id si on veut faire un PUT plus tard
         }
       } catch (err) {
         console.log("Aucun CV existant ou erreur :", err);
       }
     };

     fetchResume();
   }, []);



   const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCVData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [name]: value
      }
    }));
  };


   const handleSubmit = async () => {
     try {
       const token = localStorage.getItem('token');

       if (resumeId) {
         // Mise à jour
         const res = await axios.put(`http://localhost:5000/jobiai/api/resume/${resumeId}`, cvData, {
           headers: {
             Authorization: `Bearer ${token}`,
             'Content-Type': 'application/json'
           }
         });
         console.log('CV mis à jour avec succès:', res.data);
         alert('CV mis à jour avec succès !');
       } else {
         // Création
         const res = await axios.post('http://localhost:5000/jobiai/api/resume/add', cvData, {
           headers: {
             Authorization: `Bearer ${token}`,
             'Content-Type': 'application/json'
           }
         });
         console.log('CV soumis avec succès:', res.data);
         alert('CV soumis avec succès !');
         setResumeId(res.data._id); // Pour passer en mode "update" ensuite
       }

     } catch (error) {
       console.error("Erreur lors de l'envoi du CV:", error);
       alert("Erreur lors de l'envoi du CV");
     }
   };


   const addEducation = () => {
    setCVData(prev => ({
      ...prev,
      education: [...prev.education, {
        title: '',
        type: 'diploma',
        institution: '',
        startYear: '',
        endYear: '',
        description: ''
      }]
    }));
  };

  const addExperience = () => {
    setCVData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        company: '',
        position: '',
        location: '',
        startYear: '',
        endYear: '',
        description: ''
      }]
    }));
  };

  const addSkill = () => {
    setCVData(prev => ({
      ...prev,
      skills: [...prev.skills, { name: '', level: 3 }]
    }));
  };

  const addAccreditation = () => {
    setCVData(prev => ({
      ...prev,
      accreditations: [...prev.accreditations, {
        title: '',
        organization: '',
        year: '',
        description: ''
      }]
    }));
  };

  const addLanguage = () => {
    setCVData(prev => ({
      ...prev,
      languages: [...prev.languages, { language: '', proficiency: 'Intermediate' }]
    }));
  };

  const addInterest = () => {
    setCVData(prev => ({
      ...prev,
      interests: [...prev.interests, '']
    }));
  };

  const addLink = () => {
    setCVData(prev => ({
      ...prev,
      links: [...prev.links, { title: '', url: '' }]
    }));
  };

  return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">CV Builder</h1>
            <div className="flex gap-4">

              <button
                  onClick={handleExportPDF}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                <Download className="h-5 w-5 mr-2"/>
                Export CV
              </button>


              <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      onClick={handleSubmit}>
                Save CV
              </button>



            </div>

          </div>


          <div className="grid grid-cols-12 gap-8">
            {/* Form Section */}
            <div className="col-span-12 lg:col-span-6 space-y-6">
              {/* Personal Information */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2"/>
                  Personal Information
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        value={cvData.personalInfo.fullName}
                        onChange={handlePersonalInfoChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Professional Title</label>
                    <input
                        type="text"
                        name="title"
                        value={cvData.personalInfo.title}
                        onChange={handlePersonalInfoChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400"/>
                      </div>
                      <input
                          type="email"
                          name="email"
                          value={cvData.personalInfo.email}
                          onChange={handlePersonalInfoChange}
                          className="pl-10 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400"/>
                      </div>
                      <input
                          type="tel"
                          name="phone"
                          value={cvData.personalInfo.phone}
                          onChange={handlePersonalInfoChange}
                          className="pl-10 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                      type="text"
                      name="address"
                      value={cvData.personalInfo.address}
                      onChange={handlePersonalInfoChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Professional Summary</label>
                  <textarea
                      name="summary"
                      value={cvData.personalInfo.summary}
                      onChange={handlePersonalInfoChange}
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Education */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2"/>
                    Education & Training
                  </h2>
                  <button
                      onClick={addEducation}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
                  >
                    Add Education
                  </button>
                </div>
                {cvData.education.map((edu, index) => (
                    <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Title</label>
                          <input
                              type="text"
                              value={edu.title}
                              onChange={(e) => {
                                const newEducation = [...cvData.education];
                                newEducation[index].title = e.target.value;
                                setCVData({...cvData, education: newEducation});
                              }}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Type</label>
                          <select
                              value={edu.type}
                              onChange={(e) => {
                                const newEducation = [...cvData.education];
                                newEducation[index].type = e.target.value as 'diploma' | 'training';
                                setCVData({...cvData, education: newEducation});
                              }}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          >
                            <option value="diploma">Diploma</option>
                            <option value="training">Training</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Institution</label>
                          <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) => {
                                const newEducation = [...cvData.education];
                                newEducation[index].institution = e.target.value;
                                setCVData({...cvData, education: newEducation});
                              }}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Start Year</label>
                          <input
                              type="number"
                              value={edu.startYear}
                              onChange={(e) => {
                                const newEducation = [...cvData.education];
                                newEducation[index].startYear = e.target.value;
                                setCVData({...cvData, education: newEducation});
                              }}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">End Year</label>
                          <input
                              type="number"
                              value={edu.endYear}
                              onChange={(e) => {
                                const newEducation = [...cvData.education];
                                newEducation[index].endYear = e.target.value;
                                setCVData({...cvData, education: newEducation});
                              }}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            value={edu.description}
                            onChange={(e) => {
                              const newEducation = [...cvData.education];
                              newEducation[index].description = e.target.value;
                              setCVData({...cvData, education: newEducation});
                            }}
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                ))}
              </div>

              {/* Skills */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Award className="h-5 w-5 mr-2"/>
                    Skills
                  </h2>
                  <button
                      onClick={addSkill}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
                  >
                    Add Skill
                  </button>
                </div>
                {cvData.skills.map((skill, index) => (
                    <div key={index} className="mb-4 grid grid-cols-2 gap-4">
                      <div>
                        <input
                            type="text"
                            value={skill.name}
                            onChange={(e) => {
                              const newSkills = [...cvData.skills];
                              newSkills[index].name = e.target.value;
                              setCVData({...cvData, skills: newSkills});
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="Skill name"
                        />
                      </div>
                      <div>
                        <input
                            type="range"
                            min="1"
                            max="5"
                            value={skill.level}
                            onChange={(e) => {
                              const newSkills = [...cvData.skills];
                              newSkills[index].level = parseInt(e.target.value);
                              setCVData({...cvData, skills: newSkills});
                            }}
                            className="mt-1 block w-full"
                        />
                        <div className="text-sm text-gray-500 text-center">
                          Level: {skill.level} / 5
                        </div>
                      </div>
                    </div>
                ))}
              </div>

              {/* Accreditations */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Award className="h-5 w-5 mr-2"/>
                    Accreditations
                  </h2>
                  <button
                      onClick={addAccreditation}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
                  >
                    Add Accreditation
                  </button>
                </div>
                {cvData.accreditations.map((accred, index) => (
                    <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Title</label>
                          <input
                              type="text"
                              value={accred.title}
                              onChange={(e) => {
                                const newAccreditations = [...cvData.accreditations];
                                newAccreditations[index].title = e.target.value;
                                setCVData({...cvData, accreditations: newAccreditations});
                              }}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Organization</label>
                          <input
                              type="text"
                              value={accred.organization}
                              onChange={(e) => {
                                const newAccreditations = [...cvData.accreditations];
                                newAccreditations[index].organization = e.target.value;
                                setCVData({...cvData, accreditations: newAccreditations});
                              }}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Year</label>
                          <input
                              type="number"
                              value={accred.year}
                              onChange={(e) => {
                                const newAccreditations = [...cvData.accreditations];
                                newAccreditations[index].year = e.target.value;
                                setCVData({...cvData, accreditations: newAccreditations});
                              }}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            value={accred.description}
                            onChange={(e) => {
                              const newAccreditations = [...cvData.accreditations];
                              newAccreditations[index].description = e.target.value;
                              setCVData({...cvData, accreditations: newAccreditations});
                            }}
                            rows={2}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                ))}
              </div>

              {/* Work Experience */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Briefcase className="h-5 w-5 mr-2"/>
                    Work Experience
                  </h2>
                  <button
                      onClick={addExperience}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
                  >
                    Add Experience
                  </button>
                </div>
                {cvData.experience.map((exp, index) => (
                    <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Company</label>
                          <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => {
                                const newExperience = [...cvData.experience];
                                newExperience[index].company = e.target.value;
                                setCVData({...cvData, experience: newExperience});
                              }}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Position</label>
                          <input
                              type="text"
                              value={exp.position}
                              onChange={(e) => {
                                const newExperience = [...cvData.experience];
                                newExperience[index].position = e.target.value;
                                setCVData({...cvData, experience: newExperience});
                              }}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Start Year</label>
                          <input
                              type="number"
                              value={exp.startYear}
                              onChange={(e) => {
                                const newExperience = [...cvData.experience];
                                newExperience[index].startYear = e.target.value;
                                setCVData({...cvData, experience: newExperience});
                              }}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">End Year</label>
                          <input
                              type="number"
                              value={exp.endYear}
                              onChange={(e) => {
                                const newExperience = [...cvData.experience];
                                newExperience[index].endYear = e.target.value;
                                setCVData({...cvData, experience: newExperience});
                              }}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            value={exp.description}
                            onChange={(e) => {
                              const newExperience = [...cvData.experience];
                              newExperience[index].description = e.target.value;
                              setCVData({...cvData, experience: newExperience});
                            }}
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                ))}
              </div>

              {/* Languages */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Languages className="h-5 w-5 mr-2"/>
                    Languages
                  </h2>
                  <button
                      onClick={addLanguage}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
                  >
                    Add Language
                  </button>
                </div>
                {cvData.languages.map((lang, index) => (
                    <div key={index} className="mb-4 grid grid-cols-2 gap-4">
                      <div>
                        <input
                            type="text"
                            value={lang.language}
                            onChange={(e) => {
                              const newLanguages = [...cvData.languages];
                              newLanguages[index].language = e.target.value;
                              setCVData({...cvData, languages: newLanguages});
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="Language"
                        />
                      </div>
                      <div>
                        <select
                            value={lang.proficiency}
                            onChange={(e) => {
                              const newLanguages = [...cvData.languages];
                              newLanguages[index].proficiency = e.target.value;
                              setCVData({...cvData, languages: newLanguages});
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          {languageLevels.map((level) => (
                              <option key={level} value={level}>
                                {level}
                              </option>
                          ))}
                        </select>
                      </div>
                    </div>
                ))}
              </div>

              {/* Interests */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Heart className="h-5 w-5 mr-2"/>
                    Interests
                  </h2>
                  <button
                      onClick={addInterest}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
                  >
                    Add Interest
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {cvData.interests.map((interest, index) => (
                      <div key={index}>
                        <input
                            type="text"
                            value={interest}
                            onChange={(e) => {
                              const newInterests = [...cvData.interests];
                              newInterests[index] = e.target.value;
                              setCVData({...cvData, interests: newInterests});
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="Enter an interest"
                        />
                      </div>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Globe className="h-5 w-5 mr-2"/>
                    Links
                  </h2>
                  <button
                      onClick={addLink}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
                  >
                    Add Link
                  </button>
                </div>
                {cvData.links.map((link, index) => (
                    <div key={index} className="mb-4 grid grid-cols-2 gap-4">
                      <div>
                        <input
                            type="text"
                            value={link.title}
                            onChange={(e) => {
                              const newLinks = [...cvData.links];
                              newLinks[index].title = e.target.value;
                              setCVData({...cvData, links: newLinks});
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="Link Title"
                        />
                      </div>
                      <div>
                        <input
                            type="url"
                            value={link.url}
                            onChange={(e) => {
                              const newLinks = [...cvData.links];
                              newLinks[index].url = e.target.value;
                              setCVData({...cvData, links: newLinks});
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="URL"
                        />
                      </div>
                    </div>
                ))}
              </div>
            </div>
            {/* CV Preview Section */}
            <div className="col-span-6">
              <div
                  className="border border-gray-300 shadow-lg rounded-lg bg-white p-6 sticky top-6 max-h-screen overflow-y-auto">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">CV preview</h2>
                <CVPreview data={cvData}/>
              </div>
            </div>

          </div>
        </div>
      </div>
  );
 }

