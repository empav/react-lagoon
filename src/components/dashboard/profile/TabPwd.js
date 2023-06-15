import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { resetPasswordPrincipal } from '../../../backend';
import CustomSnackbar from '../../commons/CustomSnackbar';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  form: {
    width: '30%',
    margin: '30px auto'
  },
  snackbarMessage: {
    marginBottom: theme.spacing(2)
  }
}));

const TabPwd = ({ user, history }) => {
  const classes = useStyles();

  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarVariant, setSnackbarVariant] = useState('error');

  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSnackbar = (snackbarMessage, snackbarVariant = 'error') => () => {
    setSnackbarMessage(snackbarMessage);
    setSnackbarVariant(snackbarVariant);
  };

  const handleChange = password => e => {
    if (password) {
      setPassword(e.target.value);
    } else {
      setNewPassword(e.target.value);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (password === newPassword) {
      try {
        await resetPasswordPrincipal(user.id, password);
        history.push('/login?message=Password reimpostata.&type=success');
      } catch (error) {
        console.error(error);
        handleSnackbar('Servizio non disponibile, riprovare più tardi')();
        setPassword('');
        setNewPassword('');
      }
    } else {
      handleSnackbar('Le password non corrispondono')();
      setPassword('');
      setNewPassword('');
    }
  };

  return (
    <form
      noValidate
      autoComplete="off"
      className={classes.form}
      onSubmit={handleSubmit}
    >
      {snackbarMessage && (
        <CustomSnackbar
          onClose={handleSnackbar('')}
          variant={snackbarVariant}
          className={classes.snackbarMessage}
          message={snackbarMessage}
        />
      )}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <TextField
            required
            autoFocus
            autoComplete="password"
            id="password"
            name="password"
            label="Nuova Password"
            type="password"
            fullWidth
            value={password}
            onChange={handleChange(true)}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            required
            autoComplete="newPassword"
            id="newPassword"
            name="newPassword"
            label="Conferma Password"
            type="password"
            fullWidth
            value={newPassword}
            onChange={handleChange(false)}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <Button variant="contained" color="primary" type="submit">
            Cambia Password
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

TabPwd.propTypes = {
  user: PropTypes.object.isRequired
};

export default withRouter(TabPwd);
