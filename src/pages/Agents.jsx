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
  Avatar
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import AgentForm from '../components/AgentForm';

const Agents = () => {
  const dispatch = useAppDispatch();
  const { agents, isLoading, error, selectedAgent } = useAppSelector((state) => state.agents);
  const [editingAgent, setEditingAgent] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchAgents());
    dispatch(fetchStructures());
  }, [dispatch]);

  const filteredAgents = agents.filter(agent =>
    agent.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.matricule?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            onSubmit={(data) => {
              if (editingAgent?.id) {
                dispatch(updateAgent({ id: editingAgent.id, ...data }))
                  .unwrap()
                  .then(() => {
                    setSuccessMessage('Agent mis à jour avec succès');
                    setEditingAgent(null);
                  })
                  .catch(() => {});
              } else {
                dispatch(createAgent(data))
                  .unwrap()
                  .then(() => {
                    setSuccessMessage('Agent créé avec succès');
                    setEditingAgent(null);
                  })
                  .catch(() => {});
              }
            }}
            onCancel={() => setEditingAgent(null)}
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
      </Paper>

      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2, boxShadow: 3 }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}>Matricule</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}>Agent</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}>Date de naissance</TableCell>
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
                      <Chip label={agent.matricule} color="primary" size="small" />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ bgcolor: 'primary.light', width: 32, height: 32 }}>
                          {agent.nom?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {agent.nom} {agent.prenom}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {agent.lieu_naissance}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(agent.date_naissance).toLocaleDateString('fr-FR')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={agent.structure?.nom || 'Non assigné'}
                        variant="outlined"
                        size="small"
                        color="secondary"
                      />
                    </TableCell>
                    <TableCell align="right">
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
