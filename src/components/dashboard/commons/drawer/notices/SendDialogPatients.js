import React from 'react';
import { muiTableTextLabels } from '../../../../configs';
import MUIDataTable from 'mui-datatables';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
  gridBtn: {
    display: 'flex',
    alignItems: 'flex-end'
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: theme.spacing(2)
  },
  patientsTable: {
    boxShadow: 'none'
  }
}));

const SendDialogPatients = ({
  data: { patients = [], searchTerm = '' },
  pagination,
  setPagination,
  rowsSelected,
  setSelected,
  handleChange
}) => {
  const classes = useStyles();

  return (
    <>
      <form className={classes.form} noValidate autoComplete="off">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              id="searchTerm"
              name="searchTerm"
              label="Paziente"
              fullWidth
              value={searchTerm}
              onChange={handleChange('searchTerm')}
            />
          </Grid>
          <Grid item xs={12} sm={2} className={classes.gridBtn}>
            <Button variant="contained" color="primary" onClick={() => {}}>
              Cerca
            </Button>
          </Grid>
        </Grid>
      </form>
      {patients.length > 0 && (
        <MUIDataTable
          className={classes.patientsTable}
          data={patients}
          columns={[
            {
              name: 'surname',
              label: 'Cognome'
            },
            {
              name: 'name',
              label: 'Nome'
            },
            {
              name: 'fiscalCode',
              label: 'Codice Fiscale'
            }
          ]}
          options={{
            textLabels: muiTableTextLabels,
            responsive: 'scrollMaxHeight',
            print: false,
            download: false,
            filter: false,
            search: false,
            viewColumns: false,
            selectableRows: 'single',
            serverSide: true,
            count: pagination.total,
            page: pagination.offset,
            rowsPerPage: pagination.limit,
            rowsPerPageOptions: [5, 10, 25],
            selectableRowsHeader: false,
            rowsSelected,
            onRowsSelect: (rowsSelected, allRows) => {
              const selected = allRows.map(row => row.dataIndex);
              setSelected(selected);
            },
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
      )}
    </>
  );
};

SendDialogPatients.propTypes = {
  data: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default SendDialogPatients;
