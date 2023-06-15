import React from 'react';
import PropTypes from 'prop-types';
import PatientDrugsMobile from './PatientDrugsMobile';
import { isMmg, isPatient } from '../../utils/RoleUtils';
import MmgDrugs from './MmgDrugs';
import isMobile from '../../utils/Detect';
import PatientDrugs from './PatientDrugs';

// const Drugs = ({ user }) => {
//   return <PatientDrugsMobile user={user} />;
// };

const Drugs = ({ user }) => {
  return isMmg(user) ? (
    <MmgDrugs user={user} />
  ) : isPatient(user) ? (
    isMobile() ? (
      <PatientDrugsMobile user={user} />
    ) : (
      <PatientDrugs user={user} />
    )
  ) : (
    false
  );
};

Drugs.propTypes = {
  user: PropTypes.object.isRequired
};

export default Drugs;
