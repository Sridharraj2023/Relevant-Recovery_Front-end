import React, { useState } from 'react';
import { Box, Button, TextField, Grid, Alert, Dialog, DialogTitle, DialogContent } from '@mui/material';
import axios from 'axios';

const initialState = {
  name: '',
  email: '',
  phone: '',
  city: '',
  state: '',
  country: ''
};

const RegisterPage = ({ open, handleClose, eventId }) => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess('');
    try {
      const res = await axios.post('/api/registration', { ...form, event: eventId });
      setSuccess(res.data.message);
      setForm(initialState);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ server: 'Server error. Please try again.' });
      }
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Register for Event</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '90%' }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: '100%', maxWidth: 500, mx: 'auto' }}>

          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ width: '100%' }}>
              <TextField  label="Name" name="name" value={form.name} onChange={handleChange} fullWidth required error={!!errors.name} helperText={errors.name} />
            </Grid>
            <Grid item xs={12} sx={{ width: '100%' }}>
              <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth required error={!!errors.email} helperText={errors.email} />
            </Grid>
            <Grid item xs={12} sx={{ width: '100%' }}>
              <TextField label="Phone (Optional)" name="phone" value={form.phone} onChange={handleChange} fullWidth error={!!errors.phone} helperText={errors.phone} />
            </Grid>            
            <Grid item xs={12} sm={6} sx={{ width: '100%' }}>
              <TextField label="City" name="city" value={form.city} onChange={handleChange} fullWidth required error={!!errors.city} helperText={errors.city} />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ width: '100%' }}>
              <TextField label="State" name="state" value={form.state} onChange={handleChange} fullWidth required error={!!errors.state} helperText={errors.state} />
            </Grid>
            <Grid item xs={12} sx={{ width: '100%' }}>
              <TextField label="Country" name="country" value={form.country} onChange={handleChange} fullWidth required error={!!errors.country} helperText={errors.country} />
            </Grid>
          </Grid>
          {errors.server && <Alert severity="error" sx={{ mt: 2 }}>{errors.server}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }} disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </Box>
      </Box>
    </DialogContent>
  </Dialog>
  );
};

export default RegisterPage;
