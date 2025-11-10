import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import {
  fetchStructures,
  createStructure,
  updateStructure,
  deleteStructure,
  setSelectedStructure
} from '../features/structures/structureSlice';
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
  Business as BusinessIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import StructureForm from '../components/StructureForm';

const Structures = () => {
  const dispatch = useAppDispatch();
  const { structures, isLoading, error, selectedStructure } = useAppSelector((state) => state.structures);
  const [editingStructure, setEditingStructure] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [formErrors, setFormErrors] = useState(null);

  useEffect(() => {
    dispatch(fetchStructures());
  }, [dispatch]);

  const filteredStructures = structures.filter(structure =>
    structure.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    structure.diminutif?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    structure.adresse?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <BusinessIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 0, fontWeight: 600 }}>
            Gestion des Structures
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gérez les structures organisationnelles
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setEditingStructure({})}
          size="large"
          sx={{ boxShadow: 3 }}
        >
          Nouvelle Structure
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
        <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Total Structures</Typography>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {structures.length}
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
        open={Boolean(editingStructure)}
        onClose={() => setEditingStructure(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
          <BusinessIcon />
          {editingStructure?.id ? 'Modifier la structure' : 'Nouvelle structure'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <StructureForm
            structure={editingStructure}
            errors={formErrors}
            onSubmit={(data) => {
              setFormErrors(null);
              if (editingStructure?.id) {
                dispatch(updateStructure({ id: editingStructure.id, structureData: data }))
                  .unwrap()
                  .then(() => {
                    setSuccessMessage('Structure mise à jour avec succès');
                    setEditingStructure(null);
                    setFormErrors(null);
                  })
                  .catch((error) => {
                    if (error.errors) {
                      setFormErrors(error.errors);
                    }
                  });
              } else {
                dispatch(createStructure(data))
                  .unwrap()
                  .then(() => {
                    setSuccessMessage('Structure créée avec succès');
                    setEditingStructure(null);
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
              setEditingStructure(null);
              setFormErrors(null);
            }}
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
            Êtes-vous sûr de vouloir supprimer cette structure ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            Annuler
          </Button>
          <Button
            onClick={() => {
              if (selectedStructure) {
                dispatch(deleteStructure(selectedStructure.id))
                  .unwrap()
                  .then(() => {
                    setSuccessMessage('Structure supprimée avec succès');
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
          placeholder="Rechercher..."
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
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}>Nom</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}>Diminutif</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}>Adresse</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredStructures.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                    <BusinessIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      Aucune structure
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStructures.map((structure) => (
                  <TableRow
                    key={structure.id}
                    hover
                    selected={selectedStructure?.id === structure.id}
                    onClick={() => dispatch(setSelectedStructure(structure))}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BusinessIcon color="action" />
                        <Typography fontWeight={500}>{structure.nom}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {structure.diminutif ? (
                        <Chip label={structure.diminutif} color="primary" size="small" />
                      ) : (
                        <Typography color="text.secondary" fontSize="0.875rem">-</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{structure.adresse}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Modifier">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingStructure(structure);
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
                            dispatch(setSelectedStructure(structure));
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

export default Structures;
