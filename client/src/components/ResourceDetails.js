import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  School as SchoolIcon,
  Description as DocumentIcon,
  PlayCircle as VideoIcon,
  MenuBook as GuideIcon,
} from '@mui/icons-material';

function ResourceDetails({ resource, open, onClose, onComplete, completing }) {
  if (!resource) return null;

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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center">
          {getResourceIcon(resource.type)}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {resource.titre}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <Typography variant="body1" paragraph>
            {resource.description}
          </Typography>
          <Box display="flex" gap={1} mb={2}>
            <Chip
              label={resource.type}
              size="small"
              color="primary"
            />
            <Chip
              label={resource.niveauRequis}
              size="small"
              color="secondary"
            />
          </Box>
          {resource.pointsRecompense > 0 && (
            <Typography variant="body2" color="primary">
              +{resource.pointsRecompense} points à gagner
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" gutterBottom>
          Contenu
        </Typography>
        <Typography variant="body2" paragraph>
          {resource.contenu}
        </Typography>

        {resource.mediaUrl && (
          <Box mt={2}>
            <Typography variant="subtitle1" gutterBottom>
              Ressource média
            </Typography>
            <Button
              variant="outlined"
              href={resource.mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ouvrir la ressource
            </Button>
          </Box>
        )}

        {resource.tags && resource.tags.length > 0 && (
          <Box mt={2}>
            <Typography variant="subtitle1" gutterBottom>
              Tags
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {resource.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={completing}>
          Fermer
        </Button>
        <Button
          onClick={onComplete}
          variant="contained"
          color="primary"
          disabled={completing}
          startIcon={completing ? <CircularProgress size={20} /> : null}
        >
          {completing ? 'Complétion en cours...' : 'Marquer comme complété'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ResourceDetails; 