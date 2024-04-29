'use client'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CustomProvider from '@/redux/CustomProvider'
import { Inter } from 'next/font/google'
import { themeOptions } from '@/styles/theme'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import NextTopLoader from 'nextjs-toploader'
import SteperNav from '@/components/SteperNav'
import Footer from '@/components/Footer'
import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })
const theme = createTheme(themeOptions)
import { ErrorBoundary } from "react-error-boundary";

function fallbackRender({ error }) {
   // Call resetErrorBoundary() to reset the error boundary and retry the render.

   return (
      <div role="alert">
         <p>Something went wrong:</p>
         <pre style={{ color: "red" }}>{error.message}</pre>
      </div>
   );
}
export default function RootLayout({ children }) {
   const path = usePathname()

   let isShow = false
   if (path.includes('dashboard')) {
      isShow = true
   }

   return (
      <html lang='en'>
         <body className={inter.className}>
            <ErrorBoundary
               fallbackRender={fallbackRender}
            >
               <UserProvider>
                  <ToastContainer
                     position={'top-right'}
                     close
                     on
                     click={true}
                     pauseOnHover={false}
                     pauseOnFocusLoss={false}
                     autoClose={2000}
                     draggable={true}
                     closeButton={<p>Close</p>}
                  />
                  <CustomProvider>
                     <ThemeProvider theme={theme}>
                        <NextTopLoader />
                        {isShow ? null : <SteperNav />}
                        {children}
                        {isShow ? null : <Footer />}
                     </ThemeProvider>
                  </CustomProvider>
               </UserProvider>
            </ErrorBoundary>
         </body>
      </html>
   )
}
