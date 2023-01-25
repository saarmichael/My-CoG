import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BasicHeatMap } from './components/BasicHeatMap';
import BasicSpectogram from './components/BasicSpectogram';
import BasicNetGraph from './components/BasicNetGraph';
import path from 'path';
import Elec1 from "./ecog_data/elec1.json"


function App() {
  console.log(Elec1);
  return (
    <div className="App">
      <BasicSpectogram />
    </div>
  );
}

export default App;
