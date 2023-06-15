import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { selectUser } from '../../user/UserSelectors';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import DrawerJPG from '../../../assets/images/drawer.jpeg';
import deepPurple from '@material-ui/core/colors/deepPurple';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

import TabInfo from './TabInfo';
import TabEmail from './TabEmail';
import TabPwd from './TabPwd';
import PersonalData from '../commons/PersonalData';

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: '100%'
  },
  mediaContainer: {
    position: 'relative',
    padding: 0
  },
  media: {
    width: '100%',
    height: 250
  },
  avatar: {
    position: 'absolute',
    top: '75%',
    left: '50%',
    transform: 'translate(-50%, -35%)',
    width: '150px',
    height: '150px',
    border: '3px solid white',
    backgroundColor: deepPurple[500],
    boxShadow: theme.shadows[7],
    cursor: 'pointer'
  },
  tabContainer: {
    flexGrow: 1
  },
  tabPanel: {
    padding: theme.spacing(3)
  }
}));

const TabPanel = ({ children, value, index }) => {
  const classes = useStyles();
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      <Box className={classes.tabPanel}>{children}</Box>
    </Typography>
  );
};

const Profile = ({
  dispatch,
  user,
  user: { username, surname, name, roles, birthDate },
  location: { search }
}) => {
  const classes = useStyles();

  const [tabId, setTabId] = React.useState(0);

  useEffect(() => {
    // If there's a change email in progress I get 3 qs params and I need to enable UI email tab
    const params = new URLSearchParams(search);
    if (params.has('email') && params.has('emailid') && params.has('ts')) {
      // Change email in progress so I enable  email tab
      setTabId(1);
    }
  }, [search]);

  const handleChangeTab = (event, tabId) => {
    setTabId(tabId);
  };

  return (
    <Card className={classes.card}>
      <CardContent className={classes.mediaContainer}>
        <Avatar className={classes.avatar} onClick={() => {}}>
          {`${surname.toUpperCase().charAt(0)}${name.toUpperCase().charAt(0)}`}
        </Avatar>
        <CardMedia
          className={classes.media}
          image={DrawerJPG}
          title="Contemplative Reptile"
        />
      </CardContent>
      <CardContent>
        <PersonalData user={user} changePage={() => {}} />
      </CardContent>
      <CardContent>
        <Tabs
          value={tabId}
          onChange={handleChangeTab}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Info" id="tab-0" aria-controls="tabpanel-0" />
          <Tab label="Email e Telefono" id="tab-1" aria-controls="tabpanel-1" />
          <Tab label="Password" id="tab-2" aria-controls="tabpanel-2" />
        </Tabs>
        <TabPanel value={tabId} index={0}>
          <TabInfo user={user} />
        </TabPanel>
        <TabPanel value={tabId} index={1}>
          <TabEmail user={user} />
        </TabPanel>
        <TabPanel value={tabId} index={2}>
          <TabPwd user={user} dispatch={dispatch} />
        </TabPanel>
      </CardContent>
    </Card>
  );
};

Profile.propTypes = {
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    user: selectUser(state)
  };
};

export default connect(mapStateToProps)(withRouter(Profile));
