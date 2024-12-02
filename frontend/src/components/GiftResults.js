import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  styled,
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
  position: 'fixed',
  top: 20,
  left: 20,
  zIndex: 1000,
}));

const GiftResults = ({ allResults, onBack, onGenerateMore }) => {
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

  return (
    <Box sx={{ mt: 4, pb: 10 }}>
      <BackButton
        variant="contained"
        color="primary"
        onClick={onBack}
      >
        ← Retour
      </BackButton>

      <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ color: '#c41e3a', mt: 4 }}>
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
          onClick={onGenerateMore}
          sx={{ minWidth: 200 }}
        >
          Générer encore
        </Button>
      </Box>
    </Box>
  );
};

export default GiftResults;
