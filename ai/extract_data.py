from pymongo import MongoClient
import pandas as pd
from datetime import datetime


MONGO_URI = "mongodb+srv://eya:Bellahadid%400@cluster0.5wacl.mongodb.net/jobiai?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URI)
db = client['jobiai']  
resumes_collection = db['resumes']  # nom de ta collection



def experience_level(total_years):
    if total_years < 2:
        return "Entry Level"
    elif total_years < 5:
        return "Mid Level"
    elif total_years < 10:
        return "Senior Level"
    else:
        return "Executive"

def compute_experience_years(experiences):
    total = 0
    current_year = datetime.now().year
    for exp in experiences:
        try:
            start = int(exp.get('startYear', current_year))
            end = exp.get('endYear', current_year)
            # Parfois endYear peut être "Present" ou vide, on met current_year
            if isinstance(end, str) and not end.isdigit():
                end = current_year
            else:
                end = int(end)
            diff = max(0, end - start)
            total += diff
        except Exception:
            continue
    return total

resumes = list(resumes_collection.find())

processed_resumes = []

for resume in resumes:
    _id = resume.get('_id')
    personal_info = resume.get('personalInfo', {})
    title = personal_info.get('title', '')
    address = personal_info.get('address', '')

    # Education : on veut juste la liste des titres (ex: Bachelor, Master)
    education_list = resume.get('education', [])
    education_titles = [edu.get('title', '') for edu in education_list]

    # Skills : juste noms sans niveau
    skills_list = resume.get('skills', [])
    skill_names = [skill.get('name', '') for skill in skills_list]

    # Languages : juste noms (language)
    languages_list = resume.get('languages', [])
    language_names = [lang.get('language', '') for lang in languages_list]

    # Expérience : calculer le total d'années et convertir en level
    experience_list = resume.get('experience', [])
    total_years_exp = compute_experience_years(experience_list)
    exp_level = experience_level(total_years_exp)

    # Construire le texte final
    text_data = f"""Titre: {title}
Adresse: {address}
Niveau d'expérience: {exp_level}
Éducation: {', '.join(education_titles)}
Compétences: {', '.join(skill_names)}
Langues: {', '.join(language_names)}
"""

    processed_resumes.append({
        "id": str(_id),
        "text": text_data
    })

# Affichage pour vérification
for item in processed_resumes:
    print("ID:", item["id"])
    print(item["text"])
    print("-" * 40)

    db = client['jobiai']

jobs_collection = db['jobs']  # ou 'Jobs' selon nom exact de ta collection

jobs = list(jobs_collection.find({"status": "Active"}))  # filtre sur les jobs actifs par exemple

processed_jobs = []

for job in jobs:
    _id = job.get('_id')
    job_title = job.get('jobTitle', '')
    location = job.get('location', '')
    experience_level = job.get('experienceLevel', '')
    required_skills = job.get('requiredSkills', [])
    job_description = job.get('jobDescription', '')

    # Convertir requiredSkills en string séparée par virgules si liste
    if isinstance(required_skills, list):
        skills_text = ', '.join(required_skills)
    else:
        skills_text = str(required_skills)

    # Construire le texte à afficher / traiter
    text_data = f"""Titre du poste: {job_title}
Lieu: {location}
Niveau d'expérience: {experience_level}
Compétences requises: {skills_text}
Description du poste: {job_description}
"""

    processed_jobs.append({
        "id": str(_id),
        "text": text_data
    })

# Affichage pour vérification
for item in processed_jobs:
    print("ID:", item["id"])
    print(item["text"])
    print("-" * 50)

    from sentence_transformers import SentenceTransformer
import numpy as np

# Charge un modèle léger et rapide
model = SentenceTransformer('all-MiniLM-L6-v2')

# Exemple avec les textes des CV
resume_texts = [item['text'] for item in processed_resumes]
resume_ids = [item['id'] for item in processed_resumes]

# Générer les embeddings
resume_embeddings = model.encode(resume_texts, convert_to_numpy=True)

# Associer chaque id à son embedding
vectorized_resumes = [
    {"id": resume_ids[i], "embedding": resume_embeddings[i]}
    for i in range(len(resume_ids))
]

