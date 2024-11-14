import HTTP from '@/core/http';
import { createAppAsyncThunk } from '@/store/thunk';
import { DailyCashoutReport } from '../models/DailyCashoutReport';
import { MonthlyCashout } from '../models/MonthlyCashout';

export const findDailyCashoutDateFilter = createAppAsyncThunk('findDailyCashoutDateFilter', (data: any, ctx) => {
  const user = ctx.getState().auth.user;
  return HTTP.post(`findDailyCashoutDateFilter`, {
    ...data,
    role: user.role,
    userName: user.userName
  })
  .then(res => ({
    ...res.data,
    result: res.data.result?.totalCashouts && DailyCashoutReport.fromArray(res.data.result?.totalCashouts) || [],
  }))
});
export const findDailyCashoutReport = createAppAsyncThunk('findDailyCashoutReport', (data: any, ctx) => {
  const user = ctx.getState().auth.user;
  return HTTP.post(`findDailyCashoutReport`, {
    ...data,
    role: user.role,
    userName: user.userName
  })
  .then(res => ({
    ...res.data,
    result: res.data.result?.totalCashouts && DailyCashoutReport.fromArray(res.data.result?.totalCashouts) || [],
  }))
});
export const monthlyCashoutReport = createAppAsyncThunk('monthlyCashoutReport', (data: any, ctx) => {
  const user = ctx.getState().auth.user;
  return HTTP.post(`monthlyCashoutReport`, {
    ...data,
    role: user.role,
    userName: user.userName
  })
  .then(res => ({
    ...res.data,
    result: res.data.result && MonthlyCashout.fromArray(res.data.result) || [],
  }))
});
export const dailyCashoutChart = createAppAsyncThunk('dailyCashoutChart', (data: any, ctx) => {
  const user = ctx.getState().auth.user;
  return HTTP.post(`dailyCashoutChart`, {
    ...data,
    role: user.role,
    userName: user.userName,
    keyForCashoutChart: 1
  })
  .then(res => ({
    ...res.data,
    result: res?.data?.result,
  }))
});