import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Button, Chip, CircularProgress, Alert } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import GroupIcon from '@mui/icons-material/Group';
import PlaceIcon from '@mui/icons-material/Place';
import { CalendarToday, AccessTime, LocationOn } from '@mui/icons-material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

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

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('https://relevant-recovery-back-end.onrender.com/api/events');
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      // Sort events by date (earliest first)
      const sortedEvents = data.sort((a, b) => new Date(a.date) - new Date(b.date));
      setEvents(sortedEvents);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
            {error}
          </Alert>
        ) : events.length > 0 ? (
                     <Box sx={{ maxWidth: 1020, mx: 'auto' }}>
             {/* Event Carousel with Swiper */}
             <Box sx={{ position: 'relative', borderRadius: 3, mb: 3, minHeight: 400 }}>
                               <Swiper
                  modules={[Autoplay, Pagination]}
                  spaceBetween={30}
                  slidesPerView={1}
                  centeredSlides={true}
                  autoplay={{
                    delay: 1000, // 1 second - fast rotation
                    disableOnInteraction: false,
                  }}
                  pagination={{
                    clickable: true,
                  }}
                  loop={true}
                  style={{
                    '--swiper-pagination-color': seaGreen,
                    '--swiper-pagination-bullet-inactive-color': '#ddd',
                    '--swiper-pagination-bullet-inactive-opacity': '1',
                  }}
                >
                 {events.map((event, index) => (
                   <SwiperSlide key={event._id}>
                     <Box sx={{
                       background: '#e6fcf5',
                       borderRadius: 3,
                       boxShadow: '0 2px 12px 0 rgba(16,30,54,0.06)',
                       p: 4,
                       height: 320,
                       width: '100%',
                       maxWidth: 480,
                       mx: 'auto',
                       display: 'flex',
                       flexDirection: 'column',
                       justifyContent: 'space-between',
                       overflow: 'hidden',
                       position: 'relative',
                     }}>
                       <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                         <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 2 }}>
                           <CalendarToday sx={{ color: seaGreen, mr: 1, fontSize: 26 }} />
                           <Typography variant="subtitle1" sx={{ color: seaGreen, fontWeight: 700, fontSize: 18 }}>
                             {formatDate(event.date)}
                           </Typography>
                           {event.cost === 'Free' && (
                             <Chip
                               icon={<FavoriteBorderIcon sx={{ color: seaGreen, fontSize: 18 }} />}
                               label="Free Ticket"
                               sx={{ ml: 'auto', background: '#b9fbc0', color: seaGreen, fontWeight: 700, fontSize: 15, borderRadius: 2, px: 1.5, height: 32 }}
                             />
                           )}
                         </Box>
                         <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#181f29', lineHeight: 1.3 }}>
                           {event.title}
                         </Typography>
                         {/* Time in one row */}
                         <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, width: '100%' }}>
                           <AccessTime sx={{ fontSize: 18, mr: 1, color: seaGreen }} />
                           <Typography variant="body2" sx={{ color: '#555', fontWeight: 500, fontSize: 16, wordBreak: 'break-word' }}>
                             {event.time}
                           </Typography>
                         </Box>
                         {/* Location in one row */}
                         <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, width: '100%' }}>
                           <LocationOn sx={{ fontSize: 18, mr: 1, color: seaGreen, mt: 0.2, flexShrink: 0 }} />
                           <Typography variant="body2" sx={{ color: '#555', fontWeight: 500, fontSize: 16, wordBreak: 'break-word', lineHeight: 1.4 }}>
                             {event.place}
                           </Typography>
                         </Box>
                         <Typography
                           variant="body1"
                           sx={{
                             color: '#444',
                             mb: 2,
                             fontSize: 16,
                             lineHeight: 1.6,
                             wordBreak: 'break-word',
                             whiteSpace: 'pre-wrap',
                             overflowWrap: 'break-word',
                             display: '-webkit-box',
                             WebkitLineClamp: 4,
                             WebkitBoxOrient: 'vertical',
                             overflow: 'hidden',
                             textOverflow: 'ellipsis'
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
                         onClick={() => {
                           if (event.cost === 'Free') {
                             // Handle free event registration
                             console.log('Register for free event:', event._id);
                           } else {
                             // Navigate to booking page
                             window.location.href = `/book-event/${event._id}`;
                           }
                         }}
                       >
                         {event.cost === 'Free' ? 'Register Now' : 'Book Ticket'}
                       </Button>
                     </Box>
                   </SwiperSlide>
                 ))}
               </Swiper>
               
                               {/* Swiper Pagination */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Auto-rotating every 1s
                  </Typography>
                </Box>
             </Box>
           </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" sx={{ color: '#666', mb: 2 }}>
              No events scheduled at the moment
            </Typography>
            <Typography variant="body1" sx={{ color: '#888' }}>
              Check back soon for upcoming events and community gatherings.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
} 