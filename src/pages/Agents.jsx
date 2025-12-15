import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import {
  fetchAgents,
  createAgent,
  updateAgent,
  deleteAgent,
  setSelectedAgent
} from '../features/agents/agentSlice';
import { fetchStructures } from '../features/structures/structureSlice';
import { fetchBanques } from '../features/banques/banqueSlice';
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
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
  Badge as BadgeIcon,
  CreditCard as CreditCardIcon,
  Business as BusinessIcon,
  Cake as CakeIcon
} from '@mui/icons-material';
import AgentForm from '../components/AgentForm';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

dayjs.locale('fr');

// Fonction utilitaire pour formater les dates
const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    return dayjs(dateString).format('DD/MM/YYYY');
  } catch (error) {
    return '-';
  }
};

const Agents = () => {
  const dispatch = useAppDispatch();
  const { agents, isLoading, error, selectedAgent } = useAppSelector((state) => state.agents);
  const { structures } = useAppSelector((state) => state.structures);
  const [editingAgent, setEditingAgent] = useState(null);
  const [viewingAgent, setViewingAgent] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [formErrors, setFormErrors] = useState(null);
  const [filterStructure, setFilterStructure] = useState('');

  useEffect(() => {
    dispatch(fetchAgents());
    dispatch(fetchStructures());
    dispatch(fetchBanques());
  }, [dispatch]);

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.matricule?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStructure = filterStructure === '' || agent.structure_id === Number(filterStructure);
    
    return matchesSearch && matchesStructure;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <PersonIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 0, fontWeight: 600 }}>
            Gestion des Agents
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gérez les agents et leurs informations
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setEditingAgent({})}
          size="large"
          sx={{ boxShadow: 3 }}
        >
          Nouvel Agent
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
        <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Total Agents</Typography>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {agents.length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Agents Actifs</Typography>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {agents.length}
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
        open={Boolean(editingAgent)}
        onClose={() => setEditingAgent(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon />
          {editingAgent?.id ? 'Modifier l\'agent' : 'Nouvel agent'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <AgentForm
            agent={editingAgent}
            errors={formErrors}
            onSubmit={(data) => {
              setFormErrors(null); // Réinitialiser les erreurs
              if (editingAgent?.id) {
                dispatch(updateAgent({ id: editingAgent.id, agentData: data }))
                  .unwrap()
                  .then(() => {
                    setSuccessMessage('Agent mis à jour avec succès');
                    setEditingAgent(null);
                    setFormErrors(null);
                  })
                  .catch((error) => {
                    if (error.errors) {
                      setFormErrors(error.errors);
                    }
                  });
              } else {
                dispatch(createAgent(data))
                  .unwrap()
                  .then(() => {
                    setSuccessMessage('Agent créé avec succès');
                    setEditingAgent(null);
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
              setEditingAgent(null);
              setFormErrors(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(viewingAgent)}
        onClose={() => setViewingAgent(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', display: 'flex', alignItems: 'center', gap: 2, p: 3 }}>
          <PersonIcon sx={{ fontSize: 28 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0 }}>
              Profil de l'agent
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              {viewingAgent?.prenom} {viewingAgent?.nom}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {viewingAgent && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* En-tête avec Avatar */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'primary.main',
                    fontSize: '2rem',
                    fontWeight: 600
                  }}
                >
                  {`${viewingAgent.prenom?.[0] || ''}${viewingAgent.nom?.[0] || ''}`}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {viewingAgent.civilite} {viewingAgent.prenom} {viewingAgent.nom}
                  </Typography>
                  {viewingAgent.matricule && (
                    <Chip
                      icon={<BadgeIcon />}
                      label={viewingAgent.matricule}
                      color="primary"
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  )}
                </Box>
              </Box>

              <Box sx={{ borderTop: '2px solid #e0e0e0', pt: 2 }} />

              {/* Section Contact */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon fontSize="small" />
                  Informations de Contact
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, ml: 3.5 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Email</Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>{viewingAgent.email}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Téléphone</Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>{viewingAgent.telephone || '-'}</Typography>
                  </Box>
                </Box>
              </Box>

              {/* Section Identité */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BadgeIcon fontSize="small" />
                  Informations Personnelles
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, ml: 3.5 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Date de naissance</Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>{formatDate(viewingAgent.date_de_naissance)}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Lieu de naissance</Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>{viewingAgent.lieu_de_naissance || '-'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Numéro CNI</Typography>
                    <Typography variant="body2" sx={{ mt: 0.5, fontFamily: 'monospace', fontWeight: 500 }}>
                      {viewingAgent.numero_cni}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Date de délivrance CNI</Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>{formatDate(viewingAgent.date_delivrance_cni)}</Typography>
                  </Box>
                  <Box sx={{ gridColumn: '1 / -1' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Lieu de délivrance CNI</Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>{viewingAgent.lieu_delivrance_cni || '-'}</Typography>
                  </Box>
                </Box>
              </Box>

              {/* Section Adresse */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOnIcon fontSize="small" />
                  Adresse
                </Typography>
                <Box sx={{ ml: 3.5 }}>
                  <Typography variant="body2">{viewingAgent.adresse}</Typography>
                </Box>
              </Box>

              {/* Section Affectation */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BusinessIcon fontSize="small" />
                  Affectation et Organisation
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, ml: 3.5 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Structure</Typography>
                    <Box sx={{ mt: 0.8 }}>
                      <Chip
                        label={viewingAgent.structure?.nom || 'Non assigné'}
                        color="secondary"
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Banque</Typography>
                    <Box sx={{ mt: 0.8 }}>
                      <Chip
                        label={viewingAgent.banque?.nom || 'Non assigné'}
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Section Informations Bancaires */}
              {(viewingAgent.numero_compte || viewingAgent.iban) && (
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CreditCardIcon fontSize="small" />
                    Informations Bancaires
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, ml: 3.5 }}>
                    {viewingAgent.numero_compte && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Numéro de compte</Typography>
                        <Typography variant="body2" sx={{ mt: 0.5, fontFamily: 'monospace', fontWeight: 500 }}>
                          {viewingAgent.numero_compte}
                        </Typography>
                      </Box>
                    )}
                    {viewingAgent.iban && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>IBAN</Typography>
                        <Typography variant="body2" sx={{ mt: 0.5, fontFamily: 'monospace', fontWeight: 500, fontSize: '0.85rem' }}>
                          {viewingAgent.iban}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
          <Button onClick={() => setViewingAgent(null)} variant="outlined">
            Fermer
          </Button>
          <Button
            onClick={() => {
              setEditingAgent(viewingAgent);
              setViewingAgent(null);
            }}
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
          >
            Modifier
          </Button>
        </DialogActions>
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
            Êtes-vous sûr de vouloir supprimer cet agent ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            Annuler
          </Button>
          <Button
            onClick={() => {
              if (selectedAgent) {
                dispatch(deleteAgent(selectedAgent.id))
                  .unwrap()
                  .then(() => {
                    setSuccessMessage('Agent supprimé avec succès');
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
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <TextField
            fullWidth
            placeholder="Rechercher par nom, prénom ou matricule..."
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
          <FormControl sx={{ minWidth: { xs: '100%', sm: 250 } }}>
            <InputLabel>Structure</InputLabel>
            <Select
              value={filterStructure}
              onChange={(e) => setFilterStructure(e.target.value)}
              label="Structure"
            >
              <MenuItem value="">Toutes les structures</MenuItem>
              {structures.map((structure) => (
                <MenuItem key={structure.id} value={structure.id}>
                  {structure.nom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2, boxShadow: 3 }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}>Nom</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}>Prénom</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}>Matricule</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}>Structure</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredAgents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <PersonIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      Aucun agent
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAgents.map((agent) => (
                  <TableRow
                    key={agent.id}
                    hover
                    selected={selectedAgent?.id === agent.id}
                    onClick={() => dispatch(setSelectedAgent(agent))}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ bgcolor: 'primary.light', width: 32, height: 32 }}>
                          {agent.nom?.charAt(0)}
                        </Avatar>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {agent.nom}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">
                        {agent.prenom}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {agent.matricule ? (
                        <Chip label={agent.matricule} color="primary" size="small" />
                      ) : (
                        <Typography color="text.secondary" fontSize="0.875rem">-</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={agent.structure?.diminutif || agent.structure?.nom || 'Non assigné'}
                        variant="outlined"
                        size="small"
                        color="secondary"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Voir">
                        <IconButton
                          size="small"
                          color="info"
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingAgent(agent);
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Modifier">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingAgent(agent);
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
                            dispatch(setSelectedAgent(agent));
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

export default Agents;
