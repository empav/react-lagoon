import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { DATE_FORMAT } from '../configs';

const PersonalData = ({
  handleInputChange,
  personalData: { name, surname, birthDate }
}) => {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Dati Personali
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="name"
            name="name"
            label="Nome"
            fullWidth
            value={name}
            onChange={handleInputChange('name')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="surname"
            name="surname"
            label="Cognome"
            fullWidth
            value={surname}
            onChange={handleInputChange('surname')}
          />
        </Grid>
        <Grid item xs={12}>
          <KeyboardDatePicker
            required
            clearable
            id="birthDate"
            label="Data di nascita"
            format={DATE_FORMAT}
            value={birthDate}
            onChange={handleInputChange('birthDate')}
          />
        </Grid>
      </Grid>
    </>
  );
};

PersonalData.propTypes = {
  personalData: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired
};

export default PersonalData;
