import React from 'react';
import { Box, Typography, Button, Chip, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import GroupsIcon from '@mui/icons-material/Groups';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlaceIcon from '@mui/icons-material/Place';

const gradient = 'linear-gradient(90deg, #089e8e 0%, #0893b2 100%)';
const lightGradient = 'linear-gradient(90deg, #eafaf4 0%, #e6f4fa 100%)';
const placeholderImg = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80';
const placeholderImg2 = 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80';

const services = [
  {
    icon: <FavoriteBorderIcon sx={{ color: '#089e8e', fontSize: 40, mr: 2 }} />,
    title: 'Recovery Coaching',
    subtitle: 'Personalized Support for Your Journey',
    description: `Our trained recovery coaches provide both 1:1 and group-based guidance tailored to your unique needs and goals. Whether you're just beginning your recovery journey or looking to strengthen your foundation, our coaches offer practical tools, emotional support, and accountability.`,
    offers: [
      'Individual coaching sessions',
      'Group coaching programs',
      'Goal setting and accountability',
      'Relapse prevention strategies',
      'Life skills development',
      'Ongoing support and check-ins',
    ],
    button: 'Get Started',
    img: placeholderImg,
    reverse: false,
  },
  {
    icon: <GroupsIcon sx={{ color: '#089e8e', fontSize: 40, mr: 2 }} />,
    title: 'Community Events',
    subtitle: 'Building Connections Through Shared Experiences',
    description: `Our sober-friendly gatherings, workshops, and celebrations create opportunities for meaningful connections and personal growth. These events are designed to build community, share experiences, and celebrate milestones together.`,
    offers: [
      'Monthly community gatherings',
      'Educational workshops',
      'Sober social activities',
      'Holiday celebrations',
      'Volunteer opportunities',
      'Peer support groups',
    ],
    button: 'Get Started',
    img: placeholderImg2,
    reverse: true,
  },
  {
    icon: <HomeWorkIcon sx={{ color: '#089e8e', fontSize: 40, mr: 2 }} />,
    title: 'Family Support',
    subtitle: 'Healing for the Whole Family',
    description: `Addiction affects entire families, not just individuals. Our family support services provide resources, coaching, and guidance for family members and loved ones who are navigating the complexities of supporting someone in recovery.`,
    offers: [
      'Educational resources',
      'Support groups for families',
      'Communication strategies',
      'Boundary setting guidance',
      'Healing and reconciliation support',
    ],
    button: 'Get Started',
    img: placeholderImg,
    reverse: false,
  },
  {
    icon: <PlaceIcon sx={{ color: '#089e8e', fontSize: 40, mr: 2 }} />,
    title: 'Recovery Ranch',
    subtitle: 'Coming Soon: Nature-Based Healing',
    description: `Our vision for Minnesota's first holistic Recovery Ranch will offer immersive healing experiences in a natural setting. This retreat will provide long-term tools for wellbeing, community connection, and spiritual growth.`,
    offers: [
      'Nature-based therapy programs',
      'Mindfulness and meditation',
      'Outdoor adventure therapy',
      'Sustainable living practices',
      'Community garden programs',
      'Retreat and workshop facilities',
    ],
    button: 'Learn More',
    img: placeholderImg2,
    reverse: true,
    comingSoon: true,
  },
];

export default function Services() {
  return (
    <Box sx={{ width: '100%', bgcolor: '#fff', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box sx={{ background: gradient, color: '#fff', py: { xs: 6, md: 10 }, textAlign: 'center', px: 2 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, fontSize: { xs: 32, md: 48 } }}>
          Our Services
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: 700, mx: 'auto', fontWeight: 400, fontSize: { xs: 16, md: 22 } }}>
          Comprehensive support for every stage of your recovery journey, designed to meet you where you are and help you thrive.
        </Typography>
      </Box>

      {/* Service Sections */}
      {services.map((service, idx) => (
        <Box
          key={service.title}
          sx={{
            display: { xs: 'block', md: 'flex' },
            flexDirection: service.reverse ? { xs: 'column', md: 'row-reverse' } : { xs: 'column', md: 'row' },
            alignItems: 'stretch',
            justifyContent: 'center',
            py: { xs: 5, md: 8 },
            px: { xs: 1, md: 8 },
            background: '#fff', // Force all to white background
            opacity: service.faded ? 0.5 : 1,
            width: '100%',
            gap: { xs: 2, md: 0 },
          }}
        >
          {/* Content Column */}
          <Box
            sx={{
              width: { xs: '100%', md: '50%' },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              pr: { md: service.reverse ? 0 : 4 },
              pl: { md: service.reverse ? 4 : 0 },
              mb: { xs: 2, md: 0 },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
              {service.icon}
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: service.faded ? '#b2d8d8' : '#181f29', display: 'flex', alignItems: 'center' }}>
                  {service.title}
                  {service.comingSoon && (
                    <Chip label="Coming Soon" size="small" sx={{ ml: 2, background: '#eafaf4', color: '#089e8e', fontWeight: 700 }} />
                  )}
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: service.faded ? '#b2d8d8' : '#181f29', mb: 1 }}>
                  {service.subtitle}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body1" sx={{ color: '#444', fontSize: 18, mb: 2 }}>
              {service.description}
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: service.faded ? '#b2d8d8' : '#089e8e', mb: 1 }}>
              What We Offer:
            </Typography>
            <List dense>
              {service.offers.map((offer) => (
                <ListItem key={offer} sx={{ py: 0 }}>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: service.faded ? '#b2d8d8' : '#089e8e', fontSize: 22 }} />
                  </ListItemIcon>
                  <ListItemText primary={offer} primaryTypographyProps={{ fontSize: 16, color: '#444' }} />
                </ListItem>
              ))}
            </List>
            <Button
              variant="contained"
              sx={{
                mt: 2,
                borderRadius: 999,
                fontWeight: 700,
                px: 4,
                py: 1.2,
                fontSize: 16,
                backgroundColor: '#089e8e',
                color: '#fff',
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#067e71',
                  color: '#fff',
                  boxShadow: 'none',
                },
              }}
            >
              {service.button}
            </Button>
          </Box>
          {/* Image Column */}
          <Box
            sx={{
              width: { xs: '100%', md: '50%' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: { xs: 2, md: 0 },
            }}
          >
            <Box sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: 3, width: '100%', height: { xs: 220, sm: 260, md: 340 }, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={service.img} alt={service.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: 16 }} />
            </Box>
          </Box>
        </Box>
      ))}

      {/* Bottom CTA Section */}
      <Box sx={{ background: lightGradient, py: { xs: 6, md: 10 }, textAlign: 'center', px: 2, mt: 8, mb: -8}}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: '#181f29', fontSize: { xs: 24, md: 32 } }}>
          Ready to Begin Your Journey?
        </Typography>
        <Typography variant="body1" sx={{ color: '#444', mb: 4, fontSize: 18, maxWidth: 700, mx: 'auto' }}>
          Take the first step toward lasting recovery and wellbeing. Our team is here to support you every step of the way.
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center', alignItems: 'center', mt: 2 }}>
          <Button
            variant="contained"
            sx={{
              borderRadius: 999,
              fontWeight: 700,
              px: 4,
              py: 1.2,
              fontSize: 16,
              backgroundColor: '#089e8e',
              color: '#fff',
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#067e71',
                boxShadow: 'none',
              },
            }}
          >
            Contact Us Today
          </Button>
          <Button
            variant="outlined"
            sx={{
              borderRadius: 999,
              fontWeight: 700,
              px: 4,
              py: 1.2,
              fontSize: 16,
              color: '#089e8e',
              borderColor: '#089e8e',
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                borderColor: '#067e71',
                color: '#067e71',
                boxShadow: 'none',
              },
            }}
          >
            Schedule a Consultation
          </Button>
        </Box>
      </Box>
    </Box>
  );
} 