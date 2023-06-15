import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Divider from '@material-ui/core/Divider';
import { ListItemAvatar, Avatar } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import dayjs from 'dayjs';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import SpinnerMobile, { useSpinnerMobile } from '../../commons/SpinnerMobile';
import { b64toBlob } from '../../utils/FileUtils';
import { withRouter } from 'react-router-dom';
import NoticesDialog from './NoticesDialog';

const useStyles = makeStyles(theme => ({
  root: {
    transform: 'translateY(-100px)',
    transition: '0.4s 0.22s ease-in-out'
  },
  mediaContainer: {
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(2)
  },
  readCircle: {
    width: theme.spacing(1.1),
    height: theme.spacing(1.1),
    borderRadius: '50%',
    marginRight: theme.spacing(2),
    backgroundColor: theme.palette.primary.main
  },
  avatar: {
    backgroundColor: theme.palette.primary.main
  },
  listitem: {
    padding: theme.spacing(2, 3)
  },
  timeago: {
    position: 'absolute',
    right: theme.spacing(3),
    top: theme.spacing(2)
  },
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
  boldText: {
    fontWeight: theme.typography.fontWeightMedium,
    color: 'black'
  },
  ellipsedText: {
    maxWidth: '180px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  }
}));

const NoticesMobile = ({
  history,
  match: { params },
  findNotices,
  user: { notices = [], id: userId }
}) => {
  const classes = useStyles();
  const rootRef = useRef(null);
  // Dialog to show request detail
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (params && params.id) {
      // If url shows a parameter id I just render notice's detail
      const notice = notices.find(n => n.id === Number(params.id));
      setSelected(notice);
    } else {
      setSelected(null);
    }
  }, [params, notices]);

  const handleDetailDialog = (notice = null) => () =>
    notice
      ? history.push(`/dashboard/notices/${notice.id}`)
      : history.push('/dashboard/notices');

  useSpinnerMobile(rootRef, findNotices, []);

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
          {notices.map(notice => (
            <React.Fragment key={notice.id}>
              <ListItem
                key={notice.id}
                alignItems="center"
                onClick={handleDetailDialog(notice)}
                className={classes.listitem}
              >
                <ListItemAvatar>
                  <div className={classes.mediaContainer}>
                    {!notice.read && (
                      <Typography
                        component="span"
                        className={classes.readCircle}
                      />
                    )}
                    <Avatar className={classes.avatar}>
                      {`${notice.applicant.surname
                        .toUpperCase()
                        .charAt(0)}${notice.applicant.name
                        .toUpperCase()
                        .charAt(0)}`}
                    </Avatar>
                  </div>
                </ListItemAvatar>
                <ListItemText
                  primary={`${notice.applicant.surname} ${
                    notice.applicant.name
                  }`}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.timeago}
                        color="textPrimary"
                      >
                        {dayjs().to(dayjs(notice.createdOn))}
                      </Typography>{' '}
                      {notice.body || 'Non ci sono note'}
                    </>
                  }
                  primaryTypographyProps={{
                    className: !notice.read ? classes.boldText : undefined
                  }}
                  secondaryTypographyProps={{
                    className: notice.read
                      ? classes.ellipsedText
                      : clsx(classes.ellipsedText, classes.boldText)
                  }}
                />
              </ListItem>
              <Divider variant="middle" />
            </React.Fragment>
          ))}
        </List>

        {/* Detail dialog */}
        {selected && (
          <NoticesDialog
            userId={userId}
            fullScreen
            selected={selected}
            handleDetailDialog={handleDetailDialog}
            handleDownload={handleDownload}
          />
        )}
      </div>
    </>
  );
};

NoticesMobile.propTypes = {
  user: PropTypes.object.isRequired
};

export default withRouter(NoticesMobile);
