import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';    
import { Link as RouterLink, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { useState } from 'react';


const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Events', to: '/events' },
  { label: 'Contact', to: '/contact' },
];

// Colors from screenshot
const seaGreen = '#089e8e'; // Donate button and Home link
const darkGray = '#2d3748'; // Other links and brand text

export default function Navbar() {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);

  return (
    <AppBar position="sticky" elevation={0} sx={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: 'none', top: 0, zIndex: 1100 }}>
      <Toolbar sx={{ 
        justifyContent: 'space-between', 
        minHeight: { xs: 70, sm: 80, md: 80 },
        px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8 },
        py: { xs: 1, sm: 1.5 },
        flexWrap: 'nowrap'
      }}>
        {/* Logo and Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <FavoriteBorderIcon sx={{ 
            color: seaGreen, 
            fontSize: { xs: 32, sm: 36, md: 40 }, 
            mr: { xs: 0.5, sm: 1 } 
          }} />
          <Typography variant="h5" sx={{ 
            fontWeight: 700, 
            color: darkGray, 
            letterSpacing: 0.5,
            fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }
          }}>
            Relevant Recovery
          </Typography>
        </Box>
        
        {/* Navigation Links - Desktop Only */}
        <Box sx={{ 
          display: { xs: 'none', md: 'flex' }, 
          gap: { md: 3, lg: 4 },
          flex: 1,
          justifyContent: 'center',
          mx: 2
        }}>
          {navLinks.map((link) => {
            const isActive = link.to !== '#' && location.pathname === link.to;
            return (
              <Button
                key={link.label}
                component={link.to !== '#' ? RouterLink : 'button'}
                to={link.to !== '#' ? link.to : undefined}
                disableRipple
                sx={{
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? seaGreen : darkGray,
                  fontSize: { md: 16, lg: 18 },
                  background: 'none',
                  boxShadow: 'none',
                  textTransform: 'none',
                  '&:hover': {
                    background: 'none',
                    color: seaGreen,
                  },
                  px: { md: 1, lg: 1.5 },
                  minWidth: 0,
                  whiteSpace: 'nowrap'
                }}
              >
                {link.label}
              </Button>
            );
          })}
        </Box>
        
        {/* Donate Button - Desktop Only */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, flexShrink: 0 }}>
          <Button
            variant="contained"
            disableElevation
            component={RouterLink}
            to="/donation"
            sx={{
              borderRadius: 999,
              fontWeight: 700,
              px: { md: 3, lg: 5 },
              py: { md: 1, lg: 1.2 },
              fontSize: { md: 16, lg: 18 },
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
        </Box>
        
        {/* Hamburger Menu - Mobile Only */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, flexShrink: 0 }}>
          <IconButton edge="end" color="inherit" aria-label="menu" onClick={handleDrawerOpen}>
            <MenuIcon sx={{ fontSize: { xs: 32, sm: 36 }, color: darkGray }} />
          </IconButton>
        </Box>
      </Toolbar>
      
      {/* Drawer for Mobile Nav */}
      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
        <Box sx={{ width: 260 }} role="presentation" onClick={handleDrawerClose}>
          <List>
            {navLinks.map((link) => (
              <ListItem key={link.label} disablePadding>
                <ListItemButton
                  component={link.to !== '#' ? RouterLink : 'button'}
                  to={link.to !== '#' ? link.to : undefined}
                  selected={link.to !== '#' && location.pathname === link.to}
                >
                  <ListItemText
                    primary={link.label}
                    primaryTypographyProps={{
                      fontWeight: link.to !== '#' && location.pathname === link.to ? 700 : 500,
                      color: link.to !== '#' && location.pathname === link.to ? seaGreen : darkGray,
                      fontSize: 18,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ px: 2 }}>
            <Button
              variant="contained"
              fullWidth
              disableElevation
              component={RouterLink}
              to="/donation"
              sx={{
                borderRadius: 999,
                fontWeight: 700,
                px: 0,
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
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
} 