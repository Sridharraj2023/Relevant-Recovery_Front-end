import React, { useState, useEffect } from 'react';
import {
  Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert as MuiAlert, AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Menu as MenuIcon, Dashboard as DashboardIcon, Event as EventIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import EventForm from './EventForm';

const drawerWidth = 240;

const AdminEventTable = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openEventForm, setOpenEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, eventId: null });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

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
      setEvents(events.map(event => event._id === savedEvent._id ? savedEvent : event));
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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin');
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
      </List>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        Loading...
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
        {/* Event Table Section */}
        <Box sx={{ mt: 0 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#181f29', mb: 1 }}>
            Event Management
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', mb: 4 }}>
            Create and manage events for the Relevant Recovery community
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateEvent}
            sx={{ backgroundColor: '#089e8e', '&:hover': { backgroundColor: '#067e71' }, mb: 3 }}
          >
            Create New Event
          </Button>
          {error && (
            <MuiAlert severity="error" sx={{ mb: 3 }}>{error}</MuiAlert>
          )}
          {events.length > 0 ? (
            <Box sx={{ overflowX: 'auto', maxWidth: '100%', mb: 4 }}>
              <Table sx={{ minWidth: 1200, borderRadius: 2 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f1f1f1' }}>
                    <TableCell sx={{ verticalAlign: 'middle', width: 100 }}><b>Image</b></TableCell>
                    <TableCell sx={{ verticalAlign: 'middle', width: 180 }}><b>Title</b></TableCell>
                    <TableCell sx={{ verticalAlign: 'middle', width: 120 }}><b>Date</b></TableCell>
                    <TableCell sx={{ verticalAlign: 'middle', width: 100 }}><b>Time</b></TableCell>
                    <TableCell sx={{ verticalAlign: 'middle', width: 160 }}><b>Location</b></TableCell>
                    <TableCell sx={{ verticalAlign: 'middle', width: 100 }}><b>Capacity</b></TableCell>
                    <TableCell sx={{ verticalAlign: 'middle', width: 100 }}><b>Cost</b></TableCell>
                    <TableCell sx={{ verticalAlign: 'middle', maxWidth: 200 }}><b>Description</b></TableCell>
                    <TableCell sx={{ verticalAlign: 'middle', maxWidth: 160 }}><b>Highlights</b></TableCell>
                    <TableCell sx={{ verticalAlign: 'middle', maxWidth: 120 }}><b>Special Gift</b></TableCell>
                    <TableCell sx={{ verticalAlign: 'middle', width: 60 }}><b>Free</b></TableCell>
                    <TableCell align="center" sx={{ verticalAlign: 'middle', width: 140 }}><b>Actions</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {events.map((event, idx) => (
                    <TableRow key={event._id} sx={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9f9f9' }}>
                      <TableCell sx={{ verticalAlign: 'middle', width: 100 }}>
                        {event.image ? (
                          <img
                            src={event.image}
                            alt={event.title}
                            style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 4 }}
                          />
                        ) : (
                          <Box sx={{ width: 80, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 16, bgcolor: '#cceee5', borderRadius: 2 }}>
                            No Image
                          </Box>
                        )}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle', width: 180 }}>{event.title}</TableCell>
                      <TableCell sx={{ verticalAlign: 'middle', width: 120 }}>{event.date}</TableCell>
                      <TableCell sx={{ verticalAlign: 'middle', width: 100 }}>{event.time}</TableCell>
                      <TableCell sx={{ verticalAlign: 'middle', width: 160 }}>{event.place}</TableCell>
                      <TableCell sx={{ verticalAlign: 'middle', width: 100 }}>{event.capacity || '-'}</TableCell>
                      <TableCell sx={{ verticalAlign: 'middle', width: 100 }}>{event.cost || (event.free ? 'Free' : 'Paid')}</TableCell>
                      <TableCell sx={{ verticalAlign: 'middle', maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.desc}</TableCell>
                      <TableCell sx={{ verticalAlign: 'middle', maxWidth: 160, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {event.highlights && event.highlights.length > 0 ? (
                          <ul style={{ margin: 0, paddingLeft: 18 }}>
                            {event.highlights.map((h, idx) => (
                              <li key={idx} style={{ color: '#089e8e', fontSize: 14 }}>{h}</li>
                            ))}
                          </ul>
                        ) : '-'}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle', maxWidth: 120, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.specialGift || '-'}</TableCell>
                      <TableCell sx={{ verticalAlign: 'middle', width: 60 }}>{event.free ? 'Yes' : 'No'}</TableCell>
                      <TableCell align="center" sx={{ verticalAlign: 'middle', width: 140 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                            sx={{ color: '#d32f2f', ml: 1 }}
                          >
                            Delete
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
                No events found
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Create your first event to get started
              </Typography>
            </Paper>
          )}
          <EventForm
            open={openEventForm}
            event={editingEvent}
            onClose={() => {
              setOpenEventForm(false);
              setEditingEvent(null);
            }}
            onSave={handleEventSaved}
          />
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
      </Box>
    </Box>
  );
}

export default AdminEventTable; 