import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { b64toBlob } from '../../utils/FileUtils';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import FormLabel from '@material-ui/core/FormLabel';
import MUIDataTable from 'mui-datatables';
import { makeStyles } from '@material-ui/core/styles';
import { DATE_FORMAT } from '../../configs';
import dayjs from 'dayjs';
import { DatePicker } from '@material-ui/pickers';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import { getRequestStatusesRedux } from '../DashboardActions';
import { connect } from 'react-redux';
import { getRequestStatusesSelector } from '../DashboardSelectors';
import DigitalProcess from '../commons/DigitalProcess';
import NewDrugsDialog from './NewDrugsDialog';
import Button from '@material-ui/core/Button';
import useRequests from './hooks/useRequests';
import { muiTableTextLabels } from '../../configs';
import { formatDrugs } from '../../utils/StringUtils';
import RefreshIcon from '@material-ui/icons/Refresh';
import AttachmentOutlinedIcon from '@material-ui/icons/AttachmentOutlined';
import { IconButton } from '@material-ui/core';
import PatientDrugsDialog from './PatientDrugsDialog';
import BackLink from '../../commons/BackLink';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 3)
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  filters: {
    width: '100%'
  },
  table: {
    marginTop: theme.spacing(3),
    boxShadow: 'none',
    '&#td.MuiTableCell-root': {
      whiteSpace: 'nowrap'
    },
    [theme.breakpoints.up('lg')]: {
      '& > div:nth-child(3)': {
        maxHeight: '350px'
      }
    },
    [theme.breakpoints.up('xl')]: {
      '& > div:nth-child(3)': {
        maxHeight: '650px'
      }
    }
  },
  dialogAppBar: {
    position: 'relative'
  },
  dialogTitle: {
    marginLeft: theme.spacing(2),
    flex: 1
  },
  dialogForm: {
    padding: theme.spacing(3, 3)
  },
  dialogTA: {
    width: '100%'
  },
  openDialogBtn: {
    marginLeft: theme.spacing(3)
  },
  gridBtn: {
    display: 'flex'
  },
  textColumn: {
    maxWidth: 150,
    overflow: 'hidden',
    overflowWrap: 'break-word'
  },
  openBtn: {
    marginLeft: theme.spacing(4)
  },
  statusColumn: {
    whiteSpace: 'nowrap',
    width: '100px'
  },
  blockDrug: {
    display: 'block'
  },
  width50: {
    width: '50px'
  }
}));

// Available table page sizes and pagination
const pageOptions = [5, 10, 25, 50, 100];
const initialPagination = {
  limit: 5,
  offset: 0,
  total: 10
};

