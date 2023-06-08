import { isDev } from '@/packages/ui/utils/dev';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import app from './features/app';
import authApi from './features/auth';
import library from './features/library';
import widgets from './features/widgets';

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [app.name]: app.reducer,
    [widgets.name]: widgets.reducer,
    [library.name]: library.reducer,
  },
  devTools: isDev,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['widgets/resolve', 'library/update'],
        // Ignore these field paths in all actions
        // Ignore these paths in the state
        ignoredPaths: [/^widgets\./],
      },
    }).concat(authApi.middleware),
  enhancers: [],
  preloadedState: {},
});

setupListeners(store.dispatch);

export type Store = typeof store;
export type State = ReturnType<Store['getState']>
export type Action = Parameters<Store['dispatch']>[0]

export default store;
