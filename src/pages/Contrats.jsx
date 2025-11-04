import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import {
  fetchContrats,
  createContrat,
  updateContrat,
  deleteContrat,
  setSelectedContrat
} from '../features/contrats/contratSlice';
import { fetchAgents } from '../features/agents/agentSlice';
import { fetchStructures } from '../features/structures/structureSlice';
import { fetchStateContrats } from '../features/stateContrat/stateContratSlice';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  Tooltip,
  InputAdornment,
  TextField
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Description as DescriptionIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import ContratForm from '../components/ContratForm';
import dayjs from 'dayjs';

const Contrats = () => {
  const dispatch = useAppDispatch();
  const { contrats, isLoading, error, selectedContrat } = useAppSelector((state) => state.contrats);
  const { stateContrats } = useAppSelector((state) => state.stateContrats);
  const [editingContrat, setEditingContrat] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchContrats());
    dispatch(fetchStateContrats());
    dispatch(fetchAgents());
    dispatch(fetchStructures());
  }, [dispatch]);

  const filteredContrats = contrats.filter(contrat =>
    contrat.numero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contrat.agent?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contrat.structure?.nom?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const contratsActifs = contrats.filter(c => c.state_contrat?.libelle?.toLowerCase().includes('actif'));

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <DescriptionIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 0, fontWeight: 600 }}>
            Gestion des Contrats
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gérez les contrats et leurs informations
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setEditingContrat({})}
          size="large"
          sx={{ boxShadow: 3 }}
        >
          Nouveau Contrat
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
        <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Total Contrats</Typography>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {contrats.length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Contrats Actifs</Typography>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {contratsActifs.length}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Dialog
        open={Boolean(editingContrat)}
        onClose={() => setEditingContrat(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
          <DescriptionIcon />
          {editingContrat?.id ? 'Modifier le contrat' : 'Nouveau contrat'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <ContratForm
            contrat={editingContrat}
            onSubmit={(data) => {
              if (editingContrat?.id) {
                dispatch(updateContrat({ id: editingContrat.id, ...data }))
                  .unwrap()
                  .then(() => {
                    setSuccessMessage('Contrat mis à jour avec succès');
                    setEditingContrat(null);
                  })
                  .catch(() => {});
              } else {
                dispatch(createContrat(data))
                  .unwrap()
                  .then(() => {
                    setSuccessMessage('Contrat créé avec succès');
                    setEditingContrat(null);
                  })
                  .catch(() => {});
              }
            }}
            onCancel={() => setEditingContrat(null)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ color: 'error.main' }}>
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer ce contrat ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            Annuler
          </Button>
          <Button
            onClick={() => {
              if (selectedContrat) {
                dispatch(deleteContrat(selectedContrat.id))
                  .unwrap()
                  .then(() => {
                    setSuccessMessage('Contrat supprimé avec succès');
                    setDeleteDialogOpen(false);
                  })
                  .catch(() => {});
              }
            }}
            color="error"
            variant="contained"
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <TextField
          fullWidth
          placeholder="Rechercher par numéro, agent ou structure..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2, boxShadow: 3 }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}>Numéro</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}>Agent</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}>Structure</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}>Date Début</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}>Date Fin</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}>État</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredContrats.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <DescriptionIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      Aucun contrat
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredContrats.map((contrat) => (
                  <TableRow
                    key={contrat.id}
                    hover
                    selected={selectedContrat?.id === contrat.id}
                    onClick={() => dispatch(setSelectedContrat(contrat))}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <Chip label={contrat.numero} color="primary" size="small" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {contrat.agent?.nom} {contrat.agent?.prenom}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={contrat.structure?.nom || 'Non assigné'}
                        variant="outlined"
                        size="small"
                        color="secondary"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {dayjs(contrat.date_debut).format('DD/MM/YYYY')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {dayjs(contrat.date_fin).format('DD/MM/YYYY')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={contrat.state_contrat?.libelle || 'Non défini'}
                        size="small"
                        color={contrat.state_contrat?.libelle?.toLowerCase().includes('actif') ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Modifier">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingContrat(contrat);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(setSelectedContrat(contrat));
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Contrats;
