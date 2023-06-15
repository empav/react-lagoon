import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import LagoonAppBar from './commons/appbar/AppBar';
import Container from '@material-ui/core/Container';
import { connect } from 'react-redux';
import { selectUser } from '../user/UserSelectors';
import { withRouter, Route, Switch } from 'react-router-dom';

import Drugs from './requests/Drugs';
import Main from './main/Main';
import Privacy from './privacy/Privacy';
import Profile from './profile/Profile';
import Notices from './notices/Notices';

import {
  updatePrincipalFromStorageRedux,
  logoutRedux,
  findNoticesRedux
} from '../user/UserActions';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto'
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '100%',
    overflow: 'auto',
    [theme.breakpoints.up('xs')]: {
      height: 'calc(100vh - 56px)',
      margin: 0,
      padding: 0
    },
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100vh - 128px)',
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(4)
    }
  }
}));

const Dashboard = ({
  history,
  match,
  user,
  updatePrincipalFromStorage,
  logoutRedux,
  findNotices
}) => {
  const classes = useStyles();

  useEffect(() => {
    if (!user.username) {
      // Refreshing dashboard...If the user is not in redux yet, I'll try to read from storage
      let credentials = localStorage.getItem('credentials');
      if (credentials) {
        // Storing user into redux
        credentials = JSON.parse(credentials);
        updatePrincipalFromStorage(credentials);
      } else {
        // Redirecting to login
        history.push('/login');
      }
    }
  }, [updatePrincipalFromStorage, user.username, history]);

  const findNoticesCB = useCallback(() => findNotices(user.id), [
    findNotices,
    user.id
  ]);

  useEffect(() => {
    // Get notices for the user
    if (user.id) findNoticesCB();
  }, [findNoticesCB, user.id]);

  const logout = () => {
    localStorage.removeItem('credentials');
    logoutRedux();
    history.push('/login');
  };

  return user && user.username ? (
    <div className={classes.root}>
      <CssBaseline />
      <LagoonAppBar user={user} logout={logout} />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container className={classes.container} id="container">
          <Switch>
            <Route exact path={match.url} component={Main} />

            <Route
              exact
              path={`${match.url}/drugs`}
              render={() => {
                return <Drugs user={user} />;
              }}
            />

            <Route exact path={`${match.url}/privacy`} component={Privacy} />

            <Route
              exact
              path={[`${match.url}/notices`, `${match.url}/notices/:id`]}
              render={() => {
                return <Notices user={user} findNotices={findNoticesCB} />;
              }}
            />

            <Route
              exact
              path={`${match.url}/Profile/:id`}
              component={Profile}
            />
          </Switch>
        </Container>
      </main>
    </div>
  ) : (
    false
  );
};

Dashboard.propTypes = {
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    user: selectUser(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updatePrincipalFromStorage: credentials =>
      dispatch(updatePrincipalFromStorageRedux(credentials)),
    logoutRedux: () => dispatch(logoutRedux()),
    findNotices: userId => dispatch(findNoticesRedux(userId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Dashboard));
