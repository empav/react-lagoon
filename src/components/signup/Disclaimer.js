import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const useStyles = makeStyles(theme => ({
  textField: {
    width: '100%'
  },
  switchLabel: {
    fontSize: '0.9rem'
  }
}));

const Disclaimer = ({ disclaimer, onChange }) => {
  const classes = useStyles();

  const handleSwitchChange = name => event => {
    onChange(name, event.target.checked);
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Liberatoria
      </Typography>
      <Grid container>
        <Grid item sm={12}>
          <TextField
            id="outlined-multiline-static"
            label="Liberatoria"
            multiline
            rows="4"
            defaultValue={
              'Gentile assistita/o, i dati anagrafici che lei introdurrà, verranno confrontati con una lista di dati anagrafici fornita dal suo medico di famiglia. Tale lista non comprende alcun dato che riguarda il suo stato di salute ma solo informazioni desumibili dal codice fiscale.'
            }
            className={classes.textField}
            margin="normal"
            variant="outlined"
          />
          <FormControlLabel
            classes={{ label: classes.switchLabel }}
            control={
              <Switch
                checked={disclaimer}
                onChange={handleSwitchChange('disclaimer')}
                color="primary"
              />
            }
            label="Autorizzo e dichiaro la presa visione dello stesso"
          />
        </Grid>
      </Grid>
    </>
  );
};

Disclaimer.propTypes = {
  onChange: PropTypes.func.isRequired
};

export default Disclaimer;
