import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import GroupsIcon from '@mui/icons-material/Groups';
import SpaIcon from '@mui/icons-material/Spa';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const seaGreen = '#089e8e';
const gradient = 'linear-gradient(90deg, #089e8e 0%, #0893b2 100%)';

export default function About() {
  return (
    <Box sx={{ width: '100%', bgcolor: '#fff', minHeight: '100vh', pb: 8 }}>
      {/* Our Story Hero */}
      <Box sx={{ background: gradient, color: '#fff', py: { xs: 6, md: 10 }, textAlign: 'center', px: 2 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, fontSize: { xs: 32, md: 48 } }}>
          Our Story
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: 700, mx: 'auto', fontWeight: 400, fontSize: { xs: 16, md: 22 } }}>
          Restoring hope and rebuilding lives impacted by addiction through community, compassion, and comprehensive support.
        </Typography>
      </Box>

      {/* Mission & Vision */}
      <Grid container justifyContent="center" sx={{ pt: { xs: 0, md: 0 }, pb: { xs: 6, md: 10 }, px: { xs: 1, md: 0 }, background: '#fff' }}>
        <Grid item xs={12} md={10}>
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            bgcolor: '#fff',
            borderRadius: 0,            
            p: { xs: 2, md: 6 },
            alignItems: 'center',
            gap: { xs: 4, md: 8 },
          }}>
            {/* Image left */}
            <Box sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Box sx={{
                borderRadius: 5,
                overflow: 'hidden',
                boxShadow: '0 8px 32px 0 rgba(0,0,0,0.12)',
                width: '100%',
                maxWidth: 480,
                height: { xs: 220, md: 360 },
                minWidth: { md: 320 },
                background: '#eee',
              }}>
                <img src="https://images.unsplash.com/photo-1611459876278-d585fa2d071d?auto=format&fit=crop&w=600&q=80" alt="Lake" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: 24 }} />
              </Box>
            </Box>
            {/* Text right */}
            <Box sx={{ flex: 1, textAlign: 'left', pl: { md: 4 }, pr: { md: 2 } }}>
              <Typography variant="h4" sx={{ fontWeight: 900, mb: 3, color: '#181f29', fontSize: { xs: 28, md: 40 } }}>
                Our Mission & Vision
              </Typography>
              <Typography variant="body1" sx={{ color: '#444', fontSize: 20, mb: 3, textAlign: 'justify', lineHeight: 1.7 }}>
                Relevant Recovery is a Minnesota-based nonprofit organization committed to restoring hope and rebuilding lives impacted by addiction. With a holistic, community-centered approach, we provide pathways for individuals and families to reconnect with themselves, each other, and their greater purpose.
              </Typography>
              <Typography variant="body1" sx={{ color: '#444', fontSize: 20, textAlign: 'justify', lineHeight: 1.7 }}>
                We envision a world where every person affected by addiction has access to compassionate support, meaningful community connections, and the resources needed for lasting recovery and wellbeing.
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Founded with Purpose */}
      <Grid container justifyContent="center" sx={{ pt: { xs: 0, md: 0 }, pb: { xs: 6, md: 10 }, px: { xs: 1, md: 0 }, background: 'none' }}>
        <Grid item xs={12} md={10}>
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            bgcolor: '#fff',
            borderRadius: 0,
            boxShadow: '0 12px 48px 0 rgba(0,0,0,0.5)',
            p: { xs: 2, md: 6 },
            alignItems: 'center',
            gap: { xs: 4, md: 8 },
          }}>
            {/* Text left */}
            <Box sx={{ flex: 1, textAlign: 'left', pr: { md: 4 }, pl: { md: 2 } }}>
              <Typography variant="h4" sx={{ fontWeight: 900, mb: 2.5, color: '#181f29', fontSize: { xs: 26, md: 36 } }}>
                Founded with Purpose
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#181f29', mb: 1.5, fontSize: 20 }}>
                John Magnuson, Founder
              </Typography>
              <Typography variant="body1" sx={{ color: '#444', fontSize: 20, mb: 2, textAlign: 'justify', lineHeight: 1.7 }}>
                Founded in 2023 by John Magnuson, a person in long-term recovery himself, Relevant Recovery was born from a desire to fill the gaps in support that many individuals face once they leave formal treatment.
              </Typography>
              <Typography variant="body1" sx={{ color: '#444', fontSize: 20, mb: 2, textAlign: 'justify', lineHeight: 1.7 }}>
                Having experienced firsthand the challenges of maintaining recovery in everyday life, John recognized the critical need for ongoing community support, practical resources, and holistic approaches to healing.
              </Typography>
              <Typography variant="body1" sx={{ color: '#444', fontSize: 20, textAlign: 'justify', lineHeight: 1.7 }}>
                From local events to our future vision of a Recovery Ranch, we meet people where they are—and walk alongside them toward lasting healing.
              </Typography>
            </Box>
            {/* Image right */}
            <Box sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Box sx={{
                borderRadius: 5,
                overflow: 'hidden',
                boxShadow: '0 8px 32px 0 rgba(0,0,0,0.12)',
                width: '100%',
                maxWidth: 480,
                height: { xs: 220, md: 360 },
                minWidth: { md: 320 },
                background: '#eee',
              }}>
                <img src="https://images.unsplash.com/photo-1699182302152-78531b8c4c07" alt="Founder" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: 24 }} />
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Core Values */}
      <Box sx={{ py: { xs: 6, md: 8 }, px: { xs: 2, md: 8 }, background: '#fff', textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: '#181f29' }}>
          Our Core Values
        </Typography>
        <Typography variant="body1" sx={{ color: '#555', mb: 4, fontSize: 18, maxWidth: 700, mx: 'auto' }}>
          These principles guide everything we do and shape how we serve our community.
        </Typography>
        <Grid container spacing={4} justifyContent="center" alignItems="stretch">
          <Grid item xs={12} sm={6} md={3} display="flex" justifyContent="center">
            <Card elevation={0} sx={{ width: { xs: '100%', sm: 280, md: 300 }, height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2, textAlign: 'center', bgcolor: 'transparent', boxShadow: 'none' }}>
              <CardContent sx={{ p: 0, m: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <FavoriteBorderIcon sx={{ color: seaGreen, fontSize: 48, mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, mt: 1, wordBreak: 'break-word' }}>
                  Compassionate Care
                </Typography>
                <Typography variant="body2" sx={{ color: '#555', fontSize: 16, textAlign: 'center', mt: 1, wordBreak: 'break-word' }}>
                  We approach every individual with empathy, understanding, and unconditional support.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3} display="flex" justifyContent="center">
            <Card elevation={0} sx={{ width: { xs: '100%', sm: 280, md: 300 }, height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2, textAlign: 'center', bgcolor: 'transparent', boxShadow: 'none' }}>
              <CardContent sx={{ p: 0, m: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <GroupsIcon sx={{ color: seaGreen, fontSize: 48, mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, mt: 1, wordBreak: 'break-word' }}>
                  Community Connection
                </Typography>
                <Typography variant="body2" sx={{ color: '#555', fontSize: 16, textAlign: 'center', mt: 1, wordBreak: 'break-word' }}>
                  Building strong, supportive networks that foster lasting relationships and accountability.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3} display="flex" justifyContent="center">
            <Card elevation={0} sx={{ width: { xs: '100%', sm: 280, md: 300 }, height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2, textAlign: 'center', bgcolor: 'transparent', boxShadow: 'none' }}>
              <CardContent sx={{ p: 0, m: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <SpaIcon sx={{ color: seaGreen, fontSize: 48, mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, mt: 1, wordBreak: 'break-word' }}>
                  Holistic Approach
                </Typography>
                <Typography variant="body2" sx={{ color: '#555', fontSize: 16, textAlign: 'center', mt: 1, wordBreak: 'break-word' }}>
                  Addressing mind, body, and spirit through comprehensive, evidence-based practices.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3} display="flex" justifyContent="center">
            <Card elevation={0} sx={{ width: { xs: '100%', sm: 280, md: 300 }, height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2, textAlign: 'center', bgcolor: 'transparent', boxShadow: 'none' }}>
              <CardContent sx={{ p: 0, m: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <EmojiEventsIcon sx={{ color: seaGreen, fontSize: 48, mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, mt: 1, wordBreak: 'break-word' }}>
                  Excellence in Service
                </Typography>
                <Typography variant="body2" sx={{ color: '#555', fontSize: 16, textAlign: 'center', mt: 1, wordBreak: 'break-word' }}>
                  Committed to providing the highest quality support and resources for lasting recovery.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Making a Difference */}
      <Box sx={{ background: gradient, color: '#fff', py: { xs: 6, md: 8 }, textAlign: 'center', px: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
          Making a Difference
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 700, mx: 'auto', fontSize: 18, mb: 4 }}>
          Since our founding, we've been committed to creating meaningful change in the lives of individuals and families affected by addiction. Every person we serve strengthens our community and inspires our continued mission.
        </Typography>
        <Grid container spacing={30} justifyContent="center">
          <Grid item xs={12} sm={4} md={4}>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
              2023
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Founded with Vision
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
              100+
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Lives Touched
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <Typography variant="h4" sx={{ fontWeight:900, mb: 1}}>
              ∞
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Hope Restored
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
} 