import React from "react";
import { useSelector } from 'react-redux';
import SitUpTracker from "../workouts/SitUps/SitUpTracker"
import DeadliftTracker from "../workouts/conventionalDeadlifts/DeadliftTracker.js"
import PushUpsTracker from "../workouts/pushups/PushupsTracker.js"

const Tracker = ({isModelOn}) => {
  const { selectedWorkoutName } = useSelector(state => state.workout);

  if (!isModelOn) {
    return null;
  }
  
  const trackerComponents = {
    'Sit Ups': SitUpTracker,
    'Conventional Deadlift': DeadliftTracker,
    'Push Ups': PushUpsTracker
  };

  const SelectedTracker = trackerComponents[selectedWorkoutName] || null;

  return SelectedTracker ? <SelectedTracker /> : null;
};

export default Tracker;