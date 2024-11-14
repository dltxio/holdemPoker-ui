import { LOCAL_USER_KEY } from '@/configs/auth.config';
import cache from '@/core/cache';
import HTTP from '@/core/http';
import { sleep } from '@/core/sleep';
import {createAction, createAsyncThunk} from '@reduxjs/toolkit';

export const createAuthAction = (action: string, payload?: any) => createAction(`auth/${action}`, payload);

export const getLocalUser = () => cache.getCache(LOCAL_USER_KEY)
export const saveLocalUser = (data: any) => cache.setCache(LOCAL_USER_KEY, data, 3600)
export const removeLocalUser = () => cache.remove(LOCAL_USER_KEY)

export const initialize = createAsyncThunk('auth/initailize', (params, ctx) => {
  const localUser = getLocalUser();
  console.log('localUser', localUser)
  return localUser?.data;
})

export const login = createAsyncThunk('auth/login', async (data: {userName: string, password: string}) => {
  const res = await HTTP.post(`/login`, {
    ...data,
    keyForRakeModules: true
  });
  const user = res.data.result;
  const dataLogin = {
    ...user,
    isLogin: false
  }
  saveLocalUser(dataLogin);
  return user;
});

export const logout = createAsyncThunk('auth/logout', async () => {
  removeLocalUser();
  return true;
});

export const register = createAuthAction('login');

export const googleAuthenSecretKey = createAsyncThunk('auth/googleAuthenSecretKey', async (data: { userName: string }) => {
  const res: any = HTTP.post(`/googleAuthenSecretKey`, {
    ...data
  })
  return res;
});

export const getSecretKeyGoogleAuthen = createAsyncThunk('auth/getSecretKeyGoogleAuthen', async (data: { userName: string }) => {
  const res: any = HTTP.post('/getSecretKeyGoogleAuthen', {
    ...data
  })
  return res;
});

export const verifyGoogleAuthenCode = createAsyncThunk('auth/verifyGoogleAuthenCode', async (data: { userName: string, code: string }) => {
  const res: any = HTTP.post('/verifyGoogleAuthenCode', {
    ...data
  })
  return res;
});

export const resetPasswordPlayer = createAsyncThunk('resetPasswordPlayer', async (data: any) => {
  const res: any = HTTP.post('resetPasswordPlayer', {
    ...data
  })
  return res;
});

export const checkTokenResetExpried = createAsyncThunk('checkTokenResetExpried', async (data: any) => {
  const res: any = HTTP.post('checkTokenResetExpried', {
    ...data
  })
  return res;
});

export const checkVerifyAuthCode = createAsyncThunk('checkVerifyAuthCode', async (data: any) => {
  const res: any = HTTP.post('checkVerifyAuthCode', {
    ...data
  })
  return res;
});

export const resetPassword = createAsyncThunk('resetPassword', async (data: any) => {
  const res: any = HTTP.post('resetPassword', {
    ...data
  })
  return res
});