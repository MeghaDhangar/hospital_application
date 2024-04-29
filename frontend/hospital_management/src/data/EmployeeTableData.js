import { useState } from 'react'
import {
   Button,
   Dialog,
   DialogActions,
   DialogContent,
   DialogTitle,
   Divider,
   Grid,
   IconButton,
   Switch,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import FORM_VALIDATION from '@/components/FormValidation/employeeValidation'
import Typography from '@mui/material/Typography'
import { useAddEmployeeMutation } from '@/services/Query'
import { useGetEmployeeDetailsQuery } from './../services/Query'
import { useGetEmployeeQuery } from '@/services/Query'
import { useChangeEmpDataMutation } from '@/services/Query'
import { useChangeStatusMutation } from '@/services/Query'
import { Delete, Create, Visibility } from '@mui/icons-material'
import { useDeleteEmployeeMutation } from '@/services/Query'
import AddEmployee from '@/components/AddEmployee'
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material'
const GetStatusButton = (row) => {
   const [updateStatus] = useChangeStatusMutation()
   // eslint-disable-next-line no-unused-vars
   const [selectedRow, setSelectedRow] = useState(null)
   const [openModal, setOpenModal] = useState(false)
  

   const handleCloseModal = () => {
      setOpenModal(false)
   }
   const ChangeStatus = async () => {
      try {
         let obj = {
            id: row?.params?.row?.employee_id,
            pro: {
               employee_status: !row?.params?.row?.employee_status,
            },
         }
         const result = await updateStatus(obj)
         // Log the result to the console
         toast.success('Status Change Successfully')
         console.log('Result of updateStatus mutation:', result)
         handleCloseModal()
         
      } catch (error) {
         // Handle error
         console.error('Error changing status:', error)
      }
   }
   return (
      <div
         style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
         <Dialog open={openModal} >
            <DialogTitle
               style={{
                  boxShadow: 'box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px',
                   }}
            >
              <Typography variant="h5"> Confirmation for changing status </Typography>
            </DialogTitle>
            <IconButton
               aria-label='close'
               onClick={handleCloseModal}
               sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
               }}
            >
               <CloseIcon />
            </IconButton>
            <Divider />
            
            <DialogContent >
               <p>
                  Do you want to Change the Status for{' '}
                  <span className='Data'>{row?.params?.row?.employee_name}</span> ?
               </p>
            </DialogContent>
            <Divider />
            <DialogActions >
               <Button onClick={handleCloseModal} color='primary'  sx={{ marginBottom:1}} >
                  No
               </Button>
               <Button onClick={ChangeStatus} color='primary' variant='contained' sx={{marginRight:1, marginBottom:1}}>
                  Yes
               </Button>
            </DialogActions>
         </Dialog>
         <Switch
            checked={row?.params?.row?.employee_status}
            onClick={() => setOpenModal(true)}
            color='primary'
            size='small'
         />
      </div>
   )
}

