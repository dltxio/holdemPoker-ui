import HTTP from '@/core/http';
import { createAppAsyncThunk } from '@/store/thunk';
import {createAction, createAsyncThunk} from '@reduxjs/toolkit';
import { PlayerPassbook } from '../models/PlayerPassbook';

export const countDataForPlayerPassbook = createAppAsyncThunk('countDataForPlayerPassbook', (data: any) => {
  const args: any = {}
  return HTTP.post(`countDataForPlayerPassbook`, {
    ...args,
    ...data
  })
  .then(res => PlayerPassbook.fromArray(res?.data?.result) || []);
});
export const listPlayers = createAppAsyncThunk('listPlayers', (data: any) => {
  const args: any = {}
  return HTTP.post(`listPlayers`, {
    ...args,
    ...data
  })
  .then(res => res?.data?.result || []);
});