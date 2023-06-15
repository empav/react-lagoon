import isObject from 'lodash/isObject';

export const isMmg = (user = {}) => {
  return user.roles
    ? isObject(user.roles.find(role => role.code === 'ROLE_MMG'))
    : false;
};

export const isPatient = user => {
  const { roles } = user;

  return isObject(roles.find(role => role.code === 'ROLE_PATIENT'));
};

export const isAdmin = user => {
  const { roles } = user;

  return isObject(roles.find(role => role.code === 'ROLE_ADMIN'));
};
