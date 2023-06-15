import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import Transition from '../../commons/TransitionDialog';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import FilterIcon from '@material-ui/icons/FilterList';
import useRequests from './hooks/useRequests';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import dayjs from 'dayjs';
import NewDrugsDialog from './NewDrugsDialog';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { getRequestStatusesRedux } from '../DashboardActions';
import { connect } from 'react-redux';
import { getRequestStatusesSelector } from '../DashboardSelectors';
import SpinnerMobile, { useSpinnerMobile } from '../../commons/SpinnerMobile';
import { b64toBlob } from '../../utils/FileUtils';

const useStyles = makeStyles(theme => ({
  root: {
    transform: 'translateY(-100px)',
    transition: '0.4s 0.22s ease-in-out'
  },
  listitem: {
    padding: theme.spacing(2, 3)
  },
  timeago: {
    position: 'absolute',
    right: theme.spacing(3),
    top: theme.spacing(2)
  },
  textEllipsed: {
    maxWidth: '100%',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  },
  appBar: {
    position: 'relative'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  },
  addBtn: {
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(3)
  },
  filterBtn: {
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(12)
  },
  avatar: {
    margin: theme.spacing(0)
  },
  media: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: theme.spacing(2)
  },
  status: {
    maxWidth: '70px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  linkDownload: {
    marginBottom: theme.spacing(2),
    ...theme.typography.subtitle1
  }
}));

// Available pagination
const initialPagination = {
  limit: 10,
  offset: 0,
  total: 10
};

const StatusIcon = ({ status, description }) => {
  const classes = useStyles();
  return (
    <>
      {status === 1 && <HourglassEmptyIcon fontSize="large" />}
      {status === 2 && <DoneAllIcon fontSize="large" />}
      {status === 4 && <DoneIcon fontSize="large" />}
      {status === 5 && <HighlightOffIcon fontSize="large" />}
      <Typography
        component="span"
        variant="body2"
        color="textPrimary"
        className={classes.status}
      >
        {description}
      </Typography>
    </>
  );
};

