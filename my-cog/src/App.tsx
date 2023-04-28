import { useState } from 'react';
import './App.css';
import Sidebar from './components/SideBar';
import { GlobalDataProvider } from './contexts/ElectrodeFocusContext';
import { VisGraphOptionsProvider } from './contexts/VisualGraphOptionsContext';
import Login from './scenes/global/Login';
import Register from './scenes/global/Register';
import Tabbing from './scenes/main/Tabs';
import { menuItems, TopBar } from './scenes/main/TopBar';

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
