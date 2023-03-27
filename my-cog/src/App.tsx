import './App.css';
import Tabbing from './scenes/main/Tabs';
import { ElectrodeFocusProvider } from './contexts/ElectrodeFocusContext';
import DataContainer from './components/DataContainer';
import { menuItems, TopBar } from './scenes/main/TopBar';

function App() {
  return (
    <div>
       <TopBar
        menuItems={menuItems}
      />
      <ElectrodeFocusProvider>
        <Tabbing />
      </ElectrodeFocusProvider>
    </div>
  );
}

export default App;
