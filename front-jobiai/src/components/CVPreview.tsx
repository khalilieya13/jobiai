import React from 'react';
import { ResumeCandidate } from '../types'; // adapte le chemin si nécessaire

interface Props {
    data: ResumeCandidate;
}

const CVPreview: React.FC<Props> = ({ data }) => {
    return (
        <div id="cv-content" style={{
            width: '210mm',
            padding: '20mm',
            margin: 'auto',
            background: '#fff',
            fontFamily: 'Arial, sans-serif'
        }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h1>{data.personalInfo.fullName}</h1>
                <p>{data.personalInfo.title} | {data.personalInfo.email} | {data.personalInfo.phone} | {data.personalInfo.address}</p>
                <p>{data.personalInfo.summary}</p>
            </div>

            <section>
                <h2>Education</h2>
                <ul>
                    {data.education.map((edu, i) => (
                        <li key={i}>
                            <strong>{edu.title}</strong> ({edu.startYear} - {edu.endYear})<br />
                            <em>{edu.institution}</em><br />
                            {edu.description}
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h2>Experience</h2>
                <ul>
                    {data.experience.map((exp, i) => (
                        <li key={i}>
                            <strong>{exp.company} - {exp.position} ({exp.startYear} - {exp.endYear})</strong><br />
                            <em>{exp.location}</em><br />
                            {exp.description}
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h2>Skills</h2>
                <ul>
                    {data.skills.map((skill, i) => (
                        <li key={i}>{skill.name} - Level: {skill.level}</li>
                    ))}
                </ul>
            </section>

            <section>
                <h2>Languages</h2>
                <ul>
                    {data.languages.map((lang, i) => (
                        <li key={i}>{lang.language} - {lang.proficiency}</li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default CVPreview;
