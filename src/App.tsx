import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Owners from './pages/Owners';
import PGs from './pages/PGs';
import Rooms from './pages/Rooms';
import Guests from './pages/Guests';
import Wardens from './pages/Wardens';
import Workers from './pages/Workers';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/owners" element={<Owners />} />
            <Route path="/pgs" element={<PGs />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/guests" element={<Guests />} />
            <Route path="/wardens" element={<Wardens />} />
            <Route path="/workers" element={<Workers />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;