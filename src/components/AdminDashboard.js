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
  Paper,
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
  Alert as MuiAlert
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Event as EventIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Logout as LogoutIcon,
  CalendarToday,
  AccessTime,
  LocationOn,
} from '@mui/icons-material';
import EventForm from './EventForm';

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
      const response = await fetch('https://relevant-recovery-back-end.onrender.com/api/events/admin', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch events');
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

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setOpenEventForm(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setOpenEventForm(true);
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

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ color: '#089e8e', fontWeight: 700 }}>
          Admin Panel
        </Typography>
      </Toolbar>
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <DashboardIcon sx={{ color: '#089e8e' }} />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <EventIcon sx={{ color: '#089e8e' }} />
            </ListItemIcon>
            <ListItemText primary="Events" />
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
            <Typography variant="body1" sx={{ color: '#666' }}>
              Create and manage events for the Relevant Recovery community
            </Typography>
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
                    {events.filter(e => e.free).length}
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
                    {events.filter(e => !e.free).length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Paid Events
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Actions */}
          <Box sx={{ mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateEvent}
              sx={{
                backgroundColor: '#089e8e',
                '&:hover': { backgroundColor: '#067e71' }
              }}
            >
              Create New Event
            </Button>
          </Box>

          {/* Events List */}
          <Grid container spacing={4} justifyContent="center" alignItems="stretch" sx={{ maxWidth: 1020, mx: 'auto', flexWrap: 'wrap' }}>
            {events.map((event) => (
              <Grid item xs={12} key={event._id} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box sx={{
                  background: '#e6fcf5',
                  borderRadius: 4,
                  boxShadow: '0 2px 12px 0 rgba(16,30,54,0.06)',
                  p: 0,
                  height: { xs: 'auto', md: 500 },
                  width: { xs: '100%', md: '70vw' },
                  maxWidth: 950,
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  overflow: 'hidden',
                  alignItems: 'stretch',
                  position: 'relative',
                  minHeight: { xs: 'auto', md: 700 },
                }}>
                  {/* Event Image */}
                  <Box sx={{
                    width: { xs: '100%', md: 300 },
                    height: { xs: 200, md: '40%' },
                    flexShrink: 0,
                    background: '#cceee5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    borderRadius: { xs: 0, md: 4 },
                    marginLeft: { xs: 0, md: 2 },
                    marginTop: { xs: 0, md: 2 },
                  }}>
                    {event.image ? (
                      <img
                        src={event.image ? `https://relevant-recovery-back-end.onrender.com/uploads/events/${event.image}` : ''}
                        alt={event.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 24 }}>
                        No Image
                      </Box>
                    )}
                  </Box>
                  {/* Event Details */}
                  <Box sx={{
                    flex: 1,
                    p: { xs: 3, md: 4 },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    background: '#e6fcf5',
                  }}>
                    {/* Free Ticket Button (top right) */}
                    <Box sx={{ position: 'absolute', top: 24, right: 24, zIndex: 2, display: { xs: 'none', md: 'block' } }}>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          background: '#d1fae5',
                          color: '#089e8e',
                          fontWeight: 700,
                          borderRadius: 999,
                          fontSize: 16,
                          px: 3,
                          boxShadow: 'none',
                          textTransform: 'none',
                          '&:hover': {
                            background: '#b9f6ca',
                            color: '#089e8e',
                            boxShadow: 'none',
                          },
                        }}
                        disabled={event.cost !== 'Free' && !event.free}
                      >
                        Free Ticket
                      </Button>
                    </Box>
                    <Box>
                      {/* 1. Date */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CalendarToday sx={{ fontSize: 20, color: '#089e8e', mr: 1 }} />
                        <Typography variant="body1" sx={{ color: '#089e8e', fontWeight: 700, mr: 2 }}>
                          {event.date}
                        </Typography>
                      </Box>
                      {/* 2. Title */}
                      <Typography variant="h4" sx={{ fontWeight: 900, color: '#181f29', mb: 1, lineHeight: 1.2 }}>
                        {event.title}
                      </Typography>
                      {/* 3. Time */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <AccessTime sx={{ fontSize: 18, color: '#089e8e', mr: 1 }} />
                        <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                          {event.time}
                        </Typography>
                      </Box>
                      {/* 4. Location */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOn sx={{ fontSize: 18, color: '#089e8e', mr: 1 }} />
                        <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                          {event.place}
                        </Typography>
                      </Box>
                      {/* 5. Capacity */}
                      {event.capacity && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                            <b>Capacity:</b> {event.capacity} people
                          </Typography>
                        </Box>
                      )}
                      {/* 6. Cost */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                          <b>Cost:</b> {event.cost || (event.free ? 'Free' : 'Paid')}
                        </Typography>
                      </Box>
                      {/* 7. Description */}
                      <Typography
                        variant="body1"
                        sx={{ color: '#555', mb: 2, lineHeight: 1.6 }}
                      >
                        {event.desc}
                      </Typography>
                      {/* 8. Event Highlights */}
                      {event.highlights && event.highlights.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                            Event Highlights:
                          </Typography>
                          <ul style={{ margin: 0, paddingLeft: 20 }}>
                            {event.highlights.map((h, idx) => (
                              <li key={idx} style={{ color: '#089e8e', marginBottom: 4, fontSize: 16, fontWeight: 500 }}>{h}</li>
                            ))}
                          </ul>
                        </Box>
                      )}
                      {/* 9. Special Gift */}
                      {event.specialGift && (
                        <Box sx={{ background: '#d1fae5', borderRadius: 2, p: 2, mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span role="img" aria-label="gift" style={{ fontSize: 22, marginRight: 8 }}>🎁</span>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#089e8e', mr: 1 }}>
                            Special Gift for Attendees:
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#089e8e' }}>{event.specialGift}</Typography>
                        </Box>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'space-between' }}>
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleEditEvent(event)}
                        sx={{ color: '#089e8e' }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => setDeleteDialog({ open: true, eventId: event._id })}
                        sx={{ color: '#d32f2f' }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>

          {events.length === 0 && !loading && (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
                No events found
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Create your first event to get started
              </Typography>
            </Paper>
          )}
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