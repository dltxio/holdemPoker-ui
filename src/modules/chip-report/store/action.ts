import HTTP from '@/core/http';
import { createAppAsyncThunk } from '@/store/thunk';
import { DailyChipsReport } from '../models/DailyChipsReport';
import { MonthlyChipsReport } from '../models/MonthlyChipsReport';

export const countDataForDailyChips = createAppAsyncThunk('countDataForDailyChips', (data?: any) => {
  return HTTP.post(`countDataForDailyChips`, data).then(res => res.data.result || 0);
});

export const dailyChipsReport = createAppAsyncThunk('dailyChipsReport', (data?: any) => {
  return HTTP.post(`dailyChipsReport`, data).then(res => res.data.result && DailyChipsReport.fromArray(res.data.result) || []);
});

export const monthlyChipsReport = createAppAsyncThunk('monthlyChipsReport', (data?: any) => {
  return HTTP.post(`monthlyChipsReport`, data).then(res => res.data.result && MonthlyChipsReport.fromArray(res.data.result) || []);
});

export const dailyChipsChart = createAppAsyncThunk('dailyChipsChart', (data: any, ctx) => {
  return HTTP.post(`dailyChipsChart`, {
    ...data,
    role: ctx.getState().auth.user.role
  }).then(res => res.data.result);
});

export const listMonthlyBonusChipsReport = createAppAsyncThunk('listMonthlyBonusChipsReport', (data: any, ctx) => {
  return HTTP.post(`listMonthlyBonusChipsReport`, {
    ...data,
  }).then(res => res.data.result);
});
