import { useState } from 'react';
import './App.css';
import Sidebar from './components/SideBar';
import { GlobalDataProvider } from './contexts/ElectrodeFocusContext';
import { VisGraphOptionsProvider } from './contexts/VisualGraphOptionsContext';
import Login from './scenes/global/Login';
import Register from './scenes/global/Register';
import Tabbing from './scenes/main/Tabs';
import { menuItems, TopBar } from './scenes/main/TopBar';
import './scenes/global/StartPage.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    console.log('logged in');
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return (
      <div className='full-form' >
        <Login onLogin={handleLogin} />
        <Register onRegister={handleLogin} />
      </div>
    );
  }

  return (
    <div>
      <TopBar menuItems={menuItems} />
      <div className="app-container">
        <VisGraphOptionsProvider>
          <GlobalDataProvider>
            <Sidebar />
            <Tabbing />
          </GlobalDataProvider>
        </VisGraphOptionsProvider>
      </div>
    </div>
  );
};


export default App;
