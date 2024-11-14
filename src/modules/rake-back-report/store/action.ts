import HTTP from '@/core/http';
import { createAppAsyncThunk } from '@/store/thunk';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { PlayerRakebackReport } from '../models/PlayerRakebackReport.model';
import { RakebackTransactionHistory } from '../models/RakebackTransactionHistory.model';
export const createAuthAction = (action: string) => createAction(`auth/${action}`);

export const login = createAsyncThunk('auth/login', (data: { username: string, password: string }) => {
  return HTTP.post(`auth/login`, data);
});

export const register = createAuthAction('login');

export const playerRakeBackReport = createAppAsyncThunk('playerRakeBackReport', async (data: any) => {
  data.startDate = data.startDate?.valueOf();
  data.endDate = data.endDate?.valueOf();
  const res = await HTTP.post<any>(`playerRakeBackReport`, {
    skip: data.skip,
    limit: data.pageSize,
    ...data
  });
  // const result = {
  //   result: res.data?.result && res.data.result.length > 0 ? PlayerRakebackReport.fromArray(res.data.result) : [],
  //   total: res.data?.totalRake
  // }
  return res;
});

export const countDataForRakeBack = createAppAsyncThunk('countDataForRakeBack', async (data: any) => {
  data.startDate = data.startDate?.valueOf();
  data.endDate = data.endDate?.valueOf();
  const res = await HTTP.post(`countDataForRakeBack`, {
    ...data
  });
  return res.data?.result || {};
});

export const listRakebackData = createAppAsyncThunk('listRakebackData', async (data: any) => {
  data.startDate = data.startDate?.valueOf();
  data.endDate = data.endDate?.valueOf();
  const res = await HTTP.post(`listRakebackData`, {
    skip: data.skip,
    limit: data.pageSize,
    ...data
  });
  return res.data?.result && res.data.result.length > 0 ? RakebackTransactionHistory.fromArray(res.data.result) : [];
});

export const countRakebackData = createAppAsyncThunk('countRakebackData', async (data: any) => {
  data.startDate = data.startDate?.valueOf();
  data.endDate = data.endDate?.valueOf();
  const res = await HTTP.post(`countRakebackData`, {
    ...data
  });
  return res.data?.result || {};
});

export const countRakePLayerReportDataSearch = createAppAsyncThunk('countRakePLayerReportDataSearch', async (data: any) => {
  data.startDate = data.startDate?.valueOf();
  data.endDate = data.endDate?.valueOf();
  const res = await HTTP.post(`countRakePLayerReportDataSearch`, {
    ...data
  });
  return res.data?.result || [];
})


// rake commission
export const listRakebackCommissionData = createAppAsyncThunk('listRakeDataForRakeReportSearch', async (data: any) => {
  data.startDate = data.startDate?.valueOf();
  data.endDate = data.endDate?.valueOf();
  const res = await HTTP.post(`listRakeDataForRakeReportSearch`, {
    skip: data.skip,
    limit: data.pageSize,
    ...data
  });
  return res.data?.result && res.data.result.length > 0 ? RakebackTransactionHistory.fromArray(res.data.result) : [];
});

export const countRakeDataReportData = createAppAsyncThunk('countRakeDataReportDataSearch', async (data: any) => {
  data.startDate = data.startDate?.valueOf();
  data.endDate = data.endDate?.valueOf();
  const res = await HTTP.post(`countRakeDataReportDataSearch`, {
    ...data
  });
  return res.data?.result || [];
})

export const totalRakeDataForRakeReportSearch = createAppAsyncThunk('totalRakeDataForRakeReportSearch', async (data: any) => {
  data.startDate = data.startDate?.valueOf();
  data.endDate = data.endDate?.valueOf();
  const res = await HTTP.post(`totalRakeDataForRakeReportSearch`, {
    skip: data.skip,
    ...data
  });
  return res.data?.result && res.data.result.length > 0 ? RakebackTransactionHistory.fromArray(res.data.result) : [];
});

// rake history
export const listRakeDataRakeHistory = createAppAsyncThunk('listRakeDataRakeHistory', async (data: any) => {
  data.startDate = data.startDate?.valueOf();
  data.endDate = data.endDate?.valueOf();
  const res = await HTTP.post(`listRakeDataRakeHistory`, {
    skip: data.skip,
    limit: data.pageSize,
    ...data
  });
  return res.data.result || []
});

export const countRakeDataRakeHistory = createAppAsyncThunk('countRakeDataRakeHistory', async (data: any) => {
  data.startDate = data.startDate?.valueOf();
  data.endDate = data.endDate?.valueOf();
  const res = await HTTP.post(`countRakeDataRakeHistory`, {
    skip: data.skip,
    limit: data.pageSize,
    ...data
  });
  return res.data.result || []
});

// current cycle
export const currentCycle = createAppAsyncThunk('currentCycleRakeBack', async (data: any) => {
  const res = await HTTP.post(`currentCycleRakeBack`, {
    skip: data.skip,
    limit: data.pageSize,
    ...data
  });
  return res
});