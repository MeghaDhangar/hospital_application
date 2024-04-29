'use client'
// import { Transcribe, Translate } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid'

const customstyles = `
.MuiDataGrid-root .MuiDataGrid-row:nth-child(even) {
  background-color: #E6E8F0;
}
.MuiDataGrid-root .MuiDataGrid-row:nth-child(odd) {
  background-color: #f0f2fa;
}
  .header{
    background-color: #006494 !important;
    color: white;
    border-right: 3px solid #89949E !important; 
    border-bottom: 3px solid #89949E !important;
    font-size: .8rem;
    font-family: Verdana

  }
  .headerlast{
    background-color: #006494 !important;
    color: white;
    border-radius:'10px !important';
    border-bottom: 3px solid #89949E !important;
    font-size: .8rem;
    font-family: Verdana;
    font-weight: bolder
  }
  .column-line {
    border-right: 1px solid #89949E !important; // Adjust the color as needed
    padding-right: 8px; // Add padding to separate the text from the line
  }
  .css-jv5jpm-MuiDataGrid-root .MuiDataGrid-columnSeparator{
    display: none;
  }
  .MuiDataGrid-footerContainer.MuiDataGrid-withBorderColor {
    display: none;
  }
  .MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation24.MuiDialog-paper.MuiDialog-paperScrollPaper.MuiDialog-paperWidthSm.css-1t1j96h-MuiPaper-root-MuiDialog-paper {
    height: auto;
    border: 1px solid white;
    border-radius: 12px;
    box-shadow: box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  }
  .css-1yosu3z-MuiTypography-root-MuiDialogTitle-root{
    font-size : 1.5rem !important
  }
  .Data{
    color:red;
    font-weight:bold
  }
  .No{
    background-color: rgba(19, 41, 61, 0.04) !important;
    border: 1px solid primary !important;
  }
  .css-1kyp2zt-MuiButtonBase-root-MuiButton-root:hover {
    background-color:red;
    color:white
  }
  .No:hover{
   color: black !important
  
  }
  
`

export default function Datagrid(props) {
   const { data, columns } = props

   return (
      <div style={{ overflow: 'hidden', margin: '0' }}>
        
         <div
            style={{
               transform: 'translate(-50%, -50%)',
               position: 'absolute',
               left: '50%',
               top: '50%',
               border: '2px solid #89949E',
               borderRadius: '5px',
            }}
         >
            <style>{customstyles}</style>
            <DataGrid
               rows={data?.length > 0 ? data : []}
               columns={columns}
               getRowId={(row) => row?.employee_id}
               checkboxSelection={false}
               rowHeight={35}
               columnHeaderHeight={40}
               disableColumnMenu
            />
         </div>
      </div>
   )
}
 