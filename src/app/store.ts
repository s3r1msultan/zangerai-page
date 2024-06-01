import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import chatReducer from "./chat/chatSlice";
import documentsReducer from "./document/documentSlice";
import lawCompanyReducer from "./lawCompany/lawCompanySlice";

const store = configureStore({
  reducer: combineReducers({
    auth: authReducer,
    chat: chatReducer,
    documents: documentsReducer,
    lawCompanies: lawCompanyReducer,
  }),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
