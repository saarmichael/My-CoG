import './App.css';
import Tabbing from './scenes/main/Tabs';
import { ElectrodeFocusProvider } from './contexts/ElectrodeFocusContext';
import { menuItems, TopBar } from './scenes/main/TopBar';
import Sidebar from './components/SideBar';
import { VisGraphOptionsProvider } from './contexts/VisualGraphOptionsContext';
import { useState } from 'react';
import Login from './scenes/global/Login';
import Register from './scenes/global/Register';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div>
      <div>
      {loggedIn ? (
        <p>You are logged in!</p>
      ) : (
        <>
          <Login onLogin={() => setLoggedIn(true)} />
          <Register onRegister={() => setLoggedIn(true)} />
        </>
      )}
    </div>
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
