import HTTP from '@/core/http';
import { createAppAsyncThunk } from '@/store/thunk';
import {createAction, createAsyncThunk} from '@reduxjs/toolkit';

export const createAuthAction = (action: string) => createAction(`auth/${action}`);

export const getSpamWords = createAppAsyncThunk('listSpamWords', (params, ctx) => {
  return HTTP.post(`listSpamWords`).then(res => res.data.result?.length ? res.data.result[0] : null);
});

export const saveSpamWords = createAppAsyncThunk('saveSpamWords', (params: any, ctx) => {
  return HTTP.post(`updateSpamWord`, params);
});

export const register = createAuthAction('login');
