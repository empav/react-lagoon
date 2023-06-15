import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import dayjs from 'dayjs';
import { DATE_FORMAT } from '../../configs';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  username: {
    cursor: 'pointer'
  }
}));

const PersonalData = ({
  user: {
    id,
    username,
    surname,
    name,
    roles,
    birthDate,
    emailHome,
    phoneHome,
    fiscalCode,
    phoneMobile,
    mmg
  },
  changePage
}) => {
  const classes = useStyles();
  return (
    <>
      <Typography
        gutterBottom
        variant="h6"
        component="h2"
        onClick={changePage(`profile/${id}`)}
        className={classes.username}
      >
        {`@${username}`}
      </Typography>

      <Typography variant="body1" color="textPrimary" component="p">
        Nome:{' '}
        <Typography variant="body2" color="textSecondary" component="span">
          {`${surname} ${name}`}
        </Typography>
      </Typography>

      {roles.length && (
        <Typography variant="body1" color="textPrimary" component="p">
          Ruolo:{' '}
          <Typography variant="body2" color="textSecondary" component="span">
            {typeof roles[0] === 'string' ? roles[0] : roles[0].description}
          </Typography>
        </Typography>
      )}

      {fiscalCode && (
        <Typography variant="body1" color="textPrimary" component="p">
          Codice Fiscale:{' '}
          <Typography variant="body2" color="textSecondary" component="span">
            {fiscalCode}
          </Typography>
        </Typography>
      )}

      {birthDate && (
        <Typography variant="body1" color="textPrimary" component="p">
          Data di nascita:{' '}
          <Typography variant="body2" color="textSecondary" component="span">
            {dayjs(birthDate).format(DATE_FORMAT)}
          </Typography>
        </Typography>
      )}

      {emailHome && (
        <Typography variant="body1" color="textPrimary" component="p">
          Email:{' '}
          <Typography variant="body2" color="textSecondary" component="span">
            <a href={`mailto:${emailHome}`}>{emailHome}</a>
          </Typography>
        </Typography>
      )}

      {phoneHome || phoneMobile ? (
        <Typography variant="body1" color="textPrimary" component="p">
          Telefono:{' '}
          <Typography variant="body2" color="textSecondary" component="span">
            {`${phoneHome || ''} ${
              phoneHome && phoneMobile ? '/' : ''
            } ${phoneMobile || ''}`}
          </Typography>
        </Typography>
      ) : (
        false
      )}

      {mmg ? (
        <Typography variant="body1" color="textPrimary" component="p">
          Medico:{' '}
          <Typography variant="body2" color="textSecondary" component="span">
            {`${mmg.surname} ${mmg.name}`}
          </Typography>
        </Typography>
      ) : (
        false
      )}
    </>
  );
};

PersonalData.propTypes = {
  user: PropTypes.object.isRequired,
  changePage: PropTypes.func.isRequired
};

export default PersonalData;
