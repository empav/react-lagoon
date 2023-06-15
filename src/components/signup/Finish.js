import React from 'react';
import PropTypes from 'prop-types';
import { sendEmailSubscriptionConfirm } from '../../backend';
import { makeStyles } from '@material-ui/core/styles';
import Toast from '../../errors/Toast';

const useStyles = makeStyles(theme => ({
  resend: {
    color: '#0000EE',
    cursor: 'pointer',
    textDecoration: 'underline'
  }
}));

const Finish = ({ personalData: { emailHome, username } }) => {
  const classes = useStyles();

  const send = async () => {
    try {
      await sendEmailSubscriptionConfirm(username);
      Toast.success('Email reinviata');
    } catch (error) {
      console.error(error);
      Toast.error('Servizio email non raggiungibile, chiamare call center');
    }
  };

  return (
    <>
      <p>
        Prendi nota del tuo utente: <b>{username}</b> e la password scelta.
        Conferma la tua registrazione cliccando sul link che ti abbiamo inviato
        all' email <a href={`mailto:${emailHome}`}>{emailHome}</a>. Non chiudere
        questa pagina finchè il processo di registrazione è concluso e la
        conferma tramite email è avvenuta.
      </p>
      <p>
        Non ho ricevuto nessuna email,{' '}
        <span className={classes.resend} onClick={send}>
          Rimandamela
        </span>
      </p>
    </>
  );
};

Finish.propTypes = {
  personalData: PropTypes.object.isRequired
};

export default Finish;
