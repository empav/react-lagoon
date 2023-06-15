import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import DrawerJPG from '../../../../assets/images/drawer.jpeg';
import Avatar from '@material-ui/core/Avatar';
import deepPurple from '@material-ui/core/colors/deepPurple';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import BuildIcon from '@material-ui/icons/Build';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
import IconButton from '@material-ui/core/IconButton';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import { withRouter } from 'react-router-dom';
import { importPatients } from '../../../../backend';
import Toast from '../../../../errors/Toast';
import { isMmg } from '../../../utils/RoleUtils';
import SendDialog from './notices/SendDialog';
import PatientImportDialog from './PatientImportDialog';
import CustomDrawerMenu from './CustomDrawerMenu';
import PersonalData from '../PersonalData';

const drawerWidth = 350;

const useStyles = makeStyles(theme => ({
  drawer: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    whiteSpace: 'nowrap',
    [theme.breakpoints.up('xs')]: {
      width: '100%'
    },
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth
    },
    zIndex: theme.zIndex.drawer + 2,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    border: 0,
    outline: '1px solid rgba(0, 0, 0, 0.12)'
  },
  drawerClosed: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: 0
  },
  card: {
    borderRadius: 0,
    boxShadow: 'none'
  },
  mediaContainer: {
    position: 'relative',
    padding: 0
  },
  cardMedia: {
    height: 200
  },
  avatar: {
    position: 'absolute',
    top: '80%',
    left: '50%',
    transform: 'translate(-50%, -35%)',
    width: '100px',
    height: '100px',
    border: '3px solid white',
    backgroundColor: deepPurple[500],
    boxShadow: theme.shadows[7],
    cursor: 'pointer'
  },
  username: {
    cursor: 'pointer'
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    color: 'white'
  },
  menu: {
    flex: '1 1 auto'
  },
  version: {
    padding: theme.spacing(1, 2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}));

const CustomDrawer = ({
  match,
  history,
  onToggle,
  open: openDrawer,
  setOpen: setOpenDrawer,
  user,
  user: { id, surname, name }
}) => {
  const classes = useStyles();

  // Notification dialog open state
  const [openNotificationDialog, setOpenNotificationDialog] = React.useState(
    false
  );
  // Import dialog open state
  const [openImportDialog, setOpenImportDialog] = React.useState(false);
  // Import dialog attachment
  const initialFile = {
    name: '',
    resource: null
  };
  const [file, setFile] = React.useState(initialFile);

  const changePage = page => event => {
    event.preventDefault();
    setOpenDrawer(false);
    history.push(page ? `${match.url}/${page}` : match.url);
  };

  const handleOpenNotificationDialog = isOpen => () => {
    setOpenDrawer(false);
    setOpenNotificationDialog(isOpen);
  };

  const handleNotification = data => {
    console.log(data);
  };

  const handleOpenImportDialog = isOpen => () => {
    setFile(initialFile);
    setOpenDrawer(false);
    setOpenImportDialog(isOpen);
  };

  const handleImport = async () => {
    console.dir(file.resource);

    const formData = new FormData();
    formData.append('file', file.resource);
    formData.append('mmgId', id);

    try {
      const res = await importPatients(formData);
      Toast.success(res.userMessage || 'Importazione pazienti completata');
    } catch (error) {
      console.error(error);
      Toast.error(error.userMessage || 'Patients import failed');
    } finally {
      setOpenImportDialog(false);
    }
  };

  const handleFileImport = () => event => {
    setFile({ name: event.target.value, resource: event.target.files[0] });
  };

  return (
    <Drawer
      variant="permanent"
      classes={{
        paper: clsx(classes.drawer, !openDrawer && classes.drawerClosed)
      }}
      open={openDrawer}
    >
      <Card className={classes.card}>
        <CardContent className={classes.mediaContainer}>
          <Avatar
            className={classes.avatar}
            onClick={changePage(`profile/${id}`)}
          >
            {`${surname.toUpperCase().charAt(0)}${name
              .toUpperCase()
              .charAt(0)}`}
          </Avatar>
          <CardMedia
            className={classes.cardMedia}
            image={DrawerJPG}
            title="Home picture"
          />
          <IconButton
            edge="start"
            color="inherit"
            aria-label="Open drawer"
            onClick={onToggle}
            className={classes.closeButton}
          >
            <ChevronLeftIcon />
          </IconButton>
        </CardContent>
        <CardContent>
          <PersonalData user={user} changePage={changePage} />
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            size="small"
            onClick={changePage(`profile/${id}`)}
          >
            <BuildIcon />
            {' Profilo'}
          </Button>
          {isMmg(user) && (
            <>
              <Button
                size="small"
                color="primary"
                onClick={handleOpenImportDialog(true)}
              >
                <SupervisedUserCircleIcon />
                {'Pazienti'}
              </Button>
              <Button
                size="small"
                color="secondary"
                onClick={handleOpenNotificationDialog(true)}
              >
                <NotificationImportantIcon />
                {'Notifiche'}
              </Button>
            </>
          )}
          {openImportDialog && (
            <PatientImportDialog
              open={openImportDialog}
              handleOpen={handleOpenImportDialog}
              handleImport={handleImport}
              file={file.name}
              handleFile={handleFileImport}
            />
          )}
          {openNotificationDialog && (
            <SendDialog
              userId={user.id}
              open={openNotificationDialog}
              handleOpen={handleOpenNotificationDialog}
              handleNotification={handleNotification}
            />
          )}
        </CardActions>
      </Card>
      <Divider />
      <CustomDrawerMenu changePage={changePage} user={user} />
    </Drawer>
  );
};

CustomDrawer.propTypes = {
  user: PropTypes.object.isRequired,
  setOpen: PropTypes.func.isRequired
};

export default withRouter(CustomDrawer);
