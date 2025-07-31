import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress, Paper, Divider } from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';

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

export default function DonationSuccess() {
  const [donationDetails, setDonationDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const paymentIntentId = searchParams.get('payment_intent');
  const amount = searchParams.get('amount');

  useEffect(() => {
    // In a real app, you would fetch donation details using the paymentIntentId
    const timer = setTimeout(() => {
      // Simulating API call
      setDonationDetails({
        amount: amount ? (amount / 100).toFixed(2) : '0.00', // Convert from cents to dollars
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        transactionId: paymentIntentId || 'N/A'
      });
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [paymentIntentId, amount]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <style>{printStyles}</style>
      <Box sx={{ maxWidth: 600, mx: 'auto', my: 8, px: 2 }} className="no-print">
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: 'success.main' }}>
          Thank You for Your Generous Donation!
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 4 }}>
          Your support helps us make a difference. Here's your donation confirmation:
        </Typography>

        <Box sx={{ 
          textAlign: 'left', 
          bgcolor: 'grey.50', 
          p: 3, 
          borderRadius: 2,
          mb: 4
        }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Donation Details</Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Amount:</Typography>
            <Typography fontWeight="bold">${donationDetails.amount}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Date:</Typography>
            <Typography>{donationDetails.date}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>Transaction ID:</Typography>
            <Typography sx={{ 
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              wordBreak: 'break-word',
              textAlign: 'right',
              maxWidth: '60%'
            }}>
              {donationDetails.transactionId}
            </Typography>
          </Box>
        </Box>

        <Typography variant="body2" sx={{ mb: 3, fontStyle: 'italic' }}>
          A confirmation has been sent to your email.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            color="primary" 
            component={Link} 
            to="/"
            sx={{ minWidth: 180 }}
          >
            Back to Home
          </Button>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={() => window.print()}
            sx={{ minWidth: 180 }}
          >
            Print Receipt
          </Button>
        </Box>
      </Paper>
    </Box>
    
    {/* Print View */}
    <Box sx={{ display: 'none' }} className="print-only">
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Donation Receipt</Typography>
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
          Thank you for your generous donation of <strong>${donationDetails?.amount || '0.00'}</strong>.
          Your support helps us make a difference in our community.
        </Typography>
        
        <Box sx={{ mt: 3, border: '1px solid #ddd', p: 2, borderRadius: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>DONATION DETAILS</Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Amount:</Typography>
            <Typography fontWeight="bold">${donationDetails?.amount || '0.00'}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Date:</Typography>
            <Typography>{donationDetails?.date || 'N/A'}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>Transaction ID:</Typography>
            <Typography sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
              {donationDetails?.transactionId || 'N/A'}
            </Typography>
          </Box>
        </Box>
      </Box>
      
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
          This is an official receipt for tax purposes. Thank you for your support!
        </Typography>
      </Box>
    </Box>
    </>
  );
}
