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
  Chip,
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
          <Grid container spacing={4} justifyContent="center" alignItems="stretch" sx={{ textWrap: 'wrap', mx: 'auto', flexWrap: 'wrap' }}>
            {events.map((event) => (
              <Grid item xs={12} md={6} key={event._id} display="flex" justifyContent="center">
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#181f29' }}>
                        {event.title}
                      </Typography>
                      <Chip
                        label={event.cost ? event.cost : (event.free ? 'Free' : 'Paid')}
                        color={event.cost === 'Free' || event.free ? 'success' : 'primary'}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                      <strong>Date:</strong> {event.date}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                      <strong>Time:</strong> {event.time}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                      <strong>Place:</strong> {event.place || event.location}
                    </Typography>
                    {/* Image */}
                    {event.image && (
                      <Box sx={{ mb: 1 }}>
                        <img
                          src={
                            event.image.startsWith('http')
                              ? event.image
                              : `/uploads/events/${event.image}`
                          }
                          alt={event.title}
                          style={{ width: '100%', maxHeight: 120, objectFit: 'cover', borderRadius: 6 }}
                        />
                      </Box>
                    )}
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#555',
                        mb: 2,
                        lineHeight: 1.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: 'vertical',
                        minHeight: '5.5em',
                      }}
                    >
                      {event.desc}
                    </Typography>
                    {/* Highlights */}
                    {event.highlights && event.highlights.length > 0 && (
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Highlights:</Typography>
                        <ul style={{ margin: 0, paddingLeft: 18 }}>
                          {event.highlights.map((h, idx) => (
                            <li key={idx} style={{ color: '#089e8e', fontSize: 14 }}>{h}</li>
                          ))}
                        </ul>
                      </Box>
                    )}
                    {/* Special Gift */}
                    {event.specialGift && (
                      <Box sx={{ background: '#d1fae5', borderRadius: 2, p: 1, mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#089e8e', fontWeight: 600 }}>
                          🎁 {event.specialGift}
                        </Typography>
                      </Box>
                    )}
                    {/* Action Type */}
                    {event.actionType && (
                      <Typography variant="body2" sx={{ color: '#089e8e', fontWeight: 600, mb: 1 }}>
                        Action: {event.actionType}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mt: 'auto', justifyContent: 'space-between' }}>
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