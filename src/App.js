import React from 'react';
import { CssBaseline, Container } from '@mui/material';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Services from './components/Services';
import Contact from './components/Contact';
import Events from './components/Events';
import Admin from './components/Admin';
import DonationPage from './components/DonationPage';
import AdminEventTable from './components/AdminEventTable';
import AdminDonation from './components/AdminDonation';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <CssBaseline />
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/adminevent" element={<AdminEventTable />} />
        <Route path="/admindonation" element={<AdminDonation />} />
        <Route path="/*" element={
          <>
            <Navbar />
            <Container maxWidth="xl" disableGutters>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/donation" element={<DonationPage open={true} onClose={null} />} />
                <Route path="/events" element={<Events />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </Container>
            <Footer />
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
