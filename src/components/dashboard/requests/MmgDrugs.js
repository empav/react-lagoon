import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Toast from '../../../errors/Toast';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import FormLabel from '@material-ui/core/FormLabel';
import MUIDataTable from 'mui-datatables';
import Button from '@material-ui/core/Button';
import RefreshIcon from '@material-ui/icons/Refresh';
import { makeStyles } from '@material-ui/core/styles';
import { findRequests, updateRequest } from '../../../backend';
import { DATE_FORMAT } from '../../configs';
import dayjs from 'dayjs';
import { DatePicker } from '@material-ui/pickers';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { getRequestStatusesRedux } from '../DashboardActions';
import { connect } from 'react-redux';
import { getRequestStatusesSelector } from '../DashboardSelectors';
import GenderAge from '../commons/GenderAge';
import DigitalProcess from '../commons/DigitalProcess';
import MmgDialog from './MmgDialog';
import { toBase64 } from '../../utils/FileUtils';
import { muiTableTextLabels } from '../../configs';
import { formatDrugs } from '../../utils/StringUtils';
import { IconButton } from '@material-ui/core';
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
    marginLeft: theme.spacing(2)
  },
  gridBtn: {
    display: 'flex'
  },
  statusColumn: {
    whiteSpace: 'nowrap',
    width: '100px'
  },
  textColumn: {
    maxWidth: 150,
    overflow: 'hidden',
    overflowWrap: 'break-word'
  },
  blockDrug: {
    display: 'block'
  },
  width50: {
    width: '50px'
  }
}));

