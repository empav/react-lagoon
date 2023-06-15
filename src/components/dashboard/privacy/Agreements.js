import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  paper: {
    backgroundColor: 'white',
    padding: theme.spacing(3)
  },
  title: {
    marginBottom: theme.spacing(3)
  },
  pContainer: {
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    marginBottom: theme.spacing(3)
  },
  paragraph: {
    margin: 0,
    display: 'flex',
    flexDirection: 'column'
  }
}));

const Agreements = ({ data, handleChange }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Typography component="h1" variant="h4" className={classes.title}>
        Accordi
      </Typography>
      {[1, 2, 3].map(n => {
        return (
          <Grid container className={classes.pContainer} key={n}>
            <p className={classes.paragraph}>
              <Typography component="span" variant="h6">
                Accordo {n}
              </Typography>
              <span>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Rem
                temporibus libero reprehenderit? Vero suscipit, provident nemo
                maxime nam obcaecati ullam non rerum dolorem reiciendis sit
                necessitatibus cupiditate tempora explicabo tempore. Lorem ipsum
                dolor, sit amet consectetur adipisicing elit. Rem temporibus
                libero reprehenderit? Vero suscipit, provident nemo maxime nam
                obcaecati ullam non rerum dolorem reiciendis sit necessitatibus
                cupiditate tempora explicabo tempore. Lorem ipsum dolor, sit
                amet consectetur adipisicing elit. Rem temporibus libero
                reprehenderit? Vero suscipit, provident nemo maxime nam
                obcaecati ullam non rerum dolorem reiciendis sit necessitatibus
                cupiditate tempora explicabo tempore.
              </span>
            </p>
            <Switch
              checked={data[`cb${n}`]}
              onChange={handleChange(`cb${n}`)}
              value={data[`cb${n}`]}
              color="primary"
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
          </Grid>
        );
      })}
    </Paper>
  );
};

export default Agreements;
