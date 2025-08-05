import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Box,
  Paper,
  MenuItem
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const EventForm = ({ open, event, onClose, onSave }) => {
  // Generate 12-hour time options
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 1; hour <= 12; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const hourStr = hour.toString();
        const minuteStr = minute.toString().padStart(2, '0');
        times.push(`${hourStr}:${minuteStr} AM`);
        times.push(`${hourStr}:${minuteStr} PM`);
      }
    }
    return times;
  };
  
  const timeOptions = generateTimeOptions();
  const [formData, setFormData] = useState({
    date: '',
    title: '',
    startTime: '',
    endTime: '',
    place: '', // was 'location'
    desc: '',
    actionType: '', // was 'action'
    capacity: '',
    cost: '',
    ticketCost: '', // New field for ticket cost
    highlights: '',
    specialGift: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (event) {
      let highlightsArr = [''];
      if (Array.isArray(event.highlights)) {
        highlightsArr = event.highlights;
      } else if (typeof event.highlights === 'string') {
        try {
          highlightsArr = JSON.parse(event.highlights);
          if (!Array.isArray(highlightsArr)) highlightsArr = [event.highlights];
        } catch {
          highlightsArr = event.highlights.split(',').map(h => h.trim()).filter(Boolean);
        }
      }
      // Parse existing time format (e.g., "5:00 PM - 8:00 PM" or "12:00 AM to 06:00 AM")
      let startTime = '';
      let endTime = '';
      if (event.time) {
        const timeStr = event.time;
        const separators = [' - ', ' to ', '-', 'to'];
        let splitTime = null;
        
        for (const sep of separators) {
          if (timeStr.includes(sep)) {
            splitTime = timeStr.split(sep).map(t => t.trim());
            break;
          }
        }
        
        if (splitTime && splitTime.length === 2) {
          startTime = splitTime[0];
          endTime = splitTime[1];
        } else {
          startTime = timeStr; // fallback to original time if can't parse
        }
      }
      
      setFormData({
        date: event.date ? dayjs(event.date) : null,
        title: event.title || '',
        startTime: startTime,
        endTime: endTime,
        place: event.place || '', // was 'location'
        desc: event.desc || '',
        actionType: event.actionType || '', // was 'action'
        capacity: event.capacity || '',
        cost: event.cost || '',
        ticketCost: event.cost && event.cost !== 'Free' ? event.cost.replace(/[^0-9.]/g, '') : '', // Extract number from cost string
        highlights: highlightsArr.length ? highlightsArr : [''],
        specialGift: event.specialGift || ''
      });
    } else {
      setFormData({
        date: null,
        title: '',
        startTime: '',
        endTime: '',
        place: '', // was 'location'
        desc: '',
        actionType: '', // was 'action'
        capacity: '',
        cost: 'Free', // Default to Free
        ticketCost: '', // Initialize ticketCost
        highlights: [''],
        specialGift: ''
      });
    }
    setError('');
  }, [event, open]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name.startsWith('highlight-')) {
      const idx = parseInt(name.split('-')[1], 10);
      const newHighlights = [...formData.highlights];
      newHighlights[idx] = value;
      setFormData({ ...formData, highlights: newHighlights });
    } else {
      setFormData({
        ...formData,
        [name]: name === 'free' ? checked : value
      });
    }
  };

  const handleDateChange = (newDate) => {
    setFormData({ ...formData, date: newDate });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validate form data
    if (!formData.title || !formData.date || !formData.startTime || !formData.place || !formData.desc || !formData.actionType || !formData.cost) {
      setError('Please fill in all required fields including Event Type');
      setLoading(false);
      return;
    }
    
    // Validate ticket cost for paid events
    if (formData.cost === 'Paid' && (!formData.ticketCost || formData.ticketCost <= 0)) {
      setError('Please enter a valid ticket cost for paid events');
      setLoading(false);
      return;
    }
    
    try {
      const token = localStorage.getItem('adminToken');
      const url = event 
        ? `https://relevant-recovery-back-end.onrender.com/api/events/${event._id}`
        : 'https://relevant-recovery-back-end.onrender.com/api/events';
      
      // Prepare request body
      const requestBody = {
        date: formData.date ? formData.date.format('MMMM DD, YYYY') : '',
        title: formData.title,
        time: formData.endTime 
          ? `${formData.startTime} - ${formData.endTime}` 
          : formData.startTime,
        place: formData.place,
        capacity: formData.capacity,
        desc: formData.desc,
        highlights: JSON.stringify(formData.highlights.filter(h => h && h.trim() !== '')),
        specialGift: formData.specialGift,
        actionType: formData.actionType
      };
      
      // Handle cost field based on event type
      if (formData.cost === 'Free') {
        requestBody.cost = 'Free';
      } else if (formData.cost === 'Paid' && formData.ticketCost) {
        requestBody.cost = `$${formData.ticketCost}`;
      } else if (formData.cost === 'Paid' && !formData.ticketCost) {
        throw new Error('Ticket cost is required for paid events');
      } else {
        // Fallback to ensure cost is always set
        requestBody.cost = formData.cost || 'Free';
      }
      
      const response = await fetch(url, {
        method: event ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save event');
      }
      onSave(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHighlight = () => {
    setFormData({ ...formData, highlights: [...formData.highlights, ''] });
  };
  const handleRemoveHighlight = (idx) => {
    const newHighlights = formData.highlights.filter((_, i) => i !== idx);
    setFormData({ ...formData, highlights: newHighlights });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 0,
          bgcolor: 'transparent',
        }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: '#089e8e', 
        color: '#fff',
        fontWeight: 700,
        textAlign: 'center',
        py: 2,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12
      }}>
        {event ? 'Edit Event' : 'Create New Event'}
      </DialogTitle>
      <DialogContent sx={{ p: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', bgcolor: 'transparent', py: { xs: 2, md: 3 } }}>
          <Paper
            elevation={2}
            sx={{
              p: { xs: 2, md: 4 },
              borderRadius: 4,
              width: '100%',
              maxWidth: 500,
              mx: 'auto',
              boxShadow: 2
            }}
          >
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box component="form" onSubmit={handleSubmit} sx={{ width: '90%' }}>
                <Grid container spacing={2}>
                {/* Event Title */}
                <Grid item xs={12} sx={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    label="Event Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="medium"
                    margin="dense"
                  />
                </Grid>
                {/* Date & Time */}
                <Grid item xs={12} md={6} sx={{ width: '100%' }}>
                  <DatePicker
                    label="Date"
                    value={formData.date}
                    onChange={handleDateChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        variant: "outlined",
                        size: "medium",
                        margin: "dense"
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6} sx={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    select
                    label="Start Time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="medium"
                    margin="dense"
                    SelectProps={{
                      native: false,
                      MenuProps: {
                        PaperProps: {
                          sx: {
                            maxHeight: 200,
                            mt: 1,
                            '& .MuiMenuItem-root': {
                              justifyContent: 'center',
                              textAlign: 'center'
                            }
                          }
                        }
                      }
                    }}
                  >
                    <MenuItem value="">Select Start Time</MenuItem>
                    {timeOptions.map((time) => (
                      <MenuItem key={time} value={time}>
                        {time}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6} sx={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    select
                    label="End Time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="medium"
                    margin="dense"
                    SelectProps={{
                      native: false,
                      MenuProps: {
                        PaperProps: {
                          sx: {
                            maxHeight: 200,
                            mt: 1,
                            '& .MuiMenuItem-root': {
                              justifyContent: 'center',
                              textAlign: 'center'
                            }
                          }
                        }
                      }
                    }}
                  >
                    <MenuItem value="">Select End Time</MenuItem>
                    {timeOptions.map((time) => (
                      <MenuItem key={time} value={time}>
                        {time}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                {/* Place */}
                <Grid item xs={12} sx={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    label="Event Place"
                    name="place"
                    value={formData.place}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    placeholder="e.g., Wayzata Community Church"
                    size="medium"
                    margin="dense"
                  />
                </Grid>
                {/* Cost Dropdown */}
                <Grid item xs={12} md={6} sx={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    select
                    label="Event Type"
                    name="cost"
                    value={formData.cost}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="medium"
                    margin="dense"
                    helperText="Select whether this is a free or paid event"
                    SelectProps={{
                      native: false,
                      MenuProps: {
                        PaperProps: {
                          sx: {
                            maxHeight: 200,
                            mt: 1,
                            '& .MuiMenuItem-root': {
                              justifyContent: 'center',
                              textAlign: 'center'
                            }
                          }
                        }
                      }
                    }}
                    sx={{
                      '& .MuiFormHelperText-root': {
                        fontSize: '12px',
                        color: 'text.secondary'
                      }
                    }}
                  >
                    <MenuItem value="">Select Event Type</MenuItem>
                    <MenuItem value="Free">Free Event</MenuItem>
                    <MenuItem value="Paid">Paid Event</MenuItem>
                  </TextField>
                </Grid>
                {/* Ticket Cost (only for Paid events) */}
                {formData.cost === 'Paid' && (
                  <Grid item xs={12} md={6} sx={{ width: '100%' }}>
                    <TextField
                      fullWidth
                      label="Ticket Cost"
                      name="ticketCost"
                      value={formData.ticketCost}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      size="medium"
                      margin="dense"
                      type="number"
                      placeholder="e.g., 25"
                      helperText="Enter the ticket price in dollars"
                      InputProps={{
                        startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>$</Box>,
                      }}
                      sx={{
                        '& .MuiFormHelperText-root': {
                          fontSize: '12px',
                          color: 'text.secondary'
                        }
                      }}
                    />
                  </Grid>
                )}
                {/* Capacity */}
                <Grid item xs={12} md={6} sx={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    label="Capacity"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="e.g., 150"
                    size="medium"
                    margin="dense"
                    type="number"
                  />
                </Grid>
                {/* Description */}
                <Grid item xs={12} sx={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="desc"
                    value={formData.desc}
                    onChange={handleChange}
                    required
                    multiline
                    minRows={5}
                    maxRows={10}
                    variant="outlined"
                    placeholder="Describe the event details..."
                    size="medium"
                    margin="dense"
                  />
                </Grid>

                {/* Highlights as bullet points */}
                <Grid item xs={12} sx={{ width: '100%' }}>
                  <Box>
                    <label style={{ fontWeight: 600, marginBottom: 4, display: 'block' }}>Event Highlights</label>
                    {(() => {
                      let highlightsArr = formData.highlights;
                      if (!Array.isArray(highlightsArr)) {
                        if (typeof highlightsArr === 'string') {
                          try {
                            highlightsArr = JSON.parse(highlightsArr);
                            if (!Array.isArray(highlightsArr)) highlightsArr = [highlightsArr];
                          } catch {
                            highlightsArr = highlightsArr.split(',').map(h => h.trim()).filter(Boolean);
                          }
                        } else if (highlightsArr == null) {
                          highlightsArr = [''];
                        } else {
                          highlightsArr = [String(highlightsArr)];
                        }
                      }
                      return highlightsArr.map((h, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <TextField
                            fullWidth
                            name={`highlight-${idx}`}
                            value={h}
                            onChange={handleChange}
                            variant="outlined"
                            placeholder={`Highlight #${idx + 1}`}
                            size="small"
                            margin="dense"
                          />
                          <Button onClick={() => handleRemoveHighlight(idx)} sx={{ ml: 1, minWidth: 32, color: 'red' }} disabled={highlightsArr.length === 1}>-</Button>
                        </Box>
                      ));
                    })()}
                    <Button onClick={handleAddHighlight} sx={{ mt: 1, minWidth: 32 }}>+ Add Highlight</Button>
                  </Box>
                </Grid>
                {/* Special Gift */}
                <Grid item xs={12} sx={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    label="Special Gift (optional)"
                    name="specialGift"
                    value={formData.specialGift}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="e.g., Free ticket to Twins game"
                    size="medium"
                    margin="dense"
                  />
                </Grid>
                {/* Action Type Dropdown */}
                <Grid item xs={12} sx={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    select
                    label="Action Type"
                    name="actionType"
                    value={formData.actionType}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="medium"
                    margin="dense"
                    SelectProps={{
                      native: false,
                      MenuProps: {
                        PaperProps: {
                          sx: {
                            maxHeight: 200,
                            mt: 1,
                            '& .MuiMenuItem-root': {
                              justifyContent: 'center',
                              textAlign: 'center'
                            }
                          }
                        }
                      }
                    }}>
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="Register Now" disabled={formData.cost === 'Paid'}>Register Now</MenuItem>
                      <MenuItem value="Book Ticket" disabled={formData.cost === 'Free'}>Book Ticket</MenuItem>
                    </TextField>
                </Grid>
              </Grid>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mt: 3 }}>
                  <Button 
                    onClick={onClose} 
                    sx={{ color: '#666', minWidth: 110 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                    sx={{
                      backgroundColor: '#089e8e',
                      '&:hover': { backgroundColor: '#067e71' },
                      minWidth: 140
                    }}
                  >
                    {loading ? <CircularProgress size={20} color="inherit" /> : (event ? 'Update Event' : 'Create Event')}
                  </Button>
                </Box>
              </Box>
            </LocalizationProvider>
          </Paper>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EventForm; 