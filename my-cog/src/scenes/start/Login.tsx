import React, { useContext, useState } from 'react';
import { GlobalDataContext, IGlobalDataContext } from '../../contexts/ElectrodeFocusContext';
import { loginRequest } from '../../shared/ServerRequests';
import './StartPage.css';

type LoginProps = {
  onLogin: () => void;
};

export const loginConfig = async (username: string, setLoading:React.Dispatch<boolean>,
  onLogin: () => void, setChosenFile:React.Dispatch<string>,
  setErrorMessage:React.Dispatch<string>) => {
    setLoading(true);
    
    await loginRequest(username, onLogin).then((data) => {
      setChosenFile(data);
      console.log(data);
      setErrorMessage(data);
    })
    .finally(() => {
        setLoading(false);
    });
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { setChosenFile, setLoading } = useContext(GlobalDataContext) as IGlobalDataContext;

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      setLoading(true);
      event.preventDefault();
      
      loginConfig(username, setLoading, onLogin, setChosenFile, setErrorMessage);
    };
    

    return (
      <form onSubmit={handleSubmit} className="form-container">
        <div className="input-field">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <button type="submit" className="submit-button">Login</button>
        {errorMessage && <p className="error message">{errorMessage}</p>}
      </form>
    );
};
export default Login;

