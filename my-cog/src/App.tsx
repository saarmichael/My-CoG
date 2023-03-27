import './App.css';
import Tabbing from './scenes/main/Tabs';
import { ElectrodeFocusProvider } from './contexts/ElectrodeFocusContext';
import DataContainer from './components/DataContainer';
import { TopBar } from './scenes/main/TopBar';
import { handleEditClick, handleFileClick, handleViewClick, handleOptionsClick, handleLogoutClick } from './shared/TopBarUtil';

function App() {
  return (
    <div>
       <TopBar
        onFileClick={handleFileClick}
        onEditClick={handleEditClick}
        onViewClick={handleViewClick}
        onOptionsClick={handleOptionsClick}
        onLogoutClick={handleLogoutClick}
      />
      <ElectrodeFocusProvider>
        <Tabbing />
      </ElectrodeFocusProvider>
    </div>
  );
}

export default App;
