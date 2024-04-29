'use client'
import { DataGrid } from '@mui/x-data-grid'
import { useEffect, useState } from 'react';

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
    font-size: 0.8rem;
    font-family: Verdana
  }
  .headerlast{
    background-color: #006494 !important;
    color: white;
    border-radius:'10px !important';
    border-bottom: 3px solid #89949E !important;
    font-size: 0.8rem;
    font-family: Verdana;
  }
  
  .column-line {
    border-right: 1px solid #89949E !important; // Adjust the color as needed
    padding-right: 8px; // Add padding to separate the text from the line
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
    font-weight:bold
  }
  .No{
    background-color: rgba(19, 41, 61, 0.04) !important;
    border : 1px solid #13293D !important;
  }
  .css-1kyp2zt-MuiButtonBase-root-MuiButton-root:hover {
    color:white
  }
  .No:hover{
   color: black !important ;
  }
  .css-jv5jpm-MuiDataGrid-root .MuiDataGrid-columnSeparator{
    display: none !important;
  }
  .css-tdqsw7-MuiDataGrid-root .MuiDataGrid-iconSeparator{
    display: none !important;
  }`

export default function DataGridTable(props) {
   const {
      data,
      columns,
      map_by,
      loadinData,
      pageState,
      setPageState
   } = props;
 const [paginationModel, setPaginationModel] = useState({
    page: 1,
    pageSize: 5,
 })

 useEffect(() => {
  if (paginationModel) {
     setPageState({
        isLoding: pageState?.isLoding,
        data: pageState?.data,
        total: data?.count,
        page: paginationModel?.page,
        pageSize: paginationModel?.pageSize,
     })
  }
}, [data?.count, pageState?.data, pageState?.isLoding, paginationModel])

   return (
      <>
         <style>{customstyles}</style>

         <DataGrid
            rows={data?.results || []}
            columns={columns}
            loading={loadinData}
            getRowId={map_by}
            pageSizeOptions={[5, 10, 25]}
            localeText={{
               MuiTablePagination: {
                  labelDisplayedRows: () =>
                     `Showing page ${Math.ceil(
                        data?.current_page_number
                     )} of ${Math.ceil(data?.total_pages)} pages`,
               },
            }}
            checkboxSelection={false}
            rowCount={data?.count + data?.page_size}
            paginationModel={paginationModel}
            paginationMode='server'
            onPaginationModelChange={setPaginationModel}
            disableColumnMenu
         />
      </>
   )
}

