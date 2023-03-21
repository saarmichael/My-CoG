import React from 'react';
import './App.css';
import { BasicHeatMap } from './components/BasicHeatMap';
import BasicSpectogram from './components/BasicSpectogram';
import BasicNetGraph from './components/BasicNetGraph';
import BasicG6Graph from './components/BasicG6Graph';
import MainGrid from './scenes/main/GridComponents';
import { Box, Box1 } from './scenes/main/GridComponents';
import Tabs from './scenes/main/Tabs';
import { ElectrodeFocusProvider } from './contexts/ElectrodeFocusContext';
import DataContainer from './components/DataContainer';

function App() {
  return (
    <div>
      <ElectrodeFocusProvider>
        <DataContainer />
      </ElectrodeFocusProvider>
    </div>
  );
}

export default App;
