import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BasicHeatMap } from './components/BasicHeatMap';
import BasicSpectogram from './components/BasicSpectogram';
import BasicNetGraph from './components/BasicNetGraph';

function App() {
  return (
    <div className="App">
      <BasicNetGraph />
    </div>
  );
}

export default App;
