import React, { useState, useEffect } from 'react';
import {
  Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert as MuiAlert, AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton, TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel, TablePagination, TableSortLabel, Stack, Divider
} from '@mui/material';
import { 
  Delete as DeleteIcon, Menu as MenuIcon, 
  Dashboard as DashboardIcon, Event as EventIcon, Logout as LogoutIcon, 
  Search as SearchIcon, FilterList as FilterIcon, Clear as ClearIcon, 
  GetApp as ExportIcon, Sort as SortIcon,
  AttachMoney as MoneyIcon, ConfirmationNumber as TicketIcon, People as PeopleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const AdminRegistrationTable = () => {
  const [registrations, setRegistrations] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, registrationId: null });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [mobileOpen, setMobileOpen] = useState(false);

  // Enhanced features state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEvent, setFilterEvent] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const navigate = useNavigate();

  useEffect(() => {
    fetchRegistrations();
  }, []);

  // Filter and search registrations
  useEffect(() => {
    let filtered = [...registrations];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(registration => 
        registration.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.state?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply event filter
    if (filterEvent !== 'all') {
      filtered = filtered.filter(registration => 
        registration.event?._id === filterEvent || registration.event === filterEvent
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'name':
          aValue = (a.name || '').toLowerCase();
          bValue = (b.name || '').toLowerCase();
          break;
        case 'email':
          aValue = (a.email || '').toLowerCase();
          bValue = (b.email || '').toLowerCase();
          break;
        case 'city':
          aValue = (a.city || '').toLowerCase();
          bValue = (b.city || '').toLowerCase();
          break;
        case 'date':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          aValue = a[sortBy] || '';
          bValue = b[sortBy] || '';
          if (typeof aValue === 'string') aValue = aValue.toLowerCase();
          if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredRegistrations(filtered);
    setPage(0); // Reset to first page when filters change
  }, [registrations, searchTerm, filterEvent, sortBy, sortOrder]);

  const fetchRegistrations = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('No admin token found. Please login again.');
      }

      const response = await fetch('https://relevant-recovery-back-end.onrender.com/api/registration/admin', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch registrations');
      }

      const data = await response.json();
      setRegistrations(data);
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
    setFilterEvent(event.target.value);
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
    setFilterEvent('all');
    setSortBy('date');
    setSortOrder('desc');
  };

  const handleExportRegistrations = () => {
    const dataStr = JSON.stringify(filteredRegistrations, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `registrations_export_${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    setToast({ open: true, message: 'Registrations exported successfully!', severity: 'success' });
  };

  const handleDeleteRegistration = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`https://relevant-recovery-back-end.onrender.com/api/registration/${deleteDialog.registrationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to delete registration');
      }
      setRegistrations(registrations.filter(registration => registration._id !== deleteDialog.registrationId));
      setDeleteDialog({ open: false, registrationId: null });
      setToast({ open: true, message: 'Registration deleted successfully!', severity: 'success' });
    } catch (err) {
      setError(err.message);
      setToast({ open: true, message: 'Failed to delete registration', severity: 'error' });
    }
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
        {/* Registration Table Section */}
        <Box sx={{ mt: 0 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#181f29', mb: 1 }}>
            Event Registrations
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', mb: 4 }}>
            View and manage all event registrations from our community members
          </Typography>
          
          {/* Action Buttons */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3, width: '100%' }}>
            <Button
              variant="outlined"
              startIcon={<ExportIcon />}
              onClick={handleExportRegistrations}
              disabled={filteredRegistrations.length === 0}
              sx={{ borderColor: '#089e8e', color: '#089e8e', '&:hover': { borderColor: '#067e71', backgroundColor: '#f0fffe' } }}
            >
              Export Registrations
            </Button>
          </Stack>

          {/* Search and Filter Controls */}
          <Paper sx={{ p: 2, mb: 3, backgroundColor: '#f8f9fa', width: '100%' }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="stretch" sx={{ width: '100%' }}>
              <TextField
                placeholder="Search registrations..."
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
                <InputLabel>Filter by Event</InputLabel>
                <Select
                  value={filterEvent}
                  onChange={handleFilterChange}
                  label="Filter by Event"
                  startAdornment={<FilterIcon sx={{ color: '#089e8e', mr: 1 }} />}
                >
                  <MenuItem value="all">All Events</MenuItem>
                  {/* Event options will be populated dynamically */}
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
                  <MenuItem value="name-asc">Name (A-Z)</MenuItem>
                  <MenuItem value="name-desc">Name (Z-A)</MenuItem>
                  <MenuItem value="email-asc">Email (A-Z)</MenuItem>
                  <MenuItem value="email-desc">Email (Z-A)</MenuItem>
                  <MenuItem value="city-asc">City (A-Z)</MenuItem>
                  <MenuItem value="city-desc">City (Z-A)</MenuItem>
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
              Showing {filteredRegistrations.length} of {registrations.length} registrations
            </Typography>
          </Paper>

          {error && (
            <MuiAlert severity="error" sx={{ mb: 3 }}>{error}</MuiAlert>
          )}

          {filteredRegistrations.length > 0 ? (
            <Box sx={{ overflowX: 'auto', maxWidth: '100%', mb: 4 }}>
              <Table sx={{ minWidth: 1200, borderRadius: 2 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f1f1f1' }}>
                    <TableCell sx={{ verticalAlign: 'middle', width: 150 }}>
                      <TableSortLabel
                        active={sortBy === 'name'}
                        direction={sortBy === 'name' ? sortOrder : 'asc'}
                        onClick={() => handleSort('name')}
                        sx={{ fontWeight: 'bold' }}
                      >
                        Name
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ verticalAlign: 'middle', width: 200 }}>
                      <TableSortLabel
                        active={sortBy === 'email'}
                        direction={sortBy === 'email' ? sortOrder : 'asc'}
                        onClick={() => handleSort('email')}
                        sx={{ fontWeight: 'bold' }}
                      >
                        Email
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ verticalAlign: 'middle', width: 120 }}>
                      <b>Phone</b>
                    </TableCell>
                    <TableCell sx={{ verticalAlign: 'middle', width: 120 }}>
                      <TableSortLabel
                        active={sortBy === 'city'}
                        direction={sortBy === 'city' ? sortOrder : 'asc'}
                        onClick={() => handleSort('city')}
                        sx={{ fontWeight: 'bold' }}
                      >
                        City
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ verticalAlign: 'middle', width: 120 }}>
                      <b>State</b>
                    </TableCell>
                    <TableCell sx={{ verticalAlign: 'middle', width: 120 }}>
                      <b>Country</b>
                    </TableCell>
                    <TableCell sx={{ verticalAlign: 'middle', width: 150 }}>
                      <TableSortLabel
                        active={sortBy === 'date'}
                        direction={sortBy === 'date' ? sortOrder : 'asc'}
                        onClick={() => handleSort('date')}
                        sx={{ fontWeight: 'bold' }}
                      >
                        Registration Date
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ verticalAlign: 'middle', width: 200 }}>
                      <b>Event</b>
                    </TableCell>
                    <TableCell align="center" sx={{ verticalAlign: 'middle', width: 120 }}>
                      <b>Actions</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRegistrations
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((registration, idx) => (
                      <TableRow key={registration._id} sx={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9f9f9' }}>
                        <TableCell sx={{ verticalAlign: 'middle', width: 150 }}>
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {registration.name || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ verticalAlign: 'middle', width: 200 }}>
                          {registration.email || 'N/A'}
                        </TableCell>
                        <TableCell sx={{ verticalAlign: 'middle', width: 120 }}>
                          {registration.phone || 'N/A'}
                        </TableCell>
                        <TableCell sx={{ verticalAlign: 'middle', width: 120 }}>
                          {registration.city || 'N/A'}
                        </TableCell>
                        <TableCell sx={{ verticalAlign: 'middle', width: 120 }}>
                          {registration.state || 'N/A'}
                        </TableCell>
                        <TableCell sx={{ verticalAlign: 'middle', width: 120 }}>
                          {registration.country || 'N/A'}
                        </TableCell>
                        <TableCell sx={{ verticalAlign: 'middle', width: 150 }}>
                          {new Date(registration.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </TableCell>
                        <TableCell sx={{ verticalAlign: 'middle', width: 200 }}>
                          <Typography sx={{ 
                            fontSize: '0.9rem',
                            wordBreak: 'break-word'
                          }}>
                            {registration.event?.title || 'Event not found'}
                          </Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ verticalAlign: 'middle', width: 120 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <IconButton 
                              onClick={() => setDeleteDialog({ open: true, registrationId: registration._id })} 
                              sx={{ color: '#d32f2f' }} 
                              aria-label="delete"
                            >
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
                count={filteredRegistrations.length}
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
                {registrations.length === 0 ? 'No registrations found' : 'No registrations match your filters'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                {registrations.length === 0 ? 'Registrations will appear here once users register for events' : 'Try adjusting your search or filter criteria'}
              </Typography>
              {registrations.length > 0 && (
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

          <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, registrationId: null })}>
            <DialogTitle>Delete Registration</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this registration record? This action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialog({ open: false, registrationId: null })}>
                Cancel
              </Button>
              <Button onClick={handleDeleteRegistration} color="error">
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

export default AdminRegistrationTable; 