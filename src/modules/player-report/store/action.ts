import HTTP from '@/core/http';
import { createAppAsyncThunk } from '@/store/thunk';
import {createAction, createAsyncThunk} from '@reduxjs/toolkit';
import dayjs from '@/core/dayjs';
import { PlayerReportItem } from '../models/PlayerReportItem';
import { PlayerBannedData } from '../models/PlayerBannedData';
import { Table } from '../models/Table';
import { DataInPlayerLoyalityPointsReport } from '../models/DataInPlayerLoyalityPointsReport';
import { User } from '@/modules/user/models/User';
import { PlayerParentHistory } from '@/modules/user/models/PlayerParentHistory';
import { PlayerLockedBonusInfo } from '../models/PlayerLockedBonusInfo';
import { PlayerHandHistory } from '../models/PlayerHandHistory';

export const createAuthAction = (action: string) => createAction(`auth/${action}`);

export const findPlayersReportDateFilter = createAppAsyncThunk('findPlayersReportDateFilter', (data: any, ctx) => {
  const user = ctx.getState().auth.user;
  const args: any = {}
  if (data.startDate) {
    args.createdAt = {
      $gte: dayjs(data.startDate).valueOf()
    };
    delete data.startDate;
  }
  if (data.endDate) {
    args.createdAt = {
      ...args.createdAt,
      $lte: dayjs(data.endDate).valueOf()
    };
    delete data.endDate;
  }
  return HTTP.post(`findPlayersReportDateFilter`, {
    ...args,
    ...data,
    // containsFilters: false,
    role: user.role
  })
  .then(res => ({
    ...res.data,
    result: res.data.result && PlayerReportItem.fromArray(res.data.result) || [],
  }));
});

export const findPlayersReport = createAppAsyncThunk('findPlayersReport', (data: any, ctx) => {
  const user = ctx.getState().auth.user;
  return HTTP.post(`findPlayersReport`, {
    ...data,
    containsFilters: false,
    role: user.role
  })
  .then(res => ({
    ...res.data,
    result: res.data,
  }));
});

export const findPlayerDataChart = createAppAsyncThunk('findPlayerDataChart', (data: any, ctx) => {
  const user = ctx.getState().auth.user;
  const args: any = {}
  return HTTP.post(`findPlayerDataChart`, {
    ...args,
    ...data,
    role: user.role
  })
  .then(res => res.data.result || []);
});

export const findPlayerDataChartGamesPlayed = createAppAsyncThunk('findPlayerDataChartGamesPlayed', (data: any, ctx) => {
  const user = ctx.getState().auth.user;
  const args: any = {}
  return HTTP.post(`findPlayerDataChartGamesPlayed`, {
    ...args,
    ...data,
    role: user.role
  })
  .then(res => res.data.result);
});

export const listPlayerBannedData = createAppAsyncThunk('listPlayerBannedData', (data: any, ctx) => {
  const user = ctx.getState().auth.user;
  const args: any = {}
  return HTTP.post(`listPlayerBannedData`, {
    ...args,
    ...data,
    role: user.role
  })
  .then(res => res.data.result && PlayerBannedData.fromArray(res.data.result) || []);
});


export const listDataInPlayerChipsReport = createAppAsyncThunk('listDataInPlayerChipsReport', (data: any) => {
  // const user = ctx.getState().auth.user;
  const args: any = {}
  return HTTP.post(`listDataInPlayerChipsReport`, {
    ...args,
    ...data,
    // role: user.role
  })
  .then(res => res.data.result && [res.data.result.playerData] || []);
});

export const getListTable = createAppAsyncThunk('listTable', (data: any) => {
  const args: any = {}
  return HTTP.post(`listTable`, {
    ...args,
    ...data,
  })
  .then(res => res.data.result && Table.fromArray(res.data.result) || []);
});

export const listDataInPlayerLoyalityPointsReport = createAppAsyncThunk('listDataInPlayerLoyalityPointsReport', (data: any) => {
  const args: any = {}
  return HTTP.post(`listDataInPlayerLoyalityPointsReport`, {
    ...args,
    ...data,
  })
  .then(res => res.data.result && DataInPlayerLoyalityPointsReport.fromArray(res.data.result) || []);
});

export const countDataInPlayerLoyalityPointsReport = createAppAsyncThunk('countDataInPlayerLoyalityPointsReport', (data: any) => {
  const args: any = {}
  return HTTP.post(`countDataInPlayerLoyalityPointsReport`, {
    ...args,
    ...data,
  })
  .then(res => res.data.result || 0);
});

