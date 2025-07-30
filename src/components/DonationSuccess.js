import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function DonationSuccess() {
  return (
    <Box sx={{ mt: 8, textAlign: 'center' }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        Thank you for your donation!
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Your payment was successful. We appreciate your support.
      </Typography>
      <Button variant="contained" color="primary" component={Link} to="/">
        Back to Home
      </Button>
    </Box>
  );
}
