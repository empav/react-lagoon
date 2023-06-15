import { useState } from 'react';
import Toast from '../../../../errors/Toast';
import { findRequests } from '../../../../backend';
import { DATE_FORMAT } from '../../../configs';
import dayjs from 'dayjs';

const useRequests = (initialQueryString, initialPagination, append = false) => {
  const [queryString, setQueryString] = useState(initialQueryString);
  const [pagination, setPagination] = useState(initialPagination);
  const [requests, setRequests] = useState([]);

  const getRequests = async () => {
    try {
      const { items: reqsToMap, total } = await findRequests(queryString);
      if (Array.isArray(reqsToMap)) {
        const reqs = reqsToMap.map(req => {
          return {
            ...req,
            createdOn: dayjs(req.createdOn).format(DATE_FORMAT),
            createdOnOriginal: req.createdOn,
            patient: `${req.applicant.surname} ${req.applicant.name}`,
            genderAge: [req.applicant.gender, req.applicant.birthDate]
          };
        });
        setRequests(append ? [...requests, ...reqs] : reqs);
        setPagination({ ...pagination, total });
      }
    } catch (error) {
      console.error(error);
      Toast.error(error.userMessage || 'Non riesco a recuperare le richieste');
    }
  };

  return [
    requests,
    getRequests,
    pagination,
    setPagination,
    queryString,
    setQueryString
  ];
};

export default useRequests;
