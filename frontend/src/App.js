import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WorkoutSelector from './components/WorkoutSelector';
import Detector from './components/Detector';

function App() {
  return (
  <Router>
    <Routes>
      <Route path="/" element={<WorkoutSelector />} />
      <Route path="/detector" element={<Detector />} />
    </Routes>
  </Router>
  );
}

export default App;
