import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Divider,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GroupIcon from '@mui/icons-material/Group';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

const membershipOptions = [
  { label: 'Family Membership', price: 100, icon: <GroupIcon sx={{ color: '#20bfa9' }} /> },
  { label: 'Organizational Membership', price: 250, icon: <GroupIcon sx={{ color: '#20bfa9' }} /> },
];
const sponsorshipOptions = [
  { label: 'Class/Workshop Sponsorship', price: 1000, icon: <EventAvailableIcon sx={{ color: '#20bfa9' }} /> },
  { label: 'Program Sponsorship', price: 5000, icon: <StarBorderIcon sx={{ color: '#20bfa9' }} /> },
  { label: 'Special Events Sponsorship', price: 10000, icon: <EventAvailableIcon sx={{ color: '#20bfa9' }} /> },
];
const contributionOptions = [
  { group: 'Friend', values: [100, 250] },
  { group: 'Supporter', values: [500, 1000, 2500] },
  { group: 'Sustainer', values: [1000, 5000, 10000] },
];

export default function DonationPage({ open, onClose }) {
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [selectedType, setSelectedType] = useState('');
  const [form, setForm] = useState({
    firstName: '', lastName: '', org: '', title: '', address: '', city: '', state: '', zip: '', phone: '', email: '', emailWork: '', volunteer: false, familyServices: false
  });

  const handleAmountSelect = (amount, type) => {
    setSelectedAmount(amount);
    setSelectedType(type);
  };
  const handleFormChange = (e) => {
    const { name, value, type: t, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: t === 'checkbox' ? checked : value }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 4, p: 0, background: '#f8fafc' } }}>
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ background: 'linear-gradient(90deg, #0ba98d 0%, #0893b2 100%)', py: 6, px: 2, textAlign: 'center', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
          <Typography variant="h3" sx={{ fontWeight: 900, color: '#fff', mb: 1 }}>
            Join Our Community of Support
          </Typography>
          <Typography variant="h6" sx={{ color: '#e6f7f5', fontWeight: 400, maxWidth: 700, mx: 'auto' }}>
            Your generosity fuels our mission and creates pathways to recovery. Choose how you'd like to make an impact today.
          </Typography>
          <IconButton onClick={onClose} sx={{ position: 'absolute', right: 24, top: 24, color: '#fff' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Grid container spacing={4} sx={{ p: { xs: 2, md: 4 }, background: '#f8fafc' }}>
          {/* Left: Donation Options */}
          <Grid item xs={12} md={7}>
            <Box sx={{ background: '#fff', borderRadius: 3, p: 3, mb: 3, boxShadow: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Memberships</Typography>
              {membershipOptions.map(opt => (
                <Box key={opt.label} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, border: selectedType === opt.label ? '2px solid #089e8e' : '1px solid #e0e0e0', borderRadius: 2, p: 2, cursor: 'pointer', background: selectedType === opt.label ? '#e6fcf5' : '#fff' }} onClick={() => handleAmountSelect(opt.price, opt.label)}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{opt.icon}<Typography sx={{ fontWeight: 600 }}>{opt.label}</Typography></Box>
                  <Typography sx={{ fontWeight: 700 }}>${opt.price.toLocaleString()}</Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ background: '#fff', borderRadius: 3, p: 3, mb: 3, boxShadow: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Sponsorships</Typography>
              {sponsorshipOptions.map(opt => (
                <Box key={opt.label} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, border: selectedType === opt.label ? '2px solid #089e8e' : '1px solid #e0e0e0', borderRadius: 2, p: 2, cursor: 'pointer', background: selectedType === opt.label ? '#e6fcf5' : '#fff' }} onClick={() => handleAmountSelect(opt.price, opt.label)}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{opt.icon}<Typography sx={{ fontWeight: 600 }}>{opt.label}</Typography></Box>
                  <Typography sx={{ fontWeight: 700 }}>${opt.price.toLocaleString()}</Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ background: '#fff', borderRadius: 3, p: 3, boxShadow: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Contributions</Typography>
              <Grid container spacing={2}>
                {contributionOptions.map(group => (
                  <Grid item xs={12} sm={4} key={group.group}>
                    <Typography sx={{ fontWeight: 600, mb: 1 }}>{group.group}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {group.values.map(val => (
                        <Button key={val} variant={selectedAmount === val && selectedType === group.group ? 'contained' : 'outlined'} onClick={() => handleAmountSelect(val, group.group)} sx={{ borderRadius: 999, fontWeight: 700, minWidth: 80, background: selectedAmount === val && selectedType === group.group ? '#e6fcf5' : '#fff', color: '#089e8e', borderColor: '#089e8e', mb: 1 }}>
                          ${val.toLocaleString()}
                        </Button>
                      ))}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
          {/* Right: User Info Form */}
          <Grid item xs={12} md={5}>
            <Box sx={{ background: '#fff', borderRadius: 3, p: 3, boxShadow: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Your Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}><TextField label="First Name" name="firstName" value={form.firstName} onChange={handleFormChange} fullWidth size="small" /></Grid>
                <Grid item xs={6}><TextField label="Last Name" name="lastName" value={form.lastName} onChange={handleFormChange} fullWidth size="small" /></Grid>
                <Grid item xs={12}><TextField label="Organization Name" name="org" value={form.org} onChange={handleFormChange} fullWidth size="small" /></Grid>
                <Grid item xs={12}><TextField label="Work Title" name="title" value={form.title} onChange={handleFormChange} fullWidth size="small" /></Grid>
                <Grid item xs={12}><TextField label="Address" name="address" value={form.address} onChange={handleFormChange} fullWidth size="small" /></Grid>
                <Grid item xs={6}><TextField label="City" name="city" value={form.city} onChange={handleFormChange} fullWidth size="small" /></Grid>
                <Grid item xs={3}><TextField label="State" name="state" value={form.state} onChange={handleFormChange} fullWidth size="small" /></Grid>
                <Grid item xs={3}><TextField label="Zip" name="zip" value={form.zip} onChange={handleFormChange} fullWidth size="small" /></Grid>
                <Grid item xs={12}><TextField label="Main Phone" name="phone" value={form.phone} onChange={handleFormChange} fullWidth size="small" /></Grid>
                <Grid item xs={12}><TextField label="Email (Home)" name="email" value={form.email} onChange={handleFormChange} fullWidth size="small" /></Grid>
                <Grid item xs={12}><TextField label="Email (Work)" name="emailWork" value={form.emailWork} onChange={handleFormChange} fullWidth size="small" /></Grid>
              </Grid>
              <Box sx={{ mt: 2 }}>
                <Typography sx={{ fontWeight: 600, mb: 1 }}>I'm also interested in:</Typography>
                <FormControlLabel control={<Checkbox name="volunteer" checked={form.volunteer} onChange={handleFormChange} />} label="Volunteering" />
                <FormControlLabel control={<Checkbox name="familyServices" checked={form.familyServices} onChange={handleFormChange} />} label="Family Services" />
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography sx={{ fontWeight: 700, mb: 1 }}>Selected Amount: <span style={{ color: '#089e8e' }}>${selectedAmount.toLocaleString()}</span></Typography>
              <Button variant="contained" fullWidth sx={{ background: 'linear-gradient(90deg, #0ba98d 0%, #0893b2 100%)', color: '#fff', fontWeight: 700, fontSize: 18, borderRadius: 999, py: 1.5, textTransform: 'none', boxShadow: 'none', '&:hover': { background: 'linear-gradient(90deg, #089e8e 0%, #0893b2 100%)', opacity: 0.95, boxShadow: 'none', }, mb: 1 }}>
                Proceed to Payment
              </Button>
              <Typography sx={{ color: '#888', fontSize: 14, textAlign: 'center' }}>
                Secure payment via Stripe
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
} 