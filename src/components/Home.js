import React, { useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import BuiltBy from './commons/BuiltBy';
import { Link } from 'react-router-dom';
import HomeImg from '../assets/images/home.jpg';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh'
  },
  image: {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'block',
    [theme.breakpoints.up('xs')]: {
      display: 'none'
    },
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    [theme.breakpoints.up('xs')]: {
      margin: theme.spacing(8, 4)
    },
    [theme.breakpoints.up('sm')]: {
      margin: theme.spacing(8, 4)
    }
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  link: {
    marginTop: theme.spacing(1),
    color: theme.palette.primary.main,
    fontSize: '1rem'
  },
  brand: {
    margin: theme.spacing(1)
  },
  button: {
    margin: theme.spacing(1)
  }
}));

const Home = ({ history }) => {
  const classes = useStyles();

  useEffect(() => {
    const credentials = localStorage.getItem('credentials');
    if (credentials) {
      // If it's logged in redirecting to dashboard
      history.push('/dashboard');
    }
  }, [history]);

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7}>
        <img
          src={HomeImg}
          alt="Laguna di venezia (Lagoon)"
          className={classes.image}
        />
      </Grid>
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" className={classes.brand}>
            Lagoon
          </Typography>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => {
              history.push('/login');
            }}
            className={classes.button}
          >
            Log in
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={() => {
              history.push('/signup');
            }}
            className={classes.button}
          >
            Registrati
          </Button>
          <Box mt={5}>
            <BuiltBy />
          </Box>
          <Box mt={5}>
            <Link className={classes.link} to="/">
              {'Contatti'}
            </Link>
            {' | '}
            <Link className={classes.link} to="/">
              {'Eventi'}
            </Link>
            {' | '}
            <Link className={classes.link} to="/">
              {'Investitori'}
            </Link>
            {' | '}
            <Link className={classes.link} to="/">
              {'Condizioni'}
            </Link>
            {' | '}
            <Link className={classes.link} to="/">
              {'Documenti'}
            </Link>
          </Box>
        </div>
      </Grid>
    </Grid>
  );
};

export default withRouter(Home);
