import HTTP from '@/core/http';
import { createAppAsyncThunk, createHttpPostThunk } from '@/store/thunk';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { BalanceSheet } from '@/modules/account/models/BalanceSheet';
import { BalanceSheetForDashboard } from '@/modules/account/models/BalanceSheetForDashboard';


export const createAuthAction = (action: string) => createAction(`account/${action}`);

// export const getTotalRakeYesterday = createHttpPostThunk('findTotalRakeYesterday');

// export const getPartialRakeGenerated = createHttpPostThunk('findPartialRakeGenerated')

// export const getPartialRakeGeneratedDay = createHttpPostThunk('findPartialRakeGeneratedDay')

// export const getTotalRakeLastWeek = createHttpPostThunk('findTotalRakeLastWeek')

// export const getTotalChipsAdded = createHttpPostThunk('findTotalChipsAdded')

// export const getNewPlayersJoinData = createHttpPostThunk('findNewPlayersJoinData')
export const getTotalRakeYesterday = createAppAsyncThunk('findTotalRakeYesterday', async (params: any, ctx) => {
  const resp = await HTTP.post('findTotalRakeYesterday');
  const res = resp.data;
  const data: any = {
    totalRakeYesterday: res.result.sumOfRake,
  }
  return data;
})

export const getPartialRakeGenerated = createAppAsyncThunk('getPartialRakeGenerated', async (params: any, ctx) => {
  const resp = await HTTP.post('findPartialRakeGenerated');
  const res = resp.data;
  const data: any = {}
  if(res.result.partialRakeThisWeek >= res.result.partialRakeLastWeek){
    data.setWeekRakeProfit = true;
    data.percentRakeProfitThisWeek = (res.result.partialRakeThisWeek - res.result.partialRakeLastWeek)*100/res.result.partialRakeLastWeek || 0;
  }
  else{
    data.setWeekRakeProfit = false;
    data.percentRakeProfitThisWeek = (res.result.partialRakeLastWeek - res.result.partialRakeThisWeek)*100/res.result.partialRakeLastWeek || 0;
  }
  data.percentRakeProfitThisWeek = data.percentRakeProfitThisWeek.toFixed(2);
  data.partialRakeThisWeek = res.result.partialRakeThisWeek;
  data.averageRakeThisWeek = res.result.averageRakeThisWeek;
  data.partialRakeLastWeek = res.result.partialRakeLastWeek;
  return data;
});

export const getPartialRakeGeneratedDay = createAppAsyncThunk('getPartialRakeGeneratedDay', async (params: any, ctx) => {
  const resp = await HTTP.post('findPartialRakeGeneratedDay');
  const res = resp.data;
  const data: any = {}
  if(res.result.partialRakeToday >= res.result.partialRakeYesterday){
    data.setTodayRakeProfit = true;
    data.percentRakeProfitToday = (res.result.partialRakeToday - res.result.partialRakeYesterday)*100/res.result.partialRakeYesterday || 0;
  }
  else{
    data.setTodayRakeProfit = false;
    data.percentRakeProfitToday = (res.result.partialRakeYesterday - res.result.partialRakeToday)*100/res.result.partialRakeYesterday || 0;
  }
  data.percentRakeProfitToday = data.percentRakeProfitToday.toFixed(2);
  data.partialRakeToday = res.result.partialRakeToday;
  return data;
})

export const getTotalChipsAdded = createAppAsyncThunk('findTotalChipsAdded', async (params: any, ctx) => {
  const res = await HTTP.post(`findTotalChipsAdded`);
  const result = res.data.result;
  const data = {
    ...result,
    totalChipsLastWeek: result.totalChipsAddedLastWeek,
    totalChipsPartialThisWeek: result.totalChipsAddedPartialThisWeek,
    totalChipsPartialLastWeek: result.totalChipsAddedPartialLastWeek,
    percentChipsProfitThisWeek: result.totalChipsAddedPartialThisWeek >= result.totalChipsAddedPartialLastWeek ?
    ((result.totalChipsAddedPartialThisWeek - result.totalChipsAddedPartialLastWeek)*100/result.totalChipsAddedPartialLastWeek || 0)
    : ((result.totalChipsAddedPartialLastWeek - result.totalChipsAddedPartialThisWeek)*100/result.totalChipsAddedPartialLastWeek || 0),

    totalChipsYesterday: result.totalChipsAddedYesterday,
    totalChipsPartialToday: result.totalChipsAddedPartialToday,
    totalChipsPartialYesterday: result.totalChipsAddedPartialYesterday,
    percentChipsProfitToday: result.totalChipsPartialToday >= result.totalChipsPartialYesterday ?
    ((result.totalChipsPartialToday - result.totalChipsPartialYesterday)*100/result.totalChipsPartialYesterday || 0)
    : ((result.totalChipsPartialYesterday - result.totalChipsPartialToday)*100/result.totalChipsPartialYesterday || 0)
  }
  return data;
})

