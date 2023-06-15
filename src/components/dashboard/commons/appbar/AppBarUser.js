import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import PersonIcon from '@material-ui/icons/Person';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import Menu from '@material-ui/core/Menu';
import { makeStyles } from '@material-ui/core/styles';
import { ListItem, ListItemText } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  btn: {
    marginLeft: theme.spacing(2)
  },
  username: {
    marginLeft: theme.spacing(1)
  },
  listItemText: {
    marginLeft: theme.spacing(2)
  },
  listItem: {
    padding: theme.spacing(0.5, 2),
    cursor: 'pointer',
    '&:hover': {
      background: theme.palette.action.hover
    }
  },
  listItemIcon: {
    color: theme.palette.primary.main
  }
}));

const AppBarUser = ({ handleMenu, user, anchorEl, changePage, logout }) => {
  const classes = useStyles();
  return (
    <>
      <IconButton
        aria-haspopup="true"
        onClick={handleMenu(true)}
        color="inherit"
        className={classes.btn}
      >
        <AccountCircle />
        <Typography variant="body1" className={classes.username}>
          {user.username}
        </Typography>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenu(false)}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <ListItem
          onClick={changePage(`profile/${user.id}`)}
          className={classes.listItem}
        >
          <PersonIcon className={classes.listItemIcon} />
          <ListItemText className={classes.listItemText}>Profilo</ListItemText>
        </ListItem>
        <ListItem onClick={logout} className={classes.listItem}>
          <PowerSettingsNewIcon className={classes.listItemIcon} />
          <ListItemText className={classes.listItemText}>Log out</ListItemText>
        </ListItem>
      </Menu>
    </>
  );
};

AppBarUser.propTypes = {
  user: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
  changePage: PropTypes.func.isRequired,
  handleMenu: PropTypes.func.isRequired,
  anchorEl: PropTypes.object
};

AppBarUser.defaultProps = {
  anchorEl: null
};

export default AppBarUser;
