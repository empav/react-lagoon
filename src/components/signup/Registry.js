import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { getRegistry } from '../../backend';
import Toast from '../../errors/Toast';
import { DatePicker } from '@material-ui/pickers';
import { DATE_FORMAT } from '../configs';

const useStyles = makeStyles(theme => ({
  title: {
    margin: '30px 0 5px 0'
  },
  textSecondary: {
    marginBottom: theme.spacing(2)
  }
}));

const Registry = ({
  handleBack,
  setPersonalData,
  handleInputChange,
  personalData,
  personalData: {
    username,
    password,
    passwordConfirm,
    emailHome,
    name,
    surname,
    birthDate,
    fiscalCode,
    mmg
  }
}) => {
  const classes = useStyles();

  useEffect(() => {
    const fetchRegistry = async data => {
      try {
        const res = await getRegistry(data);
        Array.isArray(res) && setPersonalData({ ...personalData, ...res[0] });
      } catch (error) {
        console.error(error);
        Toast.error(error.userMessage || "Non riesco a recuperare l'utente");
        handleBack();
      }
    };
    if (!personalData.fiscalCode) fetchRegistry(personalData);
  }, [handleBack, personalData, setPersonalData]);

  return (
    <>
      <Typography variant="h6">Credenziali</Typography>
      <Typography
        variant="body2"
        color="textSecondary"
        component="p"
        className={classes.textSecondary}
      >
        Si prega di annotarsi utente e password per completare il processo di
        registrazione
      </Typography>
      <form noValidate autoComplete="off" onSubmit={() => {}}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="username"
              name="username"
              label="Utente"
              fullWidth
              value={username}
              onChange={handleInputChange('username')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="email"
              name="email"
              label="Email"
              type="email"
              fullWidth
              value={emailHome || ''}
              onChange={handleInputChange('emailHome')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="password"
              required
              id="password"
              name="password"
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={handleInputChange('password')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="passwordConfirm"
              required
              id="passwordConfirm"
              name="passwordConfirm"
              label="Confirm"
              type="password"
              fullWidth
              value={passwordConfirm}
              onChange={handleInputChange('passwordConfirm')}
            />
          </Grid>
        </Grid>
        <Typography variant="h6" className={classes.title}>
          Anagrafica
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              disabled
              required
              id="name"
              name="name"
              label="Nome"
              fullWidth
              value={name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              disabled
              required
              id="surname"
              name="surname"
              label="Cognome"
              fullWidth
              value={surname}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              disabled
              required
              id="birthDate"
              label="Data di nascita"
              format={DATE_FORMAT}
              value={birthDate}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              disabled
              required
              id="fiscalCode"
              name="fiscalCode"
              label="Codice Fiscale"
              fullWidth
              value={fiscalCode}
            />
          </Grid>
        </Grid>
        <Typography variant="h6" className={classes.title}>
          Medico
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              disabled
              id="mmg.name"
              name="mmg.name"
              label="Nome"
              fullWidth
              value={mmg.name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              disabled
              id="mmg.surname"
              name="mmg.surname"
              label="Surname"
              fullWidth
              value={mmg.surname}
            />
          </Grid>
        </Grid>
      </form>
    </>
  );
};

Registry.propTypes = {
  setPersonalData: PropTypes.func.isRequired,
  personalData: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired
};

export default Registry;
