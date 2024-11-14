import HTTP from '@/core/http';
import { createAppAsyncThunk } from '@/store/thunk';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { DirectLeaderboardEntryHistory } from '../models/DirectLeaderboardEntryHistory';
import { Leaderboard } from '../models/Leaderboard';
import { Participant } from '../models/Participant';


export const directEntryHistoryPlayer = createAppAsyncThunk('directEntryHistoryPlayer', (data: any) => {
  const args: any = {}
  return HTTP.post(`directEntryHistoryPlayer`, {
    ...args,
    ...data
  })
    .then(res => res?.data?.result?.playerBonusData && DirectLeaderboardEntryHistory.fromArray(res.data.result.playerBonusData) || []);
});

export const countDirectEntryHistory = createAppAsyncThunk('countDirectEntryHistory', (data: any) => {
  const args: any = {}
  return HTTP.post(`countDirectEntryHistory`, {
    ...args,
    ...data,
  })
    .then(res => (typeof res?.data?.result === 'number' ? res?.data?.result : 0) || 0);
});
export const createLeaderboard = createAppAsyncThunk('createLeaderboard', (data: any) => {
  const args: any = {}
  return HTTP.post(`createLeaderboard`, {
    ...args,
    ...data,
  })
    .then(res => res?.data?.result);
});

export const listLeaderboard = createAppAsyncThunk('listLeaderboard', (data: any) => {
  const args: any = {}
  return HTTP.post(`listLeaderboard`, {
    ...args,
    ...data
  })
    .then(res => res?.data?.result && Leaderboard.fromArray(res.data.result) || []);
});

export const deleteLeaderboard = createAppAsyncThunk('deleteLeaderboard', (data: any) => {
  const args: any = {}
  return HTTP.post(`deleteLeaderboard`, {
    ...args,
    ...data,
    bonusCodeChanged: true
  })
    .then(res => res?.data);
});
export const editLeaderboard = createAppAsyncThunk('editLeaderboard', (data: any) => {
  const args: any = {}
  return HTTP.post(`editLeaderboard`, {
    ...args,
    ...data,
  })
    .then(res => res?.data);
});

export const directEntryPlayer = createAppAsyncThunk('directEntryPlayer', (data: any) => {
  const args: any = {}
  return HTTP.post(`directEntryPlayer`, {
    ...args,
    ...data,
  })
    .then(res => res?.data);
});

export const getCurrentLeaderboardParticipants = createAppAsyncThunk('getCurrentLeaderboardParticipants', (data: any) => {
  const args: any = {}
  return HTTP.get(`getCurrentLeaderboardParticipants/${data.leaderboardId}/${data.status}`, {
    ...args,
  })
    .then(res => res?.data?.result);
});