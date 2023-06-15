import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import DrugZone from '../../../../commons/DrugZone';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex'
  },
  mmgNote: {
    width: '100%',
    margin: 0
  }
}));

const SendDialogNotes = ({
  data: {
    mmgNote,
    patients: [selectedPatient]
  },
  handleChange,
  files,
  setFiles
}) => {
  const classes = useStyles();

  return (
    <Grid container spacing={3} className={classes.container}>
      <Grid item xs={12} sm={12}>
        <Typography component="span" variant="body2" color="textPrimary">
          {`Stai inviando una notifica a ${selectedPatient.surname} ${
            selectedPatient.name
          }:`}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Note del medico"
          multiline
          rows="5"
          onChange={handleChange('mmgNote')}
          value={mmgNote}
          margin="normal"
          variant="outlined"
          className={classes.mmgNote}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <DrugZone files={files} setFiles={setFiles} />
      </Grid>
    </Grid>
  );
};

SendDialogNotes.propTypes = {
  data: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default SendDialogNotes;
