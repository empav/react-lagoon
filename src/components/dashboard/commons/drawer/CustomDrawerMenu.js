import React from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import DashboardIcon from '@material-ui/icons/Dashboard';
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
import LocalPharmacyIcon from '@material-ui/icons/LocalPharmacy';
import { makeStyles } from '@material-ui/core/styles';
import AppVersion from './AppVersion';
import { isPatient } from '../../../utils/RoleUtils';
import isMobile from '../../../utils/Detect';

const useStyles = makeStyles(theme => ({
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

const CustomDrawerMenu = ({ changePage, user }) => {
  const classes = useStyles();
  return (
    <>
      <List className={classes.menu}>
        <ListItem button onClick={changePage()}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        {/* <ListItem button onClick={changePage('privacy')}>
          <ListItemIcon>
            <ShoppingCartIcon />
          </ListItemIcon>
          <ListItemText primary="Privacy" />
        </ListItem> */}
        <ListItem button onClick={changePage('drugs')}>
          <ListItemIcon>
            <LocalPharmacyIcon />
          </ListItemIcon>
          <ListItemText primary="Richiesta Farmaci" />
        </ListItem>
        {isPatient(user) && (
          <ListItem button onClick={changePage('notices')}>
            <ListItemIcon>
              <NotificationImportantIcon />
            </ListItemIcon>
            <ListItemText primary="Notifiche" />
          </ListItem>
        )}
      </List>
      {!isMobile() ? (
        <>
          <Divider />
          <AppVersion />
        </>
      ) : (
        false
      )}
    </>
  );
};

CustomDrawerMenu.propTypes = {
  changePage: PropTypes.func.isRequired
};

export default CustomDrawerMenu;
