import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import {
  fetchEtatPaiements,
  createEtatPaiement,
  updateEtatPaiement,
  deleteEtatPaiement,
  setSelectedEtatPaiement,
  changeEtatPaiementState
} from '../features/etatPaiement/etatPaiementSlice';
import { fetchAgents } from '../features/agents/agentSlice';
import { fetchStateEtatPaiements } from '../features/stateEtatPaiement/stateEtatPaiementSlice';
import { fetchAuditLogs, clearAuditLogs } from '../features/auditLogs/auditLogSlice';
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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Payment as PaymentIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  SwapHoriz as SwapHorizIcon,
  History as HistoryIcon,
  FindInPage as FindInPageIcon
} from '@mui/icons-material';
import EtatPaiementForm from '../components/EtatPaiementForm';
import StateHistoryDialog from '../components/etatPaiements/StateHistoryDialog';
import AuditHistoryDialog from '../components/etatPaiements/AuditHistoryDialog';

const EtatPaiements = () => {
  const dispatch = useAppDispatch();
  const { etatPaiements, isLoading, error, selectedEtatPaiement } = useAppSelector((state) => state.etatPaiements);
  const { stateEtatPaiements } = useAppSelector((state) => state.stateEtatPaiements);
  const { logs: auditLogs } = useAppSelector((state) => state.auditLogs);
  const [editingPaiement, setEditingPaiement] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [stateDialogOpen, setStateDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [auditDialogOpen, setAuditDialogOpen] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchEtatPaiements());
    dispatch(fetchAgents());
    dispatch(fetchStateEtatPaiements());
  }, [dispatch]);

  const getStateColor = (stateCode) => {
    switch (stateCode) {
      case 'EN_ATTENTE':
        return 'warning';
      case 'VALIDE':
        return 'info';
      case 'PAYE':
        return 'success';
      case 'REJETE':
        return 'error';
      case 'EN_COURS_TRAITEMENT':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const handleChangeState = async () => {
    if (!selectedState || !selectedEtatPaiement) return;

    try {
      await dispatch(changeEtatPaiementState({
        id: selectedEtatPaiement.id,
        state_etat_paiement_id: selectedState
      })).unwrap();
      
      setSuccessMessage('État du paiement modifié avec succès');
      setStateDialogOpen(false);
      setSelectedState('');
      dispatch(fetchEtatPaiements());
    } catch (error) {
      console.error('Erreur lors du changement d\'état:', error);
    }
  };

  const openAuditDialog = (paiement) => {
    dispatch(setSelectedEtatPaiement(paiement));
    dispatch(fetchAuditLogs({
      table: 'etat_paiements',
      recordId: paiement.id
    }));
    setAuditDialogOpen(true);
  };

  const filteredPaiements = (etatPaiements || []).filter(paiement =>
    paiement.agent?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paiement.agent?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paiement.periode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paiement.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <PaymentIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 0, fontWeight: 600 }}>
            Gestion des États de Paiement
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gérez les différents états de paiement
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setEditingPaiement({})}
          size="large"
          sx={{ boxShadow: 3 }}
        >
          Nouvel État
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
        <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Total États</Typography>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {etatPaiements?.length || 0}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>États Actifs</Typography>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {etatPaiements?.length || 0}
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
        open={Boolean(editingPaiement)}
        onClose={() => setEditingPaiement(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
          <PaymentIcon />
          {editingPaiement?.id ? 'Modifier l\'état de paiement' : 'Nouvel état de paiement'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <EtatPaiementForm
            etatPaiement={editingPaiement}
            onSubmit={(data) => {
              if (editingPaiement?.id) {
                dispatch(updateEtatPaiement({ id: editingPaiement.id, data }))
                  .unwrap()
                  .then(() => {
                    setSuccessMessage('État de paiement mis à jour avec succès');
                    setEditingPaiement(null);
                  })
                  .catch(() => {});
              } else {
                dispatch(createEtatPaiement(data))
                  .unwrap()
                  .then(() => {
                    setSuccessMessage('État de paiement créé avec succès');
                    setEditingPaiement(null);
                  })
                  .catch(() => {});
              }
            }}
            onCancel={() => setEditingPaiement(null)}
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
            Êtes-vous sûr de vouloir supprimer cet état de paiement ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            Annuler
          </Button>
          <Button
            onClick={() => {
              if (selectedEtatPaiement) {
                dispatch(deleteEtatPaiement(selectedEtatPaiement.id))
                  .unwrap()
                  .then(() => {
                    setSuccessMessage('État de paiement supprimé avec succès');
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

      {/* Dialog de visualisation */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
          <VisibilityIcon />
          Détails de l'état de paiement
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedEtatPaiement && (
            <Box sx={{ display: 'grid', gap: 2 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Agent
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {selectedEtatPaiement.agent ? `${selectedEtatPaiement.agent.prenom} ${selectedEtatPaiement.agent.nom}` : 'N/A'}
                  </Typography>
                  {selectedEtatPaiement.agent?.matricule && (
                    <Typography variant="caption" color="text.secondary">
                      Matricule: {selectedEtatPaiement.agent.matricule}
                    </Typography>
                  )}
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Email
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {selectedEtatPaiement.agent?.email || 'N/A'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Période
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {selectedEtatPaiement.periode || 'N/A'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Type
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {selectedEtatPaiement.type || 'N/A'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Montant total
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 600, color: 'primary.main' }}>
                    {selectedEtatPaiement.montant_total ? `${new Intl.NumberFormat('fr-FR').format(selectedEtatPaiement.montant_total)} FCFA` : 'N/A'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Montant net
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 600, color: 'success.main' }}>
                    {selectedEtatPaiement.montant_net ? `${new Intl.NumberFormat('fr-FR').format(selectedEtatPaiement.montant_net)} FCFA` : 'N/A'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Montant retenu
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 600, color: 'error.main' }}>
                    {selectedEtatPaiement.montant_retenu ? `${new Intl.NumberFormat('fr-FR').format(selectedEtatPaiement.montant_retenu)} FCFA` : 'N/A'}
                  </Typography>
                </Box>
              </Box>

              {selectedEtatPaiement.fichier && (
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Fichier
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    <a href={selectedEtatPaiement.fichier} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2' }}>
                      {selectedEtatPaiement.fichier}
                    </a>
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Créé le
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {selectedEtatPaiement.created_at ? new Date(selectedEtatPaiement.created_at).toLocaleString('fr-FR') : 'N/A'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Modifié le
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {selectedEtatPaiement.updated_at ? new Date(selectedEtatPaiement.updated_at).toLocaleString('fr-FR') : 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)} color="inherit">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogue pour changer l'état du paiement */}
      <Dialog 
        open={stateDialogOpen} 
        onClose={() => setStateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SwapHorizIcon color="primary" />
            <Typography variant="h6">Changer l'état du paiement</Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedEtatPaiement && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Agent
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {selectedEtatPaiement.agent?.matricule} - {selectedEtatPaiement.agent?.nom} {selectedEtatPaiement.agent?.prenom}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  État actuel
                </Typography>
                <Chip 
                  label={selectedEtatPaiement.state_etat_paiement?.nom || 'Non défini'}
                  color={getStateColor(selectedEtatPaiement.state_etat_paiement?.code)}
                  size="small"
                />
              </Box>

              <FormControl fullWidth>
                <InputLabel id="new-state-label">Nouvel état *</InputLabel>
                <Select
                  labelId="new-state-label"
                  id="new-state"
                  value={selectedState}
                  label="Nouvel état *"
                  onChange={(e) => setSelectedState(e.target.value)}
                >
                  {stateEtatPaiements.map((state) => (
                    <MenuItem 
                      key={state.id} 
                      value={state.id}
                      disabled={state.id === selectedEtatPaiement.state_etat_paiement_id}
                    >
                      {state.nom}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStateDialogOpen(false)} color="inherit">
            Annuler
          </Button>
          <Button 
            onClick={handleChangeState} 
            variant="contained" 
            color="primary"
            disabled={!selectedState}
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>

      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <TextField
          fullWidth
          placeholder="Rechercher par agent, période ou type..."
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
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}>Agent</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}>Période</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }} align="right">Montant Total</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }} align="right">Montant Net</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }} align="right">Montant Retenu</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}>État</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredPaiements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                    <PaymentIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      Aucun état de paiement
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPaiements.map((paiement) => (
                  <TableRow
                    key={paiement.id}
                    hover
                    selected={selectedEtatPaiement?.id === paiement.id}
                    onClick={() => dispatch(setSelectedEtatPaiement(paiement))}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {paiement.agent?.prenom} {paiement.agent?.nom}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={paiement.periode} color="secondary" size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Chip label={paiement.type} color="primary" size="small" variant="outlined" />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        {paiement.montant_total ? new Intl.NumberFormat('fr-FR').format(paiement.montant_total) + ' FCFA' : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 500, color: 'success.main' }}>
                        {paiement.montant_net ? new Intl.NumberFormat('fr-FR').format(paiement.montant_net) + ' FCFA' : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ color: 'error.main' }}>
                        {paiement.montant_retenu ? new Intl.NumberFormat('fr-FR').format(paiement.montant_retenu) + ' FCFA' : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={paiement.state_etat_paiement?.nom || 'Non défini'}
                        color={getStateColor(paiement.state_etat_paiement?.code)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Voir détails">
                        <IconButton
                          size="small"
                          color="info"
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(setSelectedEtatPaiement(paiement));
                            setViewDialogOpen(true);
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Changer l'état">
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(setSelectedEtatPaiement(paiement));
                            setSelectedState(paiement.state_etat_paiement_id || '');
                            setStateDialogOpen(true);
                          }}
                        >
                          <SwapHorizIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Historique d'état">
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(setSelectedEtatPaiement(paiement));
                            setHistoryDialogOpen(true);
                          }}
                        >
                          <HistoryIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Audit complet">
                        <IconButton
                          size="small"
                          color="info"
                          onClick={(e) => {
                            e.stopPropagation();
                            openAuditDialog(paiement);
                          }}
                        >
                          <FindInPageIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Modifier">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingPaiement(paiement);
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
                            dispatch(setSelectedEtatPaiement(paiement));
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

      {/* Dialog d'historique des états */}
      <StateHistoryDialog
        open={historyDialogOpen}
        onClose={() => setHistoryDialogOpen(false)}
        etatPaiement={selectedEtatPaiement}
      />

      {/* Dialog d'audit complet */}
      <AuditHistoryDialog
        open={auditDialogOpen}
        onClose={() => {
          setAuditDialogOpen(false);
          dispatch(clearAuditLogs());
        }}
        auditLogs={auditLogs}
        etatPaiement={selectedEtatPaiement}
      />
    </Box>
  );
};

export default EtatPaiements;
