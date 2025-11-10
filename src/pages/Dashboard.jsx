import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { fetchAgents } from '../features/agents/agentSlice';
import { fetchContrats } from '../features/contrats/contratSlice';
import { fetchStructures } from '../features/structures/structureSlice';
import { fetchBanques } from '../features/banques/banqueSlice';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  People as PeopleIcon,
  Description as DescriptionIcon,
  Business as BusinessIcon,
  AccountBalance as BankIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { agents } = useAppSelector((state) => state.agents);
  const { contrats } = useAppSelector((state) => state.contrats);
  const { structures } = useAppSelector((state) => state.structures);
  const { banques } = useAppSelector((state) => state.banques);

  useEffect(() => {
    dispatch(fetchAgents());
    dispatch(fetchContrats());
    dispatch(fetchStructures());
    dispatch(fetchBanques());
  }, [dispatch]);

  // Calculs des statistiques
  const contratsActifs = contrats.filter(c => 
    c.state_contrat?.nom?.toLowerCase().includes('actif')
  ).length;

  const contratsExpirantBientot = contrats.filter(c => {
    const dateFin = dayjs(c.date_fin);
    const aujourd_hui = dayjs();
    const joursDiff = dateFin.diff(aujourd_hui, 'day');
    return joursDiff >= 0 && joursDiff <= 30;
  });

  const contratsExpires = contrats.filter(c => {
    const dateFin = dayjs(c.date_fin);
    return dateFin.isBefore(dayjs());
  }).length;

  // Derniers contrats créés
  const derniersContrats = [...contrats]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  // Derniers agents ajoutés
  const derniersAgents = [...agents]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  const StatCard = ({ title, value, icon, gradient, onClick }) => (
    <Card 
      sx={{ 
        background: gradient, 
        color: 'white', 
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s',
        '&:hover': onClick ? { transform: 'translateY(-4px)' } : {}
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h6" gutterBottom sx={{ opacity: 0.9 }}>
              {title}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
              {value}
            </Typography>
          </Box>
          <Box sx={{ 
            bgcolor: 'rgba(255, 255, 255, 0.2)', 
            p: 1.5, 
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <TrendingUpIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 0, fontWeight: 600 }}>
            Tableau de bord
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Vue d'ensemble de votre gestion contractuelle
          </Typography>
        </Box>
      </Box>

      {/* Alertes */}
      {contratsExpires > 0 && (
        <Alert severity="error" sx={{ mb: 3 }} icon={<WarningIcon />}>
          <strong>{contratsExpires}</strong> contrat{contratsExpires > 1 ? 's' : ''} expiré{contratsExpires > 1 ? 's' : ''}
        </Alert>
      )}

      {contratsExpirantBientot.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }} icon={<WarningIcon />}>
          <strong>{contratsExpirantBientot.length}</strong> contrat{contratsExpirantBientot.length > 1 ? 's' : ''} expirant dans les 30 jours
        </Alert>
      )}

      {/* Cartes de statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Agents"
            value={agents.length}
            icon={<PeopleIcon sx={{ fontSize: 40 }} />}
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            onClick={() => navigate('/agents')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Contrats"
            value={contrats.length}
            icon={<DescriptionIcon sx={{ fontSize: 40 }} />}
            gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            onClick={() => navigate('/contrats')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Contrats Actifs"
            value={contratsActifs}
            icon={<DescriptionIcon sx={{ fontSize: 40 }} />}
            gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
            onClick={() => navigate('/contrats')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Structures"
            value={structures.length}
            icon={<BusinessIcon sx={{ fontSize: 40 }} />}
            gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
            onClick={() => navigate('/structures')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Banques"
            value={banques.length}
            icon={<BankIcon sx={{ fontSize: 40 }} />}
            gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
            onClick={() => navigate('/banques')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Contrats Expirés"
            value={contratsExpires}
            icon={<WarningIcon sx={{ fontSize: 40 }} />}
            gradient="linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Expire Bientôt"
            value={contratsExpirantBientot.length}
            icon={<WarningIcon sx={{ fontSize: 40 }} />}
            gradient="linear-gradient(135deg, #ffa502 0%, #ff7f00 100%)"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Derniers contrats */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Derniers Contrats
              </Typography>
              <Tooltip title="Voir tous les contrats">
                <IconButton size="small" onClick={() => navigate('/contrats')}>
                  <ArrowForwardIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Numéro</TableCell>
                    <TableCell>Agent</TableCell>
                    <TableCell>Date fin</TableCell>
                    <TableCell>État</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {derniersContrats.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                          Aucun contrat
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    derniersContrats.map((contrat) => (
                      <TableRow key={contrat.id} hover>
                        <TableCell>
                          <Chip label={contrat.numero} size="small" color="primary" />
                        </TableCell>
                        <TableCell>
                          {contrat.agent?.nom} {contrat.agent?.prenom}
                        </TableCell>
                        <TableCell>
                          {dayjs(contrat.date_fin).format('DD/MM/YYYY')}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={contrat.state_contrat?.nom || 'N/A'}
                            size="small"
                            color={contrat.state_contrat?.nom?.toLowerCase().includes('actif') ? 'success' : 'default'}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Derniers agents */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Derniers Agents
              </Typography>
              <Tooltip title="Voir tous les agents">
                <IconButton size="small" onClick={() => navigate('/agents')}>
                  <ArrowForwardIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Matricule</TableCell>
                    <TableCell>Nom & Prénom</TableCell>
                    <TableCell>Structure</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {derniersAgents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                          Aucun agent
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    derniersAgents.map((agent) => (
                      <TableRow key={agent.id} hover>
                        <TableCell>
                          <Chip label={agent.matricule} size="small" color="primary" />
                        </TableCell>
                        <TableCell>
                          {agent.nom} {agent.prenom}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={agent.structure?.nom || 'N/A'}
                            size="small"
                            variant="outlined"
                            color="secondary"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Contrats expirant bientôt */}
        {contratsExpirantBientot.length > 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3, bgcolor: '#fff3e0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <WarningIcon color="warning" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Contrats expirant dans les 30 jours
                </Typography>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Numéro</TableCell>
                      <TableCell>Agent</TableCell>
                      <TableCell>Structure</TableCell>
                      <TableCell>Date fin</TableCell>
                      <TableCell>Jours restants</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {contratsExpirantBientot.map((contrat) => {
                      const joursRestants = dayjs(contrat.date_fin).diff(dayjs(), 'day');
                      return (
                        <TableRow key={contrat.id} hover>
                          <TableCell>
                            <Chip label={contrat.numero} size="small" color="primary" />
                          </TableCell>
                          <TableCell>
                            {contrat.agent?.nom} {contrat.agent?.prenom}
                          </TableCell>
                          <TableCell>
                            {contrat.structure?.nom}
                          </TableCell>
                          <TableCell>
                            {dayjs(contrat.date_fin).format('DD/MM/YYYY')}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={`${joursRestants} jour${joursRestants > 1 ? 's' : ''}`}
                              size="small"
                              color={joursRestants <= 7 ? 'error' : 'warning'}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard;
