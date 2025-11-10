import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import {
  fetchStateEtatPaiements,
  createStateEtatPaiement,
  updateStateEtatPaiement,
  deleteStateEtatPaiement
} from '../features/stateEtatPaiement/stateEtatPaiementSlice';
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
  Payment as PaymentIcon
} from '@mui/icons-material';
import StateEtatPaiementForm from '../components/StateEtatPaiementForm';

const StateEtatPaiements = () => {
  const dispatch = useAppDispatch();
  const { stateEtatPaiements, isLoading, error } = useAppSelector((state) => state.stateEtatPaiements);
  const [editingStateEtatPaiement, setEditingStateEtatPaiement] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [stateEtatPaiementToDelete, setStateEtatPaiementToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [formErrors, setFormErrors] = useState(null);

  useEffect(() => {
    dispatch(fetchStateEtatPaiements());
  }, [dispatch]);

  const handleCreate = async (data) => {
    try {
      await dispatch(createStateEtatPaiement(data)).unwrap();
      setEditingStateEtatPaiement(null);
      setSuccessMessage('État de paiement créé avec succès');
      setFormErrors(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setFormErrors(err);
    }
  };

  const handleUpdate = async (data) => {
    try {
      await dispatch(updateStateEtatPaiement({ id: editingStateEtatPaiement.id, data })).unwrap();
      setEditingStateEtatPaiement(null);
      setSuccessMessage('État de paiement modifié avec succès');
      setFormErrors(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setFormErrors(err);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteStateEtatPaiement(stateEtatPaiementToDelete.id)).unwrap();
      setDeleteDialogOpen(false);
      setStateEtatPaiementToDelete(null);
      setSuccessMessage('État de paiement supprimé avec succès');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setDeleteDialogOpen(false);
      setStateEtatPaiementToDelete(null);
      alert(err || 'Erreur lors de la suppression');
    }
  };

  const openDeleteDialog = (stateEtatPaiement) => {
    setStateEtatPaiementToDelete(stateEtatPaiement);
    setDeleteDialogOpen(true);
  };

  const getColorForState = (nom) => {
    const lower = nom?.toLowerCase() || '';
    if (lower.includes('validé') || lower.includes('payé')) return 'success';
    if (lower.includes('en attente')) return 'warning';
    if (lower.includes('rejeté')) return 'error';
    if (lower.includes('en cours')) return 'info';
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
        <PaymentIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 0, fontWeight: 600 }}>
            États de Paiement
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gérez les différents états des paiements (En attente, Validé, Payé, Rejeté, En cours de traitement)
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setEditingStateEtatPaiement({})}
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
        open={editingStateEtatPaiement !== null}
        onClose={() => {
          setEditingStateEtatPaiement(null);
          setFormErrors(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingStateEtatPaiement?.id ? 'Modifier l\'État de Paiement' : 'Nouvel État de Paiement'}
        </DialogTitle>
        <DialogContent>
          <StateEtatPaiementForm
            stateEtatPaiement={editingStateEtatPaiement}
            onSubmit={editingStateEtatPaiement?.id ? handleUpdate : handleCreate}
            onCancel={() => {
              setEditingStateEtatPaiement(null);
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
            Êtes-vous sûr de vouloir supprimer l'état "{stateEtatPaiementToDelete?.nom}" ?
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Attention : Cette action supprimera l'état pour tous les paiements associés.
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
              {stateEtatPaiements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Aucun état de paiement trouvé
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                stateEtatPaiements.map((stateEtatPaiement) => (
                  <TableRow
                    key={stateEtatPaiement.id}
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight={600} sx={{ fontFamily: 'monospace' }}>
                        {stateEtatPaiement.code}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip
                          label={stateEtatPaiement.nom}
                          size="small"
                          color={getColorForState(stateEtatPaiement.nom)}
                        />
                        <Typography variant="body2" fontWeight={500}>
                          {stateEtatPaiement.nom}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => setEditingStateEtatPaiement(stateEtatPaiement)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => openDeleteDialog(stateEtatPaiement)}
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

export default StateEtatPaiements;
