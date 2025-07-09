import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import generalReducer from "./slices/generalSlice";
import pagesReducer from "./slices/pagesSlice";
import promosReducer from "./slices/promosSlice";
import newsReducer from "./slices/newsSlice";
import brandsCoreReducer from "./slices/brandsCoreSlice";
import brandsReviewReducer from "./slices/brandsReviewSlice";
import brandsProductReducer from "./slices/brandsProductSlice";
import sourcesCoreReducer from "./slices/sourcesCoreSlice";
import sourcesDetailReducer from "./slices/sourcesDetailSlice";
import sourcesReviewReducer from "./slices/sourcesReviewSlice";
import sourcesDashboardReducer from "./slices/sourcesDashboardSlice";
import communityUserReducer from "./slices/communityUserSlice";
import communityPostReducer from "./slices/communityPostSlice";
import communityGroupsReducer from "./slices/communityGroupsSlice";
import communityNotificationReducer from "./slices/communityNotificationSlice";
import usersAuthReducer from "./slices/usersAuthSlice";
import usersProfileReducer from "./slices/usersProfileSlice";
import usersMessageReducer from "./slices/usersMessageSlice";

export const store = configureStore({
  reducer: {
    general: generalReducer,
    pages: pagesReducer,
    promos: promosReducer,
    news: newsReducer,
    brandsCore: brandsCoreReducer,
    brandsReview: brandsReviewReducer,
    brandsProduct: brandsProductReducer,
    sourcesCore: sourcesCoreReducer,
    sourcesDetail: sourcesDetailReducer,
    sourcesReview: sourcesReviewReducer,
    sourcesDashboard: sourcesDashboardReducer,
    communityUser: communityUserReducer,
    communityPost: communityPostReducer,
    communityGroups: communityGroupsReducer,
    communityNotification: communityNotificationReducer,
    usersAuth: usersAuthReducer,
    usersProfile: usersProfileReducer,
    usersMessage: usersMessageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["payload.timestamp"],
        ignoredPaths: ["payload.timestamp"],
      },
    }),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
