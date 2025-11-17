import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';
import {
  History as HistoryIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  Autorenew as AutorenewIcon
} from '@mui/icons-material';
import api from '../../services/api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/fr';

dayjs.extend(relativeTime);
dayjs.locale('fr');

const StateHistoryDialog = ({ open, onClose, etatPaiement }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/etat-paiements/${etatPaiement.id}/state-history`);
      setHistory(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la récupération de l\'historique');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && etatPaiement) {
      fetchHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, etatPaiement]);

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

  const getStateIcon = (stateCode) => {
    switch (stateCode) {
      case 'PAYE':
        return <CheckCircleIcon fontSize="small" />;
      case 'REJETE':
        return <CancelIcon fontSize="small" />;
      case 'EN_ATTENTE':
        return <PendingIcon fontSize="small" />;
      case 'EN_COURS_TRAITEMENT':
        return <AutorenewIcon fontSize="small" />;
      case 'VALIDE':
        return <InfoIcon fontSize="small" />;
      default:
        return <InfoIcon fontSize="small" />;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: 'secondary.main', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
        <HistoryIcon />
        Historique des changements d'état
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        {etatPaiement && (
          <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              État de paiement
            </Typography>
            <Typography variant="h6" gutterBottom>
              {etatPaiement.agent?.prenom} {etatPaiement.agent?.nom} - {etatPaiement.periode}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Chip label={etatPaiement.type} size="small" color="primary" variant="outlined" />
              <Chip 
                label={`${new Intl.NumberFormat('fr-FR').format(etatPaiement.montant_total)} FCFA`} 
                size="small" 
                color="secondary" 
                variant="outlined" 
              />
            </Box>
          </Paper>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : history.length === 0 ? (
          <Alert severity="info">Aucun historique de changement d'état disponible</Alert>
        ) : (
          <Timeline position="alternate">
            {history.map((item, index) => (
              <TimelineItem key={item.id}>
                <TimelineOppositeContent 
                  color="text.secondary"
                  sx={{ 
                    py: 2,
                    px: 2
                  }}
                >
                  <Typography variant="body2" fontWeight={600}>
                    {dayjs(item.date_modification).format('DD MMMM YYYY')}
                  </Typography>
                  <Typography variant="caption" display="block">
                    {dayjs(item.date_modification).format('HH:mm:ss')}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                    {dayjs(item.date_modification).fromNow()}
                  </Typography>
                </TimelineOppositeContent>
                
                <TimelineSeparator>
                  <TimelineDot 
                    color={getStateColor(item.state_etat_paiement?.code)}
                    variant={index === 0 ? "filled" : "outlined"}
                    sx={{ 
                      boxShadow: index === 0 ? 3 : 1,
                      transform: index === 0 ? 'scale(1.2)' : 'scale(1)'
                    }}
                  >
                    {getStateIcon(item.state_etat_paiement?.code)}
                  </TimelineDot>
                  {index < history.length - 1 && (
                    <TimelineConnector 
                      sx={{ 
                        bgcolor: index === 0 ? `${getStateColor(item.state_etat_paiement?.code)}.main` : 'grey.400',
                        minHeight: 60
                      }} 
                    />
                  )}
                </TimelineSeparator>
                
                <TimelineContent sx={{ py: 2, px: 2 }}>
                  <Paper 
                    elevation={index === 0 ? 4 : 2} 
                    sx={{ 
                      p: 2.5,
                      border: index === 0 ? 2 : 1,
                      borderColor: index === 0 ? `${getStateColor(item.state_etat_paiement?.code)}.main` : 'divider',
                      bgcolor: index === 0 ? `${getStateColor(item.state_etat_paiement?.code)}.lighter` : 'background.paper',
                      position: 'relative',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 4
                      }
                    }}
                  >
                    {index === 0 && (
                      <Chip 
                        label="État actuel" 
                        size="small" 
                        color="primary"
                        sx={{ 
                          position: 'absolute', 
                          top: 8, 
                          right: 8,
                          fontWeight: 700
                        }}
                      />
                    )}
                    
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={item.state_etat_paiement?.nom || 'État inconnu'}
                        color={getStateColor(item.state_etat_paiement?.code)}
                        size="medium"
                        sx={{ fontWeight: 600, fontSize: '0.875rem' }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                          👤 Modifié par
                        </Typography>
                        <Typography variant="body2" sx={{ ml: 2.5, fontWeight: 500 }}>
                          {item.user?.name || 'Utilisateur inconnu'}
                        </Typography>
                        {item.user?.email && (
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 2.5 }}>
                            {item.user.email}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Paper>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StateHistoryDialog;
