import React from 'react';
import MUIDataTable from 'mui-datatables';
import { muiTableTextLabels } from '../../configs';

const Patients = props => {
  const options = {
    textLabels: muiTableTextLabels,
    responsive: 'scrollMaxHeight',
    print: false,
    download: false,
    filter: false
  };

  const data = [
    ['Zuin Orfeo', 'Business Analyst', 'Minneapolis', 30, '$100,000'],
    ['Aiden Lloyd', 'Business Consultant', 'Dallas', 55, '$200,000'],
    ['Jaden Collins', 'Attorney', 'Santa Ana', 27, '$500,000'],
    ['Gabby George', 'Business Analyst', 'Minneapolis', 30, '$100,000'],
    ['Aiden Lloyd', 'Business Consultant', 'Dallas', 55, '$200,000'],
    ['Jaden Collins', 'Attorney', 'Santa Ana', 27, '$500,000']
  ];

  const columns = ['Name', 'Title', 'Location', 'Age', 'Salary'];

  return (
    <MUIDataTable
      title={'Scegli il Paziente'}
      data={data}
      columns={columns}
      options={options}
    />
  );
};

export default Patients;
