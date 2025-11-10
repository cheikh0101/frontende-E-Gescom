import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchBanques,
  createBanque,
  updateBanque,
  deleteBanque,
  setSelectedBanque
} from '../features/banques/banqueSlice';
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
  AccountBalance as BankIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import BanqueForm from '../components/BanqueForm';

const Banques = () => {
  const dispatch = useDispatch();
  const { banques, isLoading, error, selectedBanque } = useSelector((state) => state.banques);
  const [editingBanque, setEditingBanque] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [formErrors, setFormErrors] = useState(null);

  useEffect(() => {
    dispatch(fetchBanques());
  }, [dispatch]);

  const filteredBanques = banques.filter(banque =>
    banque.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    banque.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    banque.iban?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    banque.numero_compte?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    banque.guichet?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <BankIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 0, fontWeight: 600 }}>
            Gestion des Banques
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gérez les établissements bancaires partenaires
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setEditingBanque({})}
          size="large"
          sx={{ boxShadow: 3 }}
        >
          Nouvelle Banque
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Box sx={{ mb: 3, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
        <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Total Banques</Typography>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {banques.length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Banques Actives</Typography>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {banques.length}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Success/Error Messages */}
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

      {/* Dialog for Add/Edit */}
      <Dialog
        open={Boolean(editingBanque)}
        onClose={() => setEditingBanque(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
          <BankIcon />
          {editingBanque?.id ? 'Modifier la banque' : 'Nouvelle banque'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <BanqueForm
            banque={editingBanque}
            errors={formErrors}
            onSubmit={(data) => {
              setFormErrors(null);
              if (editingBanque?.id) {
                dispatch(updateBanque({ id: editingBanque.id, banqueData: data }))
                  .unwrap()
                  .then(() => {
                    setSuccessMessage('Banque mise à jour avec succès');
                    setEditingBanque(null);
                    setFormErrors(null);
                  })
                  .catch((error) => {
                    if (error.errors) {
                      setFormErrors(error.errors);
                    }
                  });
              } else {
                dispatch(createBanque(data))
                  .unwrap()
                  .then(() => {
                    setSuccessMessage('Banque créée avec succès');
                    setEditingBanque(null);
                    setFormErrors(null);
                  })
                  .catch((error) => {
                    if (error.errors) {
                      setFormErrors(error.errors);
                    }
                  });
              }
            }}
            onCancel={() => {
              setEditingBanque(null);
              setFormErrors(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ color: 'error.main' }}>
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer cette banque ? Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            Annuler
          </Button>
          <Button
            onClick={() => {
              if (selectedBanque) {
                dispatch(deleteBanque(selectedBanque.id))
                  .unwrap()
                  .then(() => {
                    setSuccessMessage('Banque supprimée avec succès');
                    setDeleteDialogOpen(false);
                  })
                  .catch(() => {});
              }
            }}
            color="error"
            variant="contained"
            autoFocus
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <TextField
          fullWidth
          placeholder="Rechercher une banque par nom, code, IBAN ou numéro de compte..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />
      </Paper>

      {/* Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2, boxShadow: 3 }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}>
                  Code
                </TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}>
                  Nom de la banque
                </TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}>
                  Guichet
                </TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}>
                  Numéro de compte
                </TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}>
                  IBAN
                </TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredBanques.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <BankIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      {searchTerm ? 'Aucune banque trouvée' : 'Aucune banque enregistrée'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {searchTerm ? 'Essayez un autre terme de recherche' : 'Commencez par ajouter une nouvelle banque'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBanques.map((banque) => (
                  <TableRow
                    key={banque.id}
                    hover
                    selected={selectedBanque?.id === banque.id}
                    onClick={() => dispatch(setSelectedBanque(banque))}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' },
                      transition: 'background-color 0.3s'
                    }}
                  >
                    <TableCell>
                      <Chip
                        label={banque.code}
                        color="primary"
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BankIcon color="action" />
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {banque.nom}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {banque.guichet || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {banque.numero_compte}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={banque.iban}>
                        <Chip
                          label={banque.iban}
                          variant="outlined"
                          size="small"
                          sx={{ fontFamily: 'monospace', maxWidth: '200px' }}
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Tooltip title="Modifier">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingBanque(banque);
                            }}
                            sx={{
                              '&:hover': { bgcolor: 'primary.light', color: 'white' }
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
                              dispatch(setSelectedBanque(banque));
                              setDeleteDialogOpen(true);
                            }}
                            sx={{
                              '&:hover': { bgcolor: 'error.light', color: 'white' }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
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

export default Banques;
