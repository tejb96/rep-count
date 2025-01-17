import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WorkoutSelector from './pages/WorkoutSelector';
import Detector from './pages/Detector';

import CssBaseline from '@mui/material/CssBaseline';
import Navbar from "./components/Navbar";
import HomePage from "./pages/Home";



function App() {
  return (
    <Router>
      <Navbar>
        <Routes>
          <Route path="/workouts" element={<WorkoutSelector />} />
          <Route path="/detector" element={<Detector />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Navbar>
    </Router>

  );
}

export default App;
