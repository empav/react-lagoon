import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import NotificationIcon from '@material-ui/icons/NotificationsOutlined';
import { Badge, ListItemAvatar, Avatar } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import ListItemText from '@material-ui/core/ListItemText';
import dayjs from 'dayjs';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  menu: {
    minWidth: '300px'
  },
  avatar: {
    backgroundColor: theme.palette.primary.main
  },
  listitem: {
    padding: theme.spacing(0.5, 2),
    cursor: 'pointer',
    '&:hover': {
      background: theme.palette.action.hover
    }
  },
  timeago: {
    position: 'absolute',
    right: theme.spacing(2),
    top: theme.spacing(0)
  },
  textEllipsed: {
    maxWidth: '180px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  }
}));

const AppBarNotice = ({
  notices = [],
  changePage,
  handleMenu,
  anchorEl = null
}) => {
  const classes = useStyles();

  const handleChangePage = noticeId => e => {
    handleMenu(false)();
    changePage(`notices/${noticeId}`)(e);
  };

  // Only the ones not read
  notices = notices.filter(notice => !notice.read);

  return (
    <>
      <IconButton
        aria-haspopup="true"
        onClick={handleMenu(true)}
        color="inherit"
      >
        <Badge badgeContent={notices.length} color="secondary">
          <NotificationIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenu(false)}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 150 }}
        PaperProps={{ className: classes.menu }}
      >
        {notices.length ? (
          notices.map(notice => (
            <ListItem
              key={notice.id}
              alignItems="center"
              onClick={handleChangePage(notice.id)}
              className={classes.listitem}
            >
              <ListItemAvatar>
                <Avatar className={classes.avatar}>
                  {`${notice.applicant.surname
                    .toUpperCase()
                    .charAt(0)}${notice.applicant.name
                    .toUpperCase()
                    .charAt(0)}`}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`${notice.applicant.surname} ${notice.applicant.name}`}
                secondaryTypographyProps={{
                  className: classes.textEllipsed
                }}
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="caption"
                      className={classes.timeago}
                      color="textSecondary"
                    >
                      {dayjs().to(dayjs(notice.createdOn))}
                    </Typography>{' '}
                    {notice.body || 'Non ci sono note'}
                  </>
                }
              />
            </ListItem>
          ))
        ) : (
          <ListItem alignItems="center">
            <ListItemText primary="Non ci sono notifiche" />
          </ListItem>
        )}
      </Menu>
    </>
  );
};

AppBarNotice.propTypes = {
  notices: PropTypes.array.isRequired,
  anchorEl: PropTypes.object,
  handleMenu: PropTypes.func.isRequired,
  changePage: PropTypes.func.isRequired
};

AppBarNotice.defaultProps = {
  anchorEl: null
};

export default AppBarNotice;
