import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import PersonalData from './PersonalData';
import Registry from './Registry';
import Finish from './Finish';
import Disclaimer from './Disclaimer';
import Grid from '@material-ui/core/Grid';
import dayjs from 'dayjs';
import Toast from '../../errors/Toast';
import { Link } from 'react-router-dom';
import Hidden from '@material-ui/core/Hidden';
import { withRouter } from 'react-router-dom';
import { insertPrincipal } from '../../backend';

const regExpEmail = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh'
  },
  paper: {
    boxShadow: 'none',
    overflowY: 'auto',
    backgroundColor: 'transparent',
    padding: theme.spacing(3, 4),
    [theme.breakpoints.up('sm')]: {
      maxHeight: '85vh'
    },
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3)
    }
  },
  link: {
    marginTop: theme.spacing(1),
    color: theme.palette.primary.main,
    fontSize: '1rem',
    fontWeight: 500
  },
  stepper: {
    padding: theme.spacing(3, 0, 5)
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1)
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }
}));

const steps = ['Liberatoria', 'Dati Personali', 'Anagrafica', 'Email Inviata'];
const initialPersonalData = {
  username: '',
  password: '',
  passwordConfirm: '',
  emailHome: '',
  name: '',
  surname: '',
  fiscalCode: '',
  birthDate: null,
  mmgCode: '',
  mmg: {
    name: '',
    surname: '',
    birthDate: ''
  }
};

const Signup = ({ history }) => {
  const classes = useStyles();

  const [activeStep, setActiveStep] = React.useState(0);

  const [disclaimer, setDisclaimer] = React.useState(false);

  const [personalData, setPersonalData] = React.useState(initialPersonalData);

  useEffect(() => {
    if (activeStep === 1) {
      setPersonalData(personalData => ({
        ...initialPersonalData,
        name: personalData.name,
        surname: personalData.surname,
        birthDate: personalData.birthDate
      }));
    }
  }, [activeStep]);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleDisclaimer = (step, checked) => {
    setDisclaimer(checked);
  };

  const handleRegister = async () => {
    try {
      // TODO: Review fields before post API
      const { id, mmgCode, mmg, passwordConfirm, ...principal } = personalData;
      principal.mmgId = mmg.id;
      await insertPrincipal(principal);
      handleNext();
      Toast.success('Paziente registrato correttamente');
    } catch (error) {
      console.error(error);
      Toast.error(error.userMessage || 'Non riesco ad inserire il paziente');
    }
  };

  const handleInputChange = name => event => {
    const value =
      name === 'birthDate' ? dayjs(event.$d).unix() * 1000 : event.target.value;
    setPersonalData({ ...personalData, [name]: value });
  };

  const handleFinish = () => {
    history.push('/');
  };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={5} className={classes.image} />
      <Grid item xs={12} sm={8} md={7} component={Paper} elevation={6} square>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            Registrazione Paziente
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
          {activeStep === 0 && (
            <Disclaimer disclaimer={disclaimer} onChange={handleDisclaimer} />
          )}
          {activeStep === 1 && (
            <PersonalData
              personalData={personalData}
              handleInputChange={handleInputChange}
            />
          )}
          {activeStep === 2 && (
            <Registry
              handleBack={handleBack}
              setPersonalData={setPersonalData}
              personalData={personalData}
              handleInputChange={handleInputChange}
            />
          )}

          {activeStep === 3 && <Finish personalData={personalData} />}

          <div className={classes.buttons}>
            {activeStep !== 0 && (
              <Button onClick={handleBack} className={classes.button}>
                Indietro
              </Button>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={
                activeStep === 2
                  ? handleRegister
                  : activeStep === 3
                  ? handleFinish
                  : handleNext
              }
              className={classes.button}
              disabled={
                !(activeStep === 0 && disclaimer) &&
                !(
                  activeStep === 1 &&
                  personalData.name &&
                  personalData.surname &&
                  personalData.birthDate
                ) &&
                !(
                  activeStep === 2 &&
                  personalData.username &&
                  personalData.password &&
                  personalData.password.length > 7 &&
                  personalData.passwordConfirm &&
                  personalData.passwordConfirm === personalData.password &&
                  personalData.emailHome &&
                  Array.isArray(personalData.emailHome.match(regExpEmail)) &&
                  personalData.name &&
                  personalData.surname &&
                  personalData.fiscalCode &&
                  personalData.birthDate &&
                  personalData.mmg.name &&
                  personalData.mmg.surname
                ) &&
                !(activeStep === 3 && true)
              }
            >
              {activeStep === steps.length - 1
                ? 'Concludi'
                : activeStep === 2
                ? 'Registrami'
                : 'Avanti'}
            </Button>
          </div>
          <Grid container>
            <Link className={classes.link} to="/login">
              {'Entra col mio account'}
            </Link>
          </Grid>
          <Grid container>
            <Link className={classes.link} to="/forgot">
              {'Dimenticata la password?'}
            </Link>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default withRouter(Signup);
