import React from 'react';
import { Box, TextField, Button, Paper, Alert } from '@mui/material';
import { useAppDispatch } from '../app/hooks';
import { Structure } from '../features/structures/structureSlice';

interface StructureFormProps {
  onSubmit: (data: Partial<Structure>) => void;
  structure?: Partial<Structure>;
  isSubmitting?: boolean;
  onCancel?: () => void;
  errors?: any;
}

const StructureForm: React.FC<StructureFormProps> = ({
  onSubmit,
  structure,
  isSubmitting = false,
  onCancel,
  errors = null,
}) => {
  const [formData, setFormData] = React.useState<Partial<Structure>>({
    nom: '',
    diminutif: '',
    adresse: '',
    logo: '',
  });

  // Update form data when structure prop changes
  React.useEffect(() => {
    if (structure) {
      setFormData({
        nom: structure.nom || '',
        diminutif: structure.diminutif || '',
        adresse: structure.adresse || '',
        logo: structure.logo || '',
      });
    } else {
      setFormData({
        nom: '',
        diminutif: '',
        adresse: '',
        logo: '',
      });
    }
  }, [structure]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (!structure?.id) {
      // Reset form only for new structures
      setFormData({ nom: '', diminutif: '', adresse: '', logo: '' });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {errors && (
          <Alert severity="error">
            {typeof errors === 'string' ? errors : (
              <Box>
                <strong>Erreurs de validation :</strong>
                <ul style={{ marginTop: '8px', marginBottom: 0 }}>
                  {Object.entries(errors).map(([field, messages]) => (
                    <li key={field}>
                      <strong>{field}:</strong> {Array.isArray(messages) ? messages.join(', ') : messages}
                    </li>
                  ))}
                </ul>
              </Box>
            )}
          </Alert>
        )}
        <TextField
          name="nom"
          label="Nom de la structure"
          value={formData.nom}
          onChange={handleChange}
          required
          fullWidth
          error={!!(errors?.nom)}
          helperText={errors?.nom?.[0] || ''}
        />
        <TextField
          name="diminutif"
          label="Diminutif"
          value={formData.diminutif}
          onChange={handleChange}
          fullWidth
          error={!!(errors?.diminutif)}
          helperText={errors?.diminutif?.[0] || ''}
        />
        <TextField
          name="logo"
          label="Logo (URL)"
          value={formData.logo}
          onChange={handleChange}
          fullWidth
          error={!!(errors?.logo)}
          helperText={errors?.logo?.[0] || "URL du logo de la structure (optionnel)"}
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
          error={!!(errors?.adresse)}
          helperText={errors?.adresse?.[0] || ''}
        />
        <Button 
          type="submit" 
          variant="contained" 
          disabled={isSubmitting}
          sx={{ alignSelf: 'flex-start' }}
        >
          {structure?.id ? 'Modifier' : 'Ajouter'}
        </Button>
      </Box>
  );
};

export default StructureForm;