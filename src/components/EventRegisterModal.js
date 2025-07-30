import React, { useState } from 'react';
import {
  Dialog,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Snackbar,
  Alert as MuiAlert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const initialState = {
  name: '',
  email: '',
  phone: '',
  city: '',
  state: '',
  country: ''
};

const EventRegisterModal = ({ open, handleClose, eventId }) => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      await axios.post('https://relevant-recovery-back-end.onrender.com/api/registration', { ...form, event: eventId });
      setToast({ open: true, message: 'Registration successful!', severity: 'success' });
      setForm(initialState);
      // Do NOT close modal here; wait until toast is closed
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        setToast({ open: true, message: 'Server error. Please try again.', severity: 'error' });
      }
    }
    setLoading(false);
  };

  const handleToastClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setToast({ ...toast, open: false });
    if (toast.severity === 'success') {
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 0 } }}>
      <Box sx={{ p: { xs: 3, md: 4 }, pb: 3, position: 'relative' }}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 12, top: 12, color: '#888' }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          Register for Event
        </Typography>
        <Typography variant="body2" sx={{ color: '#555', mb: 3 }}>
          Fill in your details below to secure your spot for this event.
        </Typography>
        <Box component="form" autoComplete="off" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ minWidth: 60, color: '#222', fontWeight: 500 }}>Name</Typography>
            <TextField
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              variant="outlined"
              size="small"
              fullWidth
              required
              error={!!errors.name}
              helperText={errors.name}
              sx={{ ml: 2, borderRadius: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              InputProps={{ sx: { borderColor: '#0ba98d' } }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ minWidth: 60, color: '#222', fontWeight: 500 }}>Email</Typography>
            <TextField
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              variant="outlined"
              size="small"
              fullWidth
              required
              error={!!errors.email}
              helperText={errors.email}
              sx={{ ml: 2, borderRadius: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ minWidth: 60, color: '#222', fontWeight: 500 }}>Phone</Typography>
            <TextField
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone number (optional)"
              variant="outlined"
              size="small"
              fullWidth
              error={!!errors.phone}
              helperText={errors.phone}
              sx={{ ml: 2, borderRadius: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ minWidth: 60, color: '#222', fontWeight: 500 }}>City</Typography>
            <TextField
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
              variant="outlined"
              size="small"
              fullWidth
              required
              error={!!errors.city}
              helperText={errors.city}
              sx={{ ml: 2, borderRadius: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ minWidth: 60, color: '#222', fontWeight: 500 }}>State</Typography>
            <TextField
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="State"
              variant="outlined"
              size="small"
              fullWidth
              required
              error={!!errors.state}
              helperText={errors.state}
              sx={{ ml: 2, borderRadius: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Typography sx={{ minWidth: 60, color: '#222', fontWeight: 500 }}>Country</Typography>
            <TextField
              name="country"
              value={form.country}
              onChange={handleChange}
              placeholder="Country"
              variant="outlined"
              size="small"
              fullWidth
              required
              error={!!errors.country}
              helperText={errors.country}
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
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </Box>
      </Box>
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
    </Dialog>
  );
};

export default EventRegisterModal;
