import React, { useState } from 'react';
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
import { forgotPassword } from '../../backend';

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

const ForgotPwd = ({ location: { search } }) => {
  const classes = useStyles();

  const [username, setUsername] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarVariant, setSnackbarVariant] = useState('error');

  const handleUsername = e => {
    setUsername(e.target.value);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (username) {
      try {
        await forgotPassword(username);
        handleSnackbar('Email inviata', 'success')();
      } catch (error) {
        console.error(error);
        handleSnackbar(
          error.userMessage || 'Servizio non disponibile, riprova più tardi'
        )();
      } finally {
        setUsername('');
      }
    }
  };

  const handleSnackbar = (snackbarMessage, snackbarVariant = 'error') => () => {
    setSnackbarMessage(snackbarMessage);
    setSnackbarVariant(snackbarVariant);
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
            Dimenticata la password
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
              id="email"
              label="Utente"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={handleUsername}
              value={username}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Mandami la password
            </Button>
            <Grid container>
              <Link className={classes.link} to="/login">
                {'Entra col mio account'}
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

export default withRouter(ForgotPwd);
