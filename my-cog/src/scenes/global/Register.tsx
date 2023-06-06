import React, { useState, useContext } from 'react';
import { ServerSettings, extractOptions, registerRequest } from '../../shared/ServerRequests';
import './StartPage.css';
import { IVisGraphOption, IVisGraphOptionsContext, IVisSettings, VisGraphOptionsContext } from '../../contexts/VisualGraphOptionsContext';
import DirectoryPicker from './DirectoryPicker';


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
    registerRequest(username, data.split('\\').pop() as string, reorganizedSettings, onRegister).then((err) => {
      console.log(err)
      setErrorMessage(err as string)
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
        <div className='file-upload-button'>
          <DirectoryPicker onChange={setData} buttonName="📁" />
        </div>
        
        {data && <p className='upload message'>{data.split('\\').pop()}</p>}
      </div>
      <button type="submit" className="submit-button">Register</button>
      {errorMessage && <p className="error message">{errorMessage}</p>}
    </form>
  );
};

export default Register;