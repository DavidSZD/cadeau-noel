import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, CssBaseline, Box } from '@mui/material';
import GiftForm from './components/GiftForm';
import GiftResults from './components/GiftResults';

const theme = createTheme({
  palette: {
    primary: {
      main: '#c41e3a', // Rouge de Noël
    },
    secondary: {
      main: '#228B22', // Vert de Noël
    },
  },
});

const CABLYAI_API_KEY = process.env.REACT_APP_CABLYAI_API_KEY;

function App() {
  const [allResults, setAllResults] = useState([]);
  const [lastFormData, setLastFormData] = useState(null);

  const generatePrompt = (formData, previousSuggestions) => {
    const { relation, age, interests, budget } = formData;
    let prompt = `En tant qu'expert en cadeaux de Noël, suggère-moi 4 idées de cadeaux originales et personnalisées pour ${relation} qui a ${age} ans.`;
    prompt += `\nCentres d'intérêt : ${interests}`;
    prompt += `\nBudget : ${budget}`;
    
    if (previousSuggestions?.length > 0) {
      prompt += "\nVoici les suggestions déjà faites (à éviter) : " + previousSuggestions.join(", ");
    }
    
    prompt += "\nRéponds uniquement en JSON avec ce format :\n[{\"name\": \"Nom du cadeau\", \"description\": \"Description détaillée\", \"price\": \"Prix approximatif\"}]";
    return prompt;
  };

  const handleSubmit = async (formData) => {
    try {
      setLastFormData(formData);
      
      const previousSuggestions = allResults.flatMap(result => {
        try {
          const content = result.choices?.[0]?.message?.content || '';
          const jsonContent = JSON.parse(content.replace(/```json\n|\n```/g, ''));
          return Array.isArray(jsonContent) ? jsonContent.map(item => item.name) : [];
        } catch {
          return [];
        }
      });

      const response = await fetch('https://cablyai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CABLYAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: generatePrompt(formData, previousSuggestions)
            }
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from API');
      }

      try {
        // Vérifie que le contenu peut être parsé en JSON
        const content = data.choices[0].message.content;
        JSON.parse(content.replace(/```json\n|\n```/g, ''));
      } catch (error) {
        throw new Error('Invalid JSON in API response');
      }

      setAllResults(prev => [...prev, data]);
    } catch (error) {
      console.error('Error:', error);
      alert('Une erreur est survenue lors de la génération des suggestions. Veuillez réessayer.');
    }
  };

  const handleBack = () => {
    setAllResults([]);
    setLastFormData(null);
  };

  const handleGenerateMore = async () => {
    if (lastFormData) {
      await handleSubmit(lastFormData);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          {allResults.length > 0 ? (
            <GiftResults
              allResults={allResults}
              onBack={handleBack}
              onGenerateMore={handleGenerateMore}
            />
          ) : (
            <GiftForm onSubmit={handleSubmit} />
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
