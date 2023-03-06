import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BasicHeatMap } from './components/BasicHeatMap';
import BasicSpectogram from './components/BasicSpectogram';
import BasicNetGraph from './components/BasicNetGraph';
import BasicG6Graph from './components/BasicG6Graph';
import MainGrid from './scenes/main/GridComponents';

function App() {
  return (
    <div className="App">
      
      <BasicG6Graph />
    </div>
  );
}

export default App;
