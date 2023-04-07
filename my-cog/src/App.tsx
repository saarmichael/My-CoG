import './App.css';
import Tabbing from './scenes/main/Tabs';
import { ElectrodeFocusProvider } from './contexts/ElectrodeFocusContext';
import DataContainer from './components/DataContainer';
import { menuItems, TopBar } from './scenes/main/TopBar';
import Sidebar from './components/SideBar';
import { VisGraphOptionsProvider } from './contexts/VisualGraphOptionsContext';

function App() {
  return (
    <div>
      <TopBar
        menuItems={menuItems}
      />
      <div className="app-container">
        <VisGraphOptionsProvider >
          <ElectrodeFocusProvider>
            <Sidebar />
            <Tabbing />
          </ElectrodeFocusProvider>
        </VisGraphOptionsProvider>
      </div>
    </div>
  );
}

export default App;
