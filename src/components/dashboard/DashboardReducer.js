import { GET_REQUEST_STATUSES } from './DashboardActions';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';

export default (state = {}, action) => {
  let newState;
  switch (action.type) {
    case GET_REQUEST_STATUSES:
      newState = cloneDeep(state);
      newState.dom = newState.dom
        ? merge(newState.dom, { requestStatuses: action.data })
        : { requestStatuses: action.data };
      return newState;
    default:
      return state;
  }
};
