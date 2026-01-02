const axios = require("axios");

const OLLAMA_URL = "http://localhost:11434/api/generate";

async function analyzeCodeWithAI(code) {
const prompt = `
Tu es un expert en cybersécurité et revue de code.

Analyse le code ci-dessous et renvoie la réponse **strictement au format JSON** avec ces champs :
{
  "issues": [
    {"type": "XSS", "line": 12, "comment": "..."},
    {"type": "SQLi", "line": 7, "comment": "..."}
  ],
  "bestPractices": [
    "Valider toutes les entrées",
    "Gérer correctement les erreurs"
  ],
  "suggestions": [
    "Utiliser des requêtes préparées",
    "Sanitizer les inputs"
  ]
}

Code à analyser :
${code}
`;

  const response = await axios.post(OLLAMA_URL, {
    model: "deepseek-coder",
    prompt,
    stream: false
  });

  return {
    raw: response.data.response
  };
}

module.exports = { analyzeCodeWithAI };
