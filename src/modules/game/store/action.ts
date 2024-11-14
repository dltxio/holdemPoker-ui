import HTTP from '@/core/http';
import { createAppAsyncThunk } from '@/store/thunk';
import {createAction, createAsyncThunk} from '@reduxjs/toolkit';
import { Table, TableUpdateRecord } from '../models/Table';

export const createTable = createAppAsyncThunk('createTable', (data: any, ctx) => {
  const user = ctx.getState().auth.user;
  return HTTP.post(`createTable`, {
    ...data,
    createdBy: user.userName,
    // updatedByRole: JSON.stringify(user.role)
  }).then(res => res.data.result || 0);
});

export const getListTable = createAppAsyncThunk('getListTable', (data?: any) => {
  return HTTP.post(`listTable`, data).then(res => res.data.result && Table.fromArray(res.data.result) || []);
});


export const countListTable = createAppAsyncThunk('countListTable', (data?: any) => {
  return HTTP.post(`countlistTable`, data).then(res => res.data.result || 0);
});

export const updateTable = createAppAsyncThunk('updateTable', (data: any, ctx) => {
  console.log("data==== ", data);
  const user = ctx.getState().auth.user;
  return HTTP.put(`updateTable`, {
    ...data,
    updatedBy: user.userName,
    updatedByRole: JSON.stringify(user.role)
  }).then(res => res.data.result || 0);
});

export const revertTable = createAppAsyncThunk('revertTable', (data?: any) => {
  console.log("vao day revertTable");
  
  return HTTP.post(`revertTable`, data).then(res => res.data.result);
});

export const disableTable = createAppAsyncThunk('disableTable', (data?: any) => {
  return HTTP.put(`disableTable`, data).then(res => res.data.result);
});

export const getTableUpdate = createAppAsyncThunk('getTableUpdate', (data?: any) => {
  return HTTP.post('getTableUpdateRecords', data).then(res => res.data.result && Table.fromArray(res.data.result) || []);
});

export const getCountTableUpdate = createAppAsyncThunk('getCountTableUpdate', (data?: any) => {
  return HTTP.post('getTableUpdateRecordsCount', data).then(res => res.data.result || 0);
});

export const getTableRecords = createAppAsyncThunk('getTableRecords', (data?: any) => {
  return HTTP.post('getTableRecords', data).then(res => res.data.result && TableUpdateRecord.fromArray(res.data.result) || []);
});