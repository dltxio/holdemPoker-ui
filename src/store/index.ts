import { configureStore } from '@reduxjs/toolkit';
import { reducer as global } from '@/store/global';
import { reducer as auth } from '@/modules/auth/store';
import { reducer as user } from '@/modules/user/store';

const store = configureStore({
  reducer: {
    global,
    auth,
    user,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;