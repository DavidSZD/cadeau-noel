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

function App() {
  const [allResults, setAllResults] = useState([]);
  const [lastFormData, setLastFormData] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      setLastFormData(formData);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/generate-gifts';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          previousSuggestions: allResults.flatMap(result => {
            try {
              const content = result.choices?.[0]?.message?.content || '';
              const jsonContent = JSON.parse(content.replace(/```json\n|\n```/g, ''));
              return Array.isArray(jsonContent) ? jsonContent.map(item => item.name) : [];
            } catch {
              return [];
            }
          })
        }),
      });
      const data = await response.json();
      setAllResults(prev => [...prev, data]);
    } catch (error) {
      console.error('Error:', error);
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