const GetActionButton = (row) => {
   const [deleteEmployee] = useDeleteEmployeeMutation()
   const [updateEmployee] = useChangeEmpDataMutation()
   const [id, setId] = useState()
   const [skip, setskip] = useState(true)
   const {
      data: viewEmployee,
      isLoading,
      isSuccess,
   } = useGetEmployeeDetailsQuery(id, { skip: skip })

   const [selectedRow, setSelectedRow] = useState(null)
   const [openModal, setOpenModal] = useState(false)
   const [openEditModal, setOpenEditModal] = useState(false)
   const [openViewModal, setOpenViewModal] = useState(false)
   const [isDeleting, setIsDeleting] = useState(false);

   const INITIAL_FORM_STATE = {
      employee_name: row?.params?.row?.employee_name,
      employee_email: row?.params?.row?.employee_email,
      employee_number: row?.params?.row?.employee_number,
      employee_password: row?.params?.row?.employee_password, // not available
      employee_type: row?.params?.row?.employee_type,
      employee_role: row?.params?.row?.employee_role,
      employee_status: row?.params?.row?.employee_status,
      // created_by: 'admin',
      // updated_by: 'admin',
   }

   // eslint-disable-next-line no-unused-vars
   const [addemployee] = useAddEmployeeMutation() //for add employee form
   const handleRegister = async (values, { resetForm }) => {
      try {
         let obj = {
            id: row?.params?.row?.employee_id,
            pro: {
               employee_name: values.employee_name,
               employee_email: values.employee_email,
               employee_number: values.employee_number,
               employee_password: values.employee_password, // not available
               employee_type: values.employee_type,
               employee_role: values.employee_role,
               employee_status: values.employee_status,
            },
         }
         const result = await updateEmployee(obj)
         resetForm()
         console.log('Result of updateStatus mutation:', result)
         toast.success('Employee Updated Successfully')
         handleCloseEditModal(); 
         handleCloseModal()
      } catch (error) {
         // Handle error
         console.error('Error changing status:', error)
         toast.error('Error updating employee')
      }
   }
   // eslint-disable-next-line no-unused-vars
   const [pageState, setPageState] = useState({
      isLoding: false,
      data: [],
      total: 0,
      page: 1,
      pageSize: 5,
   })

   // eslint-disable-next-line no-unused-vars
   const { data: empData, isFetching: loadinData } = useGetEmployeeQuery(pageState, {
      refetchOnMountOrArgChange: true,
   })
   // eslint-disable-next-line no-unused-vars
   const [open] = useState(false)
   
   const handleDelete = () => {
      setSelectedRow(row.params.row)
      setOpenModal(true)
   }
   
   const handleEdit = () => {
      setSelectedRow(row.params.row)
      setOpenEditModal(true)
      console.log('Edit:', row)
   }
   const handleView = () => {
      setOpenViewModal(true)
      setskip(false)
      ViewEmployee(row.params.row)
   }
   const handleCloseModal = () => {
      setOpenModal(false)
   }
   const handleCloseEditModal = () => {
      setOpenEditModal(false)
   }
  
const handleConfirmDelete = async () => {
      setIsDeleting(true); // Set loading state to true during deletion
      try {
         // Assuming your API expects an employee ID for deletion
         const result = await deleteEmployee(selectedRow.employee_id);
        toast.success('Employee Deleted Successfully')
         // Log the result to the console
         console.log('Result of deleteEmployee mutation:', result);
         // Perform any additional logic after successful deletion
      } catch (error) {
         // Handle error
         console.error('Error deleting employee:', error);
        toast.error("Something went wrong")
      } finally {
         setIsDeleting(false); // Reset loading state after deletion (success or failure)
         handleCloseModal();
      }
   };
   const handleCloseViewModal = () => {
      setOpenViewModal(false)
   }
   const ViewEmployee = async (values) => {
      console.log('value', values)
      let obj = {
         id: row?.params?.row?.employee_id,
         pro: {
            employee_name: values.employee_name,
            employee_email: values.employee_email,
            employee_number: values.employee_number,
            employee_password: values.employee_password, // not available
            employee_type: values.employee_type,
            employee_role: values.employee_role,
            employee_status: values.employee_status,
         },
      }
      setId(obj.id)
      console.log(obj.pro.employee_email)
   }

   return (
      <div>
      {/* Loader component */}
      {isDeleting && (
         <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <CircularProgress />
         </div>
      )}
         <Dialog open={openModal}>
            <DialogTitle
               style={{
                  
                  boxShadow: 'box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px',
                  
               }}
            >
              <Typography variant="h5">Delete Confirmation</Typography> 
            </DialogTitle>
            <IconButton
               aria-label='close'
               onClick={handleCloseModal}
               sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
               }}
            >
               <CloseIcon />
            </IconButton>
            <Divider />
            <DialogContent>
               <p>
                  Do you want to delete the data for{' '}
                  <span className='Data'>{row?.params?.row?.employee_name}</span> ?
               </p>
            </DialogContent>
            <Divider />
            <DialogActions>
               <Button onClick={handleCloseModal} color='primary'  sx={{ marginBottom:1}}>
                  No
               </Button>
               <Button onClick={handleConfirmDelete} color='primary' variant='contained' sx={{marginRight:1, marginBottom:1}}>
                  Yes
               </Button>
            </DialogActions>
         </Dialog>
       {/* EDIT EMPLOYEE //////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
         <Dialog open={openEditModal} onClose={handleCloseEditModal} padding={3}>
            <DialogTitle> <Typography variant='h5'>Edit Employee</Typography> </DialogTitle>
            <Divider />
            <IconButton
               aria-label='close'
               onClick={handleCloseEditModal}
               sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
               }}
            >
               <CloseIcon />
            </IconButton>
            <Grid p={2}>
               <AddEmployee
                  initialState={INITIAL_FORM_STATE}
                  validationSchema={FORM_VALIDATION}
                  handleRegister={handleRegister}
                  disableEmail={true}
                  disablePass={true}
                  closeButton={
                     <Button
                        variant='contained'
                        color='primary'
                        onClick={handleCloseEditModal}
                        size='large'
                        sx={{
                           mr: 2,
                        }}
                     >
                        cancel
                     </Button>
                  }
               />
            </Grid>
         </Dialog>
         {/* view///////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
         <Dialog open={openViewModal} onClose={handleCloseViewModal} padding={3}>
            <DialogTitle><Typography variant='h5'> View Employee</Typography> </DialogTitle>
            <Divider />
            <DialogContent>
               {
                  isLoading && ("Loading...")
               }
               {
                  isSuccess && (<>
                     <DialogContent>
                        <Grid container justifyContent='space-between'>

                           <Grid item  >
                              <Typography variant='h6' color='primary' fontWeight='bold'>
                                 Name   : 
                              </Typography>
                              <Typography variant='h6' color='primary' fontWeight='bold'>
                                 Email  :
                              </Typography>
                              <Typography variant='h6' color='primary' fontWeight='bold'>
                                 Phone  :
                              </Typography>
                              <Typography variant='h6' color='primary' fontWeight='bold'>
                                 Role {" "}  : 
                              </Typography>
                              <Typography variant='h6' color='primary' fontWeight='bold'>
                                 Status :
                              </Typography>


                           </Grid>
                           <Grid item >
                              <Typography variant='h6' color='primary' fontWeight='bold'>
                                  {viewEmployee?.data?.employee_name}
                              </Typography>
                              <Typography variant='h6' color='primary' fontWeight='bold'>
                                  {viewEmployee?.data?.employee_email}
                              </Typography>
                              <Typography variant='h6' color='primary' fontWeight='bold'>
                                  {viewEmployee?.data?.employee_number}
                              </Typography>
                              <Typography variant='h6' color='primary' fontWeight='bold'>
                                  {viewEmployee?.data?.employee_role}
                              </Typography>
                              <Typography variant='h6' color='primary' fontWeight='bold'>
                                  {viewEmployee?.data?.employee_status ? "Active" : "Inactive"}
                              </Typography>

                           </Grid>
                        </Grid>
                     </DialogContent>

                  </>)
               }

            </DialogContent>
            <IconButton
               aria-label='close'
               onClick={handleCloseViewModal}
               sx={{
                  position: 'absolute',
                  right: 10,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
               }}
            >
               <CloseIcon />
            </IconButton>
         </Dialog>
         
         <IconButton onClick={handleDelete} color='primary' size='small'>
            <Delete />
         </IconButton>
         {/* dont fill the color in the delete button just outlineit */}
         <IconButton onClick={handleEdit} color='primary' size='small'>
            <Create />
         </IconButton>
         <IconButton onClick={handleView} color='primary' size='small'>
            <Visibility />
         </IconButton>
      </div>
   )
}
export const columns = [
   {
      field: 'employee_name',
      headerName: 'Name',
      minWidth: 170,
      headerClassName: 'header',
      headerAlign: 'center',
      align: 'left',
      cellClassName: 'column-line',
      sortable: false,
      flex: 1,
   },
   {
      field: 'employee_email',
      headerName: 'Email',
      minWidth: 240,
      headerClassName: 'header',
      headerAlign: 'center',
      align: 'left',
      cellClassName: 'column-line',
      sortable: false,
      flex: 1,
   },
   {
      field: 'employee_number',
      headerName: 'Phone',
      minWidth: 170,
      headerClassName: 'header',
      headerAlign: 'center',
      align: 'left',
      cellClassName: 'column-line',
      sortable: false,
      flex: 1,
   },
   {
      field: 'employee_role',
      headerName: 'Role',
      minWidth: 80,
      maxWidth: 120,
      headerClassName: 'header',
      headerAlign: 'center',
      align: 'left',
      cellClassName: 'column-line',
      sortable: false,
      flex: 1,
   },
   {
      field: 'Status',
      headerName: 'Status',
      headerClassName: 'header',
      cellClassName: 'column-line',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      sortable: false,
      renderCell: (params) => <GetStatusButton params={params} />,
   },
   {
      field: 'Actions',
      headerName: 'Actions',
      headerClassName: 'headerlast',
      align: 'center',
      cellClassName: 'column-linelast',
      headerAlign: 'center',
      flex: 1,
      sortable: false,
      renderCell: (params) => <GetActionButton params={params} />,
   },
]
