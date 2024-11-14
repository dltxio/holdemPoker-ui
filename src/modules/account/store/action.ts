import HTTP from '@/core/http';
import { createAppAsyncThunk } from '@/store/thunk';
import {createAction, createAsyncThunk} from '@reduxjs/toolkit';
import { BalanceSheet } from '@/modules/account/models/BalanceSheet';
import { BalanceSheetForDashboard } from '@/modules/account/models/BalanceSheetForDashboard';

export const createAuthAction = (action: string) => createAction(`account/${action}`);

export const getBalanceSheet = createAppAsyncThunk('account/findBalanceSheet', async (params, ctx) => {
  const user = ctx.getState().auth.user;
  const res = await HTTP.post(`findBalanceSheet`, {
    userRole: user.role
  });
  return res.data.result && BalanceSheet.fromObject(res.data.result) || null;
});

export const getCurrentDataOfBalanceSheetForDashboard = createAppAsyncThunk('account/balanceSheetForDashboard', async (params: any = undefined, ctx) => {
  const user = ctx.getState().auth.user;
  const res = await HTTP.post(`getCurrentDataOfBalanceSheetForDashboard`, {
    // userRole: user.role
    date: params?.date
  });
  return res.data.result && BalanceSheetForDashboard.fromObject(res.data.result) || null;
});

export const getAccount = createAppAsyncThunk('account/account', async () => {
  const res = await HTTP.get(`account`);
  return res.data.result;
});