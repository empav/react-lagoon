import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
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
import { updateReadNotice } from '../../../backend';
import { findNoticesRedux } from '../../user/UserActions';

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
  paperDialog: {
    width: '30%'
  }
}));

const NoticesDialog = ({
  userId,
  selected,
  handleDetailDialog,
  handleDownload,
  fullScreen,
  findNotices
}) => {
  const classes = useStyles();

  useEffect(() => {
    // As soon as the user read a notice I make a call to the backend to update the read status
    const updateRead = async notice => {
      await updateReadNotice({ ...notice, read: true });
      findNotices(userId);
    };
    // Only if the notice is not read yet
    if (!selected.read) updateRead(selected);
  }, [findNotices, selected, userId]);

  return (
    <Dialog
      fullScreen={fullScreen}
      open={Boolean(selected)}
      onClose={handleDetailDialog()}
      TransitionComponent={Transition}
      PaperProps={!fullScreen ? { className: classes.paperDialog } : undefined}
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
            Dettaglio Notifica
          </Typography>
        </Toolbar>
      </AppBar>
      <List>
        <ListItem>
          <ListItemText
            primary="Notifica del"
            secondary={dayjs(selected.createdOn).format(DATE_TIME_FORMAT)}
          />
        </ListItem>
        <Divider variant="middle" />
        <ListItem>
          <ListItemText primary="Notifica" secondary={selected.body} />
        </ListItem>
        <Divider variant="middle" />
        {selected.attachments && selected.attachments.length ? (
          <ListItem>
            <ListItemText
              primary={`${selected.attachments.length} Allegati`}
              secondaryTypographyProps={{
                className: classes.linkDownload
              }}
              secondary={selected.attachments.map(attachment => (
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

NoticesDialog.propTypes = {
  userId: PropTypes.number.isRequired,
  selected: PropTypes.object.isRequired,
  handleDetailDialog: PropTypes.func.isRequired,
  handleDownload: PropTypes.func.isRequired,
  fullScreen: PropTypes.bool
};

NoticesDialog.defaultProps = {
  fullScreen: false
};

const mapDispatchToProps = dispatch => {
  return {
    findNotices: userId => dispatch(findNoticesRedux(userId))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(NoticesDialog);
