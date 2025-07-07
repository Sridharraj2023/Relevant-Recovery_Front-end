import React from 'react';
import { CssBaseline, Container } from '@mui/material';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';

function App() {
  return (
    <>
      <CssBaseline />
      <Navbar />
      <Container maxWidth="xl" disableGutters>
        <Home />
      </Container>
      <Footer />
    </>
  );
}

export default App;
