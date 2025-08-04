import React, { useState, useEffect } from 'react';
import {
  Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert as MuiAlert, AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton, TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel, TablePagination, TableSortLabel, Stack, Divider, Chip
} from '@mui/material';
import { 
  Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Menu as MenuIcon, 
  Dashboard as DashboardIcon, Event as EventIcon, Logout as LogoutIcon, 
  Search as SearchIcon, FilterList as FilterIcon, Clear as ClearIcon, 
  GetApp as ExportIcon, Sort as SortIcon, Visibility as ViewIcon,
  AttachMoney as MoneyIcon, ConfirmationNumber as TicketIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const AdminDonationTable = () => {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, donationId: null });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [mobileOpen, setMobileOpen] = useState(false);

  // Enhanced features state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAmount, setFilterAmount] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDonations();
  }, []);

  // Filter and search donations
  useEffect(() => {
    let filtered = [...donations];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(donation => 
        donation.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.paymentIntentId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(donation => {
        if (filterStatus === 'completed') return donation.status === 'succeeded';
        if (filterStatus === 'pending') return donation.status === 'processing';
        if (filterStatus === 'failed') return donation.status === 'failed';
        if (filterStatus === 'anonymous') return donation.anonymous === true;
        if (filterStatus === 'named') return donation.anonymous === false;
        return true;
      });
    }

    // Apply amount filter
    if (filterAmount !== 'all') {
      filtered = filtered.filter(donation => {
        const amount = donation.amount / 100; // Convert from cents to dollars
        switch (filterAmount) {
          case 'small': return amount < 50;
          case 'medium': return amount >= 50 && amount < 200;
          case 'large': return amount >= 200 && amount < 1000;
          case 'major': return amount >= 1000;
          default: return true;
        }
      });
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
        case 'amount':
          aValue = a.amount || 0;
          bValue = b.amount || 0;
          break;
        case 'date':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'status':
          aValue = (a.status || '').toLowerCase();
          bValue = (b.status || '').toLowerCase();
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

    setFilteredDonations(filtered);
    setPage(0); // Reset to first page when filters change
  }, [donations, searchTerm, filterStatus, filterAmount, sortBy, sortOrder]);

  const fetchDonations = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('https://relevant-recovery-back-end.onrender.com/api/donations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch donations');
      }
      const data = await response.json();
      setDonations(data);
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

  const handleAmountFilterChange = (event) => {
    setFilterAmount(event.target.value);
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
    setFilterAmount('all');
    setSortBy('date');
    setSortOrder('desc');
  };

  const handleExportDonations = () => {
    const dataStr = JSON.stringify(filteredDonations, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `donations_export_${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    setToast({ open: true, message: 'Donations exported successfully!', severity: 'success' });
  };

  const handleDeleteDonation = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`https://relevant-recovery-back-end.onrender.com/api/donations/${deleteDialog.donationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to delete donation');
      }
      setDonations(donations.filter(donation => donation._id !== deleteDialog.donationId));
      setDeleteDialog({ open: false, donationId: null });
      setToast({ open: true, message: 'Donation deleted successfully!', severity: 'success' });
    } catch (err) {
      setError(err.message);
      setToast({ open: true, message: 'Failed to delete donation', severity: 'error' });
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'succeeded': return 'success';
      case 'processing': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getAmountColor = (amount) => {
    const amountInDollars = amount / 100;
    if (amountInDollars >= 1000) return '#d32f2f';
    if (amountInDollars >= 200) return '#1976d2';
    if (amountInDollars >= 50) return '#388e3c';
    return '#666';
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
        {/* Donation Table Section */}
        <Box sx={{ mt: 0 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#181f29', mb: 1 }}>
            Donation Records
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', mb: 4 }}>
            View and manage all donation payment records from our generous supporters
          </Typography>
          
          {/* Action Buttons */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3, width: '100%' }}>
            <Button
              variant="outlined"
              startIcon={<ExportIcon />}
              onClick={handleExportDonations}
              disabled={filteredDonations.length === 0}
              sx={{ borderColor: '#089e8e', color: '#089e8e', '&:hover': { borderColor: '#067e71', backgroundColor: '#f0fffe' } }}
            >
              Export Donations
            </Button>
          </Stack>

          {/* Search and Filter Controls */}
          <Paper sx={{ p: 2, mb: 3, backgroundColor: '#f8f9fa', width: '100%' }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="stretch" sx={{ width: '100%' }}>
              <TextField
                placeholder="Search donations..."
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
                  <MenuItem value="all">All Donations</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                  <MenuItem value="anonymous">Anonymous</MenuItem>
                  <MenuItem value="named">Named</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Filter by Amount</InputLabel>
                <Select
                  value={filterAmount}
                  onChange={handleAmountFilterChange}
                  label="Filter by Amount"
                  startAdornment={<MoneyIcon sx={{ color: '#089e8e', mr: 1 }} />}
                >
                  <MenuItem value="all">All Amounts</MenuItem>
                  <MenuItem value="small">Small (&lt;$50)</MenuItem>
                  <MenuItem value="medium">Medium ($50-$199)</MenuItem>
                  <MenuItem value="large">Large ($200-$999)</MenuItem>
                  <MenuItem value="major">Major ($1000+)</MenuItem>
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
                  <MenuItem value="amount-desc">Amount (High to Low)</MenuItem>
                  <MenuItem value="amount-asc">Amount (Low to High)</MenuItem>
                  <MenuItem value="name-asc">Name (A-Z)</MenuItem>
                  <MenuItem value="name-desc">Name (Z-A)</MenuItem>
                  <MenuItem value="email-asc">Email (A-Z)</MenuItem>
                  <MenuItem value="email-desc">Email (Z-A)</MenuItem>
                  <MenuItem value="status-asc">Status (A-Z)</MenuItem>
                  <MenuItem value="status-desc">Status (Z-A)</MenuItem>
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
              Showing {filteredDonations.length} of {donations.length} donations
            </Typography>
          </Paper>

          {error && (
            <MuiAlert severity="error" sx={{ mb: 3 }}>{error}</MuiAlert>
          )}

          {filteredDonations.length > 0 ? (
            <Box sx={{ overflowX: 'auto', maxWidth: '100%', mb: 4 }}>
              <Table sx={{ minWidth: 1200, borderRadius: 2 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f1f1f1' }}>
                    <TableCell sx={{ verticalAlign: 'middle', width: 120 }}>
                      <TableSortLabel
                        active={sortBy === 'name'}
                        direction={sortBy === 'name' ? sortOrder : 'asc'}
                        onClick={() => handleSort('name')}
                        sx={{ fontWeight: 'bold' }}
                      >
                        Donor Name
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ verticalAlign: 'middle', width: 180 }}>
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
                      <TableSortLabel
                        active={sortBy === 'amount'}
                        direction={sortBy === 'amount' ? sortOrder : 'asc'}
                        onClick={() => handleSort('amount')}
                        sx={{ fontWeight: 'bold' }}
                      >
                        Amount
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
                    <TableCell sx={{ verticalAlign: 'middle', width: 120 }}>
                      <TableSortLabel
                        active={sortBy === 'status'}
                        direction={sortBy === 'status' ? sortOrder : 'asc'}
                        onClick={() => handleSort('status')}
                        sx={{ fontWeight: 'bold' }}
                      >
                        Status
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ verticalAlign: 'middle', width: 200 }}><b>Message</b></TableCell>
                    <TableCell sx={{ verticalAlign: 'middle', width: 200 }}><b>Transaction ID</b></TableCell>
                    <TableCell align="center" sx={{ verticalAlign: 'middle', width: 120 }}><b>Actions</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredDonations
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((donation, idx) => (
                      <TableRow key={donation._id} sx={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9f9f9' }}>
                        <TableCell sx={{ verticalAlign: 'middle', width: 120 }}>
                          {donation.anonymous ? (
                            <Chip label="Anonymous" size="small" color="secondary" />
                          ) : (
                            donation.name || 'N/A'
                          )}
                        </TableCell>
                        <TableCell sx={{ verticalAlign: 'middle', width: 180 }}>
                          {donation.anonymous ? (
                            <Chip label="Hidden" size="small" color="secondary" />
                          ) : (
                            donation.email || 'N/A'
                          )}
                        </TableCell>
                        <TableCell sx={{ verticalAlign: 'middle', width: 120 }}>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontWeight: 'bold',
                              color: getAmountColor(donation.amount)
                            }}
                          >
                            ${(donation.amount / 100).toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ verticalAlign: 'middle', width: 120 }}>
                          {new Date(donation.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </TableCell>
                        <TableCell sx={{ verticalAlign: 'middle', width: 120 }}>
                          <Chip 
                            label={donation.status || 'unknown'} 
                            size="small" 
                            color={getStatusColor(donation.status)}
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </TableCell>
                        <TableCell sx={{ verticalAlign: 'middle', width: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {donation.message || '-'}
                        </TableCell>
                        <TableCell sx={{ verticalAlign: 'middle', width: 200 }}>
                          <Typography sx={{ 
                            fontFamily: 'monospace',
                            fontSize: '0.8rem',
                            wordBreak: 'break-word'
                          }}>
                            {donation.paymentIntentId || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ verticalAlign: 'middle', width: 120 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <IconButton 
                              onClick={() => setDeleteDialog({ open: true, donationId: donation._id })} 
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
                count={filteredDonations.length}
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
                {donations.length === 0 ? 'No donations found' : 'No donations match your filters'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                {donations.length === 0 ? 'Donations will appear here once they are made' : 'Try adjusting your search or filter criteria'}
              </Typography>
              {donations.length > 0 && (
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

          <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, donationId: null })}>
            <DialogTitle>Delete Donation</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this donation record? This action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialog({ open: false, donationId: null })}>
                Cancel
              </Button>
              <Button onClick={handleDeleteDonation} color="error">
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

export default AdminDonationTable; 