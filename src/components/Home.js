import React from 'react';
import { Box, Grid, Typography, Button, Chip } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import GroupIcon from '@mui/icons-material/Group';
import PlaceIcon from '@mui/icons-material/Place';


const seaGreen = '#089e8e';
const heroImg = 'https://images.unsplash.com/photo-1609234656388-0ff363383899?auto=format&fit=crop&w=600&q=80'; // Placeholder

const supportCards = [
  {
    icon: <FavoriteBorderIcon sx={{ color: '#089e8e', fontSize: 40, mb: 2 }} />, bg: 'linear-gradient(135deg, #0ec7a0 0%, #0ea7c7 100%)', title: 'Recovery Coaching',
    desc: '1:1 and group-based guidance from trained recovery coaches who understand your journey.'
  },
  {
    icon: <GroupIcon sx={{ color: '#089e8e', fontSize: 40, mb: 2 }} />, bg: 'linear-gradient(135deg, #0ec7a0 0%, #0ea7c7 100%)', title: 'Community Events',
    desc: 'Sober-friendly gatherings, workshops, and celebrations that build lasting connections.'
  },
  {
    icon: <FavoriteBorderIcon sx={{ color: '#089e8e', fontSize: 40, mb: 2 }} />, bg: 'linear-gradient(135deg, #0ec7a0 0%, #0ea7c7 100%)', title: 'Family Support',
    desc: 'Resources, coaching, and guidance for families affected by addiction.'
  },
  {
    icon: <PlaceIcon sx={{ color: '#089e8e', fontSize: 40, mb: 2 }} />, bg: 'linear-gradient(135deg, #0ec7a0 0%, #0ea7c7 100%)', title: 'Recovery Ranch',
    desc: 'Coming Soon: A nature-based retreat offering immersive healing and community connection.'
  },
];

const events = [
  {
    date: 'July 31, 2025',
    title: 'Community Kickoff',
    time: '5:00 PM - 8:00 PM',
    location: 'Wayzata Community Church',
    desc: 'Join us for light refreshments and inspiring stories of hope. Attendees receive a free ticket to Minnesota Twins Recovery Week!',
    action: 'Register Now',
    free: true,
  },
  {
    date: 'September 16, 2025',
    title: 'Minnesota Twins vs. Yankees',
    time: '6:00 PM',
    location: 'Target Field',
    desc: 'First pitch ceremony honoring Jim Ramstad and Karl Pohlad during Recovery Week.',
    action: 'Buy Tickets',
    free: false,
  },
  {
    date: 'September 21, 2025',
    title: 'Twins Game - Recovery Week',
    time: 'Game Time',
    location: 'Target Field',
    desc: 'Continue celebrating Recovery Week as we honor Jim Ramstad and Karl Pohlad.',
    action: 'Buy Tickets',
    free: false,
  },
  {
    date: 'September 25, 2025',
    title: 'MRC / StepUP Gratitude Breakfast',
    time: '7:30 AM',
    location: 'Augsburg University',
    desc: 'Keynote presentation by John Magnuson, Founder of Relevant Recovery.',
    action: 'Register Now',
    free: true,
  },
];

