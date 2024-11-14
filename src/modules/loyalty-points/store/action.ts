import HTTP from '@/core/http';
import { createAppAsyncThunk } from '@/store/thunk';

export const createLoyaltyPoints = createAppAsyncThunk('createLoyaltyPoints', async (data: any) => {
  const res = await HTTP.post(`createLoyaltyPoints`, {
    ...data
  });
  return res.data.result;
});

export const listLoyaltyPoints = createAppAsyncThunk('listLoyaltyPoints', async (data: any) => {
  const res = await HTTP.post(`listLoyaltyPoints`, {
    ...data
  });
  return res.data.result;
});

export const updateLoyaltyPoints = createAppAsyncThunk('updateLoyaltyPoints', async (data: any) => {
  const res = await HTTP.post(`updateLoyaltyPoints`, {
    ...data
  });
  return res.data.result;
});