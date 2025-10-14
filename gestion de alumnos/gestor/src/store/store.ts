import { configureStore } from '@reduxjs/toolkit'
import studentsReducer from './slices/studentsSlice'
import classesReducer from './slices/classesSlice'

export const store = configureStore({
  reducer: {
    students: studentsReducer,
    classes: classesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch