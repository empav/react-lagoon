import React from 'react';
import PropTypes from 'prop-types';
import { isMmg, isPatient } from '../../utils/RoleUtils';
import NoticesDesktop from './NoticesDesktop';
import NoticesMobile from './NoticesMobile';
import isMobile from '../../utils/Detect';

const Notices = ({ user, findNotices }) => {
  return isMmg(user) ? (
    <NoticesDesktop user={user} />
  ) : isPatient(user) ? (
    isMobile() ? (
      <NoticesMobile user={user} findNotices={findNotices} />
    ) : (
      <NoticesDesktop user={user} />
    )
  ) : (
    false
  );
};

Notices.propTypes = {
  user: PropTypes.object.isRequired
};

export default Notices;
