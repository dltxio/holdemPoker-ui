import HTTP from '@/core/http';
import { Table } from '@/modules/player-report/models/Table';
import { createAppAsyncThunk } from '@/store/thunk';

export const listTable = createAppAsyncThunk('listTable', (data?: any) => {
  return HTTP.post(`listTable`, data).then(res => res.data.result && Table.fromArray(res.data.result) || []);
});
export const broadcastToGame = createAppAsyncThunk('broadcastToGame', (data?: any) => {
  return HTTP.post(`broadcastToGame`, data).then(res => res?.data?.result);
});