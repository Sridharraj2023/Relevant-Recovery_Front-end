import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Alert, Button
} from '@mui/material';

const STRIPE_MOCK_URL = 'http://localhost:12111/v1/payment_intents';
const STRIPE_MOCK_SECRET = process.env.REACT_APP_STRIPE_MOCK_SECRET || '';

function StripeMockDashboard() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(STRIPE_MOCK_URL, {
          headers: {
            'Authorization': `Bearer ${STRIPE_MOCK_SECRET}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch payment intents');
        const data = await res.json();
        setPayments(data.data || []);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };
    fetchPayments();
  }, []);

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Stripe Mock Dashboard
      </Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Currency</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((intent) => (
                <TableRow key={intent.id}>
                  <TableCell>{intent.id}</TableCell>
                  <TableCell>{intent.amount / 100}</TableCell>
                  <TableCell>{intent.currency}</TableCell>
                  <TableCell>{intent.status}</TableCell>
                  <TableCell>{intent.description || '-'}</TableCell>
                  <TableCell>{new Date(intent.created * 1000).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Button variant="contained" sx={{ mt: 2 }} onClick={() => window.location.reload()}>
        Refresh
      </Button>
    </Paper>
  );
}

export default StripeMockDashboard;
