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

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', dob: '10/9/2000'},
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', dob: '10/9/2000' },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', dob: '10/9/2000' },
  { id: 4, lastName: 'Stark', firstName: 'Arya', dob: '10/9/2000' },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', dob: null },
  { id: 6, lastName: 'Melisandre', firstName: null, dob: '10/9/2000' },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', dob: '10/9/2000' },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', dob: '10/9/2000' },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', dob: '10/9/2000' },
  { id: 10, lastName: 'Snow', firstName: 'Jon', dob: '10/9/2000'},
  { id: 11, lastName: 'Lannister', firstName: 'Cersei', dob: '10/9/2000' },
  { id: 12, lastName: 'Lannister', firstName: 'Jaime', dob: '10/9/2000' },
  { id: 13, lastName: 'Stark', firstName: 'Arya', dob: '10/9/2000' },
  { id: 14, lastName: 'Targaryen', firstName: 'Daenerys', dob: null },
  { id: 15, lastName: 'Melisandre', firstName: null, dob: '10/9/2000' },
  { id: 16, lastName: 'Clifford', firstName: 'Ferrara', dob: '10/9/2000' },
  { id: 17, lastName: 'Frances', firstName: 'Rossini', dob: '10/9/2000' },
  { id: 18, lastName: 'Roxie', firstName: 'Harvey', dob: '10/9/2000' },
];

export const DataTable = () => {
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