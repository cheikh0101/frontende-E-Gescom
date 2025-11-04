import React from 'react';
import { Box, TextField, Button, Paper } from '@mui/material';
import { useAppDispatch } from '../app/hooks';
import { Structure } from '../features/structures/structureSlice';

interface StructureFormProps {
  onSubmit: (data: Partial<Structure>) => void;
  initialData?: Partial<Structure>;
  isSubmitting?: boolean;
}

const StructureForm: React.FC<StructureFormProps> = ({
  onSubmit,
  initialData = { nom: '', diminutif: '', adresse: '', logo: '' },
  isSubmitting = false,
}) => {
  const [formData, setFormData] = React.useState(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (!initialData.id) {
      // Reset form only for new structures
      setFormData({ nom: '', diminutif: '', adresse: '', logo: '' });
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          name="nom"
          label="Nom de la structure"
          value={formData.nom}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          name="diminutif"
          label="Diminutif"
          value={formData.diminutif}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          name="logo"
          label="Logo (URL)"
          value={formData.logo}
          onChange={handleChange}
          fullWidth
          helperText="URL du logo de la structure (optionnel)"
        />
        <TextField
          name="adresse"
          label="Adresse"
          value={formData.adresse}
          onChange={handleChange}
          required
          fullWidth
          multiline
          rows={2}
        />
        <Button 
          type="submit" 
          variant="contained" 
          disabled={isSubmitting}
          sx={{ alignSelf: 'flex-start' }}
        >
          {initialData.id ? 'Modifier' : 'Ajouter'}
        </Button>
      </Box>
    </Paper>
  );
};

export default StructureForm;