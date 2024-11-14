import HTTP from '@/core/http';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { createAppAsyncThunk } from '@/store/thunk';

export const createAuthAction = (action: string) => createAction(`auth/${action}`);

export const login = createAsyncThunk('auth/login', (data: {username: string, password: string}) => {
  return HTTP.post(`auth/login`, data);
});

export const register = createAuthAction('login');

export const listOneAffiliate = createAppAsyncThunk('listOneAgen', async (data: any, ctx) => {
  const user: any = ctx.getState().auth.user;
  return await HTTP.post(`listOneAgen`, {
    // ...data,
    // name: user.name,
    // mobile: user.mobile,
    userName: user.userName,
    // role: user.role
  }).then(res => ({
    ...res.data,
    result: res.data.result || []
  }))
});

export const listAgentPlayerChips = createAppAsyncThunk('listAgentPlayerChips', async (data: any) => {
  return await HTTP.post('listAgentPlayerChips', {}).then(res => ({
    ...res.data,
    result: res.data.result || []
  }))
});