import React, { useState, useEffect, useCallback } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CustomSnackbar from '../commons/CustomSnackbar';
import Auth from './Auth';
import BuiltBy from '../commons/BuiltBy';
import useSnackbarLocation from '../commons/hooks/useSnackbarLocation';
import { confirmPrincipalSubscription } from '../../backend';
import { isAfter5minutes } from '../utils/DateUtils';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh'
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  link: {
    marginTop: theme.spacing(1),
    color: theme.palette.primary.main,
    fontSize: '1rem',
    fontWeight: 500
  },
  snackbarMessage: {
    width: '100%',
    marginTop: theme.spacing(3)
  }
}));

const initialState = {
  username: '',
  password: ''
};

const Login = ({ history, location: { search } }) => {
  const classes = useStyles();

  const [state, setState] = useState(initialState);

  const [
    snackbarMessage,
    setSnackbarMessage,
    snackbarVariant,
    setSnackbarVariant
  ] = useSnackbarLocation(search);

  const handleSnackbar = useCallback(
    (snackbarMessage, snackbarVariant = 'error') => () => {
      setSnackbarMessage(snackbarMessage);
      setSnackbarVariant(snackbarVariant);
    },
    [setSnackbarMessage, setSnackbarVariant]
  );

  useEffect(() => {
    const confirmSubscription = async id => {
      // Calling backend to activate the user after registration
      try {
        await confirmPrincipalSubscription(params.get('id'));
        handleSnackbar(
          'Registrazione completata, ora è possibile effettuare il log in',
          'success'
        )();
      } catch (error) {
        console.error(error);
        handleSnackbar(
          'Registrazione fallita, chiamare call center',
          'error'
        )();
      }
    };

    // Get a message from url queryString and display a snackbar
    const params = new URLSearchParams(search);
    if (params.has('id') && params.has('ts')) {
      if (!isAfter5minutes(Number(params.get('ts')))) {
        // This is to give a 5mins duration, Calculating the 5minsAfter the current date
        confirmSubscription(params.get('id'));
      } else {
        // Link expired, current date is greather than 5mins from the link creation
        history.push('/');
      }
    }
  }, [search, handleSnackbar, history]);

  const handleInput = (e, field) => {
    setState({ ...state, [field]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const { username, password } = state;

    if (username && password) {
      try {
        const credentials = await Auth.login({ username, password });
        handleLogin(credentials);
      } catch (error) {
        setState(initialState);
        handleSnackbar(
          error.userMessage || 'Servizio non disponibile, riprova più tardi'
        )();
      }
    }
  };

  const handleLogin = credentials => {
    if (credentials) {
      localStorage.setItem('credentials', JSON.stringify(credentials));
      history.push('/dashboard');
    }
  };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Entra
          </Typography>
          {snackbarMessage && (
            <CustomSnackbar
              onClose={handleSnackbar('')}
              variant={snackbarVariant}
              className={classes.snackbarMessage}
              message={snackbarMessage}
            />
          )}
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Utente"
              name="username"
              autoComplete="username"
              autoFocus
              onChange={e => handleInput(e, 'username')}
              value={state.username}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={e => handleInput(e, 'password')}
              value={state.password}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Entra
            </Button>
            <Grid container>
              <Link className={classes.link} to="/forgot">
                {'Dimenticata la password?'}
              </Link>
            </Grid>
            <Grid container>
              <Link className={classes.link} to="/signup">
                {'Non hai un account? Registrati'}
              </Link>
            </Grid>
            <Box mt={5}>
              <BuiltBy />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
};

export default withRouter(Login);
