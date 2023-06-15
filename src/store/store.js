import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import DashboardReducer from '../components/dashboard/DashboardReducer';
import UserReducer from '../components/user/UserReducer';

export const rootReducer = combineReducers({
  dashboard: DashboardReducer,
  user: UserReducer
});

export default createStore(
  rootReducer,
  {},
  composeWithDevTools(applyMiddleware(thunk))
);
