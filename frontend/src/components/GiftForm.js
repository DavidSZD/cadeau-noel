import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Slider,
  styled,
  CircularProgress
} from '@mui/material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(1),
  background: 'linear-gradient(145deg, #ffffff 0%, #f0f0f0 100%)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  borderRadius: '15px',
  width: '100%',
  maxWidth: { xs: '100%', md: '900px' },
  margin: '0 auto',
}));

const QuestionTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  color: '#333',
  fontWeight: 500,
}));

const budgetValues = [0, 10, 20, 50, 100, 'Illimité'];

const GiftForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    relation: '',
    age: '',
    interests: '',
    budgetRange: [1, 3],
  });
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const minBudget = getBudgetLabel(formData.budgetRange[0]);
    const maxBudget = getBudgetLabel(formData.budgetRange[1]);
    const budgetString = minBudget === maxBudget 
      ? minBudget 
      : `${minBudget} - ${maxBudget}`;

    try {
      await onSubmit({
        ...formData,
        budget: budgetString,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      minHeight: '100%',
      width: '100%',
      py: 4
    }}>
      <StyledPaper elevation={3}>
        <Box component="form" onSubmit={handleSubmit} sx={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          '& > :not(style)': { m: 2 }
        }}>
          <Typography variant="h4" gutterBottom align="center" sx={{ 
            color: '#c41e3a',
            fontWeight: 'bold',
            mb: 4,
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}>
            Trouvez le Cadeau de Noël Parfait 🎁
          </Typography>

          <Box sx={{ width: '100%', mb: 2 }}>
            <QuestionTypography variant="subtitle1">
              Pour qui cherchez-vous un cadeau ?
            </QuestionTypography>
            <TextField
              fullWidth
              required
              label="Votre relation avec cette personne"
              name="relation"
              value={formData.relation}
              onChange={handleChange}
              placeholder="Ex: Mon meilleur ami, Ma mère, Mon collègue..."
            />
          </Box>

          <Box sx={{ width: '100%', mb: 2 }}>
            <QuestionTypography variant="subtitle1">
              Quel âge a cette personne ?
            </QuestionTypography>
            <TextField
              fullWidth
              required
              label="Âge"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
            />
          </Box>

          <Box sx={{ width: '100%', mb: 2 }}>
            <QuestionTypography variant="subtitle1">
              Quels sont ses centres d'intérêt ?
            </QuestionTypography>
            <TextField
              fullWidth
              required
              label="Centres d'intérêt"
              name="interests"
              multiline
              rows={3}
              value={formData.interests}
              onChange={handleChange}
              placeholder="Ex: Passionné(e) de lecture, aime la cuisine italienne, fan de jeux vidéo..."
            />
          </Box>

          <Box sx={{ 
            width: '100%',
            mb: 4,
            textAlign: 'center',
            '& .MuiSlider-markLabel': {
              transform: 'translateX(-50%)',
            }
          }}>
            <QuestionTypography variant="subtitle1" sx={{ textAlign: 'left' }}>
              Quel est votre budget ?
            </QuestionTypography>
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
                color: '#228B22',
                '& .MuiSlider-thumb': {
                  backgroundColor: '#ffffff',
                  border: '2px solid #228B22',
                },
                '& .MuiSlider-mark': {
                  backgroundColor: '#c41e3a',
                },
                '& .MuiSlider-rail': {
                  opacity: 0.8,
                  backgroundColor: '#c41e3a',
                },
                '& .MuiSlider-track': {
                  opacity: 0.8,
                  backgroundColor: '#228B22',
                },
                '& .MuiSlider-markLabel': {
                  fontSize: '0.875rem',
                  fontWeight: 500,
                },
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
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
                minWidth: '200px',
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                'Lancer la Recherche 🔍'
              )}
            </Button>
          </Box>
        </Box>
      </StyledPaper>
    </Box>
  );
};

export default GiftForm;
