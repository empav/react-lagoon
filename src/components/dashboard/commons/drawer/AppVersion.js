import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import packageJSON from '../../../../../package.json';

const useStyles = makeStyles(theme => ({
  version: {
    padding: theme.spacing(1, 2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}));

const AppVersion = () => {
  const classes = useStyles();

  return (
    <Typography
      variant="body2"
      color="textSecondary"
      component="div"
      className={classes.version}
    >
      {`Lagoon v${packageJSON.version}`}
    </Typography>
  );
};

export default AppVersion;
