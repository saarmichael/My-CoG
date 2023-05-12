import React, { useState } from 'react';
import { loginRequest } from '../../shared/ServerRequests';
import './StartPage.css';

type LoginProps = {
  onLogin: () => void;
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await loginRequest(username, onLogin).then((data) => {
      console.log(data)
      setErrorMessage(data)
    });
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
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </form>
  );
};
export default Login;

