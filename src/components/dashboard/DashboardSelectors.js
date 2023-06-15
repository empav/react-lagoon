export const getRequestStatusesSelector = state =>
  state.dashboard && state.dashboard.dom
    ? state.dashboard.dom.requestStatuses
    : [];
