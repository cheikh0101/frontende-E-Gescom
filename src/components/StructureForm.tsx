import React from 'react';
import { Box, TextField, Button, Paper, Alert, Typography, Divider } from '@mui/material';
import { useAppDispatch } from '../app/hooks';
import { Structure } from '../features/structures/structureSlice';
import { Add as AddIcon, Edit as EditIcon, Cancel as CancelIcon } from '@mui/icons-material';

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
    code: '',
    diminutif: '',
    adresse: '',
    logo: '',
  });

  // Update form data when structure prop changes
  React.useEffect(() => {
    if (structure) {
      setFormData({
        nom: structure.nom || '',
        code: structure.code || '',
        diminutif: structure.diminutif || '',
        adresse: structure.adresse || '',
        logo: structure.logo || '',
      });
    } else {
      setFormData({
        nom: '',
        code: '',
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
      setFormData({ nom: '', code: '', diminutif: '', adresse: '', logo: '' });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {errors && (
        <Alert severity="error" sx={{ mb: 3 }}>
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
      
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
        {structure?.id && (
          <>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
              Modifier les informations de la structure
            </Typography>
            <Divider sx={{ mb: 3 }} />
          </>
        )}
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            name="nom"
            label="Nom de la structure"
            value={formData.nom}
            onChange={handleChange}
            required
            fullWidth
            error={!!(errors?.nom)}
            helperText={errors?.nom?.[0] || 'Nom complet de la structure'}
            size="medium"
          />

          <TextField
            name="code"
            label="Code de la structure"
            value={formData.code}
            onChange={handleChange}
            required
            fullWidth
            error={!!(errors?.code)}
            helperText={errors?.code?.[0] || 'Code unique et court (ex: DGSI)'}
            placeholder="Ex: DGSI, RH, IT..."
            size="medium"
          />
          
          <TextField
            name="diminutif"
            label="Diminutif"
            value={formData.diminutif}
            onChange={handleChange}
            fullWidth
            error={!!(errors?.diminutif)}
            helperText={errors?.diminutif?.[0] || 'Abréviation de la structure (optionnel)'}
            placeholder="Ex: DG, RH, IT..."
            size="medium"
          />
          
          <TextField
            name="logo"
            label="Logo (URL)"
            value={formData.logo}
            onChange={handleChange}
            fullWidth
            error={!!(errors?.logo)}
            helperText={errors?.logo?.[0] || "URL du logo de la structure (optionnel)"}
            placeholder="https://exemple.com/logo.png"
            size="medium"
          />
          
          <TextField
            name="adresse"
            label="Adresse"
            value={formData.adresse}
            onChange={handleChange}
            required
            fullWidth
            multiline
            rows={4}
            error={!!(errors?.adresse)}
            helperText={errors?.adresse?.[0] || 'Adresse complète de la structure'}
            placeholder="Ex: Avenue Gamal Abdel Nasser, Nouakchott..."
            size="medium"
          />
          
          <Divider sx={{ my: 1 }} />
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
            {onCancel && (
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<CancelIcon />}
                onClick={onCancel}
                size="large"
                sx={{ minWidth: 140 }}
              >
                Annuler
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              startIcon={structure?.id ? <EditIcon /> : <AddIcon />}
              size="large"
              sx={{ minWidth: 140 }}
            >
              {structure?.id ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default StructureForm;