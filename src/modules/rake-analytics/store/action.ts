import HTTP from '@/core/http';
import { CashTable } from '@/modules/customer-support/models/CashTable';
import { createAppAsyncThunk } from '@/store/thunk';
import { FundRake } from '../models/FundRake';
import { RakeCommissionSummaryByAgent } from '../models/RakeCommissionSummaryByAgent';
import { RakeDataRakeReport } from '../models/RakeDataRakeReport';

export const countlistRakeDataForRakeReport = createAppAsyncThunk('countlistRakeDataForRakeReport', (data: any) => {
  const args: any = {}
  return HTTP.post(`countlistRakeDataForRakeReport`, {
    ...args,
    ...data,
    // role: user.role
  })
  .then(res => res.data.result || 0);
});

export const listRakeDataRakeReport = createAppAsyncThunk('listRakeDataRakeReport', (data: any, ctx) => {
  const user = ctx.getState().auth.user;
  const args: any = {}
  return HTTP.post(`listRakeDataRakeReport`, {
    ...args,
    role: user.role,
    userName: user.userName,
    ...data,
  })
  .then(res => ({
    ...res.data,
    result: RakeDataRakeReport.fromArray(res.data.result || [])
  }));
});

export const generateDailyRakeChart = createAppAsyncThunk('generateDailyRakeChart', (data: any, ctx) => {
  const user = ctx.getState().auth.user;
  const args: any = {}
  return HTTP.post(`generateDailyRakeChart`, {
    ...args,
    role: user.role,
    // userName: 'Admin',
    ...data,
  })
  .then(res => ({
    ...res.data,
    // result: RakeDataRakeReport.fromArray(res.data.result || [])
  }));
});

export const countlistRakeDataByDate = createAppAsyncThunk('countlistRakeDataByDate', (data: any, ctx) => {
  const user = ctx.getState().auth.user;
  const args: any = {}
  return HTTP.post(`countlistRakeDataByDate`, {
    ...args,
    // role: user.role,
    // userName: 'Admin',
    ...data,
  })
  .then(res => (res.data.result || 0));
});

export const listRakeDataPlayerByDate = createAppAsyncThunk('listRakeDataPlayerByDate', (data: any, ctx) => {
  const user = ctx.getState().auth.user;
  const args: any = {}
  return HTTP.post(`listRakeDataPlayerByDate`, {
    ...args,
    userRole: user.role,
    // userName: 'Admin',
    ...data,
  })
  .then(res => ({
    ...res.data,
    // result: RakeDataRakeReport.fromArray(res.data.result || [])
  }));
});

export const listRakeDataAffiliatesByDate = createAppAsyncThunk('listRakeDataAffiliatesByDate', (data: any, ctx) => {
  const user = ctx.getState().auth.user;
  const args: any = {}
  return HTTP.post(`listRakeDataAffiliatesByDate`, {
    ...args,
    userRole: user.role,
    // userName: 'Admin',
    ...data,
  })
  .then(res => ({
    ...res.data,
    // result: RakeDataRakeReport.fromArray(res.data.result || [])
  }));
});

export const listRakeDataAffiliatesByPlayerOrAffiliate = createAppAsyncThunk('listRakeDataAffiliatesByPlayerOrAffiliate', (data: any, ctx) => {
  const user = ctx.getState().auth.user;
  const args: any = {}
  return HTTP.post(`listRakeDataAffiliatesByPlayerOrAffiliate`, {
    ...args,
    userRole: user.role,
    // loggedInUser: 'Admin',
    loggedInUser: user.userName,
    ...data,
  })
  .then(res => ({
    ...res.data,
    result: RakeCommissionSummaryByAgent.fromArray(res.data.result || [])
  }));
});

export const listRakeDataPlayerByPlayerOrAffiliate = createAppAsyncThunk('listRakeDataPlayerByPlayerOrAffiliate', (data: any, ctx) => {
  const user: any = ctx.getState().auth.user;
  const args: any = {}
  return HTTP.post(`listRakeDataPlayerByPlayerOrAffiliate`, {
    ...args,
    userRole: user.role,
    // loggedInUser: 'Admin',
    loggedInUser: user.userName,
    ...data,
  })
  .then(res => ({
    ...res.data,
    result: RakeCommissionSummaryByAgent.fromArray(res.data.result || [])
  }));
});

