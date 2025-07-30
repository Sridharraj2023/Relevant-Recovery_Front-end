import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, TextField, Select, MenuItem, FormControl, InputLabel, Paper, Grid, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, AppBar, Toolbar, Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Snackbar, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const groupTypes = [
  {
    type: 'contribution',
    label: 'Contribution',
    groups: [
      { value: 'Friend', label: 'Friend' },
      { value: 'Supporter', label: 'Supporter' },
      { value: 'Sustainer', label: 'Sustainer' }
    ]
  },
  {
    type: 'membership',
    label: 'Membership',
    groups: [
      { value: 'Family Membership', label: 'Family Membership' },
      { value: 'Organizational Membership', label: 'Organizational Membership' }
    ]
  },
  {
    type: 'sponsorship',
    label: 'Sponsorship',
    groups: [
      { value: 'Class/Workshop Sponsorship', label: 'Class/Workshop Sponsorship' },
      { value: 'Program Sponsorship', label: 'Program Sponsorship' },
      { value: 'Special Events Sponsorship', label: 'Special Events Sponsorship' }
    ]
  }
];





const drawerWidth = 240;

export default function AdminDonation() {
  const [options, setOptions] = useState([]);
  const [form, setForm] = useState({ group: '', label: '', amount: '', type: '', order: 0, active: true });
  const [editingId, setEditingId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchOptions = async () => {
  try {
    const res = await axios.get('https://relevant-recovery-back-end.onrender.com/api/donation-options');
    setOptions(res.data);
  } catch (err) {
    setSnackbar({ open: true, message: 'Failed to fetch donation options', severity: 'error' });
  }
};

  useEffect(() => { fetchOptions(); }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
  e.preventDefault();
  try {
    if (editingId) {
      await axios.put('https://relevant-recovery-back-end.onrender.com/api/donation-options/' + editingId, form);
      setSnackbar({ open: true, message: 'Donation option updated successfully!', severity: 'success' });
    } else {
      await axios.post('https://relevant-recovery-back-end.onrender.com/api/donation-options', form);
      setSnackbar({ open: true, message: 'Donation option created successfully!', severity: 'success' });
    }
    setForm({ group: '', label: '', amount: '', type: '', order: 0, active: true });
    setEditingId(null);
    fetchOptions();
  } catch (err) {
    setSnackbar({ open: true, message: 'Failed to save donation option', severity: 'error' });
  }
};

  const handleEdit = option => {
    setForm({ ...option });
    setEditingId(option._id);
  };

  const handleDelete = async id => {
  try {
    await axios.delete('https://relevant-recovery-back-end.onrender.com/api/donation-options/' + id);
    setSnackbar({ open: true, message: 'Donation option deleted successfully!', severity: 'success' });
    fetchOptions();
  } catch {
    setSnackbar({ open: true, message: 'Failed to delete option', severity: 'error' });
  }
};

  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

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
              <EventIcon sx={{ color: '#089e8e' }} />
            </ListItemIcon>
            <ListItemText primary="Manage Donations" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

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
          <IconButton color="inherit" onClick={() => {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            navigate('/admin');
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </IconButton>
        </Toolbar>
      </AppBar>
      {/* Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            background: '#f8fafc',
            borderRight: '1px solid #e0e0e0',
          },
        }}
        open
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, background: '#f8fafc' },
        }}
      >
        {drawer}
      </Drawer>
      {/* Main Content */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Box component="main" sx={{
        flexGrow: 1,
        p: 3,
        width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        mt: 8,
        minHeight: '100vh',
        background: '#f9fafb',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch'
      }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#181f29', mb: 3 }}>Manage Donation Options</Typography>
        <Paper sx={{ p: 2, mb: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3} sx={{ minWidth: 220 }}>
                <FormControl fullWidth required>
                  <InputLabel>Type</InputLabel>
                  <Select name="type" value={form.type} onChange={handleChange} label="Type">
                    {groupTypes.map(g => <MenuItem key={g.type} value={g.type}>{g.label}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3} sx={{ minWidth: 220 }}>
                <FormControl fullWidth required>
                  <InputLabel>Group</InputLabel>
                  <Select
                    name="group"
                    value={form.group}
                    onChange={handleChange}
                    label="Group"
                    disabled={!form.type}
                  >
                    {groupTypes.find(g => g.type === form.type)?.groups.map(group => (
                      <MenuItem key={group.value} value={group.value}>{group.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3} sx={{ minWidth: 220 }}>
                <FormControl fullWidth required>
                  <InputLabel>Label</InputLabel>
                  <Select
                    name="label"
                    value={form.label}
                    onChange={handleChange}
                    label="Label"
                    disabled={!form.group}
                  >
                    {/* For Memberships and Sponsorships, label is same as group; for Contributions, label is also group */}
                    {form.type && form.group && (
                      <MenuItem value={form.group}>{form.group}</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2} sx={{ minWidth: 160 }}>
                <TextField label="Amount" name="amount" type="number" value={form.amount} onChange={handleChange} required fullWidth />
              </Grid>
              <Grid item xs={12} sm={1} sx={{ minWidth: 120 }}>
                <TextField label="Order" name="order" type="number" value={form.order} onChange={handleChange} fullWidth />
              </Grid>
              <Grid item xs={12} sm={1}>
                <Button type="submit" variant="contained" color="primary">
                  {editingId ? 'Update' : 'Add'}
                </Button>
                {editingId && (
                  <Button sx={{ ml: 2 }} onClick={() => { setEditingId(null); setForm({ group: '', label: '', amount: '', type: '', order: 0, active: true }); }}>
                    Cancel
                  </Button>
                )}
              </Grid>
            </Grid>
          </form>
        </Paper>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
  <TableRow sx={{ backgroundColor: '#f1f1f1' }}>
    <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
    <TableCell sx={{ fontWeight: 'bold' }}>Group</TableCell>
    <TableCell sx={{ fontWeight: 'bold' }}>Label</TableCell>
    <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
    <TableCell sx={{ fontWeight: 'bold' }}>Order</TableCell>
    <TableCell sx={{ fontWeight: 'bold' }}>Active</TableCell>
    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
  </TableRow>
</TableHead>
            <TableBody>
              {(Array.isArray(options) ? options : []).map(option => (
                <TableRow key={option._id}>
                  <TableCell>{option.type}</TableCell>
                  <TableCell>{option.group}</TableCell>
                  <TableCell>{option.label}</TableCell>
                  <TableCell>${option.amount}</TableCell>
                  <TableCell>{option.order}</TableCell>
                  <TableCell>{option.active ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(option)}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(option._id)} color="error"><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
