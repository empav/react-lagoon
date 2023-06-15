import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Transition from '../../../commons/TransitionDialog';

const PatientImportDialog = ({
  open,
  handleOpen,
  handleImport,
  file,
  handleFile
}) => {
  return (
    <Dialog
      maxWidth="md"
      open={open}
      onClose={handleOpen(false)}
      aria-labelledby="import-dialog"
      TransitionComponent={Transition}
    >
      <DialogTitle id="import-dialog">Importa pazienti</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Seleziona un file excel per importare i pazienti
        </DialogContentText>
        <TextField type="file" onChange={handleFile('file')} value={file} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOpen(false)} color="primary">
          Annulla
        </Button>
        <Button onClick={handleImport} color="primary">
          Importa
        </Button>
      </DialogActions>
    </Dialog>
  );
};

PatientImportDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleOpen: PropTypes.func.isRequired,
  handleImport: PropTypes.func.isRequired,
  file: PropTypes.string.isRequired,
  handleFile: PropTypes.func.isRequired
};

export default PatientImportDialog;
