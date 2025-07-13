import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,

  Button,
  Chip,
  Container,
  CircularProgress,
  Alert,
  Dialog,
  TextField,
  IconButton
} from '@mui/material';
import { CalendarToday, AccessTime, LocationOn } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openRegister, setOpenRegister] = useState(false);
  const [registerData, setRegisterData] = useState({ name: '', email: '' });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const handleRegisterOpen = () => setOpenRegister(true);
  const handleRegisterClose = () => setOpenRegister(false);
  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://relevant-recovery-back-end.onrender.com/api/community-signups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      setToast({ open: true, message: 'Registration successful!', severity: 'success' });
      setRegisterData({ name: '', email: '' });
      setOpenRegister(false);
    } catch (err) {
      setToast({ open: true, message: err.message, severity: 'error' });
    }
  };
  const handleToastClose = () => setToast({ ...toast, open: false });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('https://relevant-recovery-back-end.onrender.com/api/events');
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ py: { xs: 4, md: 0 }, px: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box
        sx={{
          width: '100vw',
          position: 'relative',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          background: 'linear-gradient(90deg, #0ba98d 0%, #0893b2 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: { xs: 6, md: 8 },
          mb: 6,
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, color: '#fff', textAlign: 'center' }}>
          Upcoming Events
        </Typography>
        <Typography variant="h6" sx={{ color: '#fff', maxWidth: 700, mx: 'auto', textAlign: 'center', fontWeight: 400 }}>
          Join our community for inspiring events that celebrate recovery, build connections, and create lasting memories together.
        </Typography>
      </Box>
      <Container maxWidth="lg">

        {/* Events Grid */}
        {events.length > 0 ? (
          <Grid container spacing={4} justifyContent="center" alignItems="stretch" sx={{ maxWidth: 1020, mx: 'auto', flexWrap: 'wrap' }}>
            {events.map((event) => (
              <Grid item xs={12} md={6} key={event._id} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box sx={{
                  background: '#e6fcf5',
                  borderRadius: 3,
                  boxShadow: '0 2px 12px 0 rgba(16,30,54,0.06)',
                  p: 4,
                  height: 320,
                  width: 480,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  overflow: 'hidden',
                }}>
                  <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#181f29', lineHeight: 1.2 }}>
                        {event.title}
                      </Typography>
                      <Chip
                        label={event.free ? 'Free' : 'Paid'}
                        color={event.free ? 'success' : 'primary'}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarToday sx={{ fontSize: 16, color: '#089e8e', mr: 1 }} />
                      <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                        {event.date}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AccessTime sx={{ fontSize: 16, color: '#089e8e', mr: 1 }} />
                      <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                        {event.time}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationOn sx={{ fontSize: 16, color: '#089e8e', mr: 1 }} />
                      <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                        {event.location}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#555',
                        mb: 3,
                        lineHeight: 1.6,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: 'vertical',
                        minHeight: '5.5em',
                      }}
                    >
                      {event.desc}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      mt: 2,
                      background: 'linear-gradient(90deg, #089e8e 0%, #0893b2 100%)',
                      color: '#fff',
                      fontWeight: 700,
                      borderRadius: 999,
                      fontSize: 18,
                      py: 1.2,
                      boxShadow: 'none',
                      textTransform: 'none',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #089e8e 0%, #0893b2 100%)',
                        opacity: 0.95,
                        boxShadow: 'none',
                      },
                    }}
                  >
                    {event.action}
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" sx={{ color: '#666', mb: 2 }}>
              No events scheduled at the moment
            </Typography>
            <Typography variant="body1" sx={{ color: '#888' }}>
              Check back soon for upcoming events and community gatherings.
            </Typography>
          </Box>
        )}
      </Container>
      {/* Don't Miss Out Section */}
      <Box
        sx={{
          width: '100vw',
          position: 'relative',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          background: 'linear-gradient(135deg, #eafaf1 0%, #e3f1fa 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: { xs: 8, md: 8 },
          mt: 8,
          
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#181f29', mb: 3, textAlign: 'center' }}>
          Don't Miss Out!
        </Typography>
        <Typography variant="h6" sx={{ color: '#444', maxWidth: 700, mx: 'auto', mb: 4, textAlign: 'center', fontWeight: 400 }}>
          Stay connected with our community and be the first to know about new events, workshops, and opportunities to grow together.
        </Typography>
        <Button
          variant="contained"
          sx={{
            background: 'linear-gradient(90deg, #0ba98d 0%, #0893b2 100%)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 18,
            borderRadius: 999,
            px: 5,
            py: 1.5,
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': {
              background: 'linear-gradient(90deg, #089e8e 0%, #0893b2 100%)',
              opacity: 0.95,
              boxShadow: 'none',
            },
          }}
          onClick={handleRegisterOpen}
        >
          Join Our Community
        </Button>
      </Box>

      {/* Register Dialog */}
      <Dialog
        open={openRegister}
        onClose={handleRegisterClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 0 } }}
      >
        <Box sx={{ p: { xs: 3, md: 4 }, pb: 3, position: 'relative' }}>
          <IconButton
            aria-label="close"
            onClick={handleRegisterClose}
            sx={{ position: 'absolute', right: 12, top: 12, color: '#888' }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Register for Community Kickoff
          </Typography>
          <Typography variant="body2" sx={{ color: '#555', mb: 3 }}>
            Fill in your details below to secure your spot. We're excited to see you there!
          </Typography>
          <Box component="form" autoComplete="off" onSubmit={handleRegisterSubmit}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ minWidth: 60, color: '#222', fontWeight: 500 }}>Name</Typography>
              <TextField
                name="name"
                value={registerData.name}
                onChange={handleRegisterChange}
                placeholder="Your full name"
                variant="outlined"
                size="small"
                fullWidth
                sx={{ ml: 2, borderRadius: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                InputProps={{ sx: { borderColor: '#0ba98d' } }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Typography sx={{ minWidth: 60, color: '#222', fontWeight: 500 }}>Email</Typography>
              <TextField
                name="email"
                value={registerData.email}
                onChange={handleRegisterChange}
                placeholder="your.email@example.com"
                variant="outlined"
                size="small"
                fullWidth
                sx={{ ml: 2, borderRadius: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Box>
            <Button
              variant="contained"
              fullWidth
              type="submit"
              sx={{
                background: 'linear-gradient(90deg, #0ba98d 0%, #0893b2 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 16,
                borderRadius: 2,
                py: 1.2,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  background: 'linear-gradient(90deg, #089e8e 0%, #0893b2 100%)',
                  opacity: 0.95,
                  boxShadow: 'none',
                },
              }}
            >
              Confirm Registration
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MuiAlert
          onClose={handleToastClose}
          severity={toast.severity}
          sx={{ width: '100%' }}
        >
          {toast.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default Events; 