export const countDataInPlayerBonusReport = createAppAsyncThunk('countDataInPlayerBonusReport', (data: any) => {
  const args: any = {}
  return HTTP.post(`countDataInPlayerBonusReport`, {
    ...args,
    ...data,
  })
  .then(res => res.data.result || 0);
});

export const listDataInPlayerBonusReport = createAppAsyncThunk('listDataInPlayerBonusReport', (data: any) => {
  const args: any = {}
  return HTTP.post(`listDataInPlayerBonusReport`, {
    ...args,
    ...data,
  })
  .then(res => res.data.result || []);
});

export const countDataInPlayerInfoReport = createAppAsyncThunk('countDataInPlayerInfoReport', (data: any) => {
  const args: any = {}
  return HTTP.post(`countDataInPlayerInfoReport`, {
    ...args,
    ...data,
  })
  .then(res => res.data.result || 0);
});

export const listDataInPlayerInfoReport = createAppAsyncThunk('listDataInPlayerInfoReport', (data: any) => {
  const args: any = {}
  return HTTP.post(`listDataInPlayerInfoReport`, {
    ...args,
    ...data,
  })
  .then(res => res.data.result && User.fromArray(res.data.result) || []);
});

export const countDataInPlayerParentHistory = createAppAsyncThunk('countDataInPlayerParentHistory', (data: any) => {
  const args: any = {}
  return HTTP.post(`countDataInPlayerParentHistory`, {
    ...args,
    ...data,
  })
  .then(res => res.data.result || 0);
});

export const listDataInPlayerParentHistory = createAppAsyncThunk('listDataInPlayerParentHistory', (data: any) => {
  const args: any = {}
  return HTTP.post(`listDataInPlayerParentHistory`, {
    ...args,
    ...data,
  })
  .then(res => res.data.result && PlayerParentHistory.fromArray(res.data.result) || []);
});

export const countPlayerBonusInfo = createAppAsyncThunk('countPlayerBonusInfo', (data: any) => {
  const args: any = {}
  return HTTP.post(`countPlayerBonusInfo`, {
    ...args,
    ...data,
  })
  .then(res => res.data.result || 0);
});

export const listPlayerLockedBonusInfo = createAppAsyncThunk('listPlayerLockedBonusInfo', (data: any) => {
  const args: any = {}
  return HTTP.post(`listPlayerLockedBonusInfo`, {
    ...args,
    ...data,
  })
  .then(res => res.data.result && PlayerLockedBonusInfo.fromArray(res.data.result) || []);
});

export const claimPlayerLockedBonus = createAppAsyncThunk('claimPlayerLockedBonus', (data: any) => {
  const args: any = {}
  return HTTP.post(`claimPlayerLockedBonus`, {
    ...args,
    ...data,
  })
  .then(res => res.data.result);
});

export const countLockedClaimedHistory = createAppAsyncThunk('countLockedClaimedHistory', (data: any) => {
  const args: any = {}
  return HTTP.post(`countLockedClaimedHistory`, {
    ...args,
    ...data,
  })
  .then(res => res.data.result || 0);
});

export const listLockedClaimedHistory = createAppAsyncThunk('listLockedClaimedHistory', (data: any) => {
  const args: any = {}
  return HTTP.post(`listLockedClaimedHistory`, {
    ...args,
    ...data,
  })
  .then(res => res.data.result && PlayerLockedBonusInfo.fromArray(res.data.result) || []);
});

export const countDataInPlayerHandHistory = createAppAsyncThunk('countDataInPlayerHandHistory', (data: any) => {
  const args: any = {}
  return HTTP.post(`countDataInPlayerHandHistory`, {
    ...args,
    ...data,
  })
  .then(res => res.data.result || 0);
});

export const listDataInPlayerHandHistory = createAppAsyncThunk('listDataInPlayerHandHistory', (data: any) => {
  const args: any = {}
  return HTTP.post(`listDataInPlayerHandHistory`, {
    ...args,
    ...data,
  })
  .then(res => res.data.result && PlayerHandHistory.fromArray(res.data.result) || []);
});

export const sendHandHistoryToMail = createAppAsyncThunk('sendHandHistoryToMail', (data: any) => {
  const args: any = {}
  return HTTP.post(`sendHandHistoryToMail`, {
    ...args,
    ...data,
  })
  .then(res => res.data.result);
});
