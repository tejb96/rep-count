import React, {useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WorkoutSelector from './pages/WorkoutSelector';
import Detector from './pages/Detector';
import Navbar from "./components/Navbar";
import HomePage from "./pages/Home";
import Login from "./pages/Login";
import {useDispatch} from "react-redux";
import {logInUserWithOauth} from "./store/authSlice";
import SaveApp from "./pages/SaveApp";
import Profile from "./pages/Profile";
import PrivateRoute from "./hoc/PrivateRoute";



function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check authentication state on app load
    dispatch(logInUserWithOauth());
  }, [dispatch]);

  return (
    <Router>
      <Navbar>
        <Routes>
          <Route path="/workouts" element={<WorkoutSelector />} />
          <Route path="/detector" element={<Detector />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/downloadApp" element={<SaveApp />} ></Route>

          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

        </Routes>
      </Navbar>
    </Router>

  );
}

export default App;
