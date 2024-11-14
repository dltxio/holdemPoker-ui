import HTTP from '@/core/http';
import { createAppAsyncThunk } from '@/store/thunk';
import { DepositCode } from '../models/DepositCode';

export const createBonusCode = createAppAsyncThunk('createBonusCode', (data?: any) => {
  return HTTP.post(`createBonusCode`, data).then(res => res?.data?.result);
});

export const updateBonusCode = createAppAsyncThunk('updateBonusCode', (data?: any) => {
  return HTTP.post(`updateBonusCode`, data).then(res => res?.data);
});

export const instantBonusExpire = createAppAsyncThunk('instantBonusExpire', (data?: any) => {
  return HTTP.get(`instantBonusExpire/${data.id}`).then(res => res?.data);
});

export const listPromotionalBonus = createAppAsyncThunk('listPromotionalBonus', (data?: any) => {
  return HTTP.get(`listPromotionalBonus`).then(res => res?.data);
});


export const listBonusDeposit = createAppAsyncThunk('listBonusDeposit', (data: any) => {
  const args: any = {}
  return HTTP.post(`listBonusDeposit`, {
    ...args,
    ...data,
  })
    .then(res => res.data.result && DepositCode.fromArray(res.data.result) || []);
});

export const countBonusDeposit = createAppAsyncThunk('countBonusDeposit', (data: any) => {
  const args: any = {}
  return HTTP.post(`countBonusDeposit`, {
    ...args,
    ...data,
  })
    .then(res => res.data.result || 0);
});
export const addPromotionalBonus = createAppAsyncThunk('addPromotionalBonus', (data: any) => {
  const args: any = {}
  return HTTP.post(`addPromotionalBonus`, {
    ...args,
    ...data,
  })
    .then(res => res.data.result || 0);
});
export const removePromotionalBonus = createAppAsyncThunk('removePromotionalBonus', (data: any) => {
  const args: any = {}
  return HTTP.delete(`removePromotionalBonus/${data.id}`, {
    ...args,
    ...data,
  })
    .then(res => res.data.result || 0);
});