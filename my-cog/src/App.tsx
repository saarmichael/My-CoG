import React from 'react';
import './App.css';
import { BasicHeatMap } from './components/BasicHeatMap';
import BasicSpectogram from './components/BasicSpectogram';
import BasicNetGraph from './components/BasicNetGraph';
import BasicG6Graph from './components/BasicG6Graph';
import MainGrid from './scenes/main/GridComponents';
import {Box, Box1} from './scenes/main/GridComponents';
import Tabs from './scenes/main/Tabs';

function App() {
  return (
    <div>
      <Tabs/>
    </div>
  );
}

export default App;
