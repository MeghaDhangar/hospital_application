import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge'

export const config = {
   matcher: ['/((?!api|about|any|_next/static|_next/image|favicon.ico|$).*)'],
}

export default withMiddlewareAuthRequired()
