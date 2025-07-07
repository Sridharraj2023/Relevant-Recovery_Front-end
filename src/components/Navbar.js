import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';    



const navLinks = [
  { label: 'Home', href: '#' },
  { label: 'About', href: '#' },
  { label: 'Services', href: '#' },
  { label: 'Events', href: '#' },
  { label: 'Contact', href: '#' },
];

// Colors from screenshot
const seaGreen = '#089e8e'; // Donate button and Home link
const darkGray = '#2d3748'; // Other links and brand text

export default function Navbar() {
  return (
    <AppBar position="static" elevation={0} sx={{ background: '#fff', boxShadow: 'none', border: 'none' }}>
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 80, px: { xs: 2, md: 8 } }}>
        {/* Logo and Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FavoriteBorderIcon sx={{ color: seaGreen, fontSize: 40, mr: 1 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: darkGray, letterSpacing: 0.5 }}>
            Relevant Recovery
          </Typography>
        </Box>
        {/* Navigation Links */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4 }}>
          {navLinks.map((link) => (
            <Button
              key={link.label}
              href={link.href}
              disableRipple
              sx={{
                fontWeight: link.label === 'Home' ? 700 : 500,
                color: link.label === 'Home' ? seaGreen : darkGray,
                fontSize: 18,
                background: 'none',
                boxShadow: 'none',
                textTransform: 'none',
                '&:hover': {
                  background: 'none',
                  color: link.label === 'Home' ? seaGreen : '#089e8e',
                },
                px: 0.5,
                minWidth: 0,
              }}
            >
              {link.label}
            </Button>
          ))}
        </Box>
        {/* Donate Button */}
        <Button
          variant="contained"
          disableElevation
          sx={{
            borderRadius: 999,
            fontWeight: 700,
            px: 5,
            py: 1.2,
            fontSize: 18,
            backgroundColor: seaGreen,
            color: '#fff',
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#067e71',
              boxShadow: 'none',
            },
          }}
        >
          $ Donate
        </Button>
      </Toolbar>
    </AppBar>
  );
} 