job_texts = [job["text"] for job in processed_jobs]
job_ids = [job["id"] for job in processed_jobs]

# Embeddings des jobs
job_embeddings = model.encode(job_texts, convert_to_numpy=True)

vectorized_jobs = [
    {"id": job_ids[i], "embedding": job_embeddings[i]}
    for i in range(len(job_ids))
]

from sklearn.metrics.pairwise import cosine_similarity

def recommend_resumes_for_job(job_embedding, vectorized_resumes, top_k=5):
    similarities = cosine_similarity(
        [job_embedding],
        [res["embedding"] for res in vectorized_resumes]
    )[0]

    ranked_indices = similarities.argsort()[::-1]

    recommendations = [
        {
            "resume_id": vectorized_resumes[i]["id"],
            "score": float(similarities[i])
        }
        for i in ranked_indices[:top_k]
    ]

    return recommendations
# Choisir un job pour lequel faire la recommandation
selected_job = vectorized_jobs[0]

# Obtenir les meilleurs CVs pour ce job
recommended_resumes = recommend_resumes_for_job(selected_job["embedding"], vectorized_resumes)

# Affichage
for rec in recommended_resumes:
    print(f"CV ID: {rec['resume_id']} - Score: {rec['score'] * 100:.2f}%")


from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# On suppose que tu as :
# - processed_resumes : liste de dicts {id, text}
# - vectorized_jobs : liste de dicts {id, embedding}

# Embeddings des jobs (déjà faits)
job_embeddings = np.array([job["embedding"] for job in vectorized_jobs])
job_ids = [job["id"] for job in vectorized_jobs]

# Pour chaque CV :
for resume in processed_resumes:
    resume_id = resume["id"]
    resume_text = resume["text"]

    # Embedding du CV
    resume_embedding = model.encode(resume_text, convert_to_numpy=True)

    # Calcul des similarités entre ce CV et tous les jobs
    similarities = cosine_similarity(
        resume_embedding.reshape(1, -1),  # shape (1, 384)
        job_embeddings  # shape (n_jobs, 384)
    )[0]

    # On trie les jobs par score décroissant
    top_indices = similarities.argsort()[::-1]

    print(f"🧠 Jobs recommandés pour le CV ID: {resume_id}")
    for i in top_indices[:5]:  # Top 5 recommandations
        job_id = job_ids[i]
        score = similarities[i] * 100
        print(f"  ➤ Job ID: {job_id} - Score: {score:.2f}%")
    print("-" * 50)


recommendations_jobs_to_resumes = {}

for job in vectorized_jobs:
    job_id = job["id"]
    job_embedding = job["embedding"]

    recommended_resumes = recommend_resumes_for_job(job_embedding, vectorized_resumes, top_k=5)

    recommendations_jobs_to_resumes[job_id] = [
        {"resumeId": rec["resume_id"], "score": rec["score"]} for rec in recommended_resumes
    ]


recommendations_resumes_to_jobs = {}

job_embeddings = np.array([job["embedding"] for job in vectorized_jobs])
job_ids = [job["id"] for job in vectorized_jobs]

for resume in processed_resumes:
    resume_id = resume["id"]
    resume_embedding = model.encode(resume["text"], convert_to_numpy=True)

    similarities = cosine_similarity(
        resume_embedding.reshape(1, -1),
        job_embeddings
    )[0]

    top_indices = similarities.argsort()[::-1][:5]

    recommendations_resumes_to_jobs[resume_id] = [
        {"jobId": job_ids[i], "score": float(similarities[i])} for i in top_indices
    ]


from bson import ObjectId

for job_id, recs in recommendations_jobs_to_resumes.items():
    jobs_collection.update_one(
        {"_id": ObjectId(job_id)},
        {"$set": {"recommendations.resumes": recs}}
    )

for resume_id, recs in recommendations_resumes_to_jobs.items():
    resumes_collection.update_one(
        {"_id": ObjectId(resume_id)},
        {"$set": {"recommendations.jobs": recs}}
    )

print("✅ Recommandations générées et enregistrées.")
