import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '../drawer/CustomDrawer';
import { withRouter } from 'react-router-dom';
import AppBarUser from './AppBarUser';
import AppBarNotice from './AppBarNotice';
import isMobile from '../../../utils/Detect';

const useStyles = makeStyles(theme => ({
  toolbar: {
    paddingRight: theme.spacing(3) // keep right padding when drawer closed
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: '100%',
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerBtn: {
    marginRight: 10
  },
  appTitle: {
    flexGrow: 0,
    cursor: 'pointer'
  },
  rightAppBar: {
    marginLeft: 'auto',
    display: 'block'
  }
}));

const LagoonAppBar = ({ history, match, user, logout }) => {
  const classes = useStyles();

  // Drawer state
  const [openDrawer, setOpenDrawer] = React.useState(false);
  // User menu state
  const [anchorUser, setAnchorUser] = React.useState(null);
  // Notice menu
  const [anchorNotice, setAnchorNotice] = React.useState(null);

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const handleUserMenu = open => event => {
    open ? setAnchorUser(event.currentTarget) : setAnchorUser(null);
  };

  const handleNoticeMenu = open => event => {
    open ? setAnchorNotice(event.currentTarget) : setAnchorNotice(null);
  };

  const logoutAndCloseMenu = () => {
    handleUserMenu(false)();
    logout();
  };

  const changePage = page => event => {
    event.preventDefault();
    handleUserMenu(false)();
    history.push(page ? `${match.url}/${page}` : match.url);
  };

  return (
    <>
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, openDrawer && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="Open drawer"
            onClick={toggleDrawer}
            className={classes.drawerBtn}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.appTitle}
            onClick={changePage()}
          >
            Lagoon
          </Typography>
          <div className={classes.rightAppBar}>
            {!isMobile() && (
              <Typography
                component="a"
                variant="subtitle1"
                color="inherit"
                href="mailto:support@lagoonmed.eu"
              >
                support@lagoonmed.eu
              </Typography>
            )}
            {user.notices && user.notices.length ? (
              <AppBarNotice
                handleMenu={handleNoticeMenu}
                anchorEl={anchorNotice}
                changePage={changePage}
                notices={user.notices}
              />
            ) : (
              false
            )}
            <AppBarUser
              user={user}
              handleMenu={handleUserMenu}
              anchorEl={anchorUser}
              changePage={changePage}
              logout={logoutAndCloseMenu}
            />
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        setOpen={setOpenDrawer}
        open={openDrawer}
        onToggle={toggleDrawer}
        user={user}
      />
    </>
  );
};

LagoonAppBar.propTypes = {
  user: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
};

export default withRouter(LagoonAppBar);
