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

const AuditHistoryDialog = ({ open, onClose, auditLogs, etatPaiement }) => {
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
      periode: 'Période',
      agent_id: 'Agent',
      type: 'Type',
      montant_total: 'Montant total',
      montant_net: 'Montant net',
      montant_retenu: 'Montant retenu',
      fichier: 'Fichier',
      state_etat_paiement_id: 'État',
      created_at: 'Date de création',
      updated_at: 'Date de modification',
    };
    return fieldNames[field] || field;
  };

  const formatValue = (value, field) => {
    if (value === null || value === undefined || value === '') {
      return 'N/A';
    }

    // Format montants
    if (field && (field.includes('montant') || field.includes('Montant'))) {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        return new Intl.NumberFormat('fr-FR').format(numValue) + ' FCFA';
      }
    }

    // Format dates
    if (field && (field.includes('date') || field.includes('Date')) && 
        typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
      return dayjs(value).format('DD/MM/YYYY');
    }

    return String(value);
  };

  const renderChanges = (log) => {
    if (log.action === 'created') {
      const newValues = log.nouvelles_valeurs || {};
      const filteredValues = Object.entries(newValues).filter(
        ([key]) => !['id', 'created_at', 'updated_at'].includes(key)
      );

      if (filteredValues.length === 0) {
        return <Typography variant="body2" color="text.secondary">Aucun détail disponible</Typography>;
      }

      return (
        <TableContainer component={Paper} variant="outlined" sx={{ mt: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'success.lighter' }}>Champ</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'success.lighter' }}>Valeur</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredValues.map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell sx={{ fontWeight: 500 }}>{formatFieldName(key)}</TableCell>
                  <TableCell>
                    <Typography variant="body2" color="success.main" sx={{ fontWeight: 500 }}>
                      {formatValue(value, key)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }

    if (log.action === 'updated') {
      const oldValues = log.anciennes_valeurs || {};
      const newValues = log.nouvelles_valeurs || {};
      const changedFields = Object.keys(newValues).filter(
        key => !['id', 'created_at', 'updated_at'].includes(key) &&
               String(oldValues[key]) !== String(newValues[key])
      );

      if (changedFields.length === 0) {
        return <Typography variant="body2" color="text.secondary">Aucun changement détecté</Typography>;
      }

      return (
        <TableContainer component={Paper} variant="outlined" sx={{ mt: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'info.lighter' }}>Champ</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'info.lighter' }}>Ancienne valeur</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'info.lighter' }}>Nouvelle valeur</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {changedFields.map((key) => (
                <TableRow key={key}>
                  <TableCell sx={{ fontWeight: 500 }}>{formatFieldName(key)}</TableCell>
                  <TableCell>
                    <Typography variant="body2" color="error.main" sx={{ textDecoration: 'line-through' }}>
                      {formatValue(oldValues[key], key)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="success.main" sx={{ fontWeight: 500 }}>
                      {formatValue(newValues[key], key)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }

    if (log.action === 'deleted') {
      const oldValues = log.anciennes_valeurs || {};
      const filteredValues = Object.entries(oldValues).filter(
        ([key]) => !['id', 'created_at', 'updated_at'].includes(key)
      );

      if (filteredValues.length === 0) {
        return <Typography variant="body2" color="text.secondary">Aucun détail disponible</Typography>;
      }

      return (
        <TableContainer component={Paper} variant="outlined" sx={{ mt: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'error.lighter' }}>Champ</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'error.lighter' }}>Valeur supprimée</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredValues.map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell sx={{ fontWeight: 500 }}>{formatFieldName(key)}</TableCell>
                  <TableCell>
                    <Typography variant="body2" color="error.main" sx={{ textDecoration: 'line-through' }}>
                      {formatValue(value, key)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }

    return null;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ bgcolor: 'warning.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6">Historique complet des modifications</Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        {etatPaiement && (
          <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              État de paiement
            </Typography>
            <Typography variant="h6" gutterBottom>
              {etatPaiement.agent?.prenom} {etatPaiement.agent?.nom}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip label={etatPaiement.periode} size="small" color="secondary" variant="outlined" />
              <Chip label={etatPaiement.type} size="small" color="primary" variant="outlined" />
              <Chip 
                label={`${new Intl.NumberFormat('fr-FR').format(etatPaiement.montant_total)} FCFA`} 
                size="small" 
                color="info" 
                variant="outlined" 
              />
            </Box>
          </Paper>
        )}

        {!auditLogs || auditLogs.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Aucun historique disponible
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Les modifications seront enregistrées automatiquement
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {auditLogs.map((log, index) => (
              <Paper 
                key={log.id} 
                elevation={2} 
                sx={{ 
                  p: 3,
                  borderLeft: 4,
                  borderColor: `${getActionColor(log.action)}.main`
                }}
              >
                {/* En-tête du log */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip
                      label={log.action === 'created' ? 'Création' : log.action === 'updated' ? 'Modification' : 'Suppression'}
                      color={getActionColor(log.action)}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                    {index === 0 && (
                      <Chip
                        label="Plus récent"
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {dayjs(log.created_at).format('DD/MM/YYYY à HH:mm:ss')}
                  </Typography>
                </Box>

                {/* Informations utilisateur */}
                <Box sx={{ display: 'flex', gap: 3, mb: 2, flexWrap: 'wrap' }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Utilisateur
                    </Typography>
                    <Typography variant="body2">
                      {log.user?.name || 'Utilisateur inconnu'}
                    </Typography>
                    {log.user?.email && (
                      <Typography variant="caption" color="text.secondary">
                        {log.user.email}
                      </Typography>
                    )}
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Adresse IP
                    </Typography>
                    <Typography variant="body2">
                      {log.ip_address || 'N/A'}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Navigateur
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                      {log.user_agent ? log.user_agent.substring(0, 50) + '...' : 'N/A'}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Détails des modifications */}
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Détails des modifications
                </Typography>
                {renderChanges(log)}
              </Paper>
            ))}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuditHistoryDialog;
