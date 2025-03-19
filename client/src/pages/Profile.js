import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  TextField,
  Button,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  EmojiEvents as TrophyIcon,
  MonetizationOn as TokenIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import {
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFailure,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
} from '../store/slices/ambassadorSlice';
import { authService } from '../services/api';

function Profile() {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.ambassador);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
  });
  const [updateError, setUpdateError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        dispatch(fetchProfileStart());
        const response = await authService.getProfile();
        dispatch(fetchProfileSuccess(response.data));
        setFormData({
          nom: response.data.nom,
          email: response.data.email,
        });
      } catch (error) {
        dispatch(fetchProfileFailure(error.message));
      }
    };

    fetchProfile();
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateError('');

    try {
      dispatch(updateProfileStart());
      const response = await authService.updateProfile(formData);
      dispatch(updateProfileSuccess(response.data));
      setIsEditing(false);
    } catch (error) {
      dispatch(updateProfileFailure(error.message));
      setUpdateError(error.response?.data?.message || 'Erreur lors de la mise à jour');
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
        Mon Profil
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Informations personnelles */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Informations personnelles
            </Typography>

            {isEditing ? (
              <form onSubmit={handleSubmit}>
                {updateError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {updateError}
                  </Alert>
                )}
                <TextField
                  fullWidth
                  label="Nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    type="submit"
                    color="primary"
                  >
                    Enregistrer
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setIsEditing(false)}
                  >
                    Annuler
                  </Button>
                </Box>
              </form>
            ) : (
              <>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <PersonIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Nom"
                      secondary={profile?.nom}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email"
                      secondary={profile?.email}
                    />
                  </ListItem>
                </List>
                <Button
                  variant="contained"
                  onClick={() => setIsEditing(true)}
                  sx={{ mt: 2 }}
                >
                  Modifier
                </Button>
              </>
            )}
          </Paper>
        </Grid>

        {/* Statistiques et récompenses */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Statistiques et récompenses
            </Typography>

            <List>
              <ListItem>
                <ListItemIcon>
                  <TrophyIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Niveau"
                  secondary={profile?.niveau}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <TimelineIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Points"
                  secondary={profile?.points}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <TokenIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Revenus totaux"
                  secondary={`${profile?.statistiques?.revenusTotaux || 0} FL`}
                />
              </ListItem>
            </List>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
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

export default Profile; 