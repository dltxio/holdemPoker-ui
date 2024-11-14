import HTTP from '@/core/http';
import { createAppAsyncThunk } from '@/store/thunk';
import { InstantChipsPullHistory } from '../models/InstantChipsPullHistory';

export const searchAffiliate = createAppAsyncThunk('searchAffiliate', (data: any, ctx) => {
  const user: any = ctx.getState().auth.user;
  const args: any = {}
  return HTTP.post(`searchAffiliate`, {
    ...args,
    ...data,
    // role: user.role
  })
  .then(res => res.data.result);
});


export const pullChipsAffiliate = createAppAsyncThunk('pullChipsAffiliate', (data: any, ctx) => {
  // const user: any = ctx.getState().auth.user;
  const args: any = {}
  return HTTP.post(`pullChipsAffiliate`, {
    ...args,
    ...data,
    // role: user.role
  })
  .then(res => res.data.result);
});

export const searchPlayer = createAppAsyncThunk('searchPlayer', (data: any, ctx) => {
  const user: any = ctx.getState().auth.user;
  const args: any = {}
  return HTTP.post(`searchPlayer`, {
    ...args,
    ...data,
    // role: user.role
  })
  .then(res => res.data.result);
});

export const checkUserWithdrawlTransactionPullChips = createAppAsyncThunk('checkUserWithdrawlTransactionPullChips', (data: any, ctx) => {
  // const user: any = ctx.getState().auth.user;
  const args: any = {}
  return HTTP.post(`checkUserWithdrawlTransactionPullChips`, {
    ...args,
    ...data,
    // role: user.role
  })
  .then(res => res.data.result);
});

export const pullChipsPlayerByAdmin = createAppAsyncThunk('pullChipsPlayerByAdmin', (data: any, ctx) => {
  const args: any = {}
  return HTTP.post(`pullChipsPlayerByAdmin`, {
    ...args,
    ...data,
  }).then(res => res.data.result)
});

export const checkUserInstantChipsToPull = createAppAsyncThunk('checkUserInstantChipsToPull', (data: any, ctx) => {
  // const user: any = ctx.getState().auth.user;
  const args: any = {}
  return HTTP.post(`checkUserInstantChipsToPull`, {
    ...args,
    ...data,
    // role: user.role
  })
  .then(res => res.data.result);
});

export const pullInstantChipsPlayerByAdmin = createAppAsyncThunk('pullInstantChipsPlayerByAdmin', (data: any, ctx) => {
  const args: any = {}
  return HTTP.post(`pullInstantChipsPlayerByAdmin`, {
    ...args,
    ...data
  }).then(res => res.data.result);
});

export const countInstantChipsPulledHistory = createAppAsyncThunk('countInstantChipsPulledHistory', (data: any, ctx) => {
  // const user: any = ctx.getState().auth.user;
  const args: any = {}
  return HTTP.post(`countInstantChipsPulledHistory`, {
    ...args,
    ...data,
    // role: user.role
  })
  .then(res => res.data.result || 0);
});

export const listInstantChipsPulledHistory = createAppAsyncThunk('listInstantChipsPulledHistory', (data: any, ctx) => {
  // const user: any = ctx.getState().auth.user;
  const args: any = {}
  return HTTP.post(`listInstantChipsPulledHistory`, {
    ...args,
    ...data,
    // role: user.role
  })
  .then(res => res.data.result && InstantChipsPullHistory.fromArray(res.data.result) || []);
});

export const searchPlayerAff = createAppAsyncThunk('searchPlayerAff', (data: any, ctx) => {
  const user: any = ctx.getState().auth.user;
  const args: any = {}
  return HTTP.post(`searchPlayerAff`, {
    ...args,
    ...data,
    loggedInUser: user.userName,
    // role: user.role
  })
  .then(res => res.data.result);
});

export const pullChipsPlayerByAff = createAppAsyncThunk('pullChipsPlayerByAff', (data: any, ctx) => {
  const user: any = ctx.getState().auth.user;
  const args: any = {}
  return HTTP.post(`pullChipsPlayerByAff`, {
    ...args,
    ...data,
    loggedInUser: user.userName,
    parentRole: user.role
  })
  .then(res => res.data.result);
});