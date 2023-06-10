import { BrowserRouter as Router, Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import './App.css';
import { GlobalDataContext, GlobalDataProvider, IGlobalDataContext } from './contexts/ElectrodeFocusContext';
import { VisGraphOptionsProvider } from './contexts/VisualGraphOptionsContext';
import Login from './scenes/start/Login';
import Register from './scenes/start/Register';
import Tabbing from './scenes/home/Tabs';
import { TopBar } from './scenes/home/TopBar';
import './scenes/start/StartPage.css';
import { useContext, useEffect } from 'react';
import { Backdrop, Box, CircularProgress } from '@material-ui/core';
import { useStyles } from './components/tools_components/Styles';

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
      <TopBar/>
      <div className="app-container"> 
            <Tabbing />
      </div>
  </div>
  );
}

function App() {
  return (
    <Router>
      <GlobalDataProvider>
        <VisGraphOptionsProvider>
          <Routes>
            <Route path="/" element={<MainPageWithBackdrop />} />
            <Route path="/home" element={<MainPage />} />
          </Routes>
        </VisGraphOptionsProvider>
      </GlobalDataProvider>
    </Router>
  );
}

const MainPageWithBackdrop: React.FC = () => {
  const classes = useStyles();
  const { loading } = useContext(GlobalDataContext) as IGlobalDataContext;
  return (
    <>
      <LoginPage />
      <Backdrop className={classes.backdrop} open={loading} style={{zIndex: '2'}}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default App;
