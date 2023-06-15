import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <>
    <h3>404 Page not found</h3>
    <Link to={'/'}>Back Home</Link>
  </>
);

export default NotFound;
