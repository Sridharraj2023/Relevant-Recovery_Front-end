import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Divider
} from '@mui/material';

import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';


function CheckoutForm({ clientSecret, selectedAmount }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isStripeReady, setIsStripeReady] = useState(false);
  const [paymentElementReady, setPaymentElementReady] = useState(false);
  
  // Debug logging
  React.useEffect(() => {
    console.log('=== Stripe Debug ===');
    console.log('Stripe:', stripe ? 'Loaded' : 'Loading...');
    console.log('Elements:', elements ? 'Loaded' : 'Loading...');
    console.log('Payment Element Ready:', paymentElementReady);
    console.log('Client Secret:', clientSecret ? 'Present' : 'Missing');
    console.log('Client Secret Format:', clientSecret ? clientSecret.substring(0, 20) + '...' : 'None');
    console.log('isStripeReady:', isStripeReady);
    console.log('===================');
  }, [stripe, elements, paymentElementReady, clientSecret, isStripeReady]);
  
  // Check if all requirements are met to enable the Pay button
  React.useEffect(() => {
    console.log('Checking requirements:');
    console.log('- Stripe:', !!stripe);
    console.log('- Elements:', !!elements);
    console.log('- PaymentElement Ready:', paymentElementReady);
    console.log('- Client Secret:', !!clientSecret);
    console.log('- Client Secret Valid:', clientSecret ? clientSecret.startsWith('pi_') && clientSecret.includes('_secret_') : false);
    
    if (stripe && elements && paymentElementReady && clientSecret && clientSecret.startsWith('pi_') && clientSecret.includes('_secret_')) {
      console.log('All requirements met, enabling Pay button');
      setIsStripeReady(true);
    } else {
      setIsStripeReady(false);
    }
  }, [stripe, elements, paymentElementReady, clientSecret]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/donation-success`,
        },
        redirect: 'if_required',
      });
      
      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Redirect to success page with payment intent ID and amount
        window.location.href = `/donation-success?payment_intent=${paymentIntent.id}&amount=${selectedAmount * 100}`;
        return;
      }

      if (stripeError) {
        setError(stripeError.message);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while processing your payment.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle PaymentElement ready state
  const handleReady = () => {
    console.log('PaymentElement ready');
    setPaymentElementReady(true);
  };

  // Handle PaymentElement errors
  const handleError = (error) => {
    console.error('PaymentElement error:', error);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement 
        onReady={handleReady}
        onError={handleError}
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
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ 
          mt: 3, 
          mb: 2,
          p: 1.5,
          fontSize: '1.1rem',
          borderRadius: 999, 
          fontWeight: 700,
          background: 'linear-gradient(90deg, #0ba98d 0%, #0893b2 100%)',
          '&:hover': {
            background: 'linear-gradient(90deg, #089e8e 0%, #0791b0 100%)',
            opacity: 0.95,
            boxShadow: 'none',
          },
          '&.Mui-disabled': {
            background: '#e0e0e0',
            color: '#a0a0a0'
          }
        }}
        disabled={!isStripeReady || isProcessing || !clientSecret}
      >
        {isProcessing ? 'Processing...' : `Pay $${Number(selectedAmount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
      </Button>
      {error && (
        <Typography color="error" sx={{ mt: 2, textAlign: 'center', fontSize: '0.9rem' }}>
          {error}
        </Typography>
      )}
    </form>
  );
}

export default function DonationPage() {
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [form, setForm] = useState({
  firstName: '', lastName: '', org: '', title: '', address: '', city: '', state: '', zip: '', country: 'US', phone: '', email: '', emailWork: '', volunteer: false, familyServices: false
});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stripeClientSecret, setStripeClientSecret] = useState(null);

  // Admin donation options state
  const [donationOptions, setDonationOptions] = useState([]);
  React.useEffect(() => {
    axios.get('https://relevant-recovery-back-end.onrender.com/api/donation-options')
      .then(res => setDonationOptions(Array.isArray(res.data) ? res.data.filter(opt => opt.active !== false) : []))
      .catch(() => setDonationOptions([]));
  }, []);

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
  };
  const handleFormChange = (e) => {
    const { name, value, type: t, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: t === 'checkbox' ? checked : value }));
  };

  const [fieldErrors, setFieldErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setFieldErrors({});
    setLoading(true);
    try {
      const payload = {
        ...form,
        amount: selectedAmount,
        paymentMethod: 'stripe',
      };
      const res = await fetch('https://relevant-recovery-back-end.onrender.com/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log('API Response:', data); // Debug log
      if (!res.ok) {
        if (data.errors) {
          setFieldErrors(data.errors);
          setError('Please fix the errors below.');
        } else {
          setError(data.error || 'Failed to submit donation');
        }
        return;
      }
      
      if (!data.clientSecret) {
        console.error('No clientSecret in response:', data);
        setError('Payment processing error. Please try again.');
        return;
      }
      
      setSuccess('Donation initiated! Proceeding to payment...');
      setStripeClientSecret(data.clientSecret);
    } catch (err) {
      setError(err.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };
  // Initialize Stripe with your publishable key
  const stripePromise = React.useMemo(() => {
    const key = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
    console.log('DonationPage - Environment check - REACT_APP_STRIPE_PUBLIC_KEY:', key ? 'Present' : 'Missing');
    
    if (!key) {
      console.error('Stripe publishable key is not set. Please check your .env file for REACT_APP_STRIPE_PUBLIC_KEY');
      return null;
    }
    
    if (!key.startsWith('pk_test_') && !key.startsWith('pk_live_')) {
      console.error('Invalid Stripe publishable key format. Key should start with pk_test_ or pk_live_');
      return null;
    }
    
    console.log('Initializing Stripe with key:', key.substring(0, 12) + '...');
    return loadStripe(key);
  }, []);
  
  const appearance = {
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
  };

  return (
    <Box sx={{ width: '100%', bgcolor: '#f8fafc', minHeight: '100vh', pb: 8 }}>
      {/* Hero Section */}
      <Box sx={{ background: 'linear-gradient(90deg, #0ba98d 0%, #0893b2 100%)', py: 6, px: 2, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 900, color: '#fff', mb: 1 }}>
          Join Our Community of Support
        </Typography>
        <Typography variant="h6" sx={{ color: '#e6f7f5', fontWeight: 400, maxWidth: 700, mx: 'auto' }}>
          Your generosity fuels our mission and creates pathways to recovery. Choose how you'd like to make an impact today.
        </Typography>
      </Box>
      <Box sx={{ display: { xs: 'block', md: 'flex' }, alignItems: 'flex-start', p: { xs: 2, md: 4 }, background: '#f8fafc' }}>
        {/* Left: Donation Options (Admin fixed options as cards) */}
        <Box sx={{ flex: 1, minWidth: 0, mr: { md: 4 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Group by type and group, sort by order */}
            {['membership', 'sponsorship', 'contribution'].map(type => (
              <Box key={type} sx={{ background: '#fff', borderRadius: 3, p: 3, boxShadow: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  {type === 'membership' ? 'Memberships' : type === 'sponsorship' ? 'Sponsorships' : 'Contributions'}
                </Typography>
                {/* For contributions, group by group name, else list by group */}
                {type === 'contribution'
                  ? (
                    <Grid container spacing={2}>
                      {[...new Set(donationOptions.filter(opt => opt.type === 'contribution').map(opt => opt.group))].map(groupName => (
                        <Grid item xs={12} sm={4} key={groupName}>
                          <Box sx={{ background: '#fff', borderRadius: 3, p: 3, boxShadow: 1, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography sx={{ fontWeight: 700, mb: 1 }}>{groupName}</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                              {donationOptions.filter(opt => opt.type === 'contribution' && opt.group === groupName).sort((a,b) => a.order-b.order).map(opt => (
                                <Button
                                  key={opt._id}
                                  variant={selectedAmount === Number(opt.amount) ? 'contained' : 'outlined'}
                                  color={selectedAmount === Number(opt.amount) ? 'primary' : 'inherit'}
                                  sx={{ borderRadius: 999, fontWeight: 700, minWidth: 90, m: 0.5, borderColor: '#089e8e', color: selectedAmount === Number(opt.amount) ? '#fff' : '#089e8e', background: selectedAmount === Number(opt.amount) ? 'linear-gradient(90deg, #0ba98d 0%, #0893b2 100%)' : '#fff' }}
                                  onClick={() => handleAmountSelect(Number(opt.amount))}
                                >
                                  ${Number(opt.amount).toLocaleString()}
                                </Button>
                              ))}
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  )
                  : (
                    donationOptions.filter(opt => opt.type === type).sort((a,b) => a.order-b.order).map(opt => (
                      <Box key={opt._id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, border: selectedAmount === Number(opt.amount) ? '2px solid #089e8e' : '1px solid #e0e0e0', borderRadius: 2, p: 2, cursor: 'pointer', background: selectedAmount === Number(opt.amount) ? '#e6fcf5' : '#fff' }} onClick={() => handleAmountSelect(Number(opt.amount))}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {/* Optionally add icons based on group/label if desired */}
                          <Typography sx={{ fontWeight: 600 }}>{opt.label}</Typography>
                        </Box>
                        <Typography sx={{ fontWeight: 700 }}>${Number(opt.amount).toLocaleString()}</Typography>
                      </Box>
                    ))
                  )}
              </Box>
            ))}
          </Box>
        </Box>
        {/* Right: User Info Form or Stripe Payment Form */}
        <Box sx={{  width: '100%', maxWidth: 600, ml: { md: 0 } , mt: { xs: 4, md: 0 } }}>
          <Box sx={{ background: '#fff', borderRadius: 3, p: 3, boxShadow: 2, }}>
            {!stripeClientSecret ? (
              <form onSubmit={handleSubmit}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, ml: { md: 4 } }}>Your Information</Typography>
                <Grid container spacing={2} sx={{ ml: { md: 0 }, justifyContent: 'center' }}>
                  <Grid item xs={12} sm={6}><TextField label="First Name" name="firstName" value={form.firstName} onChange={handleFormChange} fullWidth size="small" error={!!fieldErrors.firstName} helperText={fieldErrors.firstName || ''} /></Grid>
                  <Grid item xs={12} sm={6}><TextField label="Last Name" name="lastName" value={form.lastName} onChange={handleFormChange} fullWidth size="small" error={!!fieldErrors.lastName} helperText={fieldErrors.lastName || ''} /></Grid>
                  <Grid item xs={12}><TextField label="Organization Name" name="org" value={form.org} onChange={handleFormChange} fullWidth size="small" error={!!fieldErrors.org} helperText={fieldErrors.org || ''} /></Grid>
                  <Grid item xs={12}><TextField label="Work Title" name="title" value={form.title} onChange={handleFormChange} fullWidth size="small" error={!!fieldErrors.title} helperText={fieldErrors.title || ''} /></Grid>
                  <Grid item xs={12}><TextField label="Address" name="address" value={form.address} onChange={handleFormChange} fullWidth size="small" error={!!fieldErrors.address} helperText={fieldErrors.address || ''} /></Grid>
                  <Grid item xs={12} sm={4}><TextField label="City" name="city" value={form.city} onChange={handleFormChange} fullWidth size="small" error={!!fieldErrors.city} helperText={fieldErrors.city || ''} /></Grid>
                  <Grid item xs={12} sm={6}><TextField label="State" name="state" value={form.state} onChange={handleFormChange} fullWidth size="small" error={!!fieldErrors.state} helperText={fieldErrors.state || ''} /></Grid>
                  <Grid item xs={12} sm={6}><TextField label="Zip" name="zip" value={form.zip} onChange={handleFormChange} fullWidth size="small" error={!!fieldErrors.zip} helperText={fieldErrors.zip || ''} /></Grid>
                  <Grid item xs={12} sm={6}><TextField 
                    select 
                    label="Country" 
                    name="country" 
                    value={form.country} 
                    onChange={handleFormChange} 
                    fullWidth 
                    size="small" 
                    SelectProps={{ native: true }} 
                    error={!!fieldErrors.country} 
                    helperText={fieldErrors.country || ''}
                    sx={{ 
                      width: '100%',
                      '& .MuiInputBase-root': { width: '100%' },
                      '& .MuiOutlinedInput-root': { width: '100%' },
                      '& .MuiSelect-select, & .MuiNativeSelect-select, & select': { width: '100%' }
                    }}
                  >
  <option value="US">United States</option>
  <option value="IN">India</option>
  <option value="CA">Canada</option>
  <option value="GB">United Kingdom</option>
  <option value="AU">Australia</option>
  <option value="DE">Germany</option>
  <option value="FR">France</option>
  <option value="SG">Singapore</option>
  <option value="JP">Japan</option>
  <option value="AE">United Arab Emirates</option>
  <option value="">Other</option>
</TextField></Grid>
                  <Grid item xs={12} sm={6}><TextField label="Main Phone" name="phone" value={form.phone} onChange={handleFormChange} fullWidth size="small" error={!!fieldErrors.phone} helperText={fieldErrors.phone || ''} /></Grid>
                  <Grid item xs={12}><TextField label="Email (Home)" name="email" value={form.email} onChange={handleFormChange} fullWidth size="small" error={!!fieldErrors.email} helperText={fieldErrors.email || ''} /></Grid>
                  <Grid item xs={12}><TextField label="Email (Work)" name="emailWork" value={form.emailWork} onChange={handleFormChange} fullWidth size="small" error={!!fieldErrors.emailWork} helperText={fieldErrors.emailWork || ''} /></Grid>
                </Grid>
                <Box sx={{ mt: 2, ml: { md: 4 } }}>
                  <Typography sx={{ fontWeight: 600, mb: 1 }}>I'm also interested in:</Typography>
                  <FormControlLabel control={<Checkbox name="volunteer" checked={form.volunteer} onChange={handleFormChange} />} label="Volunteering" />
                  <FormControlLabel control={<Checkbox name="familyServices" checked={form.familyServices} onChange={handleFormChange} />} label="Family Services" />
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: 20 }}>Selected Amount:</Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: '2.2rem', color: '#089e8e' }}>${selectedAmount.toLocaleString()}</Typography>
                </Box>
                {error && <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>}
                {Object.keys(fieldErrors).length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    {Object.entries(fieldErrors).map(([field, msg]) => (
                      <Typography key={field} color="error" sx={{ fontSize: 14 }}>{msg}</Typography>
                    ))}
                  </Box>
                )}
                {success && <Typography color="primary" sx={{ mb: 1 }}>{success}</Typography>}
                <Button
                  type="submit"
                  variant="text"
                  fullWidth
                  sx={{ background: 'linear-gradient(90deg, #0ba98d 0%, #0893b2 100%)', color: '#fff', fontWeight: 600, fontSize: 18, borderRadius: 999, py: 2, textTransform: 'none', boxShadow: 'none', '&:hover': { background: 'linear-gradient(90deg, #089e8e 0%, #0893b2 100%)', opacity: 0.95, boxShadow: 'none', }, mb: 1 }}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Proceed to Payment'}
                </Button>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" style={{ marginRight: 6 }}><path fill="#b0b8c1" d="M12 2c-4.97 0-9 2.16-9 4.82v5.36c0 4.42 4.03 8.44 8.25 9.8.5.16 1.01.16 1.5 0C16.97 20.62 21 16.6 21 12.18V6.82C21 4.16 16.97 2 12 2Zm7 10.18c0 3.77-3.44 7.2-7 8.44-3.56-1.24-7-4.67-7-8.44V6.82C5 4.97 8.58 3.5 12 3.5s7 1.47 7 3.32v5.36Z"/><path fill="#b0b8c1" d="M12 7a2 2 0 0 0-2 2c0 1.1.9 2 2 2s2-.9 2-2a2 2 0 0 0-2-2Zm0 2.5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1Z"/></svg>
                  <Typography sx={{ color: '#888', fontSize: 16, textAlign: 'center' }}>
                    Secure payment via Stripe
                  </Typography>
                </Box>
              </form>
            ) : stripeClientSecret && stripePromise ? (
              <Elements 
                stripe={stripePromise}
                options={{
                  clientSecret: stripeClientSecret,
                  appearance: appearance,
                  loader: 'auto',
                  fonts: [{
                    cssSrc: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
                  }]
                }}
                key={stripeClientSecret}
              >
                <CheckoutForm 
                  clientSecret={stripeClientSecret} 
                  selectedAmount={selectedAmount} 
                />
              </Elements>
            ) : null}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}