import { Backdrop, CircularProgress } from '@material-ui/core';
import { useContext } from 'react';
import { Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import { useStyles } from './components/tools_components/Styles';
import { GlobalDataContext, GlobalDataProvider, IGlobalDataContext } from './contexts/ElectrodeFocusContext';
import { VisGraphOptionsProvider } from './contexts/VisualGraphOptionsContext';
import Tabbing from './scenes/home/Tabs';
import { TopBar } from './scenes/home/TopBar';
import Login from './scenes/start/Login';
import Register from './scenes/start/Register';
import './scenes/start/StartPage.css';

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log('logged in');
    navigate('/home');
  };

  return (
    <div className='full-form'>
      <h1 className='head'>Welcome to My CoG!</h1>
      <Login onLogin={handleLogin} />
      <Register onRegister={handleLogin} />
    </div>
  );
}

function MainPage() {
  return (
    <div>
      <TopBar />
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
      <Backdrop className={classes.backdrop} open={loading} style={{ zIndex: '2' }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default App;
