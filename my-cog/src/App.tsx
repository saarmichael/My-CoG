import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BasicHeatMap } from './components/BasicHeatMap';
import BasicSpectogram from './components/BasicSpectogram';

function App() {
  return (
    <div className="App">
      <BasicSpectogram />
    </div>
  );
}

export default App;
