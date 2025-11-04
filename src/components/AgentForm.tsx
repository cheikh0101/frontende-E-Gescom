import React from 'react';
import { Box, TextField, Button, Paper, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import { useAppSelector } from '../app/hooks';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

interface AgentFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  isSubmitting?: boolean;
}

const AgentForm: React.FC<AgentFormProps> = ({
  onSubmit,
  initialData = {
    prenom: '',
    nom: '',
    email: '',
    password: '',
    telephone: '',
    matricule: '',
    date_de_naissance: null,
    lieu_de_naissance: '',
    numero_cni: '',
    adresse: '',
    structure_id: '',
    banque_id: ''
  },
  isSubmitting = false,
}) => {
  const [formData, setFormData] = React.useState(initialData);
  const { structures } = useAppSelector((state) => state.structures);
  const { banques } = useAppSelector((state) => state.banques);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDateChange = (date: Date | null) => {
    setFormData((prev: any) => ({
      ...prev,
      date_de_naissance: date ? dayjs(date).format('YYYY-MM-DD') : null,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (!initialData.id) {
      setFormData({
        prenom: '',
        nom: '',
        email: '',
        password: '',
        telephone: '',
        matricule: '',
        date_de_naissance: null,
        lieu_de_naissance: '',
        numero_cni: '',
        adresse: '',
        structure_id: '',
        banque_id: ''
      });
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="prenom"
              label="Prénom"
              value={formData.prenom}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="nom"
              label="Nom"
              value={formData.nom}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="password"
              label="Mot de passe"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required={!initialData.id}
              fullWidth
              helperText={initialData.id ? "Laissez vide pour ne pas changer" : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="telephone"
              label="Téléphone"
              value={formData.telephone}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="matricule"
              label="Matricule"
              value={formData.matricule}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Date de naissance"
              value={formData.date_de_naissance ? dayjs(formData.date_de_naissance) : null}
              onChange={handleDateChange}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  required: true,
                  fullWidth: true
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="lieu_de_naissance"
              label="Lieu de naissance"
              value={formData.lieu_de_naissance}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="numero_cni"
              label="Numéro CNI"
              value={formData.numero_cni}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
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
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Structure</InputLabel>
              <Select
                name="structure_id"
                value={formData.structure_id}
                onChange={handleChange}
                label="Structure"
              >
                {structures.map((structure) => (
                  <MenuItem key={structure.id} value={structure.id}>
                    {structure.nom}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Banque</InputLabel>
              <Select
                name="banque_id"
                value={formData.banque_id}
                onChange={handleChange}
                label="Banque"
              >
                {banques.map((banque) => (
                  <MenuItem key={banque.id} value={banque.id}>
                    {banque.nom}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Button 
          type="submit" 
          variant="contained" 
          disabled={isSubmitting}
          sx={{ alignSelf: 'flex-start', mt: 2 }}
        >
          {initialData.id ? 'Modifier' : 'Ajouter'}
        </Button>
      </Box>
    </Paper>
  );
};

export default AgentForm;