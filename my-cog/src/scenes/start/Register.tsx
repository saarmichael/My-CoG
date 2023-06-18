import React, { useContext, useEffect, useState } from 'react';
import DirectoryPicker from '../../components/tools_components/DirectoryPicker';
import { GlobalDataContext, IGlobalDataContext } from '../../contexts/ElectrodeFocusContext';
import { IVisGraphOption, IVisGraphOptionsContext, IVisSettings, VisGraphOptionsContext } from '../../contexts/VisualGraphOptionsContext';
import { ServerSettings, apiGET, extractOptions, registerRequest } from '../../shared/ServerRequests';
import { loginConfig } from './Login';
import './StartPage.css';
import ModalPopup from '../../components/tools_components/ModalPopup';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import TreeView, { Node } from '../../components/tools_components/TreeView';


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
  const [dataDir, setDataDir] = useState<Node[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const { setChosenFile, setLoading } = useContext(GlobalDataContext) as IGlobalDataContext;

  const { settings, options}= useContext(VisGraphOptionsContext) as IVisGraphOptionsContext;
  

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    let organizedOptions = extractOptions(options);
    // add settings and options to a json object
    const reorganizedSettings: ServerSettings = {
      options: organizedOptions,
      settings: settings,
    };
    registerRequest(username, data as string, reorganizedSettings, onRegister).then(async (err) => {
      if (err === '') {
        await loginConfig(username, setLoading, onRegister, setChosenFile, setErrorMessage);
      }
      console.log(err)
      setErrorMessage(err as string)
      setLoading(false);
    });

  };
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    apiGET('getDataDir').then((res) => {
      let files = res as Node[];
      setDataDir(files);
    })
  }, []);
  const [counter, setCounter] = useState(0);
  const handleFolderClicked = (folder: string) => {
    setData(folder);
    // small trick to close modal
    setChosenFile('register' + counter);
    setCounter(counter + 1);
  }

  return (
    <form onSubmit={handleSubmit} className="form-container" style={{ marginTop: '2%' }}>
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
          <ModalPopup title={'Choose Your BIDS project (using a right click)'} buttonName={<FolderOpenIcon fontSize='small'/>} content={<TreeView treeData={dataDir} folderClicked={handleFolderClicked}/>} />
        </div>
        
        {data && <p className='upload message'>{data}</p>}
      </div>
      <button type="submit" className="submit-button">Register</button>
      {errorMessage && <p className="error message">{errorMessage}</p>}
    </form>
  );
};

export default Register;