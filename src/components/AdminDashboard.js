import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,

  Alert,
  CircularProgress,
  Snackbar,
  Alert as MuiAlert,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Event as EventIcon,
  Logout as LogoutIcon,
  AttachMoney as MoneyIcon,
  ConfirmationNumber as TicketIcon,
  People as PeopleIcon,
  } from '@mui/icons-material';
import EventForm from './EventForm';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const AdminDashboard = ({ onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openEventForm, setOpenEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, eventId: null });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

 

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('No admin token found. Please login again.');
      }

      const response = await fetch('https://relevant-recovery-back-end.onrender.com/api/events/admin', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    onLogout();
  };

  const handleDeleteEvent = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`https://relevant-recovery-back-end.onrender.com/api/events/${deleteDialog.eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      setEvents(events.filter(event => event._id !== deleteDialog.eventId));
      setDeleteDialog({ open: false, eventId: null });
      setToast({ open: true, message: 'Event deleted successfully!', severity: 'success' });
    } catch (err) {
      setError(err.message);
      setToast({ open: true, message: 'Failed to delete event', severity: 'error' });
    }
  };

  const handleEventSaved = (savedEvent) => {
    if (editingEvent) {
      setEvents(events.map(event => 
        event._id === savedEvent._id ? savedEvent : event
      ));
      setToast({ open: true, message: 'Event updated successfully!', severity: 'success' });
    } else {
      setEvents([savedEvent, ...events]);
      setToast({ open: true, message: 'Event created successfully!', severity: 'success' });
    }
    setOpenEventForm(false);
    setEditingEvent(null);
  };

  const handleToastClose = () => {
    setToast({ ...toast, open: false });
  };

  const navigate = useNavigate();

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ color: '#089e8e', fontWeight: 700 }}>
          Admin Panel
        </Typography>
      </Toolbar>
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/admin')}>
            <ListItemIcon>
              <DashboardIcon sx={{ color: '#089e8e' }} />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/adminevent')}>
            <ListItemIcon>
              <EventIcon sx={{ color: '#089e8e' }} />
            </ListItemIcon>
            <ListItemText primary="Events" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/admindonation')}>
            <ListItemIcon>
              <MoneyIcon sx={{ color: '#089e8e' }} />
            </ListItemIcon>
            <ListItemText primary="Manage Donations" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/admindonation-records')}>
            <ListItemIcon>
              <MoneyIcon sx={{ color: '#089e8e' }} />
            </ListItemIcon>
            <ListItemText primary="Donation Records" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/adminregistrations')}>
            <ListItemIcon>
              <PeopleIcon sx={{ color: '#089e8e' }} />
            </ListItemIcon>
            <ListItemText primary="Event Registrations" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/adminticket-bookings')}>
            <ListItemIcon>
              <TicketIcon sx={{ color: '#089e8e' }} />
            </ListItemIcon>
            <ListItemText primary="Ticket Bookings" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: '#fff',
          color: '#181f29',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Relevant Recovery Admin
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8
        }}
      >
        {/* Dashboard Stats and Info Only - Remove Create Event button and event table */}
        <Container maxWidth="xl">
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#181f29', mb: 1 }}>
              Event Management
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', mb: 2 }}>
              Create and manage events for the Relevant Recovery community
            </Typography>
            <Button
              variant="contained"
              onClick={() => setOpenEventForm(true)}
              sx={{
                backgroundColor: '#089e8e',
                '&:hover': { backgroundColor: '#067e71' },
                px: 3,
                py: 1
              }}
            >
              Create New Event
            </Button>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: '#e6f7f5' }}>
                <CardContent>
                  <Typography variant="h4" sx={{ color: '#089e8e', fontWeight: 700 }}>
                    {events.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Total Events
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: '#e6f7f5' }}>
                <CardContent>
                  <Typography variant="h4" sx={{ color: '#089e8e', fontWeight: 700 }}>
                    {events.filter(e => e.isActive).length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Active Events
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: '#e6f7f5' }}>
                <CardContent>
                  <Typography variant="h4" sx={{ color: '#089e8e', fontWeight: 700 }}>
                    {events.filter(e => e.cost === 'Free').length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Free Events
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: '#e6f7f5' }}>
                <CardContent>
                  <Typography variant="h4" sx={{ color: '#089e8e', fontWeight: 700 }}>
                    {events.filter(e => e.cost !== 'Free').length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Paid Events
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Event Form Dialog */}
      <EventForm
        open={openEventForm}
        event={editingEvent}
        onClose={() => {
          setOpenEventForm(false);
          setEditingEvent(null);
        }}
        onSave={handleEventSaved}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, eventId: null })}>
        <DialogTitle>Delete Event</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this event? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, eventId: null })}>
            Cancel
          </Button>
          <Button onClick={handleDeleteEvent} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MuiAlert
          onClose={handleToastClose}
          severity={toast.severity}
          sx={{ width: '100%' }}
        >
          {toast.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard; 