export default function Home() {
  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ background: 'linear-gradient(90deg, #089e8e 0%, #0893b2 100%)', color: '#fff', py: 10, px: { xs: 2, md: 12 } }}>
        <Grid container alignItems="center" justifyContent="center" spacing={4} sx={{ minHeight: { md: 480 } }}>
          <Grid item xs={12} md={7} sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ textAlign: 'left', maxWidth: 600, width: '100%' }}>
              <Typography
                component="h1"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
                  lineHeight: 1.05,
                  mb: 2,
                  letterSpacing: -2,
                }}
              >
                Empowering<br />Recovery.<br />
                <Box component="span" sx={{ color: '#8ee6e0', display: 'block' }}>
                  Changing Lives.
                </Box>
              </Typography>
              <Typography
                variant="h6"
                sx={{ mb: 5, color: '#e6f7f5', fontWeight: 400, fontSize: { xs: 18, md: 22 }, maxWidth: 520 }}
              >
                We believe in the power of community and the importance of providing unwavering support for individuals on their recovery journey.
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mt: 2 }}>
                <Button
                  variant="contained"
                  sx={{
                    background: '#fff',
                    color: seaGreen,
                    fontWeight: 600,
                    borderRadius: 999,
                    px: 5,
                    py: 1.5,
                    fontSize: 15,
                    boxShadow: 'none',
                    '&:hover': { background: '#e6f7f5', boxShadow: 'none' },
                  }}
                >
                  Sign Up for an Event
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: '#fff',
                    color: '#fff',
                    fontWeight: 600,
                    borderRadius: 999,
                    px: 5,
                    py: 1.5,
                    fontSize: 15,
                    boxShadow: 'none',
                    '&:hover': { background: '#fff', boxShadow: 'none', borderColor: '#fff', color: seaGreen, },
                  }}
                >
                  Donate Now
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Box sx={{ borderRadius: 6, overflow: 'hidden', boxShadow: 6, width: { xs: '100%', md: 470, lg: 550 }, height: { xs: 'auto', md: 340, lg: 380 }, ml: 'auto', mt: { xs: 4, md: 0 } }}>
              <img src={heroImg} alt="Community" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: 32 }} />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Mission Section */}
      <Box sx={{ py: 8, px: { xs: 2, md: 8 }, textAlign: 'center', background: '#fff' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          Our Mission
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, color: '#555', maxWidth: 800, mx: 'auto' }}>
          We believe in the power of community and the importance of providing unwavering support for individuals on their recovery journey. Our mission is to help you experience true recovery and wellbeing by connecting you with a supportive network, creating nurturing spaces, and offering expert coaching and resources.
        </Typography>
        <Button variant="contained" sx={{ background: seaGreen, color: '#fff', fontWeight: 700, borderRadius: 999, px: 4, '&:hover': { background: '#067e71' } }}>
          Read More About Us
        </Button>
      </Box>

      {/* Support Section */}
      <Box sx={{ py: 10, px: { xs: 2, md: 8 }, background: 'linear-gradient(180deg, #eafaf4 0%, #e6f4fa 100%)', textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: '#181f29' }}>
          How We Support You
        </Typography>
        <Typography variant="h6" sx={{ mb: 5, color: '#555', maxWidth: 800, mx: 'auto', fontWeight: 400 }}>
          Our comprehensive approach addresses every aspect of recovery through personalized support and community connection.
        </Typography>
        <Grid container spacing={4} alignItems="stretch" justifyContent="center">
          {supportCards.map((card) => (
            <Grid item xs={12} sm={6} md={3} key={card.title}>
              <Box
                sx={{
                  background: '#fff',
                  borderRadius: 4,
                  boxShadow: '0 8px 32px 0 rgba(16,30,54,0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 5,
                  px: 3,
                  minHeight: 300,
                  height: { md: 300, xs: 'auto' },
                  aspectRatio: '1 / 1',
                  textAlign: 'center',
                }}
              >
                <Box sx={{ bgcolor: card.bg, width: 72, height: 72, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                  {card.icon}
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#181f29' }}>
                  {card.title}
                </Typography>
                <Typography variant="body1" sx={{ color: '#555', fontSize: 18, fontWeight: 400, textAlign: 'center' }}>
                  {card.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Button variant="contained" endIcon={<FavoriteBorderIcon />} sx={{ background: seaGreen, color: '#fff', fontWeight: 600, borderRadius: 999, px: 5, py: 1.5, fontSize: 18, boxShadow: 'none', mt: 6, '&:hover': { background: '#067e71', boxShadow: 'none' } }}>
          Explore All Services
        </Button>
      </Box>

      {/* Upcoming Events Section */}
      <Box sx={{ py: 8, px: { xs: 2, md: 8 }, background: '#fff', textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          Upcoming Events
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, color: '#555', maxWidth: 700, mx: 'auto' }}>
          Join us for inspiring events that build community and celebrate recovery milestones.
        </Typography>
        <Grid container spacing={4} alignItems="stretch" justifyContent="center" sx={{ maxWidth: 1020, mx: 'auto', flexWrap: 'wrap' }}>
          {events.map((event) => (
            <Grid item xs={12} sm={6} md={6} key={event.title} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box sx={{
                background: '#e6fcf5',
                borderRadius: 3,
                boxShadow: '0 2px 12px 0 rgba(16,30,54,0.06)',
                p: 4,
                height: 320,
                width: 480,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                overflow: 'hidden',
              }}>
                <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
                    <FavoriteBorderIcon sx={{ color: seaGreen, mr: 1, fontSize: 26 }} />
                    <Typography variant="subtitle1" sx={{ color: seaGreen, fontWeight: 700, fontSize: 18 }}>
                      {event.date}
                    </Typography>
                    {event.free && (
                      <Chip
                        icon={<FavoriteBorderIcon sx={{ color: seaGreen, fontSize: 18 }} />}
                        label="Free Ticket"
                        sx={{ ml: 'auto', background: '#b9fbc0', color: seaGreen, fontWeight: 700, fontSize: 15, borderRadius: 2, px: 1.5, height: 32 }}
                      />
                    )}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#181f29' }}>
                    {event.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: '#555', fontSize: 16 }}>
                    <FavoriteBorderIcon sx={{ fontSize: 18, mr: 0.5 }} />
                    <span>{event.time}</span>
                    <PlaceIcon sx={{ fontSize: 18, ml: 2, mr: 0.5 }} />
                    <span>{event.location}</span>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#444',
                      mb: 2,
                      fontSize: 16,
                      overflow: 'auto',
                    }}
                  >
                    {event.desc}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 2,
                    background: 'linear-gradient(90deg, #089e8e 0%, #0893b2 100%)',
                    color: '#fff',
                    fontWeight: 700,
                    borderRadius: 999,
                    fontSize: 18,
                    py: 1.2,
                    boxShadow: 'none',
                    textTransform: 'none',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #089e8e 0%, #0893b2 100%)',
                      opacity: 0.95,
                      boxShadow: 'none',
                    },
                  }}
                >
                  {event.action}
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
} 