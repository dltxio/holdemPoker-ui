import dayjs from '@/core/dayjs';
import HTTP from '@/core/http';
import { createAppAsyncThunk } from '@/store/thunk';
import {createAction, createAsyncThunk} from '@reduxjs/toolkit';
import { CashTable } from '../models/CashTable';
import { PlayerGameHistory } from '../models/PlayerGameHistory';
import { PlayerInfoReport } from '../models/PlayerInfoReport';
import { PlayerLoyalityPointsHistory } from '../models/PlayerLoyalityPointsHistory';
import { ProfileDetail } from '../models/ProfileDetail';
import { TransactionHistory } from '../models/TransactionHistory';

export const createAuthAction = (action: string) => createAction(`auth/${action}`);

export const login = createAsyncThunk('auth/login', (data: {username: string, password: string}) => {
  return HTTP.post(`auth/login`, data);
});

export const register = createAuthAction('login');

export const findPersonalDetailsPlayer = createAppAsyncThunk('findPersonalDetailsPlayer', (data: any, ctx) => {
  const user = ctx.getState().auth.user;
  return HTTP.post(`personalDetailsPlayer`, {
    ...data,
    containsFilters: false,
    role: user.role
  })
  .then(res => ({
    ...res.data,
    result: res.data.result[0] && ProfileDetail.fromObject(res.data.result[0]) || {},
  }));
});
export const transactionHistoryCustomerSupport = createAppAsyncThunk('transactionHistoryCustomerSupport', (data: any, ctx) => {
  const user = ctx.getState().auth.user;
  return HTTP.post(`transactionHistoryCustomerSupport`, {
    ...data,
    containsFilters: false,
    role: user.role
  })
  .then(res => ({
    ...res.data,
    result: res.data.result.finalResult && TransactionHistory.fromArray(res.data.result.finalResult) || {},
  }))
});
export const playerMagnetChipsDetails = createAppAsyncThunk('playerMagnetChipsDetails', (data: any, ctx) => {
  const user: any = ctx.getState().auth.user;
  return HTTP.post(`playerMagnetChipsDetails`, {
    ...data,
    containsFilters: false,
    role: user.role
  })
  .then(res => ({
    ...res.data,
    result: res.data.result && PlayerLoyalityPointsHistory.fromArray(res.data.result) || {},
  }));
});

export const listDataInPlayerInfoReport = createAppAsyncThunk('listDataInPlayerInfoReport', (data: any) => {
  const args: any = {}
  return HTTP.post(`listDataInPlayerInfoReport`, {
    ...args,
    ...data,
    fromCustomerSupport: true
  })
  .then(res => res.data.result && PlayerInfoReport.fromArray(res.data.result) || []);
});

export const countDataInPlayerInfoReport = createAppAsyncThunk('countDataInPlayerInfoReport', (data: any) => {
  const args: any = {}
  return HTTP.post(`countDataInPlayerInfoReport`, {
    ...args,
    ...data,
  })
  .then(res => res.data.result || 0);
});
export const listPlayerGameHistory = createAppAsyncThunk('listPlayerGameHistory', (data: any) => {
  const args: any = {}
  return HTTP.post(`listPlayerGameHistory`, {
    ...args,
    ...data
  })
  .then(res => res.data.result && PlayerGameHistory.fromArray(res.data.result) || []);
});

export const countPlayerGameHistory = createAppAsyncThunk('countPlayerGameHistory', (data: any) => {
  const args: any = {}
  return HTTP.post(`countPlayerGameHistory`, {
    ...args,
    ...data,
  })
  .then(res => res.data.result || 0);
});

export const listAllCashTable = createAppAsyncThunk('listAllCashTable', (data: any) => {
  const args: any = {}
  return HTTP.post(`listAllCashTable`, {
    ...args,
    ...data
  })
  .then(res => res.data.result && CashTable.fromArray(res.data.result) || []);
});