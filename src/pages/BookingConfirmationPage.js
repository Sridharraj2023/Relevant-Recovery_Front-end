import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Button, Paper, 
  CircularProgress, Alert, Divider
} from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import axios from 'axios';

// Add print-specific styles
const printStyles = `
  @media print {
    @page { margin: 0; }
    body { margin: 1.6cm; }
    header, footer, .no-print { display: none !important; }
    
    .print-only { display: block !important; }
    .MuiPaper-root { 
      box-shadow: none !important;
      border: 1px solid #ddd;
    }
  }
  
  @media screen {
    .print-only { display: none; }
  }
`;

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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;
  if (!booking) return <Alert severity="warning" sx={{ m: 2 }}>Booking not found</Alert>;

  return (
    <>
      <style>{printStyles}</style>
      <Box sx={{ maxWidth: 600, mx: 'auto', my: 8, px: 2 }} className="no-print">
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: 'success.main' }}>
            Booking Confirmed!
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 4 }}>
            Your event ticket has been successfully booked. Here's your booking confirmation:
          </Typography>

          <Box sx={{ 
            textAlign: 'left', 
            bgcolor: 'grey.50', 
            p: 3, 
            borderRadius: 2,
            mb: 4
          }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Booking Details</Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Reference Number:</Typography>
              <Typography fontWeight="bold">{booking.referenceNumber}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Status:</Typography>
              <Typography sx={{ textTransform: 'capitalize' }}>{booking.status}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Tickets:</Typography>
              <Typography>{booking.quantity} ticket{booking.quantity > 1 ? 's' : ''}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Amount:</Typography>
              <Typography fontWeight="bold">${(booking.totalAmount / 100).toFixed(2)}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Date:</Typography>
              <Typography>{new Date(booking.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</Typography>
            </Box>
            
            {booking.paymentIntentId && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Transaction ID:</Typography>
                <Typography sx={{ 
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  wordBreak: 'break-word',
                  textAlign: 'right',
                  maxWidth: '60%'
                }}>
                  {booking.paymentIntentId}
                </Typography>
              </Box>
            )}
          </Box>

          {event && (
            <Box sx={{ 
              textAlign: 'left', 
              bgcolor: 'grey.50', 
              p: 3, 
              borderRadius: 2,
              mb: 4
            }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Event Details</Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Event:</Typography>
                <Typography fontWeight="bold">{event.title}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Date & Time:</Typography>
                <Typography>{event.date} • {event.time}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Location:</Typography>
                <Typography>{event.place}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Attendee:</Typography>
                <Typography>{booking.customer?.name}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Email:</Typography>
                <Typography>{booking.customer?.email}</Typography>
              </Box>
            </Box>
          )}

          <Typography variant="body2" sx={{ mb: 3, fontStyle: 'italic' }}>
            A confirmation has been sent to {booking.customer?.email}.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => navigate('/events')}
              sx={{ minWidth: 180 }}
            >
              Back to Events
            </Button>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={() => window.print()}
              sx={{ minWidth: 180 }}
            >
              Print Ticket
            </Button>
          </Box>
        </Paper>
      </Box>
      
      {/* Print View */}
      <Box sx={{ display: 'none' }} className="print-only">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Event Ticket Receipt</Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Typography>
        </Box>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Thank you for booking your event ticket. Your payment of <strong>${(booking.totalAmount / 100).toFixed(2)}</strong> has been processed successfully.
          </Typography>
          
          <Box sx={{ mt: 3, border: '1px solid #ddd', p: 2, borderRadius: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>BOOKING DETAILS</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Reference Number:</Typography>
              <Typography fontWeight="bold">{booking.referenceNumber}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Amount:</Typography>
              <Typography fontWeight="bold">${(booking.totalAmount / 100).toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Date:</Typography>
              <Typography>{new Date(booking.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</Typography>
            </Box>
            {booking.paymentIntentId && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Transaction ID:</Typography>
                <Typography sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  {booking.paymentIntentId}
                </Typography>
              </Box>
            )}
            {event && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Event:</Typography>
                  <Typography fontWeight="bold">{event.title}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Date & Time:</Typography>
                  <Typography>{event.date} • {event.time}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Location:</Typography>
                  <Typography>{event.place}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Attendee:</Typography>
                  <Typography>{booking.customer?.name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Email:</Typography>
                  <Typography>{booking.customer?.email}</Typography>
                </Box>
              </>
            )}
          </Box>
        </Box>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
            This is an official receipt for your event ticket. Please keep this for your records!
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default BookingConfirmationPage;
