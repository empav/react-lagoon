import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Transition from '../../../../commons/TransitionDialog';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import Toast from '../../../../../errors/Toast';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import { makeStyles } from '@material-ui/core/styles';
import SendDialogPatients from './SendDialogPatients';
import SendDialogNotes from './SendDialogNotes';
import { findPrincipalByFullName, insertNotice } from '../../../../../backend';
import dayjs from 'dayjs';
import { toBase64 } from '../../../../utils/FileUtils';

const useStyles = makeStyles(theme => ({
  paper: {
    minWidth: '35%'
  },
  dialogContent: {
    padding: theme.spacing(3)
  },
  stepper: {
    backgroundColor: 'transparent',
    padding: theme.spacing(0, 0, 3, 0)
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(4)
  },
  button: {
    marginLeft: theme.spacing(3)
  }
}));

const steps = ['Ricerca Paziente', 'Invia la notifica'];

const initialPagination = {
  limit: 10,
  offset: 0,
  total: 10
};

const initialData = {
  patients: [],
  searchTerm: '',
  mmgNote: ''
};

const SendDialog = ({ userId, open, handleOpen }) => {
  const classes = useStyles();
  // Stepper active step
  const [activeStep, setActiveStep] = useState(0);
  // Patients to show up in the table, search patient field and mmg note
  const [data, setData] = useState(initialData);
  // Table pagination
  const [pagination, setPagination] = useState(initialPagination);
  // Selected Table Rows
  const [selected, setSelected] = useState([]);
  // Attachments in step 2
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const findPrincipal = async fullname => {
      const patients = await findPrincipalByFullName(
        fullname,
        pagination.limit,
        pagination.offset
      );
      if (patients && patients.items) {
        setPagination(pagination => ({
          ...pagination,
          total: patients.total
        }));
        setData(data => ({
          ...data,
          patients: patients.items
        }));
      }
    };
    if (data.searchTerm.length > 2) findPrincipal(data.searchTerm);
  }, [data.searchTerm, pagination.limit, pagination.offset]);

  const handleChange = name => event => {
    setData({ ...data, [name]: event.target.value });
  };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleFinish = async () => {
    try {
      //Index coming from the table
      const idx = selected[0];
      //Getting selected patient
      const selectedPatient = data.patients[idx];
      //Mapping attachments
      const attachments = await mapAttachments();
      const payload = {
        //MMG ID
        applicant: { id: userId },
        //User to send the notice to
        receiver: { id: selectedPatient.id },
        createdOn: dayjs().unix() * 1000,
        status: '1',
        //MMG Note
        body: data.mmgNote,
        attachments
      };
      //Insert notice in DB
      await insertNotice(payload);
      Toast.success(
        `Notifica inviata al paziente ${selectedPatient.surname} ${
          selectedPatient.name
        }`
      );
    } catch (error) {
      console.error(error);
      Toast.error(error.userMessage || 'Invio notifica fallito');
    } finally {
      // Closing dialog
      handleOpen(false)();
    }
  };

  const mapAttachments = async () => {
    if (files.length) {
      // Turning File into base64 and mapping into an array with fileNames
      const base64Files = await Promise.all(files.map(toBase64));
      const attachments = base64Files.length
        ? base64Files.map((doc, idx) => {
            doc = doc.split(';base64,');
            const documentData = doc[1];
            const documentType = doc[0].slice(doc[0].indexOf(':') + 1);
            return {
              id: null,
              noticeId: null,
              documentName: files[idx].name,
              documentType,
              documentData
            };
          })
        : [];
      return attachments;
    }
  };

  return (
    <Dialog
      maxWidth="md"
      open={open}
      onClose={handleOpen(false)}
      aria-labelledby="send-notices-dialog"
      TransitionComponent={Transition}
      PaperProps={{ className: classes.paper }}
    >
      <DialogTitle id="send-notices-dialog">Notifica un paziente</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Stepper activeStep={activeStep} className={classes.stepper}>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>
                <Hidden smDown>{label}</Hidden>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <SendDialogPatients
            data={data}
            handleChange={handleChange}
            pagination={pagination}
            setPagination={setPagination}
            rowsSelected={selected}
            setSelected={setSelected}
          />
        )}
        {activeStep === 1 && (
          <SendDialogNotes
            data={data}
            handleChange={handleChange}
            files={files}
            setFiles={setFiles}
          />
        )}

        <div className={classes.buttonContainer}>
          {activeStep > 0 && (
            <Button onClick={handleBack} className={classes.button}>
              Indietro
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={
              activeStep === steps.length - 1 ? handleFinish : handleNext
            }
            className={classes.button}
            disabled={!selected.length}
          >
            {activeStep === steps.length - 1 ? 'Invia' : 'Avanti'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

SendDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleOpen: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired
};

export default SendDialog;
