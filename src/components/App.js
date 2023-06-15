import React from 'react';
import { connect } from 'react-redux';
import getRoutes from '../routes';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DayjsUtils from '@date-io/dayjs';

const App = props => {
  return (
    <MuiPickersUtilsProvider utils={DayjsUtils}>
      {getRoutes(props)}
    </MuiPickersUtilsProvider>
  );
};

const mapStateToProps = state => {
  const { user } = state;

  return {
    user
  };
};

export default connect(mapStateToProps)(App);
