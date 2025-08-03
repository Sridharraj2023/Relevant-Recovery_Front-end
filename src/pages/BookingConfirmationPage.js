import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Button, Paper, 
  CircularProgress, Alert, Grid
} from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
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
        
        // First test if the route is accessible
        console.log('Testing route accessibility...');
        try {
          const testRes = await axios.get('https://relevant-recovery-back-end.onrender.com/api/event-ticket-booking/test');
          console.log('Test route response:', testRes.data);
        } catch (testErr) {
          console.error('Test route failed:', testErr);
        }
        
        // First get the booking details
        console.log('Fetching booking details for ticketId:', ticketId);
        const bookingRes = await axios.get(`https://relevant-recovery-back-end.onrender.com/api/event-ticket-booking/${ticketId}`);
        
        console.log('Booking response:', bookingRes.data);
        
        if (bookingRes.data.success) {
          setBooking(bookingRes.data.data);
          
          // The event data is already populated in the booking response
          // No need to fetch event details separately
          console.log('Booking data:', bookingRes.data.data);
          console.log('Event data from booking:', bookingRes.data.data.event);
          
          // Set the event data directly from the booking response
          if (bookingRes.data.data.event) {
            setEvent(bookingRes.data.data.event);
          }
        }
      } catch (err) {
        console.error('Failed to load booking details:', err);
        console.error('Error response:', err.response?.data);
        console.error('Error status:', err.response?.status);
        
        if (err.response?.status === 401) {
          setError('Authentication error. Please try again or contact support.');
        } else if (err.response?.status === 404) {
          setError('Booking not found. Please check the URL.');
        } else {
          setError('Failed to load booking details. Please try again.');
        }
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
            
            {/* Payment Information */}
            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>Payment Receipt</Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Amount:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  ${(booking.totalAmount / 100).toFixed(2)}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Date:</Typography>
                <Typography variant="body1">
                  {new Date(booking.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Typography>
              </Box>
              
              {booking.paymentIntentId && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Transaction ID:</Typography>
                  <Typography sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                    {booking.paymentIntentId}
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Payment Method:</Typography>
                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                  {booking.paymentMethod || 'Card'}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Currency:</Typography>
                <Typography variant="body1" sx={{ textTransform: 'uppercase' }}>
                  {booking.currency || 'USD'}
                </Typography>
              </Box>
            </Box>
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
