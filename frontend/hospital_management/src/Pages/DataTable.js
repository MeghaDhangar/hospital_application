'use client'
// import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid'

const columns = [
   {
      field: 'id',
      headerName: 'Header 1',
      width: 160,
      align: 'center',
      headerClassName: 'header1 column-line',
      cellClassName: 'column-line',
      sortable: false,
      headerAlign: 'center',
   },
   {
      field: 'firstName',
      headerName: 'Header 2',
      width: 160,
      align: 'center',
      headerClassName: 'header2 column-line',
      cellClassName: 'column-line',
      sortable: false,
      headerAlign: 'center',
   },
   {
      field: 'lastName',
      headerName: 'Header 3',
      width: 160,
      align: 'center',
      headerClassName: 'header34 column-line',
      cellClassName: 'column-line',
      sortable: false,
      headerAlign: 'center',
   },
   {
      field: 'age',
      headerName: 'Header 4',
      type: 'number',
      width: 160,
      align: 'center',
      headerClassName: 'header34 column-line',
      cellClassName: 'column-line',
      sortable: false,
      headerAlign: 'center',
   },
   {
      field: 'fullName',
      headerName: 'Header 5',
      description: 'This column has a value getter and is not sortable.',
      width: 160,
      align: 'center',
      headerClassName: 'header5',
      headerAlign: 'center', // Center header text
      headerTextStyle: { padding: '0', boxSizing: 'border-box' }, // Set padding to 0
      cellClassName: 'column-line', // Add column line to cells, but not the header
      sortable: false,
      valueGetter: (params) =>
         `${params.row.firstName || ''} ${params.row.lastName || ''}`,
   },
]

const rows = [
   { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
   { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
   { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
   { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
   { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
   { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
   { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
   { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
   { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
]

// Custom CSS styles for zebra striping, header background colors, and column lines
const customStyles = `
  .MuiDataGrid-root .MuiDataGrid-row:nth-child(even) {
    background-color: #E6E8F0;
  }
  .MuiDataGrid-root .MuiDataGrid-row:nth-child(odd) {
    background-color: #f0f2fa;
  }

  .header1 {
    background-color: #aee3f0 !important;
  }

  .header2 {
    background-color: #35cff4 !important;
  }

  .header34 {
    background-color: #006494 !important;
    color: white;
  }

  .header5 {
    background-color: #13293d !important;
    color: white;
  }

  .column-line {
    border-right: 2px solid #13293D !important; // Adjust the color as needed
    padding-right: 8px; // Add padding to separate the text from the line
  }
  .MuiDataGrid-root .MuiDataGrid-colCell:not(.MuiDataGrid-colCellCheckbox):not(.MuiDataGrid-colCellSorted):not(.MuiDataGrid-colCellMoving) .MuiDataGrid-columnSeparator,
  .MuiDataGrid-root .MuiDataGrid-colCell:not(.MuiDataGrid-colCellCheckbox):not(.MuiDataGrid-colCellSorted):not(.MuiDataGrid-colCellMoving) .MuiDataGrid-sortIcon {
    display: none !important;
  }
`

export default function DataTable() {
   return (
      <div>
         {/* Include the custom styles using a style tag */}
         <style>{customStyles}</style>

         <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            pageSizeOptions={[5, 10, 15, 20]}
            disableColumnMenu // Disable the column menu (three dots icon)
         />
      </div>
   )
}
