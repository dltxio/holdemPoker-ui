import HTTP from '@/core/http';
import { createAppAsyncThunk } from '@/store/thunk';
import {createAction, createAsyncThunk} from '@reduxjs/toolkit';
import { Approve } from '../models/Approve';
import { History } from '../models/History';


export const getScratchCardHistory = createAppAsyncThunk('getScratchCardHistory', (data: any) => {
  const args: any = {}
  return HTTP.post(`getScratchCardHistory`, {
    ...args,
    ...data,
  })
  .then(res => res.data.result && History.fromArray(res.data.result) || []);
});

export const getScratchCardHistoryCount = createAppAsyncThunk('getScratchCardHistoryCount', (data: any) => {
  const args: any = {}
  return HTTP.post(`getScratchCardHistoryCount`, {
    ...args,
    ...data,
  })
  .then(res => res.data.result || 0);
});

export const getScratchCardList = createAppAsyncThunk('getScratchCardList', (data: any) => {
  const args: any = {}
  return HTTP.post(`getScratchCardList`, {
    ...args,
    ...data,
  })
  .then(res => res.data.result && Approve.fromArray(res.data.result) || []);
});

export const getScratchCardListCount = createAppAsyncThunk('getScratchCardListCount', (data: any) => {
  const args: any = {}
  return HTTP.post(`getScratchCardListCount`, {
    ...args,
    ...data,
  })
  .then(res => res?.data?.result || 0);
});

export const createScratchCardHighRollers = createAppAsyncThunk('createScratchCardHighRollers', (data?: any) => {
  return HTTP.post(`createScratchCardHighRollers`, data).then(res => res.data.result);
});

export const approveScratchCard = createAppAsyncThunk('approveScratchCard', (data?: any) => {
  return HTTP.post(`approveScratchCard`, data).then(res => res.data.result);
});

export const rejectScratchCard = createAppAsyncThunk('rejectScratchCard', (data?: any) => {
  return HTTP.post(`rejectScratchCard`, data).then(res => res.data.result);
});
export const createScratchCardAffiliate = createAppAsyncThunk('createScratchCardAffiliate', (data?: any) => {
  return HTTP.post(`createScratchCardAffiliate`, data).then(res => res.data.result);
});