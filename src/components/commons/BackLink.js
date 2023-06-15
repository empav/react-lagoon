import React from 'react';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    margin: theme.spacing(2, 0)
  }
}));

const BackLink = ({ to, label }) => {
  const classes = useStyles();

  return (
    <Link to={`/${to}`} className={classes.backLink}>
      <ArrowBackIcon /> {label}
    </Link>
  );
};

BackLink.propTypes = {
  to: PropTypes.string,
  label: PropTypes.string
};

BackLink.defaultProps = {
  to: 'dashboard',
  label: 'Torna Indietro'
};

export default BackLink;
