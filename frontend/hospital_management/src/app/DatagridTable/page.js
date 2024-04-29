'use client'
// import React from 'react'
import Datagrid from './Datagrid'
// import { DataGrid } from '@mui/x-data-grid';
import { columns } from '../../data/EmployeeTableData'
import { useGetEmployeeQuery } from '@/services/Query'

function page() {
   const { data: empData, isSuccess } = useGetEmployeeQuery()
   console.log(empData)
   return (
      <div>
         {isSuccess && <Datagrid data={empData?.data || []} columns={columns} />}
         {!isSuccess && <>loading...</>}
      </div>
   )
}

export default page
