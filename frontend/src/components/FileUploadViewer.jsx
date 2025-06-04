 import React, {useRef, useEffect} from 'react';

export const FileUploadViewer = ({ formikAdd, value, setFileHandling, resetErrors, accept,setFileRef }) => {

  const files_data = useRef();

  useEffect(() => {
    setFileRef(files_data);
  }, [setFileRef]);

  return (
    <div>
      <input
        type="file"
        name={value.client_name}
        onChange={(e) => setFileHandling(value, e)}
        onBlur={(e) => resetErrors(value, e)}
        ref={files_data}
        accept={accept} 
        className="file-input relative top-4"      />
    </div>
  );
};
