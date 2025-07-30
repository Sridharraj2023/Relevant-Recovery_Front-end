import React from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Card,
  Paper,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';

const gradient = 'linear-gradient(90deg, #089e8e 0%, #0893b2 100%)';
const lightGradient = 'linear-gradient(90deg,rgb(207, 239, 227) 0%, #e6f4fa 100%)';
const serviceAreaImg = 'https://images.unsplash.com/photo-1689834685141-95d341497ef8';

const helpCards = [
  { title: 'Recovery Coaching', desc: 'Learn about our 1:1 and group coaching programs' },
  { title: 'Community Events', desc: 'Get information about upcoming events and workshops' },
  { title: 'Family Support', desc: 'Discover resources for families affected by addiction' },
  { title: 'Volunteer Opportunities', desc: 'Find ways to give back to the recovery community' },
  { title: 'Partnership Inquiries', desc: 'Explore collaboration opportunities with our organization' },
  { title: 'General Questions', desc: 'Any other questions about our mission and services' },
];

export default function Contact() {
  const [form, setForm] = React.useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const [fieldErrors, setFieldErrors] = React.useState({});

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setFieldErrors({});
    setLoading(true);
    try {
      const res = await fetch('https://relevant-recovery-back-end.onrender.com/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.errors) {
          setFieldErrors(data.errors);
          setError('Please fix the errors below.');
        } else {
          setError(data.error || 'Failed to send message');
        }
        return;
      }
      setSuccess('Message sent! We will get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', bgcolor: '#fff', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box sx={{ background: gradient, color: '#fff', py: { xs: 6, md: 8 }, textAlign: 'center', px: 2 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, fontSize: { xs: 32, md: 48 } }}>
          Get in Touch
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: 800, mx: 'auto', fontWeight: 400, fontSize: { xs: 16, md: 22 } }}>
          We're here to support you on your recovery journey. Reach out with questions, to learn more about our services, or to get involved in our community.
        </Typography>
      </Box>

      {/* Main Section */}
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: { xs: 4, md: 8 }, mb: { xs: 2, md: 6 } }}>
        <Grid container spacing={4} sx={{ maxWidth: 1100, width: '100%' }}>
          {/* Left: Form */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
            <Paper elevation={2} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, width: '100%', maxWidth: 480 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                Send Us a Message
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                Fill out the form below and we'll get back to you as soon as possible. All inquiries are confidential.
              </Typography>
              <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
  {/* Full Name and Email Address side by side */}
  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
    <TextField label="Full Name" name="name" required fullWidth variant="outlined" margin="dense" sx={{ flex: 1 }} value={form.name} onChange={handleFormChange} error={!!fieldErrors.name} helperText={fieldErrors.name || ''} />
    <TextField label="Email Address" name="email" required fullWidth variant="outlined" margin="dense" type="email" sx={{ flex: 1 }} value={form.email} onChange={handleFormChange} error={!!fieldErrors.email} helperText={fieldErrors.email || ''} />
  </Box>
  {/* Subject full width */}
  <Box sx={{ mb: 2 }}>
    <TextField label="Subject" name="subject" required fullWidth variant="outlined" margin="dense" value={form.subject} onChange={handleFormChange} error={!!fieldErrors.subject} helperText={fieldErrors.subject || ''} />
  </Box>
  {/* Message full width, larger height */}
  <Box sx={{ mb: 2 }}>
    <TextField label="Message" name="message" required fullWidth variant="outlined" margin="dense" multiline rows={6} value={form.message} onChange={handleFormChange} error={!!fieldErrors.message} helperText={fieldErrors.message || ''} />
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
  <Button variant="contained" endIcon={<SendIcon />} sx={{ borderRadius: 999, px: 4, py: 1.2, fontWeight: 700, fontSize: 16, background: gradient, color: '#fff', boxShadow: 'none', '&:hover': { background: '#067e71' }, width: '100%' }} type="submit" disabled={loading}>
    {loading ? 'Sending...' : 'Send Message'}
  </Button>
</Box>

            </Paper>
          </Grid>
          {/* Right: Contact Info */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%', maxWidth: 480 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                Contact Information
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
                Prefer to reach out directly? Here are all the ways you can connect with us.
              </Typography>
              {/* Info Cards */}
              <Paper elevation={0} sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#e6fcf5', borderRadius: 3, p: 3, mb: 1 }}>
                <Box sx={{ bgcolor: '#10b981', color: '#fff', borderRadius: '50%', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
                  <PhoneIcon sx={{ fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Phone</Typography>
                  <Typography variant="h6" sx={{ color: '#10b981', fontWeight: 700, fontSize: 15 }}>(612) 555-0123</Typography>
                  <Typography variant="body2" color="text.secondary">Call us during business hours</Typography>
                </Box>
              </Paper>
              <Paper elevation={0} sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#e6faf4', borderRadius: 3, p: 3, mb: 1 }}>
                <Box sx={{ bgcolor: '#10b981', color: '#fff', borderRadius: '50%', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
                  <EmailIcon sx={{ fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Email</Typography>
                  <Typography variant="h6" sx={{ color: '#10b981', fontWeight: 700, fontSize: 15 }}>info@relevantrecovery.org</Typography>
                  <Typography variant="body2" color="text.secondary">We respond within 24 hours</Typography>
                </Box>
              </Paper>
              <Paper elevation={0} sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#e6faf4', borderRadius: 3, p: 3, mb: 1 }}>
                <Box sx={{ bgcolor: '#10b981', color: '#fff', borderRadius: '50%', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
                  <LocationOnIcon sx={{ fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Location</Typography>
                  <Typography variant="h6" sx={{ color: '#10b981', fontWeight: 700, fontSize: 15 }}>Minneapolis, MN</Typography>
                  <Typography variant="body2" color="text.secondary">Serving the Twin Cities area</Typography>
                </Box>
              </Paper>
              <Paper elevation={0} sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#e6faf4', borderRadius: 3, p: 3, mb: 1 }}>
                <Box sx={{ bgcolor: '#10b981', color: '#fff', borderRadius: '50%', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
                  <AccessTimeIcon sx={{ fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Hours</Typography>
                  <Typography variant="h6" sx={{ color: '#10b981', fontWeight: 700, fontSize: 15 }}>Mon-Fri: 9AM-5PM</Typography>
                  <Typography variant="body2" color="text.secondary">Emergency support available 24/7</Typography>
                </Box>
              </Paper>
              {/* Service Area Card */}
              <Paper elevation={0} sx={{ bgcolor: '#e6faf4', borderRadius: 3, p: 3, mt: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                  Our Service Area
                </Typography>
                <Box
                  component="img"
                  src={serviceAreaImg}
                  alt="Service Area"
                  sx={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 2, mb: 2 }}
                />
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  We proudly serve the greater Minneapolis-St. Paul metropolitan area and surrounding communities.
                </Typography>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Help Section */}
      <Box sx={{ background: lightGradient, py: { xs: 6, md: 8 }, textAlign: 'center', px: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: '#181f29', fontSize: { xs: 24, md: 32 } }}>
          How Can We Help You?
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, color: '#555', maxWidth: 800, mx: 'auto', fontWeight: 400 }}>
          Whether you're seeking support, want to get involved, or have questions about our services, we're here for you.
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {helpCards.map((card) => (
            <Grid item xs={12} sm={6} md={4} key={card.title} display="flex" justifyContent="center">
              <Card sx={{ 
                borderRadius: 3, 
                boxShadow: 2, 
                p: { xs: 2, sm: 3 }, 
                width: { xs: 380, sm: 280, md: 320, lg: 350 },
                height: { xs: 160, sm: 160, md: 180 },
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                textAlign: 'center',
                mx: 'auto'
              }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700, 
                  mb: 1,
                  fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                  lineHeight: 1.2
                }}>
                  {card.title}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'text.secondary',
                  fontSize: { xs: '0.875rem', sm: '0.9rem', md: '1rem' },
                  lineHeight: 1.4
                }}>
                  {card.desc}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Immediate Support Section */}
      <Box sx={{ background: gradient, py: { xs: 6, md: 8 }, textAlign: 'center', px: 2, color: '#fff', mb: -8 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, mb: 2, fontSize: { xs: 32, md: 35 } }}>
          Need Immediate Support?
        </Typography>
        <Typography variant="h6" sx={{ mb: 6, color: '#e6f7f5', fontWeight: 400, fontSize: 20, maxWidth: 700, mx: 'auto' }}>
          If you're experiencing a crisis or need immediate support, please don't hesitate to reach out to these resources.
        </Typography>
        <Grid container spacing={4} justifyContent="center" alignItems="stretch">
          <Grid item xs={12} md={5}>
            <Card sx={{ background: 'rgba(255,255,255,0.18)', color: '#fff', borderRadius: 4, boxShadow: 0, p: 4, minHeight: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#fff' }}>Crisis Text Line</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500, fontSize: 15, color: '#fff', mb: 1 }}>Text HOME to 741741</Typography>
              <Typography variant="body2" sx={{ color: '#e6f7f5', fontSize: 15 }}>24/7 crisis support via text</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={5}>
            <Card sx={{ background: 'rgba(255,255,255,0.18)', color: '#fff', borderRadius: 4, boxShadow: 0, p: 4, minHeight: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#fff' }}>National Suicide Prevention Lifeline</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500, fontSize: 15, color: '#fff', mb: 1 }}>988</Typography>
              <Typography variant="body2" sx={{ color: '#e6f7f5', fontSize: 15 }}>24/7 phone support</Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
} 