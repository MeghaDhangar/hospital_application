'use  client'
import { useUser } from '@auth0/nextjs-auth0/client'

const Test = () => {
   const { user, isLoading } = useUser()

   return (
      <div className='nav-container' data-testid='navbar'>
         {user && (
            <>
               <div>
                  <a href='/csr' className='nav-link' testId='navbar-csr'>
                     Client-side rendered page
                  </a>
               </div>
               <div>
                  <a href='/ssr' className='nav-link' testId='navbar-ssr'>
                     Server-side rendered page
                  </a>
               </div>
               <div>
                  <a href='/external' className='nav-link' testId='navbar-external'>
                     External API
                  </a>
               </div>
            </>
         )}

         {!isLoading && !user && (
            <div>
               <a
                  href='/api/auth/login'
                  className='btn btn-primary btn-margin'
                  tabIndex={0}
               >
                  Log in
               </a>
            </div>
         )}
         {user && (
            <div>
               <img
                  src={user.picture}
                  alt='Profile'
                  className='nav-user-profile rounded-circle'
                  width='50'
                  height='50'
                  data-testid='navbar-picture-desktop'
               />

               {user.name}
               <a href='/api/auth/logout' icon='power-off'>
                  Log out
               </a>
            </div>
         )}
         {!isLoading && !user && (
            <a
               href='/api/auth/login'
               className='btn btn-primary btn-block'
               tabIndex={0}
            >
               Log in
            </a>
         )}
         {user && (
            <span className='user-info'>
               <img
                  src={user.picture}
                  alt='Profile'
                  className='nav-user-profile d-inline-block rounded-circle mr-3'
                  width='50'
                  height='50'
                  decode='async'
                  data-testid='navbar-picture-mobile'
               />
               {user.name}

               <a
                  href='/api/auth/logout'
                  className='btn btn-link p-0'
                  icon='power-off'
                  testId='navbar-logout-mobile'
               >
                  Log out
               </a>
            </span>
         )}
      </div>
   )
}

export default Test
