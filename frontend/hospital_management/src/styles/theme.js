import { color, createTheme } from "@mui/system"

export const colors = {
   primary: '#13293D',
   secondary: '#35CFF4',
   info: '#D3E3F7',
   success: '#826AF9',
   warning: '#F5A623',
   danger: '#D0021B',
   error: '#d32f2f',
   white: '#fff',
   black: '#000',
   gray: '#A7AFB7',
   background: '#F0F2FA',
}

export const themeOptions = {
   palette: {
      mode: 'light',
      primary: {
         main: colors.primary,
      },
      secondary: {
         main: colors.secondary,
      },
      info: {
         main: colors.info,
      },
      success: {
         main: colors.success,
      },
   },

   // Typography overrides
   components: {
      MuiDrawer: {
         styleOverrides: {
            paper: {
               backgroundColor: colors.primary,
               color: colors.white,
            },
         },
      },
   },




   typography: {
      h1: {
         fontSize: '3rem',
         fontWeight: 'bold',
      },
      h2: {
         fontSize: '2.5rem',
         fontWeight: 'bold',
      },
      h3: {
         fontSize: '2rem',
         fontWeight: 'bold',
      },
      h4: {
         fontSize: '1.5rem',
         fontWeight: 'bold',
         // marginblockstart:''
      },
      h5: {
         fontSize: '1.2rem',
         fontWeight: 'bold',
      },
      h6: {
         fontSize: '1rem',
         fontWeight: 'bold',
      },
      subtitle1: {
         fontSize: '1.2rem',
         fontWeight: 'bold',
      },
      subtitle2: {
         fontSize: '1rem',
         fontWeight: 'bold',
      },
      body1: {
         fontSize: '1rem',
      },
      body2: {
         // fontSize: '0.8rem',
      },
      caption: {
         fontSize: '0.6rem',
      },
      button: {
         fontSize: '1rem',
         fontWeight: 'bold',
      },
      overline: {
         fontSize: '0.6rem',
      },
   },
}
