import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Assignment as MissionIcon,
  People as ReferralIcon,
  MonetizationOn as TokenIcon,
} from '@mui/icons-material';
import { fetchProfileStart, fetchProfileSuccess, fetchProfileFailure } from '../store/slices/ambassadorSlice';
import { fetchAvailableMissionsStart, fetchAvailableMissionsSuccess, fetchAvailableMissionsFailure } from '../store/slices/missionSlice';
import { authService, missionService } from '../services/api';

function Dashboard() {
  const dispatch = useDispatch();
  const { profile, statistics, loading: profileLoading } = useSelector((state) => state.ambassador);
  const { availableMissions, loading: missionsLoading } = useSelector((state) => state.missions);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(fetchProfileStart());
        const profileResponse = await authService.getProfile();
        dispatch(fetchProfileSuccess(profileResponse.data));

        dispatch(fetchAvailableMissionsStart());
        const missionsResponse = await missionService.getAvailableMissions();
        dispatch(fetchAvailableMissionsSuccess(missionsResponse.data));
      } catch (error) {
        dispatch(fetchProfileFailure(error.message));
        dispatch(fetchAvailableMissionsFailure(error.message));
      }
    };

    fetchData();
  }, [dispatch]);

  if (profileLoading || missionsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Tableau de bord
      </Typography>
      
      <Grid container spacing={3}>
        {/* Statistiques */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrophyIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Niveau</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {profile?.niveau || 'Bronze'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Points: {profile?.points || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <MissionIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Missions</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {statistics?.missionsRealisees || 0}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {availableMissions?.length || 0} missions disponibles
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ReferralIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Références</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {statistics?.nombreReferes || 0}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Parrainages actifs
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TokenIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Revenus</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {statistics?.revenusTotaux || 0} FL
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Tokens gagnés
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Missions disponibles */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Missions disponibles
            </Typography>
            <List>
              {availableMissions?.slice(0, 5).map((mission) => (
                <ListItem key={mission._id}>
                  <ListItemIcon>
                    <MissionIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={mission.titre}
                    secondary={`${mission.pointsRecompense} points • ${mission.recompenseToken} FL`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Dernières récompenses */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Dernières récompenses
            </Typography>
            <List>
              {profile?.recompenses?.slice(0, 5).map((recompense, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <TrophyIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={recompense.description}
                    secondary={`${recompense.montant} FL • ${new Date(recompense.date).toLocaleDateString()}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard; 