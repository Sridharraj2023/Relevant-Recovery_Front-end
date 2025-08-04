import React, { useState, useEffect } from 'react';
import {
  Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert as MuiAlert, AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton, TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel, TablePagination, TableSortLabel, Stack, Divider
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Menu as MenuIcon, Dashboard as DashboardIcon, Event as EventIcon, Logout as LogoutIcon, Search as SearchIcon, FilterList as FilterIcon, Upload as UploadIcon, Clear as ClearIcon, GetApp as ExportIcon, Sort as SortIcon, AttachMoney as MoneyIcon, ConfirmationNumber as TicketIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import EventForm from './EventForm';

const drawerWidth = 240;

const AdminEventTable = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openEventForm, setOpenEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, eventId: null });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [mobileOpen, setMobileOpen] = useState(false);

  // New state for enhanced features
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [importDialog, setImportDialog] = useState(false);

  const navigate = useNavigate();

  // Helper function to convert time string to minutes for sorting
  const convertTimeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    
    // Handle different time formats (12-hour and 24-hour)
    const timeRegex = /(\d{1,2}):(\d{2})\s*(AM|PM)?/i;
    const match = timeStr.match(timeRegex);
    
    if (!match) return 0;
    
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const period = match[3]?.toUpperCase();
    
    // Convert to 24-hour format
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    
    return hours * 60 + minutes;
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter and search events
  useEffect(() => {
    let filtered = [...events];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.place.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      const currentDate = new Date();
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        if (filterStatus === 'upcoming') return eventDate >= currentDate;
        if (filterStatus === 'past') return eventDate < currentDate;
        if (filterStatus === 'free') return event.free;
        if (filterStatus === 'paid') return !event.free;
        return true;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'date':
          // Handle different date formats and ensure proper date parsing
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          // Handle invalid dates
          if (isNaN(aValue.getTime())) aValue = new Date(0);
          if (isNaN(bValue.getTime())) bValue = new Date(0);
          break;
        case 'time':
          // Convert time strings to comparable format (24-hour format)
          aValue = convertTimeToMinutes(a.time || '00:00');
          bValue = convertTimeToMinutes(b.time || '00:00');
          break;
        case 'capacity':
          aValue = parseInt(a.capacity) || 0;
          bValue = parseInt(b.capacity) || 0;
          break;
        case 'cost':
          // Handle cost sorting - consider free events as 0 cost
          aValue = a.cost === 'Free' ? 0 : (parseFloat(a.cost) || 0);
          bValue = b.cost === 'Free' ? 0 : (parseFloat(b.cost) || 0);
          break;
        default:
          aValue = a[sortBy] || '';
          bValue = b[sortBy] || '';
          // For string comparison, convert to lowercase
          if (typeof aValue === 'string') aValue = aValue.toLowerCase();
          if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredEvents(filtered);
    setPage(0); // Reset to first page when filters change
  }, [events, searchTerm, filterStatus, sortBy, sortOrder]);

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

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setSortBy('date');
    setSortOrder('desc');
  };

  const handleImportEvents = () => {
    setImportDialog(true);
  };

  const handleExportEvents = () => {
    const dataStr = JSON.stringify(filteredEvents, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `events_export_${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    setToast({ open: true, message: 'Events exported successfully!', severity: 'success' });
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
          {/* Action Buttons */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3, width: '100%' }}>
  {/* Responsive Button Group */}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateEvent}
              sx={{ backgroundColor: '#089e8e', '&:hover': { backgroundColor: '#067e71' } }}
            >
              Create New Event
            </Button>
            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              onClick={handleImportEvents}
              sx={{ borderColor: '#089e8e', color: '#089e8e', '&:hover': { borderColor: '#067e71', backgroundColor: '#f0fffe' } }}
            >
              Import Events
            </Button>
            <Button
              variant="outlined"
              startIcon={<ExportIcon />}
              onClick={handleExportEvents}
              disabled={filteredEvents.length === 0}
              sx={{ borderColor: '#089e8e', color: '#089e8e', '&:hover': { borderColor: '#067e71', backgroundColor: '#f0fffe' } }}
            >
              Export Events
            </Button>
          </Stack>

          {/* Search and Filter Controls */}
          <Paper sx={{ p: 2, mb: 3, backgroundColor: '#f8f9fa', width: '100%' }}>
  {/* Responsive Search/Filter Controls */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="stretch" sx={{ width: '100%' }}>
  {/* Each control takes full width on xs, auto on md+ */}
              <TextField
                placeholder="Search events..."
                value={searchTerm}
                onChange={handleSearchChange}
                size="small"
                sx={{ minWidth: 250 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#089e8e' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Filter by Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={handleFilterChange}
                  label="Filter by Status"
                  startAdornment={<FilterIcon sx={{ color: '#089e8e', mr: 1 }} />}
                >
                  <MenuItem value="all">All Events</MenuItem>
                  <MenuItem value="upcoming">Upcoming</MenuItem>
                  <MenuItem value="past">Past Events</MenuItem>
                  <MenuItem value="free">Free Events</MenuItem>
                  <MenuItem value="paid">Paid Events</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                  label="Sort by"
                  startAdornment={<SortIcon sx={{ color: '#089e8e', mr: 1 }} />}
                >
                  <MenuItem value="date-desc">Date (Newest First)</MenuItem>
                  <MenuItem value="date-asc">Date (Oldest First)</MenuItem>
                  <MenuItem value="title-asc">Title (A-Z)</MenuItem>
                  <MenuItem value="title-desc">Title (Z-A)</MenuItem>
                  <MenuItem value="time-asc">Time (Early First)</MenuItem>
                  <MenuItem value="time-desc">Time (Late First)</MenuItem>
                  <MenuItem value="cost-asc">Price (Low to High)</MenuItem>
                  <MenuItem value="cost-desc">Price (High to Low)</MenuItem>
                  <MenuItem value="capacity-desc">Capacity (High to Low)</MenuItem>
                  <MenuItem value="capacity-asc">Capacity (Low to High)</MenuItem>
                </Select>
              </FormControl>
              <Button
                size="small"
                startIcon={<ClearIcon />}
                onClick={clearFilters}
                sx={{ color: '#666' }}
              >
                Clear Filters
              </Button>
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Showing {filteredEvents.length} of {events.length} events
            </Typography>
          </Paper>

          {error && (
            <MuiAlert severity="error" sx={{ mb: 3 }}>{error}</MuiAlert>
          )}

          {filteredEvents.length > 0 ? (
            <Box sx={{ overflowX: 'auto', maxWidth: '100%', mb: 4 }}>
              <Table sx={{ minWidth: 1200, borderRadius: 2 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f1f1f1' }}>
                    <TableCell sx={{ verticalAlign: 'middle', width: 100 }}><b>Image</b></TableCell>
                    <TableCell sx={{ verticalAlign: 'middle', width: 180 }}>
                      <TableSortLabel
                        active={sortBy === 'title'}
                        direction={sortBy === 'title' ? sortOrder : 'asc'}
                        onClick={() => handleSort('title')}
                        sx={{ fontWeight: 'bold' }}
                      >
                        Title
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ verticalAlign: 'middle', width: 120 }}>
                      <TableSortLabel
                        active={sortBy === 'date'}
                        direction={sortBy === 'date' ? sortOrder : 'asc'}
                        onClick={() => handleSort('date')}
                        sx={{ fontWeight: 'bold' }}
                      >
                        Date
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ verticalAlign: 'middle', width: 100 }}>
                      <TableSortLabel
                        active={sortBy === 'time'}
                        direction={sortBy === 'time' ? sortOrder : 'asc'}
                        onClick={() => handleSort('time')}
                        sx={{ fontWeight: 'bold' }}
                      >
                        Time
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ verticalAlign: 'middle', width: 160 }}><b>Location</b></TableCell>
                    <TableCell sx={{ verticalAlign: 'middle', width: 100 }}>
                      <TableSortLabel
                        active={sortBy === 'capacity'}
                        direction={sortBy === 'capacity' ? sortOrder : 'asc'}
                        onClick={() => handleSort('capacity')}
                        sx={{ fontWeight: 'bold' }}
                      >
                        Capacity
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ verticalAlign: 'middle', width: 100 }}>
                      <TableSortLabel
                        active={sortBy === 'cost'}
                        direction={sortBy === 'cost' ? sortOrder : 'asc'}
                        onClick={() => handleSort('cost')}
                        sx={{ fontWeight: 'bold' }}
                      >
                        Cost
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ verticalAlign: 'middle', maxWidth: 200 }}><b>Description</b></TableCell>
                    <TableCell sx={{ verticalAlign: 'middle', maxWidth: 160 }}><b>Highlights</b></TableCell>
                    <TableCell sx={{ verticalAlign: 'middle', maxWidth: 120 }}><b>Special Gift</b></TableCell>
                    
                    <TableCell align="center" sx={{ verticalAlign: 'middle', width: 140 }}><b>Actions</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEvents
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((event, idx) => (
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
                        <TableCell sx={{ verticalAlign: 'middle', width: 100 }}>{event.cost}</TableCell>
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
                        
                        <TableCell align="center" sx={{ verticalAlign: 'middle', width: 140 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <IconButton onClick={() => handleEditEvent(event)} sx={{ color: '#089e8e' }} aria-label="edit">
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => setDeleteDialog({ open: true, eventId: event._id })} sx={{ color: '#d32f2f', ml: 1 }} aria-label="delete">
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              
              {/* Pagination */}
              <TablePagination
                component="div"
                count={filteredEvents.length}
                page={page}
                onPageChange={handlePageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={[5, 10, 25, 50]}
                sx={{
                  borderTop: '1px solid #e0e0e0',
                  '& .MuiTablePagination-toolbar': {
                    paddingLeft: 2,
                    paddingRight: 2,
                  },
                  '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                    color: '#666',
                  },
                }}
              />
            </Box>
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
                {events.length === 0 ? 'No events found' : 'No events match your filters'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                {events.length === 0 ? 'Create your first event to get started' : 'Try adjusting your search or filter criteria'}
              </Typography>
              {events.length > 0 && (
                <Button
                  size="small"
                  onClick={clearFilters}
                  sx={{ color: '#089e8e' }}
                >
                  Clear All Filters
                </Button>
              )}
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

          {/* Import Dialog */}
          <Dialog open={importDialog} onClose={() => setImportDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Import Events</DialogTitle>
            <DialogContent>
              <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
                Upload a JSON file containing event data. The file should contain an array of event objects.
              </Typography>
              <input
                type="file"
                accept=".json"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      try {
                        const importedEvents = JSON.parse(event.target.result);
                        if (Array.isArray(importedEvents)) {
                          setToast({ open: true, message: `Ready to import ${importedEvents.length} events`, severity: 'info' });
                        } else {
                          setToast({ open: true, message: 'Invalid file format. Expected JSON array.', severity: 'error' });
                        }
                      } catch (error) {
                        setToast({ open: true, message: 'Error reading file. Please check the format.', severity: 'error' });
                      }
                    };
                    reader.readAsText(file);
                  }
                }}
                style={{ width: '100%', padding: '10px', border: '2px dashed #089e8e', borderRadius: '4px' }}
              />
              <Typography variant="caption" sx={{ mt: 1, display: 'block', color: '#666' }}>
                Note: This is a demo import feature. In production, you would implement proper file validation and backend integration.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setImportDialog(false)}>Cancel</Button>
              <Button onClick={() => {
                setImportDialog(false);
                setToast({ open: true, message: 'Import feature coming soon!', severity: 'info' });
              }} sx={{ color: '#089e8e' }}>
                Import
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