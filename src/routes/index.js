import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import NotFound from './NotFound';

const Home = lazy(() => import('../components/Home'));
const About = lazy(() => import('../components/About'));
const Login = lazy(() => import('../components/login/Login'));
const Signup = lazy(() => import('../components/signup/Signup'));
const ForgotPwd = lazy(() => import('../components/forgotpwd/ForgotPwd'));
const ConfirmPwd = lazy(() => import('../components/confirmpwd/ConfirmPwd'));
const Dashboard = lazy(() => import('../components/dashboard/Dashboard'));

const getRoutes = ({ user: credentials }) => {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/about" component={About} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/forgot" component={ForgotPwd} />
          <Route exact path="/confirm" component={ConfirmPwd} />
          <Route exact path="/signup" component={Signup} />
          <PrivateRoute
            path="/dashboard"
            component={Dashboard}
            credentials={credentials}
          />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
};

export default getRoutes;
