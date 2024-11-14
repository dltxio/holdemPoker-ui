import HTTP from '@/core/http';
import { createAppAsyncThunk } from '@/store/thunk';
import {createAction, createAsyncThunk} from '@reduxjs/toolkit';
import dayjs from '@/core/dayjs';
import { InstantBonusHistory } from '../models/instantBonusHistory';

export const createAuthAction = (action: string) => createAction(`auth/${action}`);

export const getUsersAndCalculateBonus = createAppAsyncThunk('listUsersAndCalculateBonus', async (data: {userId: string}) => {
  const res = await HTTP.post(`listUsersAndCalculateBonus`, data);
  return res.data.result;
});

export const saveInstantBonusTransfer = createAppAsyncThunk('saveInstantBonusTransfer', async (data: any) => {
  const res = await HTTP.post(`instantBonusTransfer`, {
    ...data,
    transferAt: dayjs().valueOf()
  });
  return res.data.result;
});

export const countInstantBonusHistory = createAppAsyncThunk('countInstantBonusHistory', async () => {
  const res = await HTTP.post(`countInstantBonusHistory`, {});
  return res.data.result;
});

export const getInstantBonusHistory = createAppAsyncThunk('getInstantBonusHistory', async (data: any) => {
  const res = await HTTP.post(`listInstantBonusHistory`, {
    skip: 0,
    limit: 10,
    ...data
  });
  const result = res.data.result;
  return {
    ...result,
    instantBonusHistoryList: InstantBonusHistory.fromArray(result.instantBonusHistoryList),
    totalAmount: result.totalAmountArray.length ? result.totalAmountArray[0].totalAmount : 0
  };
});
