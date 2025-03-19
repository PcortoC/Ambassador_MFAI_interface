import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Chip,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  IconButton,
  Divider,
  Snackbar,
} from '@mui/material';
import {
  Search as SearchIcon,
  School as SchoolIcon,
  Description as DocumentIcon,
  PlayCircle as VideoIcon,
  MenuBook as GuideIcon,
} from '@mui/icons-material';
import { resourceService } from '../services/api';
import {
  fetchResourcesStart,
  fetchResourcesSuccess,
  fetchResourcesFailure,
  setSelectedResource,
  clearSelectedResource,
} from '../store/slices/resourceSlice';
import ResourceDetails from '../components/ResourceDetails';

function Resources() {
  const dispatch = useDispatch();
  const { resources, loading, error, selectedResource } = useSelector((state) => state.resources);
  const { profile } = useSelector((state) => state.ambassador);
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        dispatch(fetchResourcesStart());
        const response = await resourceService.getResources();
        dispatch(fetchResourcesSuccess(response.data));
      } catch (error) {
        dispatch(fetchResourcesFailure(error.message));
      }
    };

    fetchResources();
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleResourceClick = (resource) => {
    dispatch(setSelectedResource(resource));
    setDetailsOpen(true);
  };

  const handleDetailsClose = () => {
    setDetailsOpen(false);
    dispatch(clearSelectedResource());
  };

  const handleResourceComplete = async () => {
    if (!selectedResource) return;

    try {
      setCompleting(true);
      await resourceService.completeResource(selectedResource._id);
      setSnackbar({
        open: true,
        message: 'Ressource marquée comme complétée avec succès !',
        severity: 'success'
      });
      handleDetailsClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Erreur lors de la complétion de la ressource',
        severity: 'error'
      });
    } finally {
      setCompleting(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case 'Formation':
        return <SchoolIcon color="primary" />;
      case 'Document':
        return <DocumentIcon color="primary" />;
      case 'Vidéo':
        return <VideoIcon color="primary" />;
      case 'Guide':
        return <GuideIcon color="primary" />;
      default:
        return null;
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedTab === 0 || resource.type === ['Tous', 'Formation', 'Document', 'Vidéo', 'Guide'][selectedTab];
    const matchesLevel = resource.niveauRequis === 'Tous' || resource.niveauRequis === profile?.niveau;
    return matchesSearch && matchesType && matchesLevel;
  });

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
        Ressources et Formations
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher une ressource..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        sx={{ mb: 3 }}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Toutes les ressources" />
        <Tab label="Formations" />
        <Tab label="Documents" />
        <Tab label="Vidéos" />
        <Tab label="Guides" />
      </Tabs>

      <Grid container spacing={3}>
        {filteredResources.map((resource) => (
          <Grid item xs={12} md={6} lg={4} key={resource._id}>
            <Card
              sx={{ cursor: 'pointer' }}
              onClick={() => handleResourceClick(resource)}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  {getResourceIcon(resource.type)}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {resource.titre}
                  </Typography>
                </Box>

                <Typography variant="body2" color="textSecondary" paragraph>
                  {resource.description}
                </Typography>

                <Box display="flex" alignItems="center" mb={2}>
                  <Chip
                    label={resource.type}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={resource.niveauRequis}
                    size="small"
                    color="secondary"
                  />
                </Box>

                {resource.pointsRecompense > 0 && (
                  <Typography variant="body2" color="primary">
                    +{resource.pointsRecompense} points
                  </Typography>
                )}

                <Divider sx={{ my: 2 }} />

                <Box display="flex" flexWrap="wrap" gap={1}>
                  {resource.tags?.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredResources.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="body1" color="textSecondary">
            Aucune ressource trouvée
          </Typography>
        </Box>
      )}

      <ResourceDetails
        resource={selectedResource}
        open={detailsOpen}
        onClose={handleDetailsClose}
        onComplete={handleResourceComplete}
        completing={completing}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Resources; 