export const countlistRakeDataByCashTable = createAppAsyncThunk('countlistRakeDataByCashTable', (data: any, ctx) => {
  const args: any = {}
  return HTTP.post(`countlistRakeDataByCashTable`, {
    ...args,
    keyForRakeModules: true,
    ...data,
  })
  .then(res => (res.data.result || 0));
});

export const listRakeDataByCashTable = createAppAsyncThunk('listRakeDataByCashTable', (data: any, ctx) => {
  const args: any = {}
  return HTTP.post(`listRakeDataByCashTable`, {
    ...args,
    keyForRakeModules: true,
    ...data,
  })
  .then(res => ({
    ...res.data,
    result: RakeCommissionSummaryByAgent.fromArray(res.data.result || [])
  }));
});

export const listRakeDataByGameVariant = createAppAsyncThunk('listRakeDataByGameVariant', (data: any, ctx) => {
  const args: any = {}
  return HTTP.post(`listRakeDataByGameVariant`, {
    ...args,
    keyForRakeModules: true,
    ...data,
  })
  .then(res => ({
    ...res.data,
    result: RakeCommissionSummaryByAgent.fromArray(res.data.result || [])
  }));
});

export const generateRakeByTimeChart = createAppAsyncThunk('generateRakeByTimeChart', (data: any, ctx) => {
  const args: any = {}
  const user: any = ctx.getState().auth.user;
  return HTTP.post(`generateRakeByTimeChart`, {
    ...args,
    keyForRakeModules: true,
    role: user.role,
    userName: user.userName,
    ...data,
  })
  .then(res => ({
    ...res.data,
    result: res.data.result || []
  }));
});

export const listRakeDataDatewise = createAppAsyncThunk('listRakeDataDatewise', (data: any, ctx) => {
  const args: any = {}
  const user: any = ctx.getState().auth.user;
  return HTTP.post(`listRakeDataDatewise`, {
    ...args,
    keyForRakeModules: true,
    role: user.role,
    userName: user.userName,
    ...data,
  })
  .then(res => ({
    ...res.data,
    result: res.data.result || []
  }));
});

export const listEachCashTableRakeData = createAppAsyncThunk('listEachCashTableRakeData', (data: any, ctx) => {
  const args: any = {}
  // const user: any = ctx.getState().auth.user;
  return HTTP.post(`listEachCashTableRakeData`, {
    ...args,
    keyForRakeModules: true,
    ...data,
  })
  .then(res => ({
    ...res.data,
    result: res.data.result && FundRake.fromArray(res.data.result) || []
  }));
});

export const listRakeBackMonthlyReport = createAppAsyncThunk('listRakeBackMonthlyReport', (data: any, ctx) => {
  const args: any = {}
  // const user: any = ctx.getState().auth.user;
  return HTTP.post(`listRakeBackMonthlyReport`, {
    ...args,
    // keyForRakeModules: true,
    ...data,
  })
  .then(res => ({
    ...res.data,
    result: res.data.result || []
  }));
});


export const countRakeDataForRakeReportAffiliate = createAppAsyncThunk('countRakeDataForRakeReportAffiliate', (data: any, ctx) => {
  const user = ctx.getState().auth.user;
  const args: any = {}
  return HTTP.post(`countRakeDataForRakeReportAffiliate`, {
    ...args,
    ...data,
    role: user.role,
    parentUser: user.userName,
  })
  .then(res => res.data.result || 0);
});

export const listRakeDataForRakeReportAffiliate = createAppAsyncThunk('listRakeDataForRakeReportAffiliate', (data: any, ctx) => {
  const user = ctx.getState().auth.user;
  const args: any = {}
  return HTTP.post(`listRakeDataForRakeReportAffiliate`, {
    ...args,
    role: user.role,
    parentUser: user.userName,
    ...data,
  })
  .then(res => ({
    ...res.data,
    result: RakeDataRakeReport.fromArray(res.data.result || [])
  }));
});

export const countRake = createAppAsyncThunk('countRake', (data: any, ctx) => {
  const user = ctx.getState().auth.user;
  const args: any = {}
  return HTTP.post(`countRake`, {
    ...args,
    userRole: user.role,
    ...data,
  })
  .then(res => ({
    ...res.data,
  }));
})