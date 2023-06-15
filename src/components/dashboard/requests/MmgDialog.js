import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListSubheader from '@material-ui/core/ListSubheader';
import Avatar from '@material-ui/core/Avatar';
import PharmacyIcon from '@material-ui/icons/LocalPharmacy';
import Transition from '../../commons/TransitionDialog';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import DrugZone from '../../commons/DrugZone';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const useStyles = makeStyles(theme => ({
  status: {
    width: '100%'
  },
  dialogAppBar: {
    position: 'relative'
  },
  dialogTitle: {
    marginLeft: theme.spacing(2),
    flex: 1
  },
  dialogForm: {
    padding: theme.spacing(3, 3)
  },
  dialogTextArea: {
    width: '100%',
    margin: 0
  },
  dialogHeading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  },
  panelSummary: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white
  },
  panelDetail: {
    display: 'flex',
    alignItems: 'center'
  },
  drugHeader: {
    padding: '0 0 15px 0',
    lineHeight: 'unset'
  },
  drugIcon: {
    width: '30px',
    height: '30px'
  },
  drugItem: {
    paddingTop: 0,
    paddingLeft: 0
  },
  drugZone: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
  },
  drugFileList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  drugFileListTitle: {
    margin: '5px 0',
    display: 'block',
    textAlign: 'right'
  },
  drugFileListItem: {
    display: 'flex',
    alignItems: 'center'
  },
  drugFileListItemIcon: {
    marginLeft: '15px',
    cursor: 'pointer'
  }
}));

const MmgDialog = ({
  requestStatuses,
  dialog: {
    selectedId,
    patientNote,
    patientDrugs,
    mmgNote,
    mmgCheck,
    patient,
    dialogStatus
  },
  handleChange,
  handleClose,
  files,
  setFiles
}) => {
  const classes = useStyles();

  return (
    <Dialog
      maxWidth="md"
      open={selectedId > 0}
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
            Richiesta di {patient}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleClose(true)}
          >
            Rispondi
          </Button>
        </Toolbar>
      </AppBar>
      <form className={classes.dialogForm} noValidate autoComplete="off">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label={`Note di ${patient}`}
              multiline
              rows="4"
              className={classes.dialogTextArea}
              disabled
              value={patientNote}
              margin="normal"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <List
              aria-labelledby="patientDrugs-subheader"
              subheader={
                <ListSubheader component="div" className={classes.drugHeader}>
                  Farmaci richiesti
                </ListSubheader>
              }
            >
              {patientDrugs.map((drug, index) => (
                <ListItem key={index} className={classes.drugItem}>
                  <ListItemAvatar>
                    <Avatar className={classes.drugIcon}>
                      <PharmacyIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={drug} />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControl className={classes.status}>
              <InputLabel htmlFor="status">Stato</InputLabel>
              <Select
                value={dialogStatus}
                onChange={handleChange('dialogStatus')}
                inputProps={{
                  name: 'status',
                  id: 'status'
                }}
              >
                {requestStatuses
                  .filter(status => status.id !== 3 && status.id !== 1)
                  .map(status => (
                    <MenuItem key={status.id} value={status.id}>
                      {status.description}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Note del medico"
              multiline
              rows="4"
              className={classes.dialogTextArea}
              onChange={handleChange('mmgNote')}
              value={mmgNote}
              margin="normal"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DrugZone files={files} setFiles={setFiles} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={mmgCheck}
                  onChange={handleChange('mmgCheck')}
                  value="mmgCheck"
                  color="primary"
                />
              }
              label="Farmaco su ricetta non demateriabilizzabile. Ricetta disponibile in segreteria."
            />
          </Grid>
        </Grid>
      </form>
    </Dialog>
  );
};

MmgDialog.propTypes = {
  dialog: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  requestStatuses: PropTypes.array.isRequired
};

export default MmgDialog;
