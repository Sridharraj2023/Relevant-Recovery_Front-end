import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Grid,
  Alert,
  CircularProgress,
  Box,
  Paper
} from '@mui/material';

const EventForm = ({ open, event, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    date: '',
    title: '',
    time: '',
    location: '',
    desc: '',
    action: '',
    free: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (event) {
      setFormData({
        date: event.date || '',
        title: event.title || '',
        time: event.time || '',
        location: event.location || '',
        desc: event.desc || '',
        action: event.action || '',
        free: event.free || false
      });
    } else {
      setFormData({
        date: '',
        title: '',
        time: '',
        location: '',
        desc: '',
        action: '',
        free: false
      });
    }
    setError('');
  }, [event, open]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'free' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      const url = event 
        ? `https://relevant-recovery-back-end.onrender.com/api/events/${event._id}`
        : 'https://relevant-recovery-back-end.onrender.com/api/events';
      
      const response = await fetch(url, {
        method: event ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save event');
      }

      onSave(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 0,
          bgcolor: 'transparent',
        }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: '#089e8e', 
        color: '#fff',
        fontWeight: 700,
        textAlign: 'center',
        py: 2,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12
      }}>
        {event ? 'Edit Event' : 'Create New Event'}
      </DialogTitle>
      <DialogContent sx={{ p: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', bgcolor: 'transparent', py: { xs: 2, md: 3 } }}>
          <Paper
            elevation={2}
            sx={{
              p: { xs: 2, md: 4 },
              borderRadius: 4,
              width: '100%',
              maxWidth: 500,
              mx: 'auto',
              boxShadow: 2
            }}
          >
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '90%' }}>
              <Grid container spacing={2}>
                {/* Event Title (full width) */}
                <Grid item xs={12} sx={{ width: '100%' }}>
                  <TextField
                  fullWidth
                    label="Event Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="medium"
                    margin="dense"
                  />
                </Grid>
                {/* Date & Time (side by side on md+, stacked on xs) */}
                <Grid item xs={12} md={6} sx={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    label="Date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    placeholder="e.g., July 31, 2025"
                    size="medium"
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={12} md={6} sx={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    label="Time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    placeholder="e.g., 5:00 PM - 8:00 PM"
                    size="medium"
                    margin="dense"
                  />
                </Grid>
                {/* Location (full width) */}
                <Grid item xs={12} sx={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    placeholder="e.g., Wayzata Community Church"
                    size="medium"
                    margin="dense"
                  />
                </Grid>
                {/* Description (full width, textarea) */}
                <Grid item xs={12} sx={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="desc"
                    value={formData.desc}
                    onChange={handleChange}
                    required
                    multiline
                    minRows={5}
                    maxRows={10}
                    variant="outlined"
                    placeholder="Describe the event details..."
                    size="medium"
                    margin="dense"
                  />
                </Grid>
                {/* Action Text (full width) */}
                <Grid item xs={12} sx={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    label="Action Text"
                    name="action"
                    value={formData.action}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    placeholder="e.g., Register Now, Buy Tickets"
                    size="medium"
                    margin="dense"
                  />
                </Grid>
                {/* Free Event switch and buttons at the bottom */}
                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1, mb: 1, flexWrap: 'wrap' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.free}
                        onChange={handleChange}
                        name="free"
                        color="primary"
                      />
                    }
                    label="Free Event"
                    sx={{
                      ml: 0,
                      mr: 2,
                      pb: 1,
                      '& .MuiFormControlLabel-label': {
                        fontSize: '1rem'
                      }
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mt: 1 }}>
                    <Button 
                      onClick={onClose} 
                      sx={{ color: '#666', minWidth: 110 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      variant="contained"
                      disabled={loading}
                      sx={{
                        backgroundColor: '#089e8e',
                        '&:hover': { backgroundColor: '#067e71' },
                        minWidth: 140
                      }}
                    >
                      {loading ? <CircularProgress size={20} color="inherit" /> : (event ? 'Update Event' : 'Create Event')}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EventForm; 