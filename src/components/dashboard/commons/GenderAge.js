import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  box: {
    width: '40px',
    height: '40px',
    fontWeight: 'bold',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: theme.shadows[2]
  },
  pink: {
    backgroundColor: '#f044a5',
    color: 'white'
  },
  blue: {
    backgroundColor: '#6788c9',
    color: 'white'
  }
}));

const GenderAge = ({ data = [] }) => {
  const classes = useStyles();

  return Array.isArray(data) && data.length === 2 ? (
    <div
      className={clsx(
        classes.box,
        data.includes('F') && classes.pink,
        data.includes('M') && classes.blue
      )}
    >
      {dayjs().year() - dayjs(data[1]).year()}
    </div>
  ) : (
    false
  );
};

GenderAge.propTypes = {
  data: PropTypes.array.isRequired
};

export default GenderAge;
