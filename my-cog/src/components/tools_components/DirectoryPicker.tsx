import path from 'path';
import React, { ChangeEvent } from 'react';

declare module 'react' {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    // extends React's HTMLAttributes
    directory?: string;
    webkitdirectory?: string;
    mozdirectory?: string;
  }
}

interface DirectoryPickerProps {
  onChange: (directoryName: string) => void;
  buttonName: string;
}

const DirectoryPicker: React.FC<DirectoryPickerProps> = ({ onChange, buttonName }) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const directoryName = event.target.files[0].webkitRelativePath.split(path.sep)[0];
      onChange(directoryName);
    }
  };

  return (
    <div>
      <input
        type="file"
        id="directory"
        webkitdirectory=""
        directory=""
        onChange={handleChange}
        style={{ display: 'none' }} 
      />
      <label htmlFor="directory">
        {buttonName}
      </label>
    </div>
  );
};

export default DirectoryPicker;