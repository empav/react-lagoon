import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import CustomSnackbar from '../../commons/CustomSnackbar';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { updatePrincipal, changeEmailPrincipal } from '../../../backend';
import { withRouter } from 'react-router-dom';
import { isAfter5minutes } from '../../utils/DateUtils';
import { findPrincipalRedux } from '../../user/UserActions';
import { connect } from 'react-redux';

const useStyles = makeStyles(theme => ({
  form: {
    width: '30%',
    margin: '30px auto'
  },
  flexContainer: {
    display: 'flex',
    alignItems: 'flex-end'
  },
  emailBtn: {
    marginLeft: theme.spacing(2)
  },
  phoneBtn: {
    marginLeft: theme.spacing(2)
  },
  snackbarMessage: {
    marginBottom: theme.spacing(2)
  }
}));

const TabEmail = ({
  findPrincipalByUsername,
  user,
  location: { search },
  history
}) => {
  const classes = useStyles();

  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarVariant, setSnackbarVariant] = useState('error');

  const [emailHome, setEmailHome] = useState(user.emailHome || '');
  const [phoneHome, setPhoneHome] = useState(user.phoneHome || '');

  useEffect(() => {
    const updateEmailPrincipal = async principal => {
      try {
        // Callng backend to update principal email
        await updatePrincipal(principal);
        // Callng backend to refresh principal info after updating
        await findPrincipalByUsername(user.username);
        // Resetting UI field to the new email
        setEmailHome(principal.emailHome);
        // Showing success message
        handleSnackbar('Email cambiata.', 'success')();
      } catch (error) {
        console.error(error);
        handleSnackbar(
          error.userMessage ||
            'Errore server, rifare la procedura di cambio email'
        )();
      } finally {
        // Cleaning up url with the default profile url
        history.push(`/dashboard/profile/${user.id}`);
      }
    };
    // If there's a change email in progress I get 3 qs params and I need to update principal with the newer email
    const params = new URLSearchParams(search);
    if (params.has('email') && params.has('emailid') && params.has('ts')) {
      if (!isAfter5minutes(Number(params.get('ts')))) {
        // This is to give a 5mins duration, Calculating the 5minsAfter the current date then invalidating the user
        updateEmailPrincipal({ id: user.id, emailHome: params.get('email') });
      } else {
        handleSnackbar('Link scaduto, rifare la procedura di cambio email')();
      }
    }
  }, [findPrincipalByUsername, history, search, user.id, user.username]);

  const handleChange = email => e => {
    if (email) {
      setEmailHome(e.target.value);
    } else {
      setPhoneHome(e.target.value);
    }
  };

  const handlePhone = async () => {
    if (phoneHome !== user.phoneHome) {
      try {
        await updatePrincipal({ id: user.id, phoneHome });
        handleSnackbar('Telefono aggiornato', 'success')();
      } catch (error) {
        console.error(error);
        handleSnackbar(
          error.userMessage || 'Servizio non disponibile, riprova più tardi'
        )();
      }
    }
  };

  const handleEmail = async () => {
    if (emailHome !== user.emailHome) {
      try {
        await changeEmailPrincipal(user.id, emailHome);
        handleSnackbar(
          'Conferma cliccando su email che ti abbiamo inviato.',
          'success'
        )();
      } catch (error) {
        console.error(error);
        handleSnackbar(
          error.userMessage || 'Servizio non disponibile, riprova più tardi'
        )();
      }
    }
  };

  const handleSnackbar = (snackbarMessage, snackbarVariant = 'error') => () => {
    setSnackbarMessage(snackbarMessage);
    setSnackbarVariant(snackbarVariant);
  };

  return (
    <form
      noValidate
      autoComplete="off"
      onSubmit={() => {}}
      className={classes.form}
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
        <Grid item xs={12} sm={12} className={classes.flexContainer}>
          <TextField
            required
            id="email"
            name="email"
            label="Email"
            type="email"
            fullWidth
            value={emailHome || ''}
            onChange={handleChange(true)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleEmail}
            className={classes.emailBtn}
          >
            {user.emailHome ? 'Cambia' : 'Aggiungi'}
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} className={classes.flexContainer}>
          <TextField
            required
            id="phoneHome"
            name="phoneHome"
            label="Telefono"
            fullWidth
            value={phoneHome || ''}
            onChange={handleChange(false)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handlePhone}
            className={classes.phoneBtn}
          >
            {user.phoneHome ? 'Cambia' : 'Aggiungi'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

TabEmail.propTypes = {
  user: PropTypes.object.isRequired
};

const mapDispatchToProps = dispatch => {
  return {
    findPrincipalByUsername: username => dispatch(findPrincipalRedux(username))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(withRouter(TabEmail));
