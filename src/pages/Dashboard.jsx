import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { fetchDashboardData } from '../features/dashboard/dashboardSlice';
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
  Tooltip,
  CircularProgress,
  LinearProgress
} from '@mui/material';
import {
  People as PeopleIcon,
  Description as DescriptionIcon,
  Business as BusinessIcon,
  AccountBalance as BankIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  ArrowForward as ArrowForwardIcon,
  Payments as PaymentsIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.locale('fr');

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data, loading, error } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

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

  const formatMontant = (montant) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(montant) + ' FCFA';
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }} color="text.secondary">
              Chargement des statistiques...
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          <Typography variant="h6">Erreur de chargement</Typography>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!data) {
    return null;
  }

  const { general, finances, contrats_by_state, paiements_by_state, expiring_contracts, agents_by_structure, recent_activities } = data;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <TrendingUpIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 0, fontWeight: 600 }}>
            Tableau de bord
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Vue d'ensemble de votre gestion contractuelle - Mis à jour {dayjs().format('DD MMMM YYYY [à] HH:mm')}
          </Typography>
        </Box>
        <Tooltip title="Actualiser">
          <IconButton onClick={() => dispatch(fetchDashboardData())} color="primary">
            <TimelineIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Alertes */}
      {expiring_contracts.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }} icon={<WarningIcon />}>
          <strong>{expiring_contracts.length}</strong> contrat{expiring_contracts.length > 1 ? 's' : ''} expirant dans les 30 jours
        </Alert>
      )}

      {/* Cartes de statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Agents"
            value={general.total_agents}
            icon={<PeopleIcon sx={{ fontSize: 40 }} />}
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            onClick={() => navigate('/agents')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Contrats"
            value={general.total_contrats}
            icon={<DescriptionIcon sx={{ fontSize: 40 }} />}
            gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            onClick={() => navigate('/contrats')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Paiements"
            value={general.total_paiements}
            icon={<PaymentsIcon sx={{ fontSize: 40 }} />}
            gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
            onClick={() => navigate('/etat-paiements')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Structures"
            value={general.total_structures}
            icon={<BusinessIcon sx={{ fontSize: 40 }} />}
            gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
            onClick={() => navigate('/structures')}
          />
        </Grid>
      </Grid>

      {/* Statistiques financières */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              📊 Finances Contrats
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Montant Total
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {formatMontant(finances.contrats.montant_total)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Montant Net
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    {formatMontant(finances.contrats.montant_net)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Montant Retenu
                  </Typography>
                  <Typography variant="h6" color="error">
                    {formatMontant(finances.contrats.montant_retenu)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              💰 Finances Paiements
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Montant Total
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {formatMontant(finances.paiements.montant_total)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Montant Net
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    {formatMontant(finances.paiements.montant_net)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Montant Retenu
                  </Typography>
                  <Typography variant="h6" color="error">
                    {formatMontant(finances.paiements.montant_retenu)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Répartition par état */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              📋 Contrats par État
            </Typography>
            {contrats_by_state.map((item, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">{item.state_name}</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {item.count} ({item.percentage}%)
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={item.percentage} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              💳 Paiements par État
            </Typography>
            {paiements_by_state.map((item, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">{item.state_name}</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {item.count} ({item.percentage}%)
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={item.percentage} 
                  sx={{ height: 8, borderRadius: 4 }}
                  color={item.state_name === 'Payé' ? 'success' : 'primary'}
                />
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Contrats expirant bientôt */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                ⚠️ Contrats Expirant Bientôt
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
                    <TableCell>Agent</TableCell>
                    <TableCell>Fonction</TableCell>
                    <TableCell>Date fin</TableCell>
                    <TableCell>Jours</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expiring_contracts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                          Aucun contrat expirant bientôt
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    expiring_contracts.map((contrat) => (
                      <TableRow key={contrat.id} hover>
                        <TableCell>{contrat.agent_name}</TableCell>
                        <TableCell>
                          <Chip label={contrat.fonction} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          {dayjs(contrat.date_fin).format('DD/MM/YYYY')}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${contrat.days_remaining}j`}
                            size="small"
                            color={contrat.days_remaining <= 7 ? 'error' : 'warning'}
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

        {/* Agents par structure */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                🏢 Agents par Structure
              </Typography>
              <Tooltip title="Voir toutes les structures">
                <IconButton size="small" onClick={() => navigate('/structures')}>
                  <ArrowForwardIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Structure</TableCell>
                    <TableCell align="center">Agents</TableCell>
                    <TableCell align="center">Contrats</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {agents_by_structure.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                          Aucune donnée
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    agents_by_structure.map((item, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {item.structure_name}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={item.agent_count} 
                            size="small" 
                            color="primary"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={item.contrat_count} 
                            size="small" 
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

        {/* Activités récentes */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              📅 Activités Récentes
            </Typography>
            {recent_activities.length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                Aucune activité récente
              </Typography>
            ) : (
              recent_activities.map((activity, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    p: 2, 
                    mb: 1, 
                    bgcolor: 'grey.50', 
                    borderRadius: 1,
                    borderLeft: 3,
                    borderColor: activity.action === 'created' ? 'success.main' : 'info.main'
                  }}
                >
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    {activity.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {activity.date_human}
                  </Typography>
                </Box>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
