import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  },
  {
    field: 'dob',
    headerName: 'Date of Birth',
    sortable: false,
    width: 190,
  },
    {
    field: 'classes',
    headerName: 'Enrolled Classes',
    sortable: false,
    width: 550,
  },
];

export const DataTable = ({ students }) => {
  const rows = students.map(student => ({
    id: student.id,
    firstName: student.name.split(' ')[0], // Assuming the Name field contains the full name
    lastName: student.name.split(' ')[1] || '', // Splitting into first and last name
    dob: student.dob,
    classes: student.classes.join(', '), // Join classes with a comma and space
  }));
  
  
  
  return (
    <div style={{ height: 575, width: '90%' }} className='datatable'>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[10, 20]}
        checkboxSelection
      />
    </div>
  );
}