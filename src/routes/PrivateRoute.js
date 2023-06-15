import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, credentials, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      (credentials && credentials.username) ||
      localStorage.getItem('credentials') ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

export default PrivateRoute;
