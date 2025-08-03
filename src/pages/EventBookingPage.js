import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Button, Stepper, Step, StepLabel, TextField, Grid,  
  CircularProgress, Alert, Divider, Card, Chip, IconButton,
  Container, LinearProgress
} from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { 
  ArrowBack as ArrowBackIcon, 
  Event as EventIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import axios from 'axios';

// Initialize Stripe with error handling
const stripePromise = (() => {
  const publishableKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
  console.log('Environment check - REACT_APP_STRIPE_PUBLIC_KEY:', publishableKey ? 'Present' : 'Missing');
  
  if (!publishableKey) {
    console.warn('Stripe publishable key not found. Please set REACT_APP_STRIPE_PUBLIC_KEY in your environment variables.');
    return null;
  }
  
  if (!publishableKey.startsWith('pk_test_') && !publishableKey.startsWith('pk_live_')) {
    console.error('Invalid Stripe publishable key format. Key should start with pk_test_ or pk_live_');
    return null;
  }
  
  console.log('Initializing Stripe with key:', publishableKey.substring(0, 12) + '...');
  return loadStripe(publishableKey);
})();

const STEPS = [
  { label: 'Event Details', icon: <EventIcon /> },
  { label: 'Your Information', icon: <PersonIcon /> },
  { label: 'Payment', icon: <PaymentIcon /> }
];

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
  const [paymentElementReady, setPaymentElementReady] = useState(false);
  const [isStripeReady, setIsStripeReady] = useState(false);

  // Check if all requirements are met to enable the Pay button
  React.useEffect(() => {
    if (stripe && elements && paymentElementReady && formData.clientSecret) {
      console.log('All requirements met, enabling Pay button');
      setIsStripeReady(true);
    } else {
      setIsStripeReady(false);
    }
  }, [stripe, elements, paymentElementReady, formData.clientSecret]);

  // Check if Stripe is available
  if (!stripePromise) {
    return (
      <Card sx={{ p: 4, mb: 3, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <PaymentIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 2, color: 'error.main' }}>
            Payment Processing Unavailable
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Payment processing is not available at the moment. Please contact support for assistance.
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          onClick={onBack} 
          disabled={loading}
          startIcon={<ArrowBackIcon />}
          fullWidth
          sx={{ borderRadius: 2 }}
        >
          Back to Previous Step
        </Button>
      </Card>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setCardError('');

    try {
      console.log('Confirming payment with client secret:', formData.clientSecret);
      
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking-confirmation/${formData.ticketId}`,
        },
        redirect: 'if_required',
      });
      
      console.log('Payment confirmation result:', { stripeError, paymentIntent });
      
      if (paymentIntent) {
        console.log('Payment intent status:', paymentIntent.status);
        
        if (paymentIntent.status === 'succeeded') {
          console.log('Payment succeeded, confirming with backend');
          
          // Confirm payment with backend
          try {
            const confirmResponse = await axios.post('https://relevant-recovery-back-end.onrender.com/api/event-ticket-booking/confirm-payment', {
              paymentIntentId: paymentIntent.id,
              ticketId: formData.ticketId
            });
            
            if (confirmResponse.data.success) {
              console.log('Payment confirmed with backend');
              // Payment succeeded, navigate to confirmation
              await onSubmit();
              return;
            } else {
              console.error('Backend confirmation failed:', confirmResponse.data);
              setCardError('Payment succeeded but confirmation failed. Please contact support.');
            }
          } catch (confirmErr) {
            console.error('Backend confirmation error:', confirmErr);
            setCardError('Payment succeeded but confirmation failed. Please contact support.');
          }
        } else if (paymentIntent.status === 'requires_action') {
          console.log('Payment requires additional action');
          setCardError('Payment requires additional verification. Please try again.');
        } else if (paymentIntent.status === 'requires_payment_method') {
          console.log('Payment method failed');
          setCardError('Payment method failed. Please try a different card.');
        } else {
          console.log('Payment status:', paymentIntent.status);
          setCardError(`Payment status: ${paymentIntent.status}`);
        }
      }

      if (stripeError) {
        console.error('Stripe error:', stripeError);
        setCardError(stripeError.message);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setCardError(err.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle PaymentElement ready state
  const handleReady = () => {
    console.log('PaymentElement ready');
    setPaymentElementReady(true);
  };

  return (
    <Card sx={{ p: 4, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <PaymentIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Secure Payment
        </Typography>
        <Typography color="text.secondary">
          Your payment information is encrypted and secure
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Payment Information
          </Typography>
          <PaymentElement 
            onReady={handleReady}
            options={{
              fields: {
                billingDetails: 'auto'
              },
              layout: {
                type: 'tabs',
                defaultCollapsed: false
              }
            }}
          />
          {cardError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {cardError}
            </Alert>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button 
            variant="outlined" 
            onClick={onBack} 
            disabled={isProcessing || loading} 
            startIcon={<ArrowBackIcon />}
            fullWidth
            sx={{ borderRadius: 2, py: 1.5 }}
          >
            Back
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={!isStripeReady || isProcessing || loading}
            fullWidth
            sx={{ 
              borderRadius: 2, 
              py: 1.5,
              background: 'linear-gradient(45deg, #089e8e 30%, #0893b2 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #089e8e 60%, #0893b2 100%)',
              }
            }}
          >
            {isProcessing ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
                Processing...
              </Box>
            ) : (
              `Pay $${(parseFloat(event.cost.replace(/[^0-9.]/g, '')) * formData.quantity).toFixed(2)}`
            )}
          </Button>
        </Box>
      </form>
    </Card>
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

  // Debug logging
  useEffect(() => {
    console.log('EventBookingPage Debug:', {
      activeStep,
      stripePromise: !!stripePromise,
      event: !!event,
      formData
    });
  }, [activeStep, event, formData]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError('');
        
        // First try to fetch the specific event
        try {
          const response = await axios.get(`https://relevant-recovery-back-end.onrender.com/api/events/${eventId}`);
          setEvent(response.data);
          return;
        } catch (singleEventError) {
          console.log('Single event fetch failed, trying fallback...');
        }
        
        // Fallback: fetch all events and find the specific one
        const allEventsResponse = await axios.get('https://relevant-recovery-back-end.onrender.com/api/events');
        const allEvents = allEventsResponse.data;
        const foundEvent = allEvents.find(event => event._id === eventId);
        
        if (foundEvent) {
          setEvent(foundEvent);
        } else {
          throw new Error('Event not found');
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        if (err.message === 'Event not found') {
          setError('Event not found. It may have been removed or is no longer available.');
        } else if (err.response?.status === 404) {
          setError('Event not found. It may have been removed or is no longer available.');
        } else if (err.response?.status >= 500) {
          setError('Server error. Please try again later.');
        } else if (err.code === 'NETWORK_ERROR') {
          setError('Network error. Please check your internet connection.');
        } else {
          setError('Failed to load event details. Please try again.');
        }
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
        setError('');
        
        console.log('Sending booking request:', {
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
        
        console.log('Booking response:', response.data);
        
        if (response.data.success) {
          setFormData(prev => ({
            ...prev,
            clientSecret: response.data.data.clientSecret,
            ticketId: response.data.data.ticketId
          }));
          setActiveStep(prev => prev + 1);
        } else {
          throw new Error(response.data.message || 'Booking failed');
        }
      } catch (err) {
        console.error('Booking error:', err);
        console.error('Error response:', err.response?.data);
        
        if (err.response?.data?.errors) {
          // Handle server-side validation errors
          const serverErrors = err.response.data.errors;
          const validationErrors = {};
          
          // Map server error keys to form field names
          Object.keys(serverErrors).forEach(key => {
            switch (key) {
              case 'customerName':
                validationErrors.name = serverErrors[key];
                break;
              case 'customerEmail':
                validationErrors.email = serverErrors[key];
                break;
              case 'customerPhone':
                validationErrors.phone = serverErrors[key];
                break;
              case 'customerCity':
                validationErrors.city = serverErrors[key];
                break;
              case 'customerState':
                validationErrors.state = serverErrors[key];
                break;
              case 'customerCountry':
                validationErrors.country = serverErrors[key];
                break;
              case 'quantity':
                validationErrors.quantity = serverErrors[key];
                break;
              case 'eventId':
                setError(serverErrors[key]);
                return;
              default:
                // For any other errors, show them as general error
                setError(serverErrors[key]);
                return;
            }
          });
          
          if (Object.keys(validationErrors).length > 0) {
            setFormErrors(validationErrors);
            // Scroll to the first error field
            const firstErrorField = Object.keys(validationErrors)[0];
            const element = document.querySelector(`[name="${firstErrorField}"]`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        } else if (err.response?.data?.error) {
          // Handle other server errors
          setError(err.response.data.error);
        } else if (err.response?.data?.message) {
          // Handle server messages
          setError(err.response.data.message);
        } else {
          // Handle network or other errors
          setError(err.message || 'Failed to create booking. Please try again.');
        }
      } finally {
        setLoading(false);
      }
      return;
    }
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => setActiveStep(prev => prev - 1);
  const handleSubmit = () => navigate(`/booking-confirmation/${formData.ticketId}`);

  if (loading && !event) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        gap: 2
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Loading event details...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
            {error}
          </Alert>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              onClick={() => window.location.reload()}
              sx={{ borderRadius: 2 }}
            >
              Retry
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/events')}
              sx={{ borderRadius: 2 }}
            >
              Back to Events
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Alert severity="warning" sx={{ mb: 4, borderRadius: 2 }}>
            Event not found
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => navigate('/events')}
            sx={{ borderRadius: 2 }}
          >
            Back to Events
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate(-1)} 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Back to Events
          </Button>
          
          <Typography variant="h3" sx={{ 
            fontWeight: 800, 
            mb: 2,
            background: 'linear-gradient(45deg, #089e8e 30%, #0893b2 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Book Your Tickets
          </Typography>
          
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Complete your booking in just a few steps
          </Typography>
        </Box>

        {/* Progress Stepper */}
        <Card sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <Stepper 
            activeStep={activeStep} 
            alternativeLabel
            sx={{ 
              '& .MuiStepLabel-root': {
                '& .MuiStepLabel-label': {
                  fontWeight: 600,
                  fontSize: '14px'
                }
              }
            }}
          >
            {STEPS.map((step, index) => (
              <Step key={step.label}>
                <StepLabel 
                  icon={step.icon}
                  sx={{
                    '& .MuiStepLabel-iconContainer': {
                      '& .MuiStepIcon-root': {
                        color: index <= activeStep ? 'primary.main' : 'grey.400'
                      }
                    }
                  }}
                >
                  {step.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <LinearProgress 
            variant="determinate" 
            value={((activeStep + 1) / STEPS.length) * 100}
            sx={{ 
              mt: 3, 
              height: 6, 
              borderRadius: 3,
              backgroundColor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                background: 'linear-gradient(45deg, #089e8e 30%, #0893b2 90%)'
              }
            }}
          />
        </Card>

        {/* Step Content */}
        {activeStep === 0 && (
          <Card sx={{ p: 4, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
            <Grid container spacing={4}>
              {/* Event Image */}
              <Grid item xs={12} md={5}>
                <Box sx={{ 
                  height: 300, 
                  borderRadius: 3, 
                  overflow: 'hidden',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  position: 'relative'
                }}>
                  {event.image ? (
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover' 
                      }} 
                    />
                  ) : (
                    <Box sx={{ 
                      width: '100%', 
                      height: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      background: 'linear-gradient(45deg, #089e8e 30%, #0893b2 90%)',
                      color: 'white',
                      fontSize: 24,
                      fontWeight: 600
                    }}>
                      <EventIcon sx={{ fontSize: 48, mr: 2 }} />
                      Event
                    </Box>
                  )}
                </Box>
              </Grid>

              {/* Event Details */}
              <Grid item xs={12} md={7}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, lineHeight: 1.2 }}>
                    {event.title}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                    <Chip 
                      icon={<TimeIcon />} 
                      label={event.date} 
                      color="primary" 
                      variant="outlined"
                    />
                    <Chip 
                      icon={<LocationIcon />} 
                      label={event.place} 
                      color="secondary" 
                      variant="outlined"
                    />
                    {event.capacity && (
                      <Chip 
                        label={`${event.capacity} spots`} 
                        color="info" 
                        variant="outlined"
                      />
                    )}
                  </Box>

                  <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6, color: 'text.secondary' }}>
                    {event.desc}
                  </Typography>

                  {event.highlights && event.highlights.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Event Highlights:
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {event.highlights.map((highlight, idx) => (
                          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircleIcon sx={{ fontSize: 20, color: 'success.main' }} />
                            <Typography variant="body2">{highlight}</Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}

                  {event.specialGift && (
                    <Box sx={{ 
                      background: 'linear-gradient(45deg, #e8f5e8 30%, #e3f1fa 90%)',
                      borderRadius: 2, 
                      p: 2, 
                      mb: 3,
                      border: '2px solid',
                      borderColor: 'success.light'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <span role="img" aria-label="gift" style={{ fontSize: 24 }}>🎁</span>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'success.main' }}>
                          Special Gift for Attendees:
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="success.main">
                        {event.specialGift}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Ticket Information */}
                <Card sx={{ p: 3, mb: 3, borderRadius: 2, background: 'linear-gradient(45deg, #f8f9fa 30%, #e9ecef 90%)' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                    Ticket Information
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">Price per ticket:</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      ${parseFloat(event.cost.replace(/[^0-9.]/g, '')).toFixed(2)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 600 }}>Quantity:</Typography>
                    <IconButton 
                      onClick={() => handleQuantityChange(formData.quantity - 1)} 
                      disabled={formData.quantity <= 1}
                      sx={{ border: '2px solid', borderColor: 'primary.main' }}
                    >
                      -
                    </IconButton>
                    <Typography sx={{ mx: 3, fontWeight: 700, fontSize: '18px' }}>
                      {formData.quantity}
                    </Typography>
                    <IconButton 
                      onClick={() => handleQuantityChange(formData.quantity + 1)} 
                      disabled={formData.quantity >= 10}
                      sx={{ border: '2px solid', borderColor: 'primary.main' }}
                    >
                      +
                    </IconButton>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Total:
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
                      ${(formData.quantity * parseFloat(event.cost.replace(/[^0-9.]/g, ''))).toFixed(2)}
                    </Typography>
                  </Box>
                </Card>

                <Button 
                  variant="contained" 
                  onClick={handleNext} 
                  disabled={loading}
                  fullWidth
                  sx={{ 
                    borderRadius: 2, 
                    py: 2,
                    fontSize: '18px',
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #089e8e 30%, #0893b2 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #089e8e 60%, #0893b2 100%)',
                    }
                  }}
                >
                  Continue to Checkout
                </Button>
              </Grid>
            </Grid>
          </Card>
        )}

        {activeStep === 1 && (
          <Card sx={{ p: 4, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box sx={{ 
                width: 80, 
                height: 80, 
                borderRadius: '50%', 
                background: 'linear-gradient(45deg, #089e8e 30%, #0893b2 90%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2
              }}>
                <PersonIcon sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
                Your Information
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                Help us personalize your experience
              </Typography>
              <Typography variant="body1" color="text.secondary">
                We'll use this information to send you event updates and confirmations
              </Typography>
            </Box>

            <Grid container spacing={4}>
              {/* Personal Information Section */}
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%', 
                      background: 'linear-gradient(45deg, #089e8e 30%, #0893b2 90%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2
                    }}>
                      <PersonIcon sx={{ fontSize: 20, color: 'white' }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Personal Details
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField 
                      fullWidth 
                      label="Full Name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      error={!!formErrors.name} 
                      helperText={formErrors.name} 
                      required 
                      sx={{ 
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: 2,
                          '&:hover': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'primary.main',
                            }
                          },
                          '&.Mui-error': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'error.main',
                              borderWidth: '2px'
                            }
                          }
                        },
                        '& .MuiFormHelperText-root': {
                          fontSize: '14px',
                          fontWeight: 500
                        }
                      }}
                      InputProps={{
                        startAdornment: (
                          <Box sx={{ mr: 1, color: formErrors.name ? 'error.main' : 'text.secondary' }}>
                            <PersonIcon />
                          </Box>
                        ),
                      }}
                    />
                    
                    <TextField 
                      fullWidth 
                      label="Email Address" 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      error={!!formErrors.email} 
                      helperText={formErrors.email} 
                      required 
                      sx={{ 
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: 2,
                          '&:hover': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'primary.main',
                            }
                          },
                          '&.Mui-error': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'error.main',
                              borderWidth: '2px'
                            }
                          }
                        },
                        '& .MuiFormHelperText-root': {
                          fontSize: '14px',
                          fontWeight: 500
                        }
                      }}
                      InputProps={{
                        startAdornment: (
                          <Box sx={{ mr: 1, color: formErrors.email ? 'error.main' : 'text.secondary' }}>
                            <EmailIcon />
                          </Box>
                        ),
                      }}
                    />
                    
                    <TextField 
                      fullWidth 
                      label="Phone Number" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      error={!!formErrors.phone} 
                      helperText={formErrors.phone} 
                      required 
                      sx={{ 
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: 2,
                          '&:hover': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'primary.main',
                            }
                          },
                          '&.Mui-error': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'error.main',
                              borderWidth: '2px'
                            }
                          }
                        },
                        '& .MuiFormHelperText-root': {
                          fontSize: '14px',
                          fontWeight: 500
                        }
                      }}
                      InputProps={{
                        startAdornment: (
                          <Box sx={{ mr: 1, color: formErrors.phone ? 'error.main' : 'text.secondary' }}>
                            <PhoneIcon />
                          </Box>
                        ),
                      }}
                    />
                  </Box>
                </Card>
              </Grid>

              {/* Location Information Section */}
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%', 
                      background: 'linear-gradient(45deg, #089e8e 30%, #0893b2 90%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2
                    }}>
                      <LocationIcon sx={{ fontSize: 20, color: 'white' }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Location Details
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField 
                      fullWidth 
                      label="City" 
                      name="city" 
                      value={formData.city} 
                      onChange={handleChange} 
                      error={!!formErrors.city} 
                      helperText={formErrors.city} 
                      sx={{ 
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: 2,
                          '&:hover': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'primary.main',
                            }
                          },
                          '&.Mui-error': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'error.main',
                              borderWidth: '2px'
                            }
                          }
                        },
                        '& .MuiFormHelperText-root': {
                          fontSize: '14px',
                          fontWeight: 500
                        }
                      }}
                      InputProps={{
                        startAdornment: (
                          <Box sx={{ mr: 1, color: formErrors.city ? 'error.main' : 'text.secondary' }}>
                            <LocationIcon />
                          </Box>
                        ),
                      }}
                    />
                    
                    <TextField 
                      fullWidth 
                      label="State/Province" 
                      name="state" 
                      value={formData.state} 
                      onChange={handleChange} 
                      error={!!formErrors.state} 
                      helperText={formErrors.state} 
                      sx={{ 
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: 2,
                          '&:hover': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'primary.main',
                            }
                          },
                          '&.Mui-error': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'error.main',
                              borderWidth: '2px'
                            }
                          }
                        },
                        '& .MuiFormHelperText-root': {
                          fontSize: '14px',
                          fontWeight: 500
                        }
                      }}
                    />
                    
                    <TextField 
                      fullWidth 
                      label="Country" 
                      name="country" 
                      value={formData.country} 
                      onChange={handleChange} 
                      error={!!formErrors.country} 
                      helperText={formErrors.country} 
                      sx={{ 
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: 2,
                          '&:hover': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'primary.main',
                            }
                          },
                          '&.Mui-error': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'error.main',
                              borderWidth: '2px'
                            }
                          }
                        },
                        '& .MuiFormHelperText-root': {
                          fontSize: '14px',
                          fontWeight: 500
                        }
                      }}
                    />
                  </Box>
                </Card>
              </Grid>

              {/* Special Requests Section */}
              <Grid item xs={12}>
                <Card sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)', border: '2px solid', borderColor: 'warning.light' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%', 
                      background: 'linear-gradient(45deg, #ffc107 30%, #ff9800 90%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2
                    }}>
                      <span role="img" aria-label="note" style={{ fontSize: 20 }}>📝</span>
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Special Requests
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Optional - Let us know if you have any special requirements
                      </Typography>
                    </Box>
                  </Box>
                  
                  <TextField 
                    fullWidth 
                    label="Any special requests or accommodations needed?" 
                    name="specialRequests" 
                    value={formData.specialRequests} 
                    onChange={handleChange} 
                    multiline 
                    rows={4} 
                    placeholder="e.g., dietary restrictions, accessibility needs, or any other special requirements..."
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: 2,
                        '&:hover': {
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'warning.main',
                          }
                        }
                      }
                    }}
                  />
                </Card>
              </Grid>
            </Grid>

            {/* Progress Indicator */}
            <Box sx={{ mt: 4, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Step 2 of 3
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  67% Complete
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={67}
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    background: 'linear-gradient(45deg, #089e8e 30%, #0893b2 90%)'
                  }
                }}
              />
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
              <Button 
                variant="outlined" 
                onClick={handleBack} 
                disabled={loading}
                startIcon={<ArrowBackIcon />}
                fullWidth
                sx={{ 
                  borderRadius: 2, 
                  py: 2,
                  fontSize: '16px',
                  fontWeight: 600,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    background: 'rgba(8, 158, 142, 0.04)'
                  }
                }}
              >
                Back to Event Details
              </Button>
              <Button 
                variant="contained" 
                onClick={handleNext} 
                disabled={loading}
                fullWidth
                sx={{ 
                  borderRadius: 2, 
                  py: 2,
                  fontSize: '16px',
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #089e8e 30%, #0893b2 90%)',
                  boxShadow: '0 4px 14px rgba(8, 158, 142, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #089e8e 60%, #0893b2 100%)',
                    boxShadow: '0 6px 20px rgba(8, 158, 142, 0.6)',
                    transform: 'translateY(-1px)'
                  },
                  '&:disabled': {
                    background: 'grey.400',
                    boxShadow: 'none',
                    transform: 'none'
                  }
                }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    Processing...
                  </Box>
                ) : (
                  'Continue to Payment'
                )}
              </Button>
            </Box>
          </Card>
        )}

        {activeStep === 2 && (
          stripePromise ? (
            <Elements 
              stripe={stripePromise}
              options={{
                clientSecret: formData.clientSecret,
                appearance: {
                  theme: 'stripe',
                  variables: {
                    colorPrimary: '#089e8e',
                    colorBackground: '#ffffff',
                    colorText: '#30313d',
                    colorDanger: '#df1b41',
                    fontFamily: 'Arial, sans-serif',
                    spacingUnit: '4px',
                    borderRadius: '4px'
                  },
                  rules: {
                    '.Input': {
                      border: '1px solid #e6e8eb',
                      borderRadius: '4px'
                    }
                  }
                },
                loader: 'auto',
                fonts: [{
                  cssSrc: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
                }]
              }}
              key={formData.clientSecret}
            >
              <PaymentForm 
                formData={formData} 
                event={event} 
                onBack={handleBack} 
                onSubmit={handleSubmit} 
                loading={loading} 
                error={error} 
              />
            </Elements>
          ) : (
            <Card sx={{ p: 4, mb: 3, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <PaymentIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 2, color: 'error.main' }}>
                  Payment Processing Unavailable
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  Payment processing is not available at the moment. Please contact support for assistance.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Stripe configuration is missing. Please check your environment variables.
                </Typography>
              </Box>
              <Button 
                variant="outlined" 
                onClick={handleBack} 
                disabled={loading}
                startIcon={<ArrowBackIcon />}
                fullWidth
                sx={{ borderRadius: 2 }}
              >
                Back to Previous Step
              </Button>
            </Card>
          )
        )}
      </Container>
    </Box>
  );
};

export default EventBookingPage;
