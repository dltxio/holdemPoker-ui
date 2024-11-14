import HTTP from '@/core/http';
import { createAppAsyncThunk } from '@/store/thunk';
import { ChatHistoy } from '../models/ChatHistoy';

export const disableOrEnablePlayerChat = createAppAsyncThunk('disableOrEnablePlayerChat', (data: any) => {
  const args: any = {}
  return HTTP.post(`disableOrEnablePlayerChat`, {
    ...args,
    ...data
  })
  .then(res => res?.data?.result);
});

export const playerChat = createAppAsyncThunk('playerChat', (data: any) => {
  const args: any = {}
  return HTTP.get(`playerChat/${data.playerName}`, {
    ...args,
  })
    .then(res => res?.data?.result);
});

export const listChatHistory = createAppAsyncThunk('listChatHistory', (data: any) => {
  const args: any = {}
  return HTTP.post(`listChatHistory`, {
    ...args,
    ...data,
  })
  .then(res => res.data.result && ChatHistoy.fromArray(res.data.result) || []);
});

export const countChatHistory = createAppAsyncThunk('countChatHistory', (data: any) => {
  const args: any = {}
  return HTTP.post(`countChatHistory`, {
    ...args,
    ...data,
  })
  .then(res => res.data.result || 0);
});