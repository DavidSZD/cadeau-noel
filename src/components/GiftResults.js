import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  styled,
  CircularProgress
} from '@mui/material';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8f8f8 100%)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  borderRadius: '15px',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const BackButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  top: { xs: 10, sm: 20 },
  left: { xs: 10, sm: 20 },
  zIndex: 1000,
  '@media (max-width: 600px)': {
    fontSize: '0.875rem',
    padding: '6px 12px',
  }
}));

const GiftResults = ({ allResults, onBack, onGenerateMore }) => {
  const [isLoading, setIsLoading] = useState(false);

  let allGiftList = [];
  try {
    allGiftList = allResults.flatMap(result => {
      const content = result.choices?.[0]?.message?.content || '';
      const jsonContent = JSON.parse(content.replace(/```json\n|\n```/g, ''));
      return Array.isArray(jsonContent) ? jsonContent : [];
    });
  } catch (error) {
    console.error('Error parsing results:', error);
  }

  const handleGenerateMore = async () => {
    setIsLoading(true);
    try {
      await onGenerateMore();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 4, pb: 10 }}>
      <BackButton
        variant="contained"
        color="primary"
        onClick={onBack}
      >
        ← Retour
      </BackButton>

      <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ color: '#c41e3a', mt: 6 }}>
        Suggestions de Cadeaux de Noël 🎁
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {allGiftList.map((gift, index) => (
          <Grid item xs={12} sm={6} md={6} key={index}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  {gift.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {gift.description}
                </Typography>
                <Typography variant="body2" color="primary" sx={{ textAlign: 'center', mt: 2 }}>
                  Prix estimé : {gift.price}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  Où acheter : {gift.where}
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleGenerateMore}
          disabled={isLoading}
          sx={{ 
            minWidth: 200, 
            position: 'relative',
            '&:disabled': {
              backgroundColor: 'rgba(0, 0, 0, 0.12)',
              color: 'rgba(0, 0, 0, 0.26)'
            }
          }}
        >
          {isLoading ? (
            <>
              <CircularProgress 
                size={24} 
                sx={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  marginTop: '-12px', 
                  marginLeft: '-12px',
                  color: 'secondary.main'
                }} 
              />
              Génération en cours...
            </>
          ) : (
            'Générer encore'
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default GiftResults;
