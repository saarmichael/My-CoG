import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import './App.css';
import Sidebar from './components/SideBar';
import { GlobalDataProvider } from './contexts/ElectrodeFocusContext';
import { VisGraphOptionsProvider } from './contexts/VisualGraphOptionsContext';
import Login from './scenes/global/Login';
import Register from './scenes/global/Register';
import Tabbing from './scenes/main/Tabs';
import { menuItems, TopBar } from './scenes/main/TopBar';
import './scenes/global/StartPage.css'

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log('logged in');
    navigate('/home');
  };
  
  return (
    <div className='full-form'>
      <Login onLogin={handleLogin} />
      <Register onRegister={handleLogin} />
    </div>
  );
}

function MainPage() {
  return (
    <div>
    <TopBar menuItems={menuItems} />
    <div className="app-container">
      <VisGraphOptionsProvider>
        <GlobalDataProvider>
          <Tabbing />
        </GlobalDataProvider>
      </VisGraphOptionsProvider>
    </div>
  </div>
  );
}

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<MainPage/>} />
      </Routes>
    </Router>
  );
};

export default App;
