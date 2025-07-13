import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,

  Button,
  Chip,
  Container,
  CircularProgress,
  Alert
} from '@mui/material';
import { CalendarToday, AccessTime, LocationOn } from '@mui/icons-material';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    <Box sx={{ py: { xs: 4, md: 8 }, px: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, color: '#181f29' }}>
            Upcoming Events
          </Typography>
          <Typography variant="h6" sx={{ color: '#555', maxWidth: 600, mx: 'auto' }}>
            Join us for community events, workshops, and celebrations that support recovery and build lasting connections.
          </Typography>
        </Box>

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
    </Box>
  );
};

export default Events; 