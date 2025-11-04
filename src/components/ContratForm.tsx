import React from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Grid
} from '@mui/material';
import { useAppSelector } from '../app/hooks';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

interface ContratFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  isSubmitting?: boolean;
}

const ContratForm: React.FC<ContratFormProps> = ({
  onSubmit,
  initialData = {
    type: '',
    date_debut: null,
    date_fin: null,
    montant_total: '',
    montant_net: '',
    montant_retenu: '',
    fonction: '',
    fichier: '',
    date_resiliation: null,
    agent_id: ''
  },
  isSubmitting = false,
}) => {
  const [formData, setFormData] = React.useState(initialData);
  const { agents } = useAppSelector((state) => state.agents);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDateChange = (field: string) => (date: Date | null) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: date ? dayjs(date).format('YYYY-MM-DD') : null,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (!initialData.id) {
      setFormData({
        type: '',
        date_debut: null,
        date_fin: null,
        montant_total: '',
        montant_net: '',
        montant_retenu: '',
        fonction: '',
        fichier: '',
        date_resiliation: null,
        agent_id: ''
      });
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Agent</InputLabel>
              <Select
                name="agent_id"
                value={formData.agent_id}
                onChange={handleChange}
                label="Agent"
              >
                {agents.map((agent) => (
                  <MenuItem key={agent.id} value={agent.id}>
                    {agent.prenom} {agent.nom}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="type"
              label="Type de contrat"
              value={formData.type}
              onChange={handleChange}
              required
              fullWidth
              helperText="Ex: CDI, CDD, Stage, etc."
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Date de début"
              value={formData.date_debut ? dayjs(formData.date_debut) : null}
              onChange={handleDateChange('date_debut')}
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
            <DatePicker
              label="Date de fin"
              value={formData.date_fin ? dayjs(formData.date_fin) : null}
              onChange={handleDateChange('date_fin')}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  required: true,
                  fullWidth: true
                }
              }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              name="montant_total"
              label="Montant total"
              type="number"
              value={formData.montant_total}
              onChange={handleChange}
              required
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">FCFA</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              name="montant_net"
              label="Montant net"
              type="number"
              value={formData.montant_net}
              onChange={handleChange}
              required
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">FCFA</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              name="montant_retenu"
              label="Montant retenu"
              type="number"
              value={formData.montant_retenu}
              onChange={handleChange}
              required
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">FCFA</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="fonction"
              label="Fonction"
              value={formData.fonction}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="fichier"
              label="Fichier (URL)"
              value={formData.fichier}
              onChange={handleChange}
              fullWidth
              helperText="URL du fichier du contrat (optionnel)"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Date de résiliation"
              value={formData.date_resiliation ? dayjs(formData.date_resiliation) : null}
              onChange={handleDateChange('date_resiliation')}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  fullWidth: true,
                  helperText: "Optionnel - pour les contrats résiliés"
                }
              }}
            />
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

export default ContratForm;