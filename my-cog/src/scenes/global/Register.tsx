import React, { useState } from 'react';
import { registerRequest } from '../../shared/ServerRequests';
import './StartPage.css';


interface RegisterProps {
  onRegister: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [data, setData] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    registerRequest(username, data, onRegister);

  };
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="input-field">
        <label>
          Username
        </label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className="input-field">
        <label htmlFor="upload" className="file-upload-label">
          Data
        </label>
        <input
          type="file"
          id="upload"
          ref={fileInputRef}
          className="file-upload-input"
          onChange={(e) => setData(e.target.value)}
          style={{ display: 'none' }}
        />
        <button type="button" className="file-upload-button" onClick={handleFileButtonClick}>
          📁
        </button>
      </div>
      <button type="submit" className="submit-button">Register</button>
    </form>
  );
};

export default Register;
