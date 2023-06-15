import React, { useState, useEffect, useCallback } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router-dom';
import CustomSnackbar from '../commons/CustomSnackbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import BuiltBy from '../commons/BuiltBy';
import { isAfter5minutes } from '../utils/DateUtils';
import { invalidatePrincipal, changeForgotPassword } from '../../backend';

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
    fontSize: '1rem'
  },
  snackbarMessage: {
    width: '100%',
    marginTop: theme.spacing(3)
  }
}));

const ConfirmPwd = ({ history, location: { search } }) => {
  const classes = useStyles();

  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarVariant, setSnackbarVariant] = useState('error');

  const handleSnackbar = useCallback(
    (snackbarMessage, snackbarVariant = 'error') => () => {
      setSnackbarMessage(snackbarMessage);
      setSnackbarVariant(snackbarVariant);
    },
    [setSnackbarMessage, setSnackbarVariant]
  );

  useEffect(() => {
    const invalidate = async id => {
      // Calling backend to deactivate the user after clicking the email link
      try {
        await invalidatePrincipal(id);
        setEmailId(id);
        handleSnackbar('Conferma la tua password', 'warning')();
      } catch (error) {
        console.error(error);
        history.push('/');
      }
    };

    // Get a message from url queryString and display a snackbar
    const params = new URLSearchParams(search);
    if (params.has('id') && params.has('ts')) {
      if (!isAfter5minutes(Number(params.get('ts')))) {
        // This is to give a 5mins duration, Calculating the 5minsAfter the current date then invalidating the user
        invalidate(params.get('id'));
      } else {
        // Link expired, current date is greather than 5mins from the link creation
        history.push('/');
      }
    } else {
      history.push('/');
    }
  }, [search, handleSnackbar, history]);

  const handlePassword = newPwd => e => {
    if (newPwd) {
      setNewPassword(e.target.value);
    } else {
      setPassword(e.target.value);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (password === newPassword) {
      try {
        await changeForgotPassword(emailId, password);
        history.push(
          '/login?message=La password è stata cambiata.&type=success'
        );
      } catch (error) {
        console.error(error);
        handleSnackbar(
          error.userMessage || 'Servizio non disponibile, riprova più tardi'
        )();
        setPassword('');
        setNewPassword('');
      }
    } else {
      handleSnackbar(
        'Le password non corrispondono. Reinserire la password.'
      )();
      setPassword('');
      setNewPassword('');
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
            Conferma la tua password
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
              type="password"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="password"
              label="Nuova Password"
              name="password"
              autoComplete="password"
              autoFocus
              onChange={handlePassword(false)}
              value={password}
            />
            <TextField
              type="password"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="newPassword"
              label="Confirma Password"
              name="newPassword"
              autoComplete="newPassword"
              onChange={handlePassword(true)}
              value={newPassword}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Conferma
            </Button>
            <Grid container>
              <Link className={classes.link} to="/">
                {'Torna alla Home'}
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

export default withRouter(ConfirmPwd);