const MmgDrugs = ({ user, getRequestStatuses, requestStatuses = [] }) => {
  const classes = useStyles();

  // Open full screen dialog
  const initialDialogState = {
    selectedId: -1,
    patientNote: '',
    patientDrugs: '',
    mmgNote: '',
    mmgCheck: false,
    mmgFile: '',
    dialogStatus: 2
  };
  // MMG Answer
  const [dialog, setDialog] = React.useState({ ...initialDialogState });
  const [dialogFiles, setDialogFiles] = useState([]);
  // Requests to fill the table with
  const [requests, setRequests] = useState([]);
  // Filtering the table
  const [filters, setFilters] = useState({
    name: '',
    surname: '',
    status: 1,
    creationDate: null
  });
  // Paginating the table
  const [pagination, setPagination] = useState({
    limit: 5,
    offset: 0,
    total: 10
  });
  //Requests query string
  const [queryString, setQueryString] = useState(
    `?receiverId=${user.id}&status=${filters.status}&limit=${
      pagination.limit
    }&offset=${pagination.offset}`
  );

  useEffect(() => {
    // During the mounting If there're no statues I'll get them
    if (!requestStatuses.length) getRequestStatuses();
  }, [getRequestStatuses, requestStatuses.length]);

  useEffect(() => {
    // If queryString changes I'll call backend again and refresh the table
    getRequests(queryString);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString]);

  const getRequests = async queryString => {
    try {
      const { items: requests, total } = await findRequests(queryString);
      if (Array.isArray(requests)) {
        const reqs = requests.map(req => {
          return {
            ...req,
            createdOn: dayjs(req.createdOn).format(DATE_FORMAT),
            patient: `${req.applicant.surname} ${req.applicant.name}`,
            genderAge: [req.applicant.gender, req.applicant.birthDate]
          };
        });
        setRequests(reqs);
        setPagination({ ...pagination, total });
      }
    } catch (error) {
      console.error(error);
      Toast.error(error.userMessage || 'Non riesco ad inserire la richiesta');
    }
  };

  const handleSearch = useCallback(
    event => {
      if (event) event.preventDefault();

      let { name, surname, status, creationDate } = filters;
      let { limit, offset } = pagination;

      name = name && name.length > 2 ? `&name=${name}` : '';
      surname = surname && surname.length > 1 ? `&surname=${surname}` : '';
      status = status ? `&status=${status}` : '';
      creationDate = creationDate ? `&createdOn=${creationDate}` : '';
      limit = Number.isInteger(limit) ? `&limit=${limit}` : '';
      offset = Number.isInteger(offset) ? `&offset=${offset}` : '';

      setQueryString(
        `?receiverId=${
          user.id
        }${name}${surname}${status}${creationDate}${limit}${offset}`
      );
    },
    [filters, pagination, user.id]
  );

  useEffect(() => {
    // If table pagination changes I'll trigger a search again
    handleSearch();
  }, [handleSearch, pagination.limit, pagination.offset]);

  const handleChange = name => event => {
    if (name === 'mmgCheck') {
      // Dialog checkbox
      setDialog({
        ...dialog,
        [name]: event.target.checked
      });
    } else if (
      name === 'mmgFile' ||
      name === 'mmgNote' ||
      name === 'dialogStatus'
    ) {
      //Dialog texts
      setDialog({
        ...dialog,
        [name]:
          name === 'mmgNote' && event.target.value.length >= 4000
            ? ''
            : event.target.value
      });
    } else {
      //Filters form
      setFilters({
        ...filters,
        [name]:
          name === 'creationDate' && !event
            ? null
            : event && event.$d
            ? dayjs(event.$d).unix() * 1000
            : event.target.value
      });
    }
  };

  const handleChangeRequest = async (event, request) => {
    try {
      await updateRequest({
        status: event ? event.target.value : undefined,
        ...request
      });
      getRequests(queryString);
      Toast.success(`Richiesta numero ${request.id} aggiornata`);
    } catch (error) {
      console.error(error);
      Toast.error(error.userMessage || 'Non riesco ad aggiornare la richiesta');
    }
  };

  const handleOpenDialog = ([
    selectedId,
    patient,
    patientDrugs,
    ,
    ,
    ,
    patientNote,
    mmgNote
  ]) => {
    setDialog({
      ...dialog,
      patient,
      patientDrugs: patientDrugs.split(','),
      patientNote,
      selectedId,
      mmgNote
    });
  };

  const handleCloseDialog = save => async () => {
    if (save) {
      let receiverAttachments;
      if (dialogFiles.length) {
        try {
          // Turning File into base64 and mapping into an array with fileNames
          const base64Files = await Promise.all(dialogFiles.map(toBase64));
          receiverAttachments = base64Files.length
            ? base64Files.map((doc, idx) => {
                doc = doc.split(';base64,');
                const documentData = doc[1];
                const documentType = doc[0].slice(doc[0].indexOf(':') + 1);
                return {
                  id: null,
                  requestId: dialog.selectedId,
                  documentName: dialogFiles[idx].name,
                  documentType,
                  documentData,
                  owner: 'R'
                };
              })
            : receiverAttachments;
        } catch (error) {
          console.error(error);
          return;
        }
      }

      await handleChangeRequest(null, {
        id: dialog.selectedId,
        processedOn: Date.now(),
        status: dialog.dialogStatus,
        receiverNote: dialog.mmgNote,
        // eslint-disable-next-line camelcase
        paper_description: dialog.mmgCheck,
        receiverAttachments
      });
    }
    setDialog({ ...initialDialogState });
    setDialogFiles([]);
  };

  const handleRefresh = () => getRequests(queryString);

  return (
    <>
      <BackLink />
      <Paper className={classes.root}>
        <form className={classes.form} noValidate autoComplete="off">
          <FormLabel component="legend">Ricerca Paziente</FormLabel>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={2}>
              <TextField
                id="name"
                name="name"
                label="Nome"
                value={filters.name}
                fullWidth
                onChange={handleChange('name')}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                id="surname"
                name="surname"
                label="Cognome"
                fullWidth
                value={filters.surname}
                onChange={handleChange('surname')}
              />
            </Grid>
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
            <Grid item xs={12} sm={2} className={classes.gridBtn}>
              <IconButton
                color="primary"
                className={classes.openDialogBtn}
                aria-label="Refresh"
                onClick={handleRefresh}
              >
                <RefreshIcon />
              </IconButton>
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
                  name: 'patient',
                  label: 'Paziente',
                  options: {
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
                  name: 'genderAge',
                  label: 'Genere/Età',
                  options: {
                    customBodyRender: value => <GenderAge data={value} />,
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
                    customBodyRender: (value, tableMeta) => {
                      return (
                        <>
                          <span>
                            {(() => {
                              const req = requestStatuses.find(
                                req => req.id === value
                              );
                              return req ? req.description : undefined;
                            })()}
                          </span>
                          {value === 1 && (
                            <Button
                              className={classes.openDialogBtn}
                              variant="outlined"
                              color="primary"
                              onClick={() =>
                                handleOpenDialog(tableMeta.rowData)
                              }
                            >
                              Apri
                            </Button>
                          )}
                        </>
                      );
                    }
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
                rowsPerPageOptions: [5, 10, 25, 50, 100],
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
            {dialog.selectedId > 0 && (
              <MmgDialog
                files={dialogFiles}
                setFiles={setDialogFiles}
                dialog={dialog}
                handleClose={handleCloseDialog}
                handleChange={handleChange}
                requestStatuses={requestStatuses}
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

MmgDrugs.propTypes = {
  user: PropTypes.object.isRequired,
  requestStatuses: PropTypes.array.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MmgDrugs);
