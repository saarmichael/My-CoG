import { BrowserRouter as Router, Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import './App.css';
import { GlobalDataProvider } from './contexts/ElectrodeFocusContext';
import { VisGraphOptionsProvider } from './contexts/VisualGraphOptionsContext';
import Login from './scenes/global/Login';
import Register from './scenes/global/Register';
import Tabbing from './scenes/main/Tabs';
import { TopBar } from './scenes/main/TopBar';
import './scenes/global/StartPage.css';

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
    <GlobalDataProvider>
      <TopBar/>
      <div className="app-container">
        
          
            <Tabbing />
          
        
      </div>
    </GlobalDataProvider>
  </div>
  );
}

function App() {

  return (
    <Router>
      <VisGraphOptionsProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<MainPage/>} />
        </Routes>
      </VisGraphOptionsProvider>
    </Router>
  );
};

export default App;
