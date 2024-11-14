import HTTP from '@/core/http';
import { createAppAsyncThunk } from '@/store/thunk';
import {createAction, createAsyncThunk} from '@reduxjs/toolkit';

export const listPlayerForBuildAcess = createAppAsyncThunk('listPlayerForBuildAcess', (data: any) => {
  return HTTP.post(`listPlayerForBuildAcess`, data)
  .then(res => res.data.result);
});

export const updatePlayerBuildAcess = createAppAsyncThunk('updatePlayerBuildAcess', (data: any) => {
  return HTTP.post(`updatePlayerBuildAcess`, data);
});

