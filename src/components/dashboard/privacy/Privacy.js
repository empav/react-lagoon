import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import Toast from '../../../errors/Toast';

import Patients from './Patients';
import Upload from './Upload';
import Agreements from './Agreements';

const useStyles = makeStyles(theme => ({
  paper: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    flex: 1
  },
  stepper: {
    backgroundColor: 'transparent'
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

const steps = ['Pazienti', 'Accordi', 'Spedisci il pdf'];

const Privacy = () => {
  const classes = useStyles();

  const [activeStep, setActiveStep] = React.useState(0);
  const [data, setData] = React.useState({
    cb1: false,
    cb2: true,
    cb3: false,
    base64Img: ''
  });

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleChange = name => event => {
    setData({ ...data, [name]: event.target.checked });
  };

  const handleImage = event => {
    if (event && event.data) {
      setData({ ...data, base64Img: event.data });
      Toast.success('Firma acquisita correttamente');
    } else {
      setData({ ...data, base64Img: '' });
    }
  };

  const handleFinish = () => {
    //TODO: Send data to API
    console.log({ data });
  };

  return (
    <Paper className={classes.paper}>
      <Typography component="h1" variant="h4" align="center">
        Privacy
      </Typography>
      <Stepper activeStep={activeStep} className={classes.stepper}>
        {steps.map(label => (
          <Step key={label}>
            <StepLabel>
              <Hidden smDown>{label}</Hidden>
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && <Patients data={data} handleChange={handleChange} />}
      {activeStep === 1 && (
        <Agreements data={data} handleChange={handleChange} />
      )}
      {activeStep === 2 && <Upload handleImage={handleImage} />}

      <div className={classes.buttonContainer}>
        {activeStep > 0 && (
          <Button onClick={handleBack} className={classes.button}>
            Indietro
          </Button>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={activeStep === steps.length - 1 ? handleFinish : handleNext}
          className={classes.button}
          disabled={activeStep === steps.length - 1 && !data.base64Img}
        >
          {activeStep === steps.length - 1 ? 'Concludi' : 'Avanti'}
        </Button>
      </div>
    </Paper>
  );
};

export default Privacy;
