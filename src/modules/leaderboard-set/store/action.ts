import HTTP from '@/core/http';
import { createAppAsyncThunk } from '@/store/thunk';
import {createAction, createAsyncThunk} from '@reduxjs/toolkit';
import dayjs from '@/core/dayjs';
import { LeaderboardSet } from '../models/LeaderboardSet';

export const createAuthAction = (action: string) => createAction(`auth/${action}`);

export const getLeaderboardSpecificDetails = createAppAsyncThunk('getLeaderboardSpecificDetails', () => {
  return HTTP.post(`getLeaderboardSpecificDetails`, {
    projectionFields: {leaderboardId: 1, leaderboardName: 1},
    usedInSet: false
  }).then(res => res.data.result);
});

export const createLeaderboardSet = createAppAsyncThunk('createLeaderboardSet', async (data: any) => {
  const res = await HTTP.post(`createLeaderboardSet`, {
    createdAt: dayjs().utc().valueOf(),
    ...data
  });
  return res.data.result;
});

export const getLeaderboardSets = createAppAsyncThunk('getLeaderboardSets', async (data: any) => {
  const res = await HTTP.post(`getLeaderboardSets`, {
    // createdAt: dayjs().utc().valueOf(),
    ...data
  });
  return res.data.result && LeaderboardSet.fromArray(res.data.result) || [];
});

export const countLeaderboardSets = createAppAsyncThunk('countLeaderboardSets', async (data: any) => {
  const res = await HTTP.post(`countLeaderboardSets`, {
    // createdAt: dayjs().utc().valueOf(),
    ...data
  });
  return res.data.result || 0;
});

export const changeViewOfSet = createAppAsyncThunk('changeViewOfSet', async (data: {leaderboardSetId: string, onView: boolean}) => {
  const res = await HTTP.post(`changeViewOfSet`, {
    // createdAt: dayjs().utc().valueOf(),
    ...data
  });
  return res.data.result;
});

export const updateLeaderboardSet = createAppAsyncThunk('updateLeaderboardSet', async (data: {leaderboardSetId: string, leaderboardArray: any[]}) => {
  const res = await HTTP.post(`updateLeaderboardSet`, {
    editedAt: dayjs().utc().valueOf(),
    ...data
  });
  return res.data.result;
});

export const deleteLeaderboardSet = createAppAsyncThunk('deleteLeaderboardSet', async (data: any) => {
  const res = await HTTP.post(`deleteLeaderboardSet`, {
    editedAt: dayjs().utc().valueOf(),
    ...data
  });
  return res.data.result;
});
