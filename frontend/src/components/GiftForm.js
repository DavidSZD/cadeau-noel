import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Slider,
  styled,
} from '@mui/material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(3),
  background: 'linear-gradient(145deg, #ffffff 0%, #f0f0f0 100%)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  borderRadius: '15px',
}));

const budgetValues = [0, 10, 20, 50, 100, 'Illimité'];

const GiftForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    relation: '',
    age: '',
    interests: '',
    budgetRange: [1, 3], // Par défaut: 10€ - 50€
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBudgetChange = (event, newValue) => {
    setFormData({
      ...formData,
      budgetRange: newValue,
    });
  };

  const getBudgetLabel = (value) => {
    return value === 5 ? 'Illimité' : `${budgetValues[value]}€`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const minBudget = getBudgetLabel(formData.budgetRange[0]);
    const maxBudget = getBudgetLabel(formData.budgetRange[1]);
    const budgetString = minBudget === maxBudget 
      ? minBudget 
      : `${minBudget} - ${maxBudget}`;

    onSubmit({
      ...formData,
      budget: budgetString,
    });
  };

  return (
    <StyledPaper elevation={3}>
      <Box component="form" onSubmit={handleSubmit} sx={{ '& > :not(style)': { m: 2 } }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ 
          color: '#c41e3a',
          fontWeight: 'bold',
          mb: 4,
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}>
          Trouvez le Cadeau de Noël Parfait 🎁
        </Typography>

        <TextField
          fullWidth
          required
          label="Quelle est votre relation avec cette personne ?"
          name="relation"
          value={formData.relation}
          onChange={handleChange}
          sx={{ mb: 3 }}
          placeholder="Ex: Mon meilleur ami, Ma mère, Mon collègue..."
        />

        <TextField
          fullWidth
          required
          label="Âge"
          name="age"
          type="number"
          value={formData.age}
          onChange={handleChange}
          sx={{ mb: 3 }}
        />

        <TextField
          fullWidth
          required
          label="Centres d'intérêt"
          name="interests"
          multiline
          rows={3}
          value={formData.interests}
          onChange={handleChange}
          sx={{ mb: 4 }}
          placeholder="Ex: Passionné(e) de lecture, aime la cuisine italienne, fan de jeux vidéo..."
        />

        <Box sx={{ 
          mb: 4, 
          width: '100%',  
          margin: '0 auto',
          textAlign: 'center',
          '& .MuiSlider-markLabel': {
            transform: 'translateX(-50%)',
          }
        }}>
          <Typography variant="h6" gutterBottom sx={{ 
            mb: 3,
            color: '#c41e3a',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            Budget
          </Typography>
          <Slider
            value={formData.budgetRange}
            onChange={handleBudgetChange}
            step={1}
            min={0}
            max={5}
            marks={[0,1,2,3,4,5].map(value => ({
              value,
              label: getBudgetLabel(value)
            }))}
            sx={{
              color: '#c41e3a',
              '& .MuiSlider-thumb': {
                backgroundColor: '#ffffff',
                border: '2px solid #c41e3a',
              },
              '& .MuiSlider-mark': {
                backgroundColor: '#c41e3a',
              },
              '& .MuiSlider-rail': {
                opacity: 0.8,
              },
              '& .MuiSlider-track': {
                opacity: 0.8,
              },
              '& .MuiSlider-markLabel': {
                fontSize: '0.875rem',
                fontWeight: 500,
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{
              mt: 2,
              py: 1.5,
              px: 4,
              backgroundColor: '#c41e3a',
              '&:hover': {
                backgroundColor: '#a01830',
              },
              boxShadow: '0 4px 12px rgba(196,30,58,0.3)',
              borderRadius: '25px',
              width: 'auto',
            }}
          >
            Lancer la Recherche 🔍
          </Button>
        </Box>
      </Box>
    </StyledPaper>
  );
};

export default GiftForm;
