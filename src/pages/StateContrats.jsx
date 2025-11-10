import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import {
  fetchStateContrats,
  createStateContrat,
  updateStateContrat,
  deleteStateContrat
} from '../features/stateContrat/stateContratSlice';
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
  Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Label as LabelIcon
} from '@mui/icons-material';
import StateContratForm from '../components/StateContratForm';

const StateContrats = () => {
  const dispatch = useAppDispatch();
  const { stateContrats, isLoading, error } = useAppSelector((state) => state.stateContrats);
  const [editingStateContrat, setEditingStateContrat] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [stateContratToDelete, setStateContratToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [formErrors, setFormErrors] = useState(null);

  useEffect(() => {
    dispatch(fetchStateContrats());
  }, [dispatch]);

  const handleCreate = async (data) => {
    try {
      await dispatch(createStateContrat(data)).unwrap();
      setEditingStateContrat(null);
      setSuccessMessage('État de contrat créé avec succès');
      setFormErrors(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setFormErrors(err);
    }
  };

  const handleUpdate = async (data) => {
    try {
      await dispatch(updateStateContrat({ id: editingStateContrat.id, data })).unwrap();
      setEditingStateContrat(null);
      setSuccessMessage('État de contrat modifié avec succès');
      setFormErrors(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setFormErrors(err);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteStateContrat(stateContratToDelete.id)).unwrap();
      setDeleteDialogOpen(false);
      setStateContratToDelete(null);
      setSuccessMessage('État de contrat supprimé avec succès');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setDeleteDialogOpen(false);
      setStateContratToDelete(null);
      alert(err || 'Erreur lors de la suppression');
    }
  };

  const openDeleteDialog = (stateContrat) => {
    setStateContratToDelete(stateContrat);
    setDeleteDialogOpen(true);
  };

  const getColorForState = (nom) => {
    const lower = nom?.toLowerCase() || '';
    if (lower.includes('en cours') || lower.includes('actif')) return 'success';
    if (lower.includes('expiré')) return 'error';
    if (lower.includes('résilié')) return 'error';
    if (lower.includes('suspendu')) return 'warning';
    if (lower.includes('renouvelé')) return 'info';
    return 'default';
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <LabelIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 0, fontWeight: 600 }}>
            États de Contrat
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gérez les différents états des contrats (En cours, Expiré, Résilié, etc.)
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setEditingStateContrat({})}
        >
          Nouvel État
        </Button>
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
        open={editingStateContrat !== null}
        onClose={() => {
          setEditingStateContrat(null);
          setFormErrors(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingStateContrat?.id ? 'Modifier l\'État de Contrat' : 'Nouvel État de Contrat'}
        </DialogTitle>
        <DialogContent>
          <StateContratForm
            stateContrat={editingStateContrat}
            onSubmit={editingStateContrat?.id ? handleUpdate : handleCreate}
            onCancel={() => {
              setEditingStateContrat(null);
              setFormErrors(null);
            }}
            errors={formErrors}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer l'état "{stateContratToDelete?.nom}" ?
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Attention : Cette action supprimera l'état pour tous les contrats associés.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2, boxShadow: 3 }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}>Code</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}>Nom</TableCell>
                <TableCell align="center" sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stateContrats.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Aucun état de contrat trouvé
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                stateContrats.map((stateContrat) => (
                  <TableRow
                    key={stateContrat.id}
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight={600} sx={{ fontFamily: 'monospace' }}>
                        {stateContrat.code}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip
                          label={stateContrat.nom}
                          size="small"
                          color={getColorForState(stateContrat.nom)}
                        />
                        <Typography variant="body2" fontWeight={500}>
                          {stateContrat.nom}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => setEditingStateContrat(stateContrat)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => openDeleteDialog(stateContrat)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
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

export default StateContrats;
