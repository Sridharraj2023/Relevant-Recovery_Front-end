import React, { useState, useEffect } from 'react';
import EventRegisterModal from './EventRegisterModal';
import {
  Box,
  Typography,
  Grid,

  Button,
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
const [openEventRegister, setOpenEventRegister] = useState({ open: false, eventId: null });
  const [registerData, setRegisterData] = useState({ name: '', email: '', phone: '', city: '', state: '', country: '' });
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
              <Grid item xs={12} key={event._id} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box sx={{
                  background: '#e6fcf5',
                  borderRadius: 4,
                  boxShadow: '0 2px 12px 0 rgba(16,30,54,0.06)',
                  p: 0,
                  height: { xs: 'auto', md: 500 },
                  width: { xs: '100%', md: '70vw', xl: 950 },
                  maxWidth: { xs: '100%', md: 950 },
                  minWidth: { xl: 700 },
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  overflow: 'hidden',
                  alignItems: 'stretch',
                  position: 'relative',
                  minHeight: { xs: 'auto', md: 700 },
                  mx: 'auto', // center on large screens
                }}>
                  {/* Event Image */}
                  <Box sx={{
                    width: { xs: '100%', md: 300 },
                    height: { xs: 200, md: '40%' },
                    flexShrink: 0,
                    background: '#cceee5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    borderRadius: { xs: 0, md: 4 },
                    marginLeft: { xs: 0, md: 2 },
                    marginTop: { xs: 0, md: 2 },
                  }}>
                    {event.image ? (
                      <img
                        src={event.image}
                        alt={event.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.target.onerror = null; e.target.src = '/path/to/placeholder.jpg'; }}
                      />
                    ) : (
                      <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 24 }}>
                        No Image
                      </Box>
                    )}
                  </Box>
                  {/* Event Details */}
                  <Box sx={{
                    flex: 1,
                    p: { xs: 3, md: 4 },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    background: '#e6fcf5',
                  }}>
                    {/* Free Ticket Button (top right) */}
                    <Box sx={{ position: 'absolute', top: 24, right: 24, zIndex: 2, display: { xs: 'none', md: 'block' } }}>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          background: '#d1fae5',
                          color: '#089e8e',
                          fontWeight: 700,
                          borderRadius: 999,
                          fontSize: 16,
                          px: 3,
                          boxShadow: 'none',
                          textTransform: 'none',
                          '&:hover': {
                            background: '#b9f6ca',
                            color: '#089e8e',
                            boxShadow: 'none',
                          },
                        }}
                        disabled={event.cost !== 'Free'}
                      >
                        Free Ticket
                      </Button>
                    </Box>
                    <Box>
                      {/* 1. Date */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CalendarToday sx={{ fontSize: 20, color: '#089e8e', mr: 1 }} />
                        <Typography variant="body1" sx={{ color: '#089e8e', fontWeight: 700, mr: 2 }}>
                          {event.date}
                        </Typography>
                      </Box>
                      {/* 2. Title */}
                      <Typography variant="h6" sx={{ fontWeight: 900, color: '#181f29', mb: 1, lineHeight: 1.2 }}>
                        {event.title}
                      </Typography>
                      {/* 3. Time */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <AccessTime sx={{ fontSize: 18, color: '#089e8e', mr: 1 }} />
                        <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                          {event.time}
                        </Typography>
                      </Box>
                      {/* 4. Location */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOn sx={{ fontSize: 18, color: '#089e8e', mr: 1 }} />
                        <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                          {event.place}
                        </Typography>
                      </Box>
                      {/* 5. Capacity */}
                      {event.capacity && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                            <b>Capacity:</b> {event.capacity} people
                          </Typography>
                        </Box>
                      )}
                      {/* 6. Cost */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                          <b>Cost:</b> {event.cost}
                        </Typography>
                      </Box>
                      {/* 7. Description */}
                      <Typography
                        variant="body1"
                        sx={{ color: '#555', mb: 2, lineHeight: 1.6 }}
                      >
                        {event.desc}
                      </Typography>
                      {/* 8. Event Highlights */}
                      {event.highlights && event.highlights.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                            Event Highlights:
                          </Typography>
                          <ul style={{ margin: 0, paddingLeft: 20 }}>
                            {event.highlights.map((h, idx) => (
                              <li key={idx} style={{ color: '#089e8e', marginBottom: 4, fontSize: 16, fontWeight: 500 }}>{h}</li>
                            ))}
                          </ul>
                        </Box>
                      )}
                      {/* 9. Special Gift */}
                      {event.specialGift && (
                        <Box sx={{ background: '#d1fae5', borderRadius: 2, p: 2, mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span role="img" aria-label="gift" style={{ fontSize: 22, marginRight: 8 }}>🎁</span>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#089e8e', mr: 1 }}>
                            Special Gift for Attendees:
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#089e8e' }}>{event.specialGift}</Typography>
                        </Box>
                      )}
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
                        ...(event.cost !== 'Free' && { 
                          opacity: 0.7,
                          '&:hover': {
                            cursor: 'not-allowed',
                            opacity: 0.7,
                          }
                        }),
                        '&:hover': {
                          background: 'linear-gradient(90deg, #089e8e 0%, #0893b2 100%)',
                          opacity: 0.95,
                          boxShadow: 'none',
                          ...(event.cost !== 'Free' && {
                            cursor: 'not-allowed',
                            opacity: 0.7
                          })
                        }
                      }}
                      onClick={() => {
                        if (event.cost === 'Free') {
                          setOpenEventRegister({ open: true, eventId: event._id });
                        } else {
                          window.location.href = `/book-event/${event._id}`;
                        }
                      }}
                    >
                      {event.cost === 'Free' ? 'Register Now' : 'Book Ticket'}
                    </Button>
                  </Box>
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
      {/* Event Registration Modal */}
      {openEventRegister && (
        <EventRegisterModal
          open={openEventRegister.open}
          handleClose={() => setOpenEventRegister({ open: false, eventId: null })}
          eventId={openEventRegister.eventId}
        />
      )}
    </Box>
  );
};

export default Events; 