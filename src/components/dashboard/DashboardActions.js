import { getRequestStatuses } from '../../backend';

export const GET_REQUEST_STATUSES = 'GET_REQUEST_STATUSES';

export const getRequestStatusesRedux = () => async dispatch => {
  const data = await getRequestStatuses();
  dispatch({
    type: GET_REQUEST_STATUSES,
    data
  });
};
