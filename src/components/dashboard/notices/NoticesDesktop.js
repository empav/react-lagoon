import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import MUIDataTable from 'mui-datatables';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { DATE_TIME_FORMAT } from '../../configs';
import dayjs from 'dayjs';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import NoticesDialog from './NoticesDialog';
import { muiTableTextLabels } from '../../configs';
import { b64toBlob } from '../../utils/FileUtils';
import MarkunreadIcon from '@material-ui/icons/Markunread';
import MarkunreadOutlinedIcon from '@material-ui/icons/MarkunreadOutlined';
import AttachmentOutlinedIcon from '@material-ui/icons/AttachmentOutlined';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import BackLink from '../../commons/BackLink';

const useStyles = makeStyles(theme => ({
  paper: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    flex: 1
  },
  openBtn: {
    marginLeft: theme.spacing(4)
  },
  boldText: {
    fontWeight: theme.typography.fontWeightMedium,
    display: 'flex',
    alignItems: 'center'
  },
  noticeText: {
    display: 'flex',
    alignItems: 'center'
  }
}));

const NoticesDesktop = ({
  history,
  user: { notices = [], id: userId },
  match: { params }
}) => {
  const classes = useStyles();

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

  const handleOpenDialog = noticeId => () => {
    noticeId
      ? history.push(`notices/${noticeId}`)
      : history.push('/dashboard/notices');
  };

  const handleDownload = ({ documentType, documentData }) => {
    if (documentType && documentData) {
      const blob = b64toBlob(documentData, documentType);
      if (blob) return URL.createObjectURL(blob);
    }
  };

  return (
    <Paper className={classes.paper}>
      <BackLink />
      <MUIDataTable
        title="Notifiche"
        data={notices}
        columns={[
          {
            name: 'id',
            label: 'ID',
            options: {
              display: 'false'
            }
          },
          {
            name: 'body',
            label: 'Notifica',
            options: {
              customBodyRender: (body, tableMeta) => (
                <span
                  className={
                    !tableMeta.rowData[2]
                      ? classes.boldText
                      : classes.noticeText
                  }
                >
                  <InfoOutlinedIcon /> {body}
                </span>
              )
            }
          },
          {
            name: 'attachments',
            label: 'Allegati',
            options: {
              customBodyRender: attachments =>
                attachments && attachments.length ? (
                  <AttachmentOutlinedIcon />
                ) : (
                  false
                )
            }
          },
          {
            name: 'read',
            label: 'Letta/Non letta',
            options: {
              customBodyRender: read => (
                <span className={!read ? classes.boldText : undefined}>
                  {read ? (
                    <MarkunreadOutlinedIcon color="secondary" />
                  ) : (
                    <MarkunreadIcon color="secondary" />
                  )}
                </span>
              )
            }
          },
          {
            name: 'createdOn',
            label: 'Data di creazione',
            options: {
              customBodyRender: (createdOn, tableMeta) => (
                <>
                  <span
                    className={
                      !tableMeta.rowData[2] ? classes.boldText : undefined
                    }
                  >
                    {dayjs(createdOn).format(DATE_TIME_FORMAT)}
                  </span>
                  <Button
                    className={classes.openBtn}
                    variant="outlined"
                    color="primary"
                    onClick={handleOpenDialog(tableMeta.rowData[0])}
                  >
                    Apri
                  </Button>
                </>
              )
            }
          }
        ]}
        options={{
          textLabels: muiTableTextLabels,
          responsive: 'scrollMaxHeight',
          print: false,
          download: false,
          filter: false,
          search: false,
          selectableRows: 'none'
        }}
      />
      {selected && (
        <NoticesDialog
          userId={userId}
          selected={selected}
          handleDetailDialog={handleOpenDialog}
          handleDownload={handleDownload}
        />
      )}
    </Paper>
  );
};

NoticesDesktop.propTypes = {
  user: PropTypes.object.isRequired
};

export default withRouter(NoticesDesktop);
