import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import BusinessIcon from '@material-ui/icons/Business';
import DeleteIcon from '@material-ui/icons/Delete';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import { FormGroup } from '@material-ui/core';
import { insertRequest } from '../../../backend';
import Toast from '../../../errors/Toast';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Transition from '../../commons/TransitionDialog';

const useStyles = makeStyles(theme => ({
  dialogAppBar: {
    position: 'relative'
  },
  dialogTitle: {
    marginLeft: theme.spacing(2),
    flex: 1
  },
  patientForm: {
    padding: theme.spacing(3, 3)
  },
  patientDrugInput: {
    marginBottom: 0,
    minWidth: '12rem'
  },
  patientAddBtn: {
    marginLeft: theme.spacing(2),
    alignSelf: 'flex-end'
  },
  note: {
    width: '100%',
    margin: 0
  },
  grid: {
    marginTop: theme.spacing(5)
  }
}));

const PatientDialog = ({
  user,
  user: {
    mmg: {
      mmgAttributes: { allowPatientRequestNote, patientRequestNoteLength }
    }
  },
  handleClose,
  open,
  fullScreen
}) => {
  const classes = useStyles();

  const drugRef = useRef(null);

  const initialPatientState = {
    input: '',
    listItems: [],
    note: '',
    radio: 'toEmail'
  };

  const [patient, setPatient] = React.useState(initialPatientState);

  const handleChange = name => event => {
    if (
      name === 'note' &&
      event.target.value.length > patientRequestNoteLength
    ) {
      // Limit the number of chars on Patient Note
      return;
    }
    setPatient({ ...patient, [name]: event.target.value });
  };

  const handleCreate = async event => {
    event.preventDefault();

    const payload = [patient].map(form => {
      return {
        applicant: {
          id: user.id
        },
        receiver: {
          id: user.mmg.id
        },
        createdOn: Date.now(),
        status: '1',
        type: '1',
        body: `${patient.input ? patient.input : ''}${
          patient.input && form.listItems.length ? ',' : ''
        }${form.listItems.length ? form.listItems.toString() : ''}`,
        applicantNote: form.note,
        digitalProcess: form.radio === 'toEmail'
      };
    })[0];

    try {
      const res = await insertRequest(payload);
      Toast.success(res.userMessage || 'Request stored successfully');
      handleClose()(true);
    } catch (error) {
      console.error(error);
      Toast.error(error.userMessage || 'Non riesco ad inserire la richiesta');
      handleClose()();
    }
  };

  const handleAdd = event => {
    event.preventDefault();

    if (patient.input) {
      const listItems = [...patient.listItems];
      listItems.push(patient.input);
      setPatient({ ...patient, listItems, input: '' });
    }

    drugRef.current.focus();
  };

  const handleDelete = (event, index) => {
    event.preventDefault();
    const listItems = [...patient.listItems];
    listItems.splice(index, 1);
    setPatient({ ...patient, listItems });
  };

  return (
    <Dialog
      maxWidth={!fullScreen ? 'md' : undefined}
      fullScreen={fullScreen}
      open={open}
      TransitionComponent={Transition}
      onClose={handleClose()}
    >
      <AppBar className={classes.dialogAppBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose()}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.dialogTitle}>
            Richiesta Farmaci
          </Typography>
          <Button variant="contained" color="secondary" onClick={handleCreate}>
            Invia
          </Button>
        </Toolbar>
      </AppBar>
      <form
        className={classes.patientForm}
        noValidate
        autoComplete="off"
        onSubmit={() => {}}
      >
        <Grid item xs={12}>
          <FormGroup row xs={12}>
            <TextField
              required
              label="Farmaco"
              value={patient.input}
              onChange={handleChange('input')}
              className={classes.patientDrugInput}
              margin="normal"
              inputRef={drugRef}
              autoFocus
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAdd}
              className={classes.patientAddBtn}
            >
              Aggiungi
            </Button>
          </FormGroup>
        </Grid>

        {patient.listItems.length ? (
          <Grid item xs={12} sm={4} className={classes.grid}>
            <List>
              {patient.listItems.map((item, idx) => {
                return (
                  <ListItem key={idx}>
                    <ListItemAvatar>
                      <Avatar>
                        <BusinessIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={item} />
                    <ListItemSecondaryAction>
                      <IconButton
                        onClick={e => handleDelete(e, idx)}
                        edge="end"
                        aria-label="Delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          </Grid>
        ) : (
          false
        )}

        {allowPatientRequestNote && (
          <Grid item xs={12} className={classes.grid}>
            <TextField
              label={`Nota del paziente (Caratteri rimanenti: ${patientRequestNoteLength -
                patient.note.length})`}
              multiline
              rows="4"
              value={patient.note}
              onChange={handleChange('note')}
              className={classes.note}
              variant="outlined"
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <FormControl>
            <RadioGroup
              aria-label="position"
              name="position"
              value={patient.radio}
              onChange={handleChange('radio')}
              row
            >
              <FormControlLabel
                value="toEmail"
                control={<Radio color="primary" />}
                label="Ecofarmacia o invio telematico"
                labelPlacement="end"
              />
              <FormControlLabel
                value="toPrint"
                control={<Radio color="primary" />}
                label="Da stampare (consegna in segreteria)"
                labelPlacement="end"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
      </form>
    </Dialog>
  );
};

PatientDialog.propTypes = {
  user: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default PatientDialog;
