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
  TextField
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Description as DescriptionIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  History as HistoryIcon,
  FindInPage as FindInPageIcon,
  PictureAsPdf as PdfIcon
} from '@mui/icons-material';
import ContratForm from '../components/ContratForm';
import AuditHistoryDialog from '../components/contrats/AuditHistoryDialog';
import dayjs from 'dayjs';

const Contrats = () => {
  const dispatch = useAppDispatch();
  const { contrats, isLoading, error, selectedContrat } = useAppSelector((state) => state.contrats);
  const { logs: auditLogs } = useAppSelector((state) => state.auditLogs);
  // structures, agents et stateContrats chargés pour ContratForm
  useAppSelector((state) => state.structures);
  useAppSelector((state) => state.agents);
  useAppSelector((state) => state.stateContrats);
  const [editingContrat, setEditingContrat] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [auditDialogOpen, setAuditDialogOpen] = useState(false);
  const [stateHistory, setStateHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [formErrors, setFormErrors] = useState(null);

  useEffect(() => {
    dispatch(fetchContrats());
    dispatch(fetchStateContrats());
    dispatch(fetchAgents());
    dispatch(fetchStructures());
  }, [dispatch]);

  const handleCreate = async (data) => {
    try {
      await dispatch(createContrat(data)).unwrap();
      setEditingContrat(null);
      setSuccessMessage('Contrat créé avec succès');
      setFormErrors(null);
      setTimeout(() => setSuccessMessage(''), 3000);
      // Recharger la liste pour s'assurer que toutes les relations sont à jour
      dispatch(fetchContrats());
    } catch (err) {
      setFormErrors(err);
    }
  };

  const handleUpdate = async (data) => {
    try {
      await dispatch(updateContrat({ id: editingContrat.id, contratData: data })).unwrap();
      setEditingContrat(null);
      setSuccessMessage('Contrat modifié avec succès');
      setFormErrors(null);
      setTimeout(() => setSuccessMessage(''), 3000);
      // Recharger la liste pour s'assurer que toutes les relations sont à jour
      dispatch(fetchContrats());
    } catch (err) {
      setFormErrors(err);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteContrat(selectedContrat.id)).unwrap();
      setDeleteDialogOpen(false);
      dispatch(setSelectedContrat(null));
      setSuccessMessage('Contrat supprimé avec succès');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setDeleteDialogOpen(false);
      alert(err || 'Erreur lors de la suppression');
    }
  };

  const openDeleteDialog = (contrat) => {
    dispatch(setSelectedContrat(contrat));
    setDeleteDialogOpen(true);
  };

  const openHistoryDialog = async (contrat) => {
    dispatch(setSelectedContrat(contrat));
    setHistoryDialogOpen(true);
    setLoadingHistory(true);
    
    try {
      const response = await fetch(`http://localhost:8000/api/contrats/${contrat.id}/state-history`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      console.log('Historique reçu:', data);
      if (data.success && data.data) {
        setStateHistory(data.data);
      } else {
        setStateHistory([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
      setStateHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const openAuditDialog = async (contrat) => {
    dispatch(setSelectedContrat(contrat));
    setAuditDialogOpen(true);
    dispatch(fetchAuditLogs({ table: 'contrats', recordId: contrat.id }));
  };

  useEffect(() => {
    dispatch(fetchContrats());
    dispatch(fetchStateContrats());
    dispatch(fetchAgents());
    dispatch(fetchStructures());
  }, [dispatch]);

  const filteredContrats = contrats.filter(contrat =>
    contrat.agent?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contrat.agent?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contrat.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contrat.structure?.nom?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const contratsActifs = contrats.filter(c => c.current_state?.code === 'EN_COURS');

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
        onClose={() => {
          setEditingContrat(null);
          setFormErrors(null);
        }}
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
            onSubmit={editingContrat?.id ? handleUpdate : handleCreate}
            onCancel={() => {
              setEditingContrat(null);
              setFormErrors(null);
            }}
            errors={formErrors}
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
            onClick={handleDelete}
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
          Détails du contrat
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedContrat && (
            <Box sx={{ display: 'grid', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Type de contrat
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5 }}>
                  {selectedContrat.type || 'N/A'}
                </Typography>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Agent
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {selectedContrat.agent ? `${selectedContrat.agent.prenom} ${selectedContrat.agent.nom}` : 'N/A'}
                  </Typography>
                  {selectedContrat.agent?.matricule && (
                    <Typography variant="caption" color="text.secondary">
                      Matricule: {selectedContrat.agent.matricule}
                    </Typography>
                  )}
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Structure
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {selectedContrat.structure?.nom || 'N/A'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Date de début
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {selectedContrat.date_debut ? dayjs(selectedContrat.date_debut).format('DD/MM/YYYY') : 'N/A'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Date de fin
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {selectedContrat.date_fin ? dayjs(selectedContrat.date_fin).format('DD/MM/YYYY') : 'N/A'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Montant total
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 600, color: 'primary.main' }}>
                    {selectedContrat.montant_total ? `${selectedContrat.montant_total.toLocaleString()} FCFA` : 'N/A'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Montant net
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 600, color: 'success.main' }}>
                    {selectedContrat.montant_net ? `${selectedContrat.montant_net.toLocaleString()} FCFA` : 'N/A'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Montant retenu
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 600, color: 'warning.main' }}>
                    {selectedContrat.montant_retenu ? `${selectedContrat.montant_retenu.toLocaleString()} FCFA` : 'N/A'}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Fonction
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5 }}>
                  {selectedContrat.fonction || 'N/A'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Diplôme
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5 }}>
                  {selectedContrat.diplome || <em style={{ color: '#999' }}>Non renseigné</em>}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Tâches et missions
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5, whiteSpace: 'pre-line' }}>
                  {selectedContrat.taches ? (
                    selectedContrat.taches.split(';').map((tache, index) => (
                      <Box key={index} component="span" sx={{ display: 'block', mb: 0.5 }}>
                        • {tache.trim()}
                      </Box>
                    ))
                  ) : (
                    <em style={{ color: '#999' }}>Non renseigné</em>
                  )}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  État du contrat
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    label={selectedContrat.current_state?.nom || 'Non défini'}
                    color={selectedContrat.current_state?.nom?.toLowerCase().includes('actif') ? 'success' : 'default'}
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              </Box>

              {selectedContrat.created_at && (
                <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Typography variant="caption" color="text.secondary">
                    Créé le {dayjs(selectedContrat.created_at).format('DD/MM/YYYY à HH:mm')}
                  </Typography>
                  {selectedContrat.updated_at && selectedContrat.updated_at !== selectedContrat.created_at && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                      Modifié le {dayjs(selectedContrat.updated_at).format('DD/MM/YYYY à HH:mm')}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)} color="inherit">
            Fermer
          </Button>
          <Button
            onClick={() => {
              setViewDialogOpen(false);
              setEditingContrat(selectedContrat);
            }}
            color="primary"
            variant="contained"
            startIcon={<EditIcon />}
          >
            Modifier
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Historique des états */}
      <Dialog
        open={historyDialogOpen}
        onClose={() => setHistoryDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ bgcolor: 'info.main', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
          <HistoryIcon />
          Historique des états du contrat
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {loadingHistory ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : stateHistory.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <HistoryIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Aucun historique d'état disponible
              </Typography>
              <Typography variant="body2" color="text.secondary">
                L'historique sera créé lors du premier changement d'état de ce contrat.
              </Typography>
              {selectedContrat?.current_state && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    État actuel :
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      label={selectedContrat.current_state.nom}
                      color="primary"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                </Box>
              )}
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {stateHistory.map((item, index) => (
                <Paper
                  key={item.id}
                  elevation={2}
                  sx={{
                    p: 2,
                    borderLeft: 4,
                    borderColor: index === 0 ? 'primary.main' : 'grey.300'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box>
                      <Chip
                        label={item.state_name}
                        color={index === 0 ? 'primary' : 'default'}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                      {index === 0 && (
                        <Chip
                          label="État actuel"
                          color="success"
                          size="small"
                          sx={{ ml: 1, fontWeight: 600 }}
                        />
                      )}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {item.date}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Modifié par
                      </Typography>
                      <Typography variant="body2">
                        {item.changed_by}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Date
                      </Typography>
                      <Typography variant="body2">
                        {dayjs(item.changed_at).format('DD/MM/YYYY à HH:mm')}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHistoryDialogOpen(false)} color="inherit">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Audit complet */}
      <AuditHistoryDialog
        open={auditDialogOpen}
        onClose={() => {
          setAuditDialogOpen(false);
          dispatch(clearAuditLogs());
        }}
        auditLogs={auditLogs}
        contrat={selectedContrat}
      />

      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <TextField
          fullWidth
          placeholder="Rechercher par agent, type ou structure..."
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
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}>Type</TableCell>
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
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {contrat.agent?.prenom} {contrat.agent?.nom}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={contrat.type} color="primary" size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={contrat.structure?.diminutif || contrat.structure?.nom || 'Non assigné'}
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
                        label={contrat.current_state?.nom || 'Non défini'}
                        size="small"
                        color={contrat.current_state?.nom?.toLowerCase().includes('actif') ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Voir détails">
                        <IconButton
                          size="small"
                          color="info"
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(setSelectedContrat(contrat));
                            setViewDialogOpen(true);
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Historique des états">
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            openHistoryDialog(contrat);
                          }}
                        >
                          <HistoryIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Audit complet">
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={(e) => {
                            e.stopPropagation();
                            openAuditDialog(contrat);
                          }}
                        >
                          <FindInPageIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Télécharger PDF">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
                              const token = localStorage.getItem('token');
                              
                              const response = await fetch(`${API_BASE_URL}/api/contrats/${contrat.id}/download-pdf`, {
                                method: 'GET',
                                headers: {
                                  'Authorization': `Bearer ${token}`,
                                  'Accept': 'application/pdf',
                                },
                              });

                              if (!response.ok) {
                                throw new Error('Erreur lors du téléchargement du PDF');
                              }

                              const blob = await response.blob();
                              const url = window.URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `contrat_${contrat.agent?.nom}_${contrat.agent?.prenom}.pdf`;
                              document.body.appendChild(a);
                              a.click();
                              window.URL.revokeObjectURL(url);
                              document.body.removeChild(a);
                            } catch (error) {
                              console.error('Erreur PDF:', error);
                              alert('Erreur lors du téléchargement du PDF');
                            }
                          }}
                        >
                          <PdfIcon />
                        </IconButton>
                      </Tooltip>
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
                            openDeleteDialog(contrat);
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
