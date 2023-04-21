import './App.css';
import Tabbing from './scenes/main/Tabs';
import { GlobalDataProvider } from './contexts/ElectrodeFocusContext';
import DataContainer from './components/DataContainer';
import { menuItems, TopBar } from './scenes/main/TopBar';
import Sidebar from './components/SideBar';
import { VisGraphOptionsProvider } from './contexts/VisualGraphOptionsContext';
import { simpleGetRequest, simplePostRequest } from './shared/ServerRequests';

function App() {
  simpleGetRequest()
  simplePostRequest()

  return (
    <div>
      <TopBar
        menuItems={menuItems}
      />
      <div className="app-container">
        <VisGraphOptionsProvider >
          <GlobalDataProvider>
            <Sidebar />
            <Tabbing />
          </GlobalDataProvider>
        </VisGraphOptionsProvider>
      </div>
    </div>
  );
}

export default App;