const PatientDrugs = ({ user, getRequestStatuses, requestStatuses = [] }) => {
  const classes = useStyles();
  // Filtering the table
  const [filters, setFilters] = useState({
    status: 1,
    creationDate: null
  });
  // Custom hook to handle backend requests
  const [
    requests,
    getRequests,
    pagination,
    setPagination,
    queryString,
    setQueryString
  ] = useRequests(
    `?applicantId=${user.id}&status=${filters.status}&limit=${
      initialPagination.limit
    }&offset=${initialPagination.offset}`,
    initialPagination
  );
  const [newDialog, setNewDialog] = useState(false);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    // During the mounting If there're no statues I'll get them
    if (!requestStatuses.length) getRequestStatuses();
  }, [getRequestStatuses, requestStatuses.length]);

  useEffect(() => {
    // If queryString changes I'll call backend again and refresh the table
    getRequests(queryString);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString]);

  useEffect(() => {
    // If table pagination changes I'll trigger a search again
    const handleSearch = event => {
      if (event) event.preventDefault();

      let { status, creationDate } = filters;
      let { limit, offset } = pagination;

      status = status ? `&status=${status}` : '';
      creationDate = creationDate ? `&createdOn=${creationDate}` : '';
      limit = Number.isInteger(limit) ? `&limit=${limit}` : '';
      offset = Number.isInteger(offset) ? `&offset=${offset}` : '';

      setQueryString(
        `?applicantId=${user.id}${status}${creationDate}${limit}${offset}`
      );
    };

    handleSearch();
  }, [filters, pagination, setQueryString, user.id]);

  const handleChange = name => event => {
    setFilters({
      ...filters,
      [name]:
        name === 'creationDate' && !event
          ? null
          : event && event.$d
          ? dayjs(event.$d).unix() * 1000
          : event.target.value
    });
  };

  const handleNewDialog = (save = false) => refresh => {
    setNewDialog(save);
    if (refresh) {
      // Refreshing table after creating a new request
      getRequests(queryString);
    }
  };

  const handleSelectedDialog = (id = false) => () => {
    if (id) {
      const request = requests.find(req => req.id === id);
      setSelected(request);
    } else {
      setSelected(id);
    }
  };

  const handleRefresh = () => getRequests(queryString);

  const handleDownload = ({ documentType, documentData }) => {
    if (documentType && documentData) {
      const blob = b64toBlob(documentData, documentType);
      if (blob) return URL.createObjectURL(blob);
    }
  };

  return (
    <>
      <BackLink />
      <Paper className={classes.root}>
        <form className={classes.form} noValidate autoComplete="off">
          <FormLabel component="legend">Ricerca Paziente</FormLabel>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={2}>
              <DatePicker
                id="creationDate"
                label="Data di creazione"
                format={DATE_FORMAT}
                value={filters.creationDate}
                onChange={handleChange('creationDate')}
                clearable
                className={classes.filters}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <FormControl className={classes.filters}>
                <InputLabel htmlFor="status">Stato</InputLabel>
                <Select
                  value={filters.status}
                  onChange={handleChange('status')}
                  inputProps={{
                    name: 'status',
                    id: 'status'
                  }}
                >
                  {requestStatuses
                    .filter(status => status.id !== 3)
                    .map(status => (
                      <MenuItem key={status.id} value={status.id}>
                        {status.description}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={1} className={classes.gridBtn}>
              <IconButton
                color="primary"
                className={classes.openDialogBtn}
                aria-label="Refresh"
                onClick={handleRefresh}
              >
                <RefreshIcon />
              </IconButton>
            </Grid>
            <Grid item xs={12} sm={3} className={classes.gridBtn}>
              <Button
                className={classes.openDialogBtn}
                variant="contained"
                color="primary"
                onClick={handleNewDialog(true)}
              >
                Nuova Richiesta
              </Button>
            </Grid>
          </Grid>
        </form>
        {requestStatuses.length && (
          <>
            <MUIDataTable
              className={classes.table}
              title="Richieste Farmaci"
              data={requests}
              columns={[
                {
                  name: 'id',
                  label: 'id',
                  options: {
                    display: 'false'
                  }
                },
                {
                  name: 'body',
                  label: 'Farmaci',
                  options: {
                    customBodyRender: value => {
                      const drugs = value.includes(',')
                        ? value.split(',')
                        : [value];
                      return drugs.map((drug, index) => (
                        <span
                          key={index}
                          className={classes.blockDrug}
                          title={formatDrugs(value)}
                        >
                          {drug}
                        </span>
                      ));
                    },
                    setCellProps: () => {
                      return {
                        className: {
                          [classes.textColumn]: true
                        }
                      };
                    }
                  }
                },
                {
                  name: 'receiverAttachments',
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
                  name: 'digitalProcess',
                  label: 'Modalità consegna',
                  options: {
                    customBodyRender: value => <DigitalProcess data={value} />,
                    setCellProps: () => {
                      return {
                        className: {
                          [classes.width50]: true
                        }
                      };
                    }
                  }
                },
                {
                  name: 'createdOn',
                  label: 'Data di creazione',
                  options: {
                    setCellProps: () => {
                      return {
                        className: {
                          [classes.width50]: true
                        }
                      };
                    }
                  }
                },
                {
                  name: 'receiverNote',
                  label: 'Note del medico',
                  options: {
                    customBodyRender: value => (
                      <span title={value}>{value}</span>
                    ),
                    setCellProps: () => {
                      return {
                        className: {
                          [classes.textColumn]: true
                        }
                      };
                    }
                  }
                },
                {
                  name: 'applicantNote',
                  label: 'Note del paziente',
                  options: {
                    customBodyRender: value => (
                      <span title={value}>{value}</span>
                    ),
                    setCellProps: () => {
                      return {
                        className: {
                          [classes.textColumn]: true
                        }
                      };
                    }
                  }
                },
                {
                  name: 'status',
                  label: 'Stato',
                  options: {
                    setCellProps: () => {
                      return {
                        className: {
                          [classes.statusColumn]: true
                        }
                      };
                    },
                    customBodyRender: (value, tableMeta) => (
                      <>
                        <span>
                          {(() => {
                            const req = requestStatuses.find(
                              req => req.id === value
                            );
                            return req ? req.description : undefined;
                          })()}
                        </span>
                        <Button
                          className={classes.openBtn}
                          variant="outlined"
                          color="primary"
                          onClick={handleSelectedDialog(tableMeta.rowData[0])}
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
                responsive: 'stacked',
                print: false,
                download: false,
                filter: false,
                search: false,
                selectableRows: 'none',
                serverSide: true,
                count: pagination.total,
                page: pagination.offset,
                rowsPerPage: pagination.limit,
                rowsPerPageOptions: pageOptions,
                onTableChange: (action, tableState) => {
                  switch (action) {
                    case 'changeRowsPerPage':
                      setPagination({
                        ...pagination,
                        limit: tableState.rowsPerPage
                      });
                      break;
                    case 'changePage':
                      setPagination({
                        ...pagination,
                        limit: tableState.rowsPerPage,
                        offset: tableState.rowsPerPage * tableState.page
                      });
                      break;
                    default:
                  }
                }
              }}
            />
            {newDialog && (
              <NewDrugsDialog
                user={user}
                open={newDialog}
                handleClose={handleNewDialog}
              />
            )}
            {selected && (
              <PatientDrugsDialog
                selected={selected}
                handleDetailDialog={handleSelectedDialog}
                handleDownload={handleDownload}
              />
            )}
          </>
        )}
      </Paper>
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

PatientDrugs.propTypes = {
  user: PropTypes.object.isRequired,
  requestStatuses: PropTypes.array.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PatientDrugs);
