import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WorkoutSelector from './components/WorkoutSelector';
import Detector from './components/Detector';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <Router>
      <Routes>
        <Route path="/" element={<WorkoutSelector />} />
        <Route path="/detector" element={<Detector />} />
      </Routes>
    </Router>
  </ThemeProvider>
  );
}

export default App;
