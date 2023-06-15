import {
  UPDATE_PRINCIPAL_FROM_STORAGE,
  FIND_PRINCIPAL,
  FIND_NOTICES,
  LOGIN,
  LOGOUT
} from './UserActions';
import cloneDeep from 'lodash/cloneDeep';

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case FIND_NOTICES:
      return cloneDeep({ ...state, notices: action.notices });

    case UPDATE_PRINCIPAL_FROM_STORAGE:
    case LOGIN:
    case FIND_PRINCIPAL:
      return cloneDeep({ ...state, ...action.data });

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
};
