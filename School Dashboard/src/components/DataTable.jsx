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
    headerName: 'Enrolled Classes', // Default column name
    sortable: false,
    width: 550,
  },
];

export const DataTable = ({ isTeacher, group }) => {
  // Modify columns based on whether it's a teacher or a student
  const modifiedColumns = columns.map(column => {
    if (column.field === 'classes') {
      return {
        ...column,
        headerName: isTeacher ? 'Classes Taught' : 'Enrolled Classes',
      };
    }
    return column;
  });

  const rows = group.map(entry => ({
    id: entry.id,
    firstName: entry.name.split(' ')[0],
    lastName: entry.name.split(' ')[1] || '',
    dob: entry.dob,
    classes: entry.classes.join(', '),
  }));

  return (
    <div style={{ height: 500, width: '90%' }} className='datatable'>
      <DataGrid
        rows={rows}
        columns={modifiedColumns}
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
};
