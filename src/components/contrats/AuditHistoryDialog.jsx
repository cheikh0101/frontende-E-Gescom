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
    if (value === null || value === undefined) return 'N/A';
    
    // Format monetary values
    if (field?.includes('montant')) {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
      }).format(value);
    }
    
    // Format dates
    if (field?.includes('date')) {
      try {
        return dayjs(value).format('DD/MM/YYYY');
      } catch {
        return value;
      }
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
      if (field === 'updated_at' || field === 'created_at') return false;
      return oldValues[field] !== newValues[field];
    });

    if (changedFields.length === 0) return null;

    return (
      <TableContainer component={Paper} variant="outlined" sx={{ mt: 1 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Champ</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Ancienne valeur</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Nouvelle valeur</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {changedFields.map((field, idx) => (
              <TableRow key={idx} hover>
                <TableCell sx={{ fontWeight: 500 }}>
                  {formatFieldName(field)}
                </TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>
                  {formatValue(oldValues[field], field)}
                </TableCell>
                <TableCell sx={{ color: 'primary.main', fontWeight: 500 }}>
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
                      {log.user?.nom} {log.user?.prenom}
                    </strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {log.created_at && dayjs(log.created_at).format('DD/MM/YYYY à HH:mm')}
                  </Typography>
                </Box>

                {log.action?.toLowerCase() === 'created' ||
                log.action?.toLowerCase() === 'création' ? (
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'rgba(46, 125, 50, 0.1)' }}>
                    <Typography variant="body2" sx={{ color: 'success.dark' }}>
                      Contrat créé
                    </Typography>
                    {log.nouvelles_valeurs && (
                      <Box mt={1}>
                        <Typography variant="caption" color="text.secondary">
                          Valeurs initiales enregistrées
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                ) : log.action?.toLowerCase() === 'deleted' ||
                  log.action?.toLowerCase() === 'suppression' ? (
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'rgba(211, 47, 47, 0.1)' }}>
                    <Typography variant="body2" sx={{ color: 'error.dark' }}>
                      Contrat supprimé
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
