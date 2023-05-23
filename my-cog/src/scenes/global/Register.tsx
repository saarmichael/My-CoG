import React, { useState, useContext } from 'react';
import { ServerSettings, extractOptions, registerRequest } from '../../shared/ServerRequests';
import './StartPage.css';
import { IVisGraphOption, IVisGraphOptionsContext, IVisSettings, VisGraphOptionsContext } from '../../contexts/VisualGraphOptionsContext';


interface RegisterProps {
  onRegister: () => void;
}

export interface VisualPreferences {
  options: IVisGraphOption[];
  settings: IVisSettings;
}

const Register: React.FC<RegisterProps> = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [data, setData] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { settings, options}= useContext(VisGraphOptionsContext) as IVisGraphOptionsContext;
  

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let organizedOptions = extractOptions(options);
    // add settings and options to a json object
    const reorganizedSettings: ServerSettings = {
      options: organizedOptions,
      settings: settings,
    };
    registerRequest(username, data, reorganizedSettings, onRegister).then((err) => {
      console.log(err)
      setErrorMessage(err)
    });

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
        {data && <p className='upload message'>{data.split('\\').pop()}</p>}
      </div>
      <button type="submit" className="submit-button">Register</button>
      {errorMessage && <p className="error message">{errorMessage}</p>}
    </form>
  );
};

export default Register;