import React from 'react';
import { useDropzone } from 'react-dropzone';

type MyDropzoneProps = {
  dropFunc: (file: string) => void;
  message: string;
};

const MyDropzone: React.FC<MyDropzoneProps> = ({ dropFunc, message }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => {
      let name = acceptedFiles[0].name as string;
      dropFunc(name);
    }
});

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>{message}</p>
    </div>
  );
}

export default MyDropzone;