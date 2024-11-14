import { CaseReducer, createReducer, PayloadAction } from "@reduxjs/toolkit";
import { initialize, login, logout } from "./action";

export type AuthState = {
  user: any
}

const initialState: AuthState = {
  user: null
}

const setUser: CaseReducer<AuthState, PayloadAction> = (state, action) => {
  state.user = action.payload;
  return state;
}

export const reducer = createReducer<AuthState>(initialState, (builder) => {
  builder.addCase(login.fulfilled, setUser);
  builder.addCase(initialize.fulfilled, setUser);
  builder.addCase(logout.fulfilled, () => {
    return initialState;
  });
})