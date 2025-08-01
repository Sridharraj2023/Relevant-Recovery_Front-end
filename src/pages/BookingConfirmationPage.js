import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Button, Paper, Divider, 
  CircularProgress, Alert, Grid, IconButton 
} from '@mui/material';
import { CheckCircle as CheckCircleIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import axios from 'axios';

const BookingConfirmationPage = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(null);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [bookingRes, eventRes] = await Promise.all([
          axios.get(`https://relevant-recovery-back-end.onrender.com/api/event-ticket-booking/${ticketId}`),
          axios.get(`https://relevant-recovery-back-end.onrender.com/api/events/${ticketId}`)
        ]);
        
        if (bookingRes.data.success) setBooking(bookingRes.data.data);
        if (eventRes.data) setEvent(eventRes.data);
      } catch (err) {
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    if (ticketId) fetchData();
  }, [ticketId]);

  if (loading) return <CircularProgress sx={{ display: 'block', m: 'auto', mt: 4 }} />;
  if (error) return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;
  if (!booking) return <Alert severity="warning" sx={{ m: 2 }}>Booking not found</Alert>;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>Booking Confirmed!</Typography>
        <Typography color="text.secondary">
          A confirmation has been sent to {booking.customer?.email}
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2 }}>Booking Details</Typography>
            <Typography variant="body2" color="text.secondary">Reference</Typography>
            <Typography sx={{ mb: 2 }}>{booking.referenceNumber}</Typography>
            
            <Typography variant="body2" color="text.secondary">Status</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ width: 10, height: 10, bgcolor: 'success.main', borderRadius: '50%', mr: 1 }} />
              <Typography sx={{ textTransform: 'capitalize' }}>{booking.status}</Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary">Tickets</Typography>
            <Typography>{booking.quantity} ticket{booking.quantity > 1 ? 's' : ''}</Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            {event && (
              <>
                <Typography variant="h6" sx={{ mb: 2 }}>Event Details</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{event.title}</Typography>
                <Typography color="text.secondary">{event.date} • {event.time}</Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>{event.place}</Typography>
              </>
            )}
            
            <Typography variant="body2" color="text.secondary">Attendee</Typography>
            <Typography>{booking.customer?.name}</Typography>
            <Typography color="text.secondary">{booking.customer?.email}</Typography>
          </Grid>
        </Grid>
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button variant="outlined" onClick={() => navigate('/events')}>
          Back to Events
        </Button>
        <Button variant="contained" onClick={() => window.print()}>
          Print Ticket
        </Button>
      </Box>
    </Box>
  );
};

export default BookingConfirmationPage;
