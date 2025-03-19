import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  Divider,
} from '@mui/material';
import {
  Assignment as MissionIcon,
  EmojiEvents as TrophyIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import {
  fetchAvailableMissionsStart,
  fetchAvailableMissionsSuccess,
  fetchAvailableMissionsFailure,
  completeMissionStart,
  completeMissionSuccess,
  completeMissionFailure,
} from '../store/slices/missionSlice';
import { missionService } from '../services/api';

function Missions() {
  const dispatch = useDispatch();
  const { availableMissions, loading, error } = useSelector((state) => state.missions);
  const [selectedMission, setSelectedMission] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [proof, setProof] = useState('');
  const [submissionError, setSubmissionError] = useState('');

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        dispatch(fetchAvailableMissionsStart());
        const response = await missionService.getAvailableMissions();
        dispatch(fetchAvailableMissionsSuccess(response.data));
      } catch (error) {
        dispatch(fetchAvailableMissionsFailure(error.message));
      }
    };

    fetchMissions();
  }, [dispatch]);

  const handleOpenDialog = (mission) => {
    setSelectedMission(mission);
    setOpenDialog(true);
    setProof('');
    setSubmissionError('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMission(null);
    setProof('');
    setSubmissionError('');
  };

  const handleSubmit = async () => {
    if (!proof.trim()) {
      setSubmissionError('Veuillez fournir une preuve de complétion');
      return;
    }

    try {
      dispatch(completeMissionStart());
      const response = await missionService.completeMission(selectedMission._id, proof);
      dispatch(completeMissionSuccess(response.data));
      handleCloseDialog();
    } catch (error) {
      dispatch(completeMissionFailure(error.message));
      setSubmissionError(error.response?.data?.message || 'Erreur lors de la soumission');
    }
  };

  const getMissionTypeColor = (type) => {
    switch (type) {
      case 'Quotidienne':
        return 'primary';
      case 'Hebdomadaire':
        return 'secondary';
      case 'Mensuelle':
        return 'success';
      case 'Spéciale':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Missions disponibles
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {availableMissions?.map((mission) => (
          <Grid item xs={12} md={6} lg={4} key={mission._id}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <MissionIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">{mission.titre}</Typography>
                </Box>

                <Chip
                  label={mission.type}
                  color={getMissionTypeColor(mission.type)}
                  size="small"
                  sx={{ mb: 2 }}
                />

                <Typography variant="body2" color="textSecondary" paragraph>
                  {mission.description}
                </Typography>

                <Box display="flex" alignItems="center" mb={2}>
                  <TimeIcon sx={{ mr: 1, fontSize: 16 }} />
                  <Typography variant="body2">
                    Du {new Date(mission.dateDebut).toLocaleDateString()} au{' '}
                    {new Date(mission.dateFin).toLocaleDateString()}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={2}>
                  <TrophyIcon sx={{ mr: 1, fontSize: 16, color: 'primary.main' }} />
                  <Typography variant="body2">
                    {mission.pointsRecompense} points • {mission.recompenseToken} FL
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" gutterBottom>
                  Critères de complétion :
                </Typography>
                <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                  {mission.criteres.map((critere, index) => (
                    <Typography component="li" variant="body2" key={index}>
                      {critere}
                    </Typography>
                  ))}
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleOpenDialog(mission)}
                >
                  Compléter la mission
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Compléter la mission</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            {selectedMission?.titre}
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            {selectedMission?.description}
          </Typography>
          {submissionError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submissionError}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Preuve de complétion"
            fullWidth
            multiline
            rows={4}
            value={proof}
            onChange={(e) => setProof(e.target.value)}
            error={!!submissionError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Soumettre
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Missions; 