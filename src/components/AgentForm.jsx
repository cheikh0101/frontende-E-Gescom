import React, { useEffect } from 'react';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material';
import { useAppSelector } from '../app/hooks';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const AgentForm = ({
  onSubmit,
  agent,
  isSubmitting = false,
  onCancel,
  errors = null
}) => {
  const [formData, setFormData] = React.useState({
    civilite: 'Monsieur',
    prenom: '',
    nom: '',
    email: '',
    password: '',
    telephone: '',
    matricule: '',
    date_de_naissance: null,
    lieu_de_naissance: '',
    numero_cni: '',
    date_delivrance_cni: null,
    lieu_delivrance_cni: '',
    adresse: '',
    structure_id: '',
    banque_id: '',
    numero_compte: '',
    iban: ''
  });
  
  const { structures = [] } = useAppSelector((state) => state.structures || { structures: [] });
  const { banques = [] } = useAppSelector((state) => state.banques || { banques: [] });

  useEffect(() => {
    if (agent?.id) {
      setFormData({
        civilite: agent.civilite || 'Monsieur',
        prenom: agent.prenom || '',
        nom: agent.nom || '',
        email: agent.email || '',
        password: '',
        telephone: agent.telephone || '',
        matricule: agent.matricule || '',
        date_de_naissance: agent.date_de_naissance || null,
        lieu_de_naissance: agent.lieu_de_naissance || '',
        numero_cni: agent.numero_cni || '',
        date_delivrance_cni: agent.date_delivrance_cni || null,
        lieu_delivrance_cni: agent.lieu_delivrance_cni || '',
        adresse: agent.adresse || '',
        structure_id: agent.structure_id || '',
        banque_id: agent.banque_id || '',
        numero_compte: agent.numero_compte || '',
        iban: agent.iban || ''
      });
    } else {
      setFormData({
        civilite: 'Monsieur',
        prenom: '',
        nom: '',
        email: '',
        password: '',
        telephone: '',
        matricule: '',
        date_de_naissance: null,
        lieu_de_naissance: '',
        numero_cni: '',
        date_delivrance_cni: null,
        lieu_delivrance_cni: '',
        adresse: '',
        structure_id: '',
        banque_id: '',
        numero_compte: '',
        iban: ''
      });
    }
  }, [agent]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      date_de_naissance: date ? dayjs(date).format('YYYY-MM-DD') : null,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Nettoyer les données avant envoi
    const cleanedData = { ...formData };
    
    // Supprimer le mot de passe s'il est vide (modification)
    if (agent?.id && !cleanedData.password) {
      delete cleanedData.password;
    }
    
    // Supprimer les champs vides optionnels
    if (!cleanedData.telephone) delete cleanedData.telephone;
    if (!cleanedData.matricule) delete cleanedData.matricule;
    if (!cleanedData.numero_compte) delete cleanedData.numero_compte;
    if (!cleanedData.iban) delete cleanedData.iban;
    
    // Convertir structure_id et banque_id en nombres
    if (cleanedData.structure_id) {
      cleanedData.structure_id = Number(cleanedData.structure_id);
    }
    
    if (cleanedData.banque_id) {
      cleanedData.banque_id = Number(cleanedData.banque_id);
    }
    
    onSubmit(cleanedData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {errors && (
        <Alert severity="error" sx={{ mb: 2 }}>
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
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        <FormControl fullWidth required>
          <InputLabel>Civilité</InputLabel>
          <Select
            name="civilite"
            value={formData.civilite}
            onChange={handleChange}
            label="Civilité"
          >
            <MenuItem value="Monsieur">Monsieur</MenuItem>
            <MenuItem value="Madame">Madame</MenuItem>
            <MenuItem value="Mademoiselle">Mademoiselle</MenuItem>
          </Select>
        </FormControl>
        <TextField
          name="prenom"
          label="Prénom"
          value={formData.prenom}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          name="nom"
          label="Nom"
          value={formData.nom}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          name="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          fullWidth
          error={!!(errors?.email)}
          helperText={errors?.email?.[0] || ''}
        />
        <TextField
          name="password"
          label="Mot de passe"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required={!agent?.id}
          fullWidth
          error={!!(errors?.password)}
          helperText={errors?.password?.[0] || (agent?.id ? "Laissez vide pour ne pas changer" : "")}
        />
        <TextField
          name="telephone"
          label="Téléphone"
          value={formData.telephone}
          onChange={handleChange}
          fullWidth
          error={!!(errors?.telephone)}
          helperText={errors?.telephone?.[0] || ''}
        />
        <TextField
          name="matricule"
          label="Matricule"
          value={formData.matricule}
          onChange={handleChange}
          fullWidth
          error={!!(errors?.matricule)}
          helperText={errors?.matricule?.[0] || ''}
        />
        <DatePicker
          label="Date de naissance"
          value={formData.date_de_naissance ? dayjs(formData.date_de_naissance) : null}
          onChange={(date) => {
            setFormData((prev) => ({
              ...prev,
              date_de_naissance: date ? dayjs(date).format('YYYY-MM-DD') : null,
            }));
          }}
          format="DD/MM/YYYY"
          slotProps={{
            textField: {
              required: true,
              fullWidth: true
            }
          }}
        />
        <TextField
          name="lieu_de_naissance"
          label="Lieu de naissance"
          value={formData.lieu_de_naissance}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          name="numero_cni"
          label="Numéro CNI"
          value={formData.numero_cni}
          onChange={handleChange}
          required
          fullWidth
          error={!!(errors?.numero_cni)}
          helperText={errors?.numero_cni?.[0] || ''}
        />
        <DatePicker
          label="Date de délivrance CNI"
          value={formData.date_delivrance_cni ? dayjs(formData.date_delivrance_cni) : null}
          onChange={(date) => {
            setFormData((prev) => ({
              ...prev,
              date_delivrance_cni: date ? dayjs(date).format('YYYY-MM-DD') : null,
            }));
          }}
          format="DD/MM/YYYY"
          slotProps={{
            textField: {
              fullWidth: true
            }
          }}
        />
        <TextField
          name="lieu_delivrance_cni"
          label="Lieu de délivrance CNI"
          value={formData.lieu_delivrance_cni}
          onChange={handleChange}
          fullWidth
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
        <FormControl fullWidth required>
          <InputLabel>Structure</InputLabel>
          <Select
            name="structure_id"
            value={formData.structure_id}
            onChange={handleChange}
            label="Structure"
          >
            {(structures || []).map((structure) => (
              <MenuItem key={structure.id} value={structure.id}>
                {structure.nom}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth required>
          <InputLabel>Banque</InputLabel>
          <Select
            name="banque_id"
            value={formData.banque_id}
            onChange={handleChange}
            label="Banque"
          >
            {(banques || []).map((banque) => (
              <MenuItem key={banque.id} value={banque.id}>
                {banque.nom}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          name="numero_compte"
          label="Numéro de compte"
          value={formData.numero_compte}
          onChange={handleChange}
          fullWidth
          placeholder="Ex: 1234567890"
          error={!!(errors?.numero_compte)}
          helperText={errors?.numero_compte?.[0] || 'Numéro de compte bancaire (optionnel)'}
        />
        <TextField
          name="iban"
          label="IBAN"
          value={formData.iban}
          onChange={handleChange}
          fullWidth
          placeholder="Ex: MR1300012000010000000123456"
          error={!!(errors?.iban)}
          helperText={errors?.iban?.[0] || 'Code IBAN international (optionnel)'}
        />
      </Box>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={isSubmitting}
          >
            {agent?.id ? 'Modifier' : 'Ajouter'}
          </Button>
          {onCancel && (
            <Button 
              variant="outlined" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
          )}
        </Box>
    </Box>
  );
};

export default AgentForm;