/* eslint-disable require-atomic-updates */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import App from './components/App';
import axios from 'axios';
import { toast } from 'react-toastify';
import { showSpinner, hideSpinner } from './components/utils/DOMUtils';
import 'react-toastify/dist/ReactToastify.css';
import './index.scss';

//Time ago plugin
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

// TOAST
toast.configure({
  autoClose: 5000,
  hideProgressBar: true
});

// Add a request interceptor
axios.interceptors.request.use(config => {
  // SPINNER shows up
  showSpinner();
  // Get token from localStorage
  const token = localStorage.getItem('token');
  if (token && !config.url.includes('/login')) {
    // Store token in axios config
    config.headers.Authorization = token;
  }
  return config;
});

// Add a response interceptor
axios.interceptors.response.use(
  response => {
    // SPINNER hides
    hideSpinner();
    return response;
  },
  error => {
    // SPINNER hides
    hideSpinner();
    // Redirect to login for the following codes
    const codes = [401, 403, 405];
    if (error.response && codes.includes(error.response.status)) {
      // Clear localStorage and redirect to login
      localStorage.clear();
      // If I'm not already in login page
      if (!error.config.url.includes('/rest/login'))
        window.location.pathname = '/login';
    }
    return Promise.reject(error);
  }
);

// Init and getting backend configuration
(async () => {
  try {
    const res = await axios.get(`${process.env.PUBLIC_URL}/config.json`);
    // AXIOS CONFIG
    axios.defaults.baseURL = res.data.baseURL;
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    axios.defaults.timeout = 5000;
    // RENDER APP
    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      document.getElementById('root')
    );
  } catch (error) {
    console.error(error);
    ReactDOM.render(
      <h1>Can't find backend configuration!!</h1>,
      document.getElementById('root')
    );
  }
})();
