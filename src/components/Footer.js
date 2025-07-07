import React from 'react';
import { Box, Typography, Grid, Link, Button, TextField, IconButton } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

const seaGreen = '#20bfa9';
const darkBg = '#181f29';
const darkText = '#e2e8f0';
const mutedText = '#94a3b8';

export default function Footer() {
  return (
    <Box component="footer" sx={{ background: darkBg, color: darkText, pt: 8, pb: 2, mt: 8 }}>
      <Grid container spacing={4} justifyContent="center" sx={{ px: { xs: 2, md: 10 } }}>
        {/* About */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FavoriteBorderIcon sx={{ color: seaGreen, fontSize: 36, mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: darkText }}>
              Relevant Recovery
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: mutedText, maxWidth: 320 }}>
            Empowering individuals and families on their recovery journey through coaching, community, and connection.
          </Typography>
        </Grid>
        {/* Quick Links */}
        <Grid item xs={12} md={2}>
          <Typography variant="h6" sx={{ color: seaGreen, fontWeight: 700, mb: 2 }}>
            Quick Links
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {['Home', 'About Us', 'Services', 'Events', 'Donate', 'Contact', 'Admin Login'].map((text) => (
              <Link
                key={text}
                href="#"
                underline="none"
                sx={{ color: darkText, fontSize: 17, fontWeight: 500, '&:hover': { color: seaGreen } }}
              >
                {text}
              </Link>
            ))}
          </Box>
        </Grid>
        {/* Stay Connected */}
        <Grid item xs={12} md={3}>
          <Typography variant="h6" sx={{ color: seaGreen, fontWeight: 700, mb: 2 }}>
            Stay Connected
          </Typography>
          <Typography variant="body1" sx={{ color: mutedText, mb: 2 }}>
            Subscribe to our newsletter for updates on events, stories, and resources.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              variant="filled"
              placeholder="Enter your email"
              size="small"
              sx={{
                background: '#232b36',
                borderRadius: 1,
                width: 180,
                '.MuiFilledInput-root': { background: 'none', height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' },
                input: {
                  color: darkText,
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  padding: 0,
                },
              }}
              InputProps={{ disableUnderline: true }}
            />
            <Button
              variant="contained"
              sx={{
                background: seaGreen,
                color: '#fff',
                fontWeight: 700,
                borderRadius: 1,
                px: 3,
                '&:hover': { background: '#179e8c' },
              }}
            >
              Subscribe
            </Button>
          </Box>
        </Grid>
        {/* Follow Us */}
        <Grid item xs={12} md={2}>
          <Typography variant="h6" sx={{ color: seaGreen, fontWeight: 700, mb: 2 }}>
            Follow Us
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton sx={{ background: '#232b36', color: darkText, '&:hover': { background: seaGreen, color: '#fff' } }}>
              <TwitterIcon />
            </IconButton>
            <IconButton sx={{ background: '#232b36', color: darkText, '&:hover': { background: seaGreen, color: '#fff' } }}>
              <FacebookIcon />
            </IconButton>
            <IconButton sx={{ background: '#232b36', color: darkText, '&:hover': { background: seaGreen, color: '#fff' } }}>
              <InstagramIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
      {/* Copyright */}
      <Box sx={{ textAlign: 'center', color: mutedText, mt: 6, fontSize: 15, borderTop: '1px solid #232b36', pt: 3 }}>
        <div>© 2025 Relevant Recovery. All Rights Reserved.</div>
        <div>A Minnesota-based 501(c)(3) nonprofit organization.</div>
      </Box>
    </Box>
  );
} 