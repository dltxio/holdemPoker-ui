import HTTP from '@/core/http';
import { createAppAsyncThunk } from '@/store/thunk';
import {createAction, createAsyncThunk} from '@reduxjs/toolkit';
import { LeaderboardReport } from '../models/LeaderboardReport';

export const createAuthAction = (action: string) => createAction(`auth/${action}`);

export const getLeaderboardReportCount = createAppAsyncThunk('getLeaderboardReportCount', (data: any) => {
  const args: any = {}
  return HTTP.post(`getLeaderboardReportCount`, {
    ...args,
    ...data,
  })
  .then(res => res.data.result || 0);
});
export const listLeaderboardReport = createAppAsyncThunk('listLeaderboardReport', (data: any) => {
  const args: any = {}
  return HTTP.post(`listLeaderboardReport`, {
    ...args,
    ...data
  })
  .then(res => res.data.result && LeaderboardReport.fromArray(res.data.result) || []);
});