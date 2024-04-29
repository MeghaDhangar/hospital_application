'use client'

import { configureStore } from '@reduxjs/toolkit'
import user from './slice/user'
import { queries } from '@/services/Query'

const Store = configureStore({
   reducer: {
      userInfo: user,
      [queries.reducerPath]: queries.reducer,
   },
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(queries.middleware),
})

export default Store