export const getPlayerLoginData = createAppAsyncThunk('findPlayerLoginData', async (params: any, ctx) => {
  const res = await HTTP.post('findPlayerLoginData', {
    keyForRakeModules: true
  });
  const result = res.data.result;
  const data: any = {}
  if(result.totalPlayersLoggedInToday >= result.totalPlayersLoggedInYesterday){
    data.setTodayPlayersProfit = true;
    data.percentPlayersJoinToday = (result.totalPlayersLoggedInToday - result.totalPlayersLoggedInYesterday)*100/result.totalPlayersLoggedInPartialYesterday || 0;
  }
  else{
    data.setTodayPlayersProfit = false;
    data.percentPlayersJoinToday = (result.totalPlayersLoggedInYesterday - result.totalPlayersLoggedInToday)*100/result.totalPlayersLoggedInPartialYesterday || 0;
  }
  data.percentPlayersJoinToday = data.percentPlayersJoinToday.toFixed(2);
  data.totalPlayersLoggedInToday = result.totalPlayersLoggedInToday;

  data.onlinePlayers = result.onlinePlayers;
  data.totalPlayersLoggedInToday = result.totalPlayersLoggedInToday;
  data.totalPlayersLoggedInYesterday = result.totalPlayersLoggedInYesterday;
  return data;
})

export const getNewPlayersJoinData = createAppAsyncThunk('findNewPlayersJoinData', async (params: any, ctx) => {
  const resp = await HTTP.post('findNewPlayersJoinData');
  const res = resp.data
  const data: any = {};
  data.newPlayersToday = res.result.newPlayersToday;
  data.newPlayersThisMonth = res.result.newPlayersThisMonth;
  data.totalPlayersAllTime = res.result.allPlayersJoinData;
  data.newPlayersThisYear = res.result.newPlayersThisYear;
  return data;
})

export const getTotalRakeLastWeek = createAppAsyncThunk('getTotalRakeLastWeek', async (params: any, ctx) => {
  const resp = await HTTP.post('findTotalRakeLastWeek');
  const res = resp.data
  const data: any = {};
  data.totalRakeLastWeek = res.result.sumOfRake.toFixed(2);
  return data;
})

export const getActivityDetails = createAppAsyncThunk('getActivityDetails', async (params: any, ctx) => {
  const result: any = {};
  const handleResponse = (masterKey: string) => ( res: any) => {
    // result[`${masterKey}`] = res.payload;
    
    res.payload = res.payload || {}
    Object.keys(res.payload).forEach(key => {
      result[`${key}`] = res.payload[key];
    })
  }
  await Promise.all([
    ctx.dispatch(getTotalRakeYesterday({}))
    .then(handleResponse('rakeYesterday')),
    ctx.dispatch(getPartialRakeGenerated({}))
    .then(handleResponse('rakeGenerated')),
    ctx.dispatch(getPartialRakeGeneratedDay({}))
    .then(handleResponse('rakeGeneratedDay')),
    ctx.dispatch(getTotalRakeLastWeek({}))
    .then(handleResponse('rakeLastweek')),
    ctx.dispatch(getTotalChipsAdded({}))
    .then(handleResponse('chipsAdded')),
    ctx.dispatch(getNewPlayersJoinData({}))
    .then(handleResponse('newPlayerJoinData')),
    ctx.dispatch(getPlayerLoginData({}))
    .then(handleResponse('playerLoginData'))
  ]);
  // percentRakeProfitToday: percentRakeProfitToday.toFixed(2);
  // partialRakeToday = rakeThisWeek.partialRakeToday;
  return result;
})