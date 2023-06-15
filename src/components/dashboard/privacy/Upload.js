import React, { useEffect } from 'react';

const Upload = ({ handleImage }) => {
  useEffect(() => {
    window.addEventListener('message', handleImage);
    return () => {
      window.removeEventListener('message', handleImage);
    };
  }, [handleImage]);

  return (
    <iframe
      style={{ width: '100%', height: '500px', overflow: 'auto' }}
      title="Capture"
      src={`${process.env.PUBLIC_URL}/wacom/SigCaptX-Capture.html`}
    />
  );
};

export default Upload;
