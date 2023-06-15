import { useState, useEffect } from 'react';

const useSnackbarLocation = queryString => {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('error');

  useEffect(() => {
    // Get a message from url queryString and display a snackbar
    const params = new URLSearchParams(queryString);
    if (params.has('type') && params.has('message')) {
      // In case there's a message I show up a snackbar with it
      setMessage(params.get('message'));
      setMessageType(params.get('type'));
    }
  }, [queryString]);

  return [message, setMessage, messageType, setMessageType];
};

export default useSnackbarLocation;
