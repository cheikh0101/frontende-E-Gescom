import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Avatar
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  History as HistoryIcon,
  FindInPage as FindInPageIcon,
  MoreVert as MoreVertIcon,
  Calendar as CalendarIcon,
  Person as PersonIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';

const ContratCard = ({
  contrat,
  onView,
  onEdit,
  onDelete,
  onHistory,
  onAudit,
  isSelected
}) => {
  // Calculer le nombre de jours restants
  const today = dayjs();
  const endDate = dayjs(contrat.date_fin);
  const daysRemaining = endDate.diff(today, 'day');
  const totalDays = endDate.diff(dayjs(contrat.date_debut), 'day');
  const progressPercent = Math.max(0, Math.min(100, ((totalDays - daysRemaining) / totalDays) * 100));

  // Déterminer la couleur basée sur les jours restants
  let statusColor = 'success'; // > 30 jours
  let statusLabel = 'Actif';
  if (daysRemaining < 0) {
    statusColor = 'error';
    statusLabel = 'Expiré';
  } else if (daysRemaining < 30) {
    statusColor = 'warning';
    statusLabel = 'À Renouveler';
  }

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: isSelected ? 3 : 1,
        borderColor: isSelected ? 'primary.main' : 'divider',
        borderRadius: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-4px)',
        },
      }}
    >
      {/* Header avec état */}
      <Box sx={{ px: 2, pt: 2, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.9rem' }}>
              {contrat.agent?.prenom?.[0]}{contrat.agent?.nom?.[0]}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {contrat.agent?.prenom} {contrat.agent?.nom}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {contrat.type}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Chip
          label={contrat.current_state?.nom || 'Non défini'}
          size="small"
          color={
            contrat.current_state?.nom?.toLowerCase().includes('actif') ? 'success' : 'default'
          }
          sx={{ fontWeight: 600 }}
        />
      </Box>

      <CardContent sx={{ pt: 1, flex: 1 }}>
        {/* Structure */}
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <BusinessIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {contrat.structure?.diminutif || contrat.structure?.nom || 'Non assigné'}
          </Typography>
        </Box>

        {/* Dates */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Début
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Fin
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {dayjs(contrat.date_debut).format('DD/MM/YYYY')}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {dayjs(contrat.date_fin).format('DD/MM/YYYY')}
            </Typography>
          </Box>
        </Box>

        {/* Barre de progression */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              Progression du contrat
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: statusColor + '.main' }}>
              {daysRemaining < 0 ? 'Expiré' : `${daysRemaining} j restants`}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progressPercent}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                backgroundColor: statusColor + '.main',
              },
            }}
          />
        </Box>

        {/* Statut */}
        <Box sx={{ mb: 2 }}>
          <Chip
            label={statusLabel}
            size="small"
            color={statusColor}
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        </Box>

        {/* Description */}
        {contrat.fonction && (
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Fonction
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
              {contrat.fonction}
            </Typography>
          </Box>
        )}
      </CardContent>

      {/* Actions */}
      <Box
        sx={{
          px: 2,
          py: 1,
          display: 'flex',
          gap: 0.5,
          borderTop: 1,
          borderColor: 'divider',
          justifyContent: 'flex-end',
        }}
      >
        <Tooltip title="Voir détails">
          <IconButton
            size="small"
            color="info"
            onClick={(e) => {
              e.stopPropagation();
              onView(contrat);
            }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Historique">
          <IconButton
            size="small"
            color="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onHistory(contrat);
            }}
          >
            <HistoryIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Audit">
          <IconButton
            size="small"
            color="warning"
            onClick={(e) => {
              e.stopPropagation();
              onAudit(contrat);
            }}
          >
            <FindInPageIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Modifier">
          <IconButton
            size="small"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(contrat);
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Supprimer">
          <IconButton
            size="small"
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(contrat);
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Card>
  );
};

export default ContratCard;
