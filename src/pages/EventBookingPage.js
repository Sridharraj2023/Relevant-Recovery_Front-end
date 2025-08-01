import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Stepper, Step, StepLabel, TextField, Grid, Paper, CircularProgress, Alert, Divider, IconButton } from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import axios from 'axios';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const STEPS = ['Event Details', 'Your Information', 'Payment'];

const initialFormData = {
  name: '',
  email: '',
  phone: '',
  city: '',
  state: '',
  country: 'United States',
  quantity: 1,
  specialRequests: ''
};

const PaymentForm = ({ formData, event, onBack, onSubmit, loading, error }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setCardError('');

    try {
      const { error: stripeError } = await stripe.confirmCardPayment(
        formData.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: { name: formData.name, email: formData.email }
          },
        }
      );

      if (stripeError) throw stripeError;
      await onSubmit();
    } catch (err) {
      setCardError(err.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Payment Information</Typography>
        <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <CardElement />
          {cardError && <Typography color="error" sx={{ mt: 2 }}>{cardError}</Typography>}
        </Paper>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button variant="outlined" onClick={onBack} disabled={isProcessing || loading} startIcon={<ArrowBackIcon />}>
            Back
          </Button>
          <Button type="submit" variant="contained" disabled={!stripe || isProcessing || loading}>
            {isProcessing ? <CircularProgress size={24} /> : `Pay $${(event.price * formData.quantity).toFixed(2)}`}
          </Button>
        </Box>
      </Box>
    </form>
  );
};

const EventBookingPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`https://relevant-recovery-back-end.onrender.com/api/events/${eventId}`);
        setEvent(response.data);
      } catch (err) {
        setError('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleQuantityChange = (newQuantity) => {
    setFormData(prev => ({ ...prev, quantity: Math.max(1, Math.min(10, newQuantity)) }));
  };

  const handleNext = async () => {
    if (activeStep === 1) {
      const errors = {};
      if (!formData.name) errors.name = 'Name is required';
      if (!formData.email) errors.email = 'Email is required';
      if (!formData.phone) errors.phone = 'Phone is required';
      
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.post('https://relevant-recovery-back-end.onrender.com/api/event-ticket-booking', {
          eventId,
          customer: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            city: formData.city,
            state: formData.state,
            country: formData.country
          },
          quantity: formData.quantity,
          metadata: { specialRequests: formData.specialRequests }
        });
        
        if (response.data.success) {
          setFormData(prev => ({
            ...prev,
            clientSecret: response.data.data.clientSecret,
            ticketId: response.data.data.ticketId
          }));
          setActiveStep(prev => prev + 1);
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to create booking');
      } finally {
        setLoading(false);
      }
      return;
    }
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => setActiveStep(prev => prev - 1);
  const handleSubmit = () => navigate(`/booking-confirmation/${formData.ticketId}`);

  if (loading && !event) return <CircularProgress sx={{ display: 'block', m: 'auto', mt: 4 }} />;
  if (error) return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;
  if (!event) return <Alert severity="error" sx={{ m: 2 }}>Event not found</Alert>;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        Back to Event
      </Button>

      <Typography variant="h4" sx={{ mb: 4 }}>Book Your Tickets</Typography>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {STEPS.map((label) => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <Box>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ height: 200, bgcolor: '#f5f5f5', borderRadius: 2, overflow: 'hidden' }}>
                  {event.image && <img src={event.image} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </Box>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography variant="h5" sx={{ mb: 2 }}>{event.title}</Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>{event.date} • {event.time}</Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>{event.place}</Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Ticket Information</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography>Price per ticket:</Typography>
                    <Typography>${parseFloat(event.cost.replace(/[^0-9.]/g, '')).toFixed(2)}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography sx={{ mr: 2 }}>Quantity:</Typography>
                    <Button onClick={() => handleQuantityChange(formData.quantity - 1)} disabled={formData.quantity <= 1}>-</Button>
                    <Typography sx={{ mx: 2 }}>{formData.quantity}</Typography>
                    <Button onClick={() => handleQuantityChange(formData.quantity + 1)} disabled={formData.quantity >= 10}>+</Button>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                    <Typography>Total:</Typography>
                    <Typography>${(formData.quantity * parseFloat(event.cost.replace(/[^0-9.]/g, ''))).toFixed(2)}</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
          <Button variant="contained" onClick={handleNext} disabled={loading} sx={{ float: 'right' }}>
            Continue to Checkout
          </Button>
        </Box>
      )}

      {activeStep === 1 && (
        <Box>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Contact Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Full Name" name="name" value={formData.name} onChange={handleChange} error={!!formErrors.name} helperText={formErrors.name} required />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={!!formErrors.email} helperText={formErrors.email} required />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Phone" name="phone" value={formData.phone} onChange={handleChange} error={!!formErrors.phone} helperText={formErrors.phone} required />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="City" name="city" value={formData.city} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="State/Province" name="state" value={formData.state} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Country" name="country" value={formData.country} onChange={handleChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Special Requests" name="specialRequests" value={formData.specialRequests} onChange={handleChange} multiline rows={3} />
              </Grid>
            </Grid>
          </Paper>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined" onClick={handleBack} disabled={loading} startIcon={<ArrowBackIcon />}>
              Back
            </Button>
            <Button variant="contained" onClick={handleNext} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Continue to Payment'}
            </Button>
          </Box>
        </Box>
      )}

      {activeStep === 2 && (
        <Elements stripe={stripePromise}>
          <PaymentForm 
            formData={formData} 
            event={event} 
            onBack={handleBack} 
            onSubmit={handleSubmit} 
            loading={loading} 
            error={error} 
          />
        </Elements>
      )}
    </Box>
  );
};

export default EventBookingPage;
