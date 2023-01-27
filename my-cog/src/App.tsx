import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BasicHeatMap } from './components/BasicHeatMap';
import BasicSpectogram from './components/BasicSpectogram';
import BasicNetGraph from './components/BasicNetGraph';
import MainGrid from './scenes/main/GridComponents';

function App() {
  return (
    <div className="App">
      
      <MainGrid />
    </div>
  );
}

export default App;
