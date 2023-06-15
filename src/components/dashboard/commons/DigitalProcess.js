import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  box: {
    width: '40px',
    height: '40px',
    fontWeight: 'bold',
    borderRadius: '50%',
    backgroundColor: 'orangered',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    boxShadow: theme.shadows[2]
  }
}));

const DigitalProcess = ({ data = false }) => {
  const classes = useStyles();

  return (
    <div
      title={
        data
          ? 'Ecofarmacia o invio telematico'
          : 'Da stampare (consegna in segreteria)'
      }
      className={classes.box}
    >
      {data ? 'E' : 'S'}
    </div>
  );
};

DigitalProcess.propTypes = {
  data: PropTypes.bool.isRequired
};

export default DigitalProcess;
