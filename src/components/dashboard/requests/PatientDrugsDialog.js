import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import dayjs from 'dayjs';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Transition from '../../commons/TransitionDialog';
import { DATE_TIME_FORMAT } from '../../configs';

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  },
  linkDownload: {
    marginBottom: theme.spacing(2),
    ...theme.typography.subtitle1
  },
  detailPopup: {
    minWidth: '30%'
  }
}));

const PatientDrugsDialog = ({
  selected,
  handleDownload,
  handleDetailDialog
}) => {
  const classes = useStyles();

  return (
    <Dialog
      maxWidth="md"
      open={Boolean(selected)}
      onClose={handleDetailDialog()}
      TransitionComponent={Transition}
      PaperProps={{ className: classes.detailPopup }}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleDetailDialog()}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Dettaglio Richiesta
          </Typography>
        </Toolbar>
      </AppBar>
      <List>
        <ListItem>
          <ListItemText
            primary="Richiesta del"
            secondary={dayjs(selected.createdOn).format(DATE_TIME_FORMAT)}
          />
        </ListItem>
        <Divider variant="middle" />
        <ListItem>
          <ListItemText primary="Farmaci" secondary={selected.body} />
        </ListItem>
        <Divider variant="middle" />
        <ListItem>
          <ListItemText
            primary="Modalità di consegna"
            secondary={
              selected.digitalProcess
                ? 'Ecofarmacia o invio telematico'
                : 'Da stampare (consegna in segreteria)'
            }
          />
        </ListItem>
        {selected.applicantNote ? (
          <>
            <Divider variant="middle" />
            <ListItem>
              <ListItemText
                primary="Note del paziente"
                secondary={selected.applicantNote}
              />
            </ListItem>
          </>
        ) : (
          false
        )}
        {selected.receiverNote ? (
          <>
            <Divider variant="middle" />
            <ListItem>
              <ListItemText
                primary="Note del medico"
                secondary={selected.receiverNote}
              />
            </ListItem>
          </>
        ) : (
          false
        )}
        <Divider variant="middle" />
        {selected.receiverAttachments && selected.receiverAttachments.length ? (
          <ListItem>
            <ListItemText
              primary={`${selected.receiverAttachments.length} Allegati`}
              secondaryTypographyProps={{
                className: classes.linkDownload
              }}
              secondary={selected.receiverAttachments.map(attachment => (
                <React.Fragment key={selected.id}>
                  <a
                    download={attachment.documentName}
                    href={handleDownload(attachment)}
                  >
                    {attachment.documentName}
                  </a>
                  <br />
                </React.Fragment>
              ))}
            />
          </ListItem>
        ) : (
          false
        )}
      </List>
    </Dialog>
  );
};

PatientDrugsDialog.propTypes = {
  selected: PropTypes.object.isRequired,
  handleDownload: PropTypes.func.isRequired,
  handleDetailDialog: PropTypes.func.isRequired
};

export default PatientDrugsDialog;
