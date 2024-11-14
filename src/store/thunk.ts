import HTTP, { handleResponse } from '@/core/http';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosRequestConfig } from 'axios';
import { AppDispatch, RootState } from '.';

const type =  createAsyncThunk.withTypes<{
  state: RootState
  dispatch: AppDispatch
  // rejectValue: string
  // extra: { s: string; n: number }
}>();

export const createAppAsyncThunk: typeof type = createAsyncThunk;

export const createHttpPostThunk = (path: string, data?: any, options?: AxiosRequestConfig) =>
createAppAsyncThunk(path, (params: any = {}) => HTTP.post(path, {...data, ...params}, options)
.then(handleResponse))