const PatientDrugsMobile = ({
  user,
  getRequestStatuses,
  requestStatuses = []
}) => {
  const classes = useStyles();
  // Dialog to show request detail
  const [selected, setSelected] = React.useState(null);
  // Add dialog
  const [addDialog, setAddDialog] = React.useState(false);
  // Filtering the table
  const [filter, setFilter] = useState({
    status: 1,
    anchor: null,
    appendData: true
  });

  const rootRef = useRef(null);

  // Custom hook to handle backend requests pullup
  const [
    requests,
    getRequests,
    pagination,
    setPagination,
    queryString,
    setQueryString
  ] = useRequests(
    `?applicantId=${user.id}&status=1&limit=${initialPagination.limit}&offset=${
      initialPagination.offset
    }`,
    initialPagination,
    filter.appendData
  );

  useSpinnerMobile(
    // Handling pull-down to refresh feature
    rootRef,
    () => {
      setFilter(filter => ({ ...filter, appendData: true }));
      setPagination(pagination => ({
        ...pagination,
        offset: pagination.offset + pagination.limit
      }));
    },
    []
  );

  useEffect(() => {
    // During the mounting If there're no statues I'll get them
    if (!requestStatuses.length) getRequestStatuses();
  }, [getRequestStatuses, requestStatuses.length]);

  useEffect(() => {
    // If queryString changes I'll call backend again and refresh the table
    getRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString]);

  useEffect(() => {
    // If table pagination changes I'll trigger a search again
    const handleSearch = () => {
      const offset = Number.isInteger(pagination.offset)
        ? `&offset=${pagination.offset}`
        : '';

      setQueryString(
        `?applicantId=${user.id}&status=${filter.status}&limit=${
          initialPagination.limit
        }${offset}`
      );
    };

    handleSearch();
  }, [filter.status, pagination.offset, setQueryString, user.id]);

  const handleAddDialog = (open = false) => (event = {}) => {
    if (typeof event === 'boolean') {
      // Refreshing table after creating a new request
      getRequests();
    } else if (event.target) {
      event.stopPropagation();
    }
    setAddDialog(open);
  };

  const handleDetailDialog = (request = null) => () => setSelected(request);

  const handleFiltersDialog = (open = false) => event => {
    event.stopPropagation();
    setFilter({ ...filter, anchor: open ? event.target : null });
  };

  const handleFilterClick = status => event => {
    event.stopPropagation();
    setPagination(initialPagination);
    setFilter({ status, anchor: null, appendData: false });
  };

  const handleDownload = ({ documentType, documentData }) => {
    if (documentType && documentData) {
      const blob = b64toBlob(documentData, documentType);
      if (blob) return URL.createObjectURL(blob);
    }
  };

  return (
    <>
      <div className={classes.root} ref={rootRef}>
        <SpinnerMobile />
        <Divider variant="middle" />
        <List>
          {requests.length > 0 &&
            requests.map((req, idx) => (
              <React.Fragment key={req.id}>
                <ListItem
                  alignItems="center"
                  onClick={handleDetailDialog(req)}
                  className={classes.listitem}
                >
                  <ListItemIcon className={classes.media}>
                    <StatusIcon
                      status={req.status}
                      description={
                        requestStatuses.find(s => s.id === req.status)
                          .description
                      }
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={req.body || 'Non ci sono farmaci'}
                    secondaryTypographyProps={{
                      className: classes.textEllipsed
                    }}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          className={classes.timeago}
                          color="textPrimary"
                        >
                          {dayjs().to(dayjs(req.createdOnOriginal))}
                        </Typography>{' '}
                        {req.applicantNote || 'Non ci sono note'}
                      </>
                    }
                  />
                </ListItem>
                {idx < requests.length - 1 && <Divider variant="middle" />}
              </React.Fragment>
            ))}
          {/* Empty requests array */}
          {requests.length === 0 && (
            <ListItem alignItems="center" className={classes.listitem}>
              <ListItemText primary="Non ci sono richieste" />
            </ListItem>
          )}
        </List>

        {/* Detail dialog */}
        {selected && (
          <Dialog
            fullScreen
            open={Boolean(selected)}
            onClose={handleDetailDialog()}
            TransitionComponent={Transition}
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
                  primary="Stato"
                  secondary={
                    requestStatuses.find(rs => rs.id === selected.status)
                      .description
                  }
                />
              </ListItem>
              <Divider variant="middle" />
              <ListItem>
                <ListItemText primary="Farmaci" secondary={selected.body} />
              </ListItem>
              <Divider variant="middle" />
              <ListItem>
                <ListItemText
                  primary="Note"
                  secondary={selected.applicantNote}
                />
              </ListItem>
              <Divider variant="middle" />
              <ListItem>
                <ListItemText
                  primary="Richiesta il"
                  secondary={selected.createdOn}
                />
              </ListItem>
              <Divider variant="middle" />
              <ListItem>
                <ListItemText
                  primary="Metodo di consegna"
                  secondary={
                    selected.digitalProcess
                      ? 'Ecofarmacia o invio telematico'
                      : 'Da stampare (consegna in segreteria)'
                  }
                />
              </ListItem>
              <Divider variant="middle" />
              <ListItem>
                <ListItemText
                  primary="Ricetta"
                  secondary={
                    selected.paperPrescription
                      ? 'Dematerializzata'
                      : 'Non dematerializzata'
                  }
                />
              </ListItem>
              <Divider variant="middle" />
              {selected.receiverAttachments &&
              selected.receiverAttachments.length ? (
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
        )}
      </div>
      <Fab
        color="primary"
        aria-label="add"
        className={classes.addBtn}
        onClick={handleAddDialog(true)}
      >
        <AddIcon />
      </Fab>
      <Fab
        color="primary"
        aria-label="add"
        className={classes.filterBtn}
        onClick={handleFiltersDialog(true)}
      >
        <FilterIcon />
        <Menu
          id="simple-menu"
          anchorEl={filter.anchor}
          keepMounted
          open={Boolean(filter.anchor)}
          onClose={handleFiltersDialog()}
        >
          {requestStatuses
            .filter(s => [1, 2, 5, 4].includes(s.id))
            .map(status => (
              <MenuItem key={status.id} onClick={handleFilterClick(status.id)}>
                {status.description}
              </MenuItem>
            ))}
        </Menu>
      </Fab>
      {addDialog && (
        <NewDrugsDialog
          user={user}
          open={addDialog}
          handleClose={handleAddDialog}
          fullScreen
        />
      )}
    </>
  );
};

const mapStateToProps = state => {
  return {
    requestStatuses: getRequestStatusesSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getRequestStatuses: () => dispatch(getRequestStatusesRedux())
  };
};

PatientDrugsMobile.propTypes = {
  user: PropTypes.object.isRequired,
  requestStatuses: PropTypes.array.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PatientDrugsMobile);
