import React from 'react'
import Avatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'

const CommonListItem = ({
   avatarSrc,
   primaryText,
   secondaryText,
   disease_names,
   patient_name,
}) => {
   return (
      <ListItem alignItems='flex-start'>
         <ListItemAvatar>
            <Avatar alt='Avatar' src={avatarSrc} />
         </ListItemAvatar>
         <ListItemText
            primary={primaryText}
            secondary={
               <React.Fragment>
                  <Typography
                     sx={{ display: 'inline' }}
                     component='span'
                     variant='body2'
                  >
                     {secondaryText}
                  </Typography>
                  <br />
                  <Typography
                     sx={{ display: 'inline' }}
                     component='span'
                     variant='body2'
                  >
                     {disease_names}
                  </Typography>
                  <br />
                  <Typography
                     sx={{ display: 'inline' }}
                     component='span'
                     variant='body2'
                  >
                     {patient_name}
                  </Typography>
               </React.Fragment>
            }
         />
      </ListItem>
   )
}

export default CommonListItem
