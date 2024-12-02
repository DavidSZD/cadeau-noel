from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

CABLYAI_API_KEY = os.getenv('CABLYAI_API_KEY', 'sk-k6PQtW96nnzFY1pKzBwsIaYkCVxJRDUspeP0Jh9cqi1iym_9')
CABLYAI_API_URL = "https://cablyai.com/v1/chat/completions"

@app.route('/api/generate-gifts', methods=['POST'])
def generate_gifts():
    try:
        data = request.json
        relation = data.get('relation', '')
        age = data.get('age', '')
        interests = data.get('interests', '')
        budget = data.get('budget', '')
        previous_suggestions = data.get('previousSuggestions', [])

        previous_suggestions_text = ""
        if previous_suggestions:
            previous_suggestions_text = f"""
            Voici les suggestions déjà faites (à ne pas répéter) :
            {', '.join(previous_suggestions)}
            """

        prompt = f"""En tant qu'expert en cadeaux de Noël, suggère 4 idées de cadeaux DIFFÉRENTES des précédentes pour une personne avec les caractéristiques suivantes :
        - Relation : {relation}
        - Âge : {age} ans
        - Centres d'intérêt : {interests}
        - Budget : {budget}

        {previous_suggestions_text}

        Pour chaque cadeau, fournis :
        1. Le nom du cadeau
        2. Une brève description
        3. Le prix estimé
        4. Où l'acheter
        
        Format de réponse souhaité pour chaque cadeau :
        {{
            "name": "Nom du cadeau",
            "description": "Description",
            "price": "Prix estimé",
            "where": "Où l'acheter"
        }}
        
        Réponds uniquement avec un tableau JSON de suggestions."""

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {CABLYAI_API_KEY}"
        }

        payload = {
            "model": "gpt-4o",
            "messages": [{"role": "user", "content": prompt}],
            "response_format": {"type": "json_object"}
        }

        response = requests.post(CABLYAI_API_URL, headers=headers, json=payload)
        response.raise_for_status()
        
        suggestions = response.json()
        return jsonify(suggestions)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
