export const selectUser = ({ user }) => user;
export const selectNotices = ({ user }) => (user ? user.notices : []);
