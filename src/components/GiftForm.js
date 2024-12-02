import {
  Box,
  TextField,
  Button,
  Typography,
  Slider,
  styled,
  CircularProgress,
  Switch,
  FormControlLabel
} from '@mui/material';
import React, { useState, useEffect } from 'react';

const QuestionTypography = styled(Typography)({
  marginBottom: '8px',
  color: '#333',
  fontWeight: 500,
});

const StyledPaper = styled(Box)(({ theme }) => ({
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(4),
  marginTop: theme.spacing(0.5),
  background: 'linear-gradient(145deg, #ffffff 0%, #f0f0f0 100%)',
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  width: '100%',
  maxWidth: '1000px',
  margin: '0 auto',
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(0),
    marginTop: theme.spacing(0),
  }
}));

const GiftForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('giftFormData');
    return savedData ? JSON.parse(savedData) : initialData || {
      relation: '',
      age: '',
      interests: '',
      budget: [0, 100],
      noMaxBudget: false
    };
  });

  useEffect(() => {
    localStorage.setItem('giftFormData', JSON.stringify(formData));
  }, [formData]);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const budgetString = formData.noMaxBudget 
      ? `important suggere seulement des cadeau qui coute au minimum ${formData.budget[0]}€ et je n'ai pas de budget maximum`
      : `${formData.budget[0]}€ - ${formData.budget[1]}€`;
    await onSubmit({ ...formData, budget: budgetString });
    setLoading(false);
  };

  const handleBudgetChange = (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      budget: [newValue[0], prev.noMaxBudget ? prev.budget[1] : newValue[1]]
    }));
  };

  const handleNoMaxBudgetChange = (event) => {
    setFormData(prev => ({
      ...prev,
      noMaxBudget: event.target.checked
    }));
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      minHeight: '100vh',
      width: '100%',
      py: 0
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
            color: '#D32F2F',
            fontWeight: 'bold',
            mb: 4,
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            mt: { xs: 0, md: 4 }
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
              value={formData.relation}
              onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
              placeholder="Ex: Mon meilleur ami, Ma mère, Mon collègue..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#D32F2F',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#D32F2F',
                  },
                },
              }}
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
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#D32F2F',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#D32F2F',
                  },
                },
              }}
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
              multiline
              rows={3}
              value={formData.interests}
              onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
              placeholder="Ex: Passionné(e) de lecture, aime la cuisine italienne, fan de jeux vidéo..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#D32F2F',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#D32F2F',
                  },
                },
              }}
            />
          </Box>

          <Box sx={{ width: '100%', mb: 2 }}>
            <QuestionTypography variant="subtitle1">
              Quel est votre budget ?
            </QuestionTypography>
            <Slider
              value={formData.budget}
              onChange={handleBudgetChange}
              valueLabelFormat={(value) => (formData.noMaxBudget && value === 100 ? 'illimité' : `${value}€`)}
              valueLabelDisplay="on"
              min={0}
              max={100}
              step={5}
              marks={[
                { value: 0, label: '0€' },
                { value: 25, label: '25€' },
                { value: 50, label: '50€' },
                { value: 75, label: '75€' },
                { value: 100, label: formData.noMaxBudget ? 'illimité' : '100€' }
              ]}
              sx={{
                '& .MuiSlider-thumb': {
                  backgroundColor: '#D32F2F',
                },
                '& .MuiSlider-track': {
                  backgroundColor: '#D32F2F',
                },
                '& .MuiSlider-rail': {
                  backgroundColor: '#ffcdd2',
                },
                '& .MuiSlider-mark': {
                  backgroundColor: '#D32F2F',
                },
                '& .MuiSlider-markLabel': {
                  color: 'text.secondary',
                },
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.noMaxBudget}
                    onChange={handleNoMaxBudgetChange}
                    color="error"
                  />
                }
                label="Sans maximum"
              />
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Budget : {formData.budget[0]}€{formData.noMaxBudget ? ' illimité' : ` - ${formData.budget[1]}€`}
            </Typography>
          </Box>

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              mt: 2,
              py: 1.5,
              px: 4,
              backgroundColor: '#2e7d32',
              '&:hover': {
                backgroundColor: '#1b5e20',
              },
              boxShadow: '0 4px 12px rgba(46,125,50,0.3)',
              borderRadius: '25px',
              width: 'auto',
              minWidth: '200px',
              textTransform: 'none',
              fontSize: '1.1rem',
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Lancer la recherche'
            )}
          </Button>
        </Box>
      </StyledPaper>
    </Box>
  );
};

export default GiftForm;
