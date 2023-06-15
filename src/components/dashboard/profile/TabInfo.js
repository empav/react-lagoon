import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  form: {
    width: '40%',
    margin: '30px auto'
  }
}));

const TabInfo = ({ user }) => {
  const classes = useStyles();
  return (
    <form
      noValidate
      autoComplete="off"
      onSubmit={() => {}}
      className={classes.form}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            id="username"
            name="username"
            label="Utente"
            fullWidth
            value={user.username}
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="fiscalCode"
            name="fiscalCode"
            label="Codice Fiscale"
            fullWidth
            value={user.fiscalCode || ''}
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="surname"
            name="surname"
            label="Cognome"
            fullWidth
            value={user.surname || ''}
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="name"
            name="name"
            label="Nome"
            fullWidth
            value={user.name || ''}
            disabled
          />
        </Grid>
      </Grid>
    </form>
  );
};

TabInfo.propTypes = {
  user: PropTypes.object.isRequired
};

export default TabInfo;
