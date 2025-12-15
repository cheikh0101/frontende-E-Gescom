import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  Send as SendIcon,
  History as HistoryIcon,
  Person as PersonIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  fetchInactiveUsers,
  fetchPendingRelances,
  fetchRelanceHistory,
  fetchStatistics,
  approveRelance,
  rejectRelance,
  createManualRelance,
} from '../features/relances/relanceSlice';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const SuiviActivite: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    inactiveUsers,
    pendingRelances,
    relanceHistory,
    statistics,
    loading,
    error,
    actionLoading,
  } = useAppSelector((state) => state.relances);

  const [tabValue, setTabValue] = useState(0);
  const [selectedRelance, setSelectedRelance] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterStatut, setFilterStatut] = useState('');
  const [inactivityDays, setInactivityDays] = useState(7);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    dispatch(fetchInactiveUsers(inactivityDays));
    dispatch(fetchPendingRelances());
    dispatch(fetchStatistics());
    if (tabValue === 2) {
      dispatch(fetchRelanceHistory(filterStatut ? { statut: filterStatut } : undefined));
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    if (newValue === 2 && relanceHistory.length === 0) {
      dispatch(fetchRelanceHistory());
    }
  };

  const handleApprove = async (id: number) => {
    await dispatch(approveRelance(id));
    loadData();
  };

  const handleReject = async (id: number) => {
    await dispatch(rejectRelance(id));
    loadData();
  };

  const handleCreateManual = async (userId: number) => {
    await dispatch(createManualRelance(userId));
    loadData();
  };

  const handleViewDetails = (relance: any) => {
    setSelectedRelance(relance);
    setDialogOpen(true);
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'en_attente_validation':
        return 'warning';
      case 'approuve':
        return 'info';
      case 'envoye':
        return 'success';
      case 'rejete':
        return 'error';
      case 'echoue':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (statut: string) => {
    switch (statut) {
      case 'en_attente_validation':
        return 'En attente';
      case 'approuve':
        return 'Approuvé';
      case 'envoye':
        return 'Envoyé';
      case 'rejete':
        return 'Rejeté';
      case 'echoue':
        return 'Échoué';
      default:
        return statut;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && !statistics) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" gutterBottom>
            Suivi d'Activité & Relances
          </Typography>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadData}
            disabled={loading}
          >
            Actualiser
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => {}}>
            {error}
          </Alert>
        )}

        {/* Statistics Cards */}
        {statistics && (
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Utilisateurs Actifs
                  </Typography>
                  <Typography variant="h4">{statistics.inactivity.active_users}</Typography>
                  <Typography variant="body2" color="success.main">
                    {statistics.inactivity.activity_rate}% taux d'activité
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Inactifs (7+ jours)
                  </Typography>
                  <Typography variant="h4">{statistics.inactivity.inactive_7_days}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Relances en Attente
                  </Typography>
                  <Typography variant="h4">{statistics.relances.pending}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Envoyées Aujourd'hui
                  </Typography>
                  <Typography variant="h4">{statistics.relances.sent_today}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Utilisateurs Inactifs" />
            <Tab label="Relances en Attente" />
            <Tab label="Historique" />
          </Tabs>
        </Paper>

        {/* Tab 1: Inactive Users */}
        <TabPanel value={tabValue} index={0}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Utilisateurs Inactifs</Typography>
            <TextField
              select
              size="small"
              label="Inactivité"
              value={inactivityDays}
              onChange={(e) => {
                setInactivityDays(Number(e.target.value));
                dispatch(fetchInactiveUsers(Number(e.target.value)));
              }}
              sx={{ width: 150 }}
            >
              <MenuItem value={7}>7+ jours</MenuItem>
              <MenuItem value={15}>15+ jours</MenuItem>
              <MenuItem value={30}>30+ jours</MenuItem>
            </TextField>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Jours d'Inactivité</TableCell>
                  <TableCell>Dernière Activité</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inactiveUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Aucun utilisateur inactif trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  inactiveUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.jours_inactivite >= 999 ? 'Jamais connecté' : `${user.jours_inactivite} jours`}
                          color={user.jours_inactivite >= 999 ? 'default' : user.jours_inactivite >= 30 ? 'error' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatDate(user.last_activity_at)}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Créer relance manuelle">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleCreateManual(user.id)}
                            disabled={actionLoading}
                          >
                            <SendIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Tab 2: Pending Relances */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" mb={2}>
            Relances en Attente de Validation
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Utilisateur</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Inactivité</TableCell>
                  <TableCell>Date Création</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingRelances.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Aucune relance en attente
                    </TableCell>
                  </TableRow>
                ) : (
                  pendingRelances.map((relance) => (
                    <TableRow key={relance.id}>
                      <TableCell>{relance.user?.name}</TableCell>
                      <TableCell>{relance.user?.email}</TableCell>
                      <TableCell>
                        <Chip label={relance.jours_inactivite >= 999 ? 'Jamais connecté' : `${relance.jours_inactivite} jours`} size="small" />
                      </TableCell>
                      <TableCell>{formatDate(relance.created_at)}</TableCell>
                      <TableCell>
                        <Button size="small" onClick={() => handleViewDetails(relance)}>
                          Voir message
                        </Button>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Approuver et envoyer">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleApprove(relance.id)}
                            disabled={actionLoading}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Rejeter">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleReject(relance.id)}
                            disabled={actionLoading}
                          >
                            <CancelIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Tab 3: History */}
        <TabPanel value={tabValue} index={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Historique des Relances</Typography>
            <TextField
              select
              size="small"
              label="Filtrer par statut"
              value={filterStatut}
              onChange={(e) => {
                setFilterStatut(e.target.value);
                dispatch(fetchRelanceHistory(e.target.value ? { statut: e.target.value } : undefined));
              }}
              sx={{ width: 200 }}
            >
              <MenuItem value="">Tous</MenuItem>
              <MenuItem value="approuve">Approuvé</MenuItem>
              <MenuItem value="envoye">Envoyé</MenuItem>
              <MenuItem value="rejete">Rejeté</MenuItem>
              <MenuItem value="echoue">Échoué</MenuItem>
            </TextField>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Utilisateur</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell>Date Création</TableCell>
                  <TableCell>Date Envoi</TableCell>
                  <TableCell>Approuvé Par</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {relanceHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Aucun historique trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  relanceHistory.map((relance) => (
                    <TableRow key={relance.id}>
                      <TableCell>{relance.user?.name}</TableCell>
                      <TableCell>{relance.user?.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(relance.statut)}
                          color={getStatusColor(relance.statut)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatDate(relance.created_at)}</TableCell>
                      <TableCell>{formatDate(relance.date_envoi)}</TableCell>
                      <TableCell>{relance.approvedBy?.name || 'N/A'}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => handleViewDetails(relance)}>
                          <HistoryIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Box>

      {/* Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Détails de la Relance</DialogTitle>
        <DialogContent>
          {selectedRelance && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Utilisateur
              </Typography>
              <Typography variant="body1" mb={2}>
                {selectedRelance.user?.name} ({selectedRelance.user?.email})
              </Typography>

              <Typography variant="subtitle2" gutterBottom>
                Statut
              </Typography>
              <Chip
                label={getStatusLabel(selectedRelance.statut)}
                color={getStatusColor(selectedRelance.statut)}
                sx={{ mb: 2 }}
              />

              <Typography variant="subtitle2" gutterBottom>
                Message
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'grey.50', mb: 2 }}>
                <Typography variant="body2" style={{ whiteSpace: 'pre-line' }}>
                  {selectedRelance.message}
                </Typography>
              </Paper>

              <Typography variant="subtitle2" gutterBottom>
                Informations
              </Typography>
              <Typography variant="body2">
                Créé le: {formatDate(selectedRelance.created_at)}
              </Typography>
              {selectedRelance.date_approbation && (
                <Typography variant="body2">
                  Approuvé le: {formatDate(selectedRelance.date_approbation)}
                </Typography>
              )}
              {selectedRelance.date_envoi && (
                <Typography variant="body2">
                  Envoyé le: {formatDate(selectedRelance.date_envoi)}
                </Typography>
              )}
              {selectedRelance.erreur && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {selectedRelance.erreur}
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SuiviActivite;
