import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Paper,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';

const AuditHistoryDialog = ({ open, onClose, auditLogs, contrat }) => {
  const getActionColor = (action) => {
    switch (action?.toLowerCase()) {
      case 'created':
      case 'création':
        return 'success';
      case 'updated':
      case 'modification':
        return 'info';
      case 'deleted':
      case 'suppression':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatFieldName = (field) => {
    const fieldNames = {
      agent_id: 'Agent',
      type: 'Type de contrat',
      date_debut: 'Date de début',
      date_fin: 'Date de fin',
      montant_total: 'Montant total',
      montant_net: 'Montant net',
      montant_retenu: 'Montant retenu',
      fonction: 'Fonction',
      state_contrat_id: 'État du contrat',
      created_at: 'Date de création',
      updated_at: 'Date de modification',
    };
    return fieldNames[field] || field;
  };

  const formatValue = (value, field) => {
    if (value === null || value === undefined || value === '') return 'N/A';
    
    // Format monetary values
    if (field?.includes('montant')) {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }
    
    // Format dates
    if (field?.includes('date') && field !== 'updated_at' && field !== 'created_at') {
      try {
        return dayjs(value).format('DD/MM/YYYY');
      } catch {
        return value;
      }
    }
    
    // Format IDs - afficher juste l'ID sans plus d'info (on ne peut pas résoudre les relations ici)
    if (field === 'agent_id' || field === 'state_contrat_id') {
      return `ID: ${value}`;
    }
    
    return value;
  };

  const renderChanges = (anciennes, nouvelles) => {
    if (!anciennes && !nouvelles) return null;

    const oldValues = anciennes || {};
    const newValues = nouvelles || {};
    
    // Get all unique fields from both old and new values
    const allFields = new Set([
      ...Object.keys(oldValues),
      ...Object.keys(newValues),
    ]);

    // Filter out timestamps and fields that didn't change
    const changedFields = Array.from(allFields).filter(field => {
      // Ignorer les timestamps système
      if (field === 'updated_at' || field === 'created_at') return false;
      // Ignorer les champs techniques
      if (field === 'id') return false;
      // Ne garder que les champs qui ont vraiment changé
      return String(oldValues[field]) !== String(newValues[field]);
    });

    if (changedFields.length === 0) {
      return (
        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
          <Typography variant="body2" color="text.secondary">
            Aucun changement détecté
          </Typography>
        </Paper>
      );
    }

    return (
      <TableContainer component={Paper} variant="outlined" sx={{ mt: 1 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>Champ modifié</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '35%' }}>Ancienne valeur</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '35%' }}>Nouvelle valeur</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {changedFields.map((field, idx) => (
              <TableRow key={idx} hover>
                <TableCell sx={{ fontWeight: 500, color: 'primary.main' }}>
                  {formatFieldName(field)}
                </TableCell>
                <TableCell sx={{ color: 'text.secondary', textDecoration: 'line-through' }}>
                  {formatValue(oldValues[field], field)}
                </TableCell>
                <TableCell sx={{ color: 'success.main', fontWeight: 600 }}>
                  {formatValue(newValues[field], field)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">
            Historique Complet des Modifications
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        {contrat && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Contrat: {contrat.agent?.nom} {contrat.agent?.prenom} - {contrat.type}
          </Typography>
        )}
      </DialogTitle>
      <DialogContent dividers>
        {!auditLogs || auditLogs.length === 0 ? (
          <Box py={4} textAlign="center">
            <Typography color="text.secondary">
              Aucune modification enregistrée pour ce contrat
            </Typography>
          </Box>
        ) : (
          <Box>
            {auditLogs.map((log, index) => (
              <Box key={log.id} mb={3}>
                <Box display="flex" alignItems="center" gap={2} mb={1}>
                  <Chip
                    label={log.action || 'Action'}
                    color={getActionColor(log.action)}
                    size="small"
                  />
                  <Typography variant="body2" color="text.secondary">
                    par{' '}
                    <strong>
                      {log.user?.name || 'Utilisateur inconnu'}
                    </strong>
                    {log.user?.email && (
                      <span style={{ fontWeight: 'normal' }}>
                        {' '}({log.user.email})
                      </span>
                    )}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {log.created_at && dayjs(log.created_at).format('DD/MM/YYYY à HH:mm')}
                  </Typography>
                </Box>

                {log.action?.toLowerCase() === 'created' ||
                log.action?.toLowerCase() === 'création' ? (
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'rgba(46, 125, 50, 0.08)' }}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Typography variant="body2" sx={{ color: 'success.dark', fontWeight: 600 }}>
                        ✓ Contrat créé avec succès
                      </Typography>
                    </Box>
                    {log.nouvelles_valeurs && Object.keys(log.nouvelles_valeurs).length > 0 && (
                      <Box mt={2}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary', mb: 1, display: 'block' }}>
                          Valeurs initiales :
                        </Typography>
                        <Box sx={{ pl: 2 }}>
                          {Object.entries(log.nouvelles_valeurs)
                            .filter(([key]) => !['id', 'created_at', 'updated_at'].includes(key))
                            .map(([key, value], idx) => (
                              <Typography key={idx} variant="caption" component="div" sx={{ color: 'text.secondary', mb: 0.5 }}>
                                • <strong>{formatFieldName(key)}</strong>: {formatValue(value, key)}
                              </Typography>
                            ))}
                        </Box>
                      </Box>
                    )}
                  </Paper>
                ) : log.action?.toLowerCase() === 'deleted' ||
                  log.action?.toLowerCase() === 'suppression' ? (
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'rgba(211, 47, 47, 0.08)' }}>
                    <Typography variant="body2" sx={{ color: 'error.dark', fontWeight: 600 }}>
                      ✗ Contrat supprimé définitivement
                    </Typography>
                  </Paper>
                ) : (
                  renderChanges(log.anciennes_valeurs, log.nouvelles_valeurs)
                )}

                {index < auditLogs.length - 1 && <Divider sx={{ mt: 3 }} />}
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuditHistoryDialog;
