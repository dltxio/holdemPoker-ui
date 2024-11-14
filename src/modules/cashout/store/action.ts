import HTTP from '@/core/http';
import { createAppAsyncThunk } from '@/store/thunk';
import { ApproveCashOutRequest } from '../models/ApproveCashOutRequest';
import { CashoutHistory } from '../models/CashoutHistory';
import { PendingCashOutRequest } from '../models/PendingCashOutRequest';

export const getCashOutRequestCount = createAppAsyncThunk('getCashOutRequestCount', (data: any, ctx) => {
  return HTTP.post(`getCashOutRequestCount`, {
    ...data,
  }).then(res =>(res.data.result || 0))
})

export const listPendingCashOutRequest = createAppAsyncThunk('listPendingCashOutRequest', (data: any, ctx) => {
  return HTTP.post(`listPendingCashOutRequest`, {
    ...data,
  }).then(res => ({
    ...res.data,
    result: res.data.result && PendingCashOutRequest.fromArray(res.data.result || [])
  }))
})

export const removeCashoutRequestOnAction = createAppAsyncThunk('removeCashoutRequestOnAction', async (data: {_id: string}, ctx) => {
  return await HTTP.post(`removeCashoutRequestOnAction`, {
    ...data,
  }).then(res => ({
    ...res.data,
  }))
})

export const processApproveCashout = createAppAsyncThunk('processApproveCashout', async (data: {_id: string}, ctx) => {
  const user = ctx.getState().auth.user;
  await HTTP.post(`processApproveCashout`, {
    ...data,
    approveBy: user.userName
  }).then(res => ({
    ...res.data,
  }))
  return await ctx.dispatch(removeCashoutRequestOnAction(data));
})

export const insertIntoCashoutHistory = createAppAsyncThunk('insertIntoCashoutHistory', async (data: { _id: string }, ctx) => {
  const user = ctx.getState().auth.user;
  await HTTP.post(`insertIntoCashoutHistory`, {
    ...data,
    approveBy: user.userName
  }).then(res => ({
    ...res.data,
  }))
});

export const approveCashoutCount = createAppAsyncThunk('approveCashoutCount', (data: any, ctx) => {
  return HTTP.post(`approveCashoutCount`, {
    ...data,
  }).then(res =>(res.data.result || 0))
})

export const listApproveCashOutRequest = createAppAsyncThunk('listApproveCashOutRequest', (data: any, ctx) => {
  return HTTP.post(`listApproveCashOutRequest`, {
    ...data,
  }).then(res => ({
    ...res.data,
    // result: res.data.result && ApproveCashOutRequest.fromArray(res.data.result || [])
    result: res.data.result
  }))
})

export const insertIntoCashoutHistoryOnTransfer = createAppAsyncThunk('insertIntoCashoutHistory/onTransfer', async (data: {_id: string}, ctx) => {
  // const user = ctx.getState().auth.user;
  return await HTTP.post(`insertIntoCashoutHistory/onTransfer`, {
    ...data,
  }).then(res => ({
    ...res.data,
  }))
})

export const removeFromCashsoutApprovel = createAppAsyncThunk('removeFromCashsoutApprovel', async (data: {_id: string}, ctx) => {
  // const user = ctx.getState().auth.user;
  return await HTTP.post(`removeFromCashsoutApprovel`, {
    ...data,
  }).then(res => ({
    ...res.data,
  }))
})

export const getCashoutHistoryCount = createAppAsyncThunk('getCashoutHistoryCount', (data: any, ctx) => {
  return HTTP.post(`getCashoutHistoryCount`, {
    ...data,
  }).then(res =>(res.data.result || 0))
});

export const listCashOutHistory = createAppAsyncThunk('listCashOutHistory', async (data: {_id: string}, ctx) => {
  // const user = ctx.getState().auth.user;
  return await HTTP.post(`listCashOutHistory`, {
    ...data,
  }).then(res => ({
    ...res.data,
    result: res.data.result && CashoutHistory.fromArray(res.data.result || []) || []
  }))
});

export const countDataForCashoutHistory = createAppAsyncThunk('countDataForCashoutHistory', (data: any, ctx) => {
  const user: any = ctx.getState().auth.user;
  return HTTP.post(`countDataForCashoutHistory`, {
    ...data,
    name: user.name,
    mobile: user.mobile,
    userName: user.userName,
    role: user.role
  }).then(res =>(res.data.result || 0))
});

export const findDataForCashoutHistory = createAppAsyncThunk('findDataForCashoutHistory', async (data: {_id: string}, ctx) => {
  const user: any = ctx.getState().auth.user;
  return await HTTP.post(`findDataForCashoutHistory`, {
    ...data,
    name: user.name,
    mobile: user.mobile,
    userName: user.userName,
    role: user.role
  }).then(res => ({
    ...res.data,
    result: res.data.result || []
  }))
});

export const countDataForCashout = createAppAsyncThunk('countDataForCashout', (data: any, ctx) => {
  const user: any = ctx.getState().auth.user;
  return HTTP.post(`countDataForCashout`, {
    ...data,
    name: user.name,
    mobile: user.mobile,
    userName: user.userName,
    role: user.role
  }).then(res =>(res.data.result || 0))
});

export const findDataForCashout = createAppAsyncThunk('findDataForCashout', async (data: {_id: string}, ctx) => {
  const user: any = ctx.getState().auth.user;
  return await HTTP.post(`findDataForCashout`, {
    ...data,
    name: user.name,
    mobile: user.mobile,
    userName: user.userName,
    role: user.role
  }).then(res => ({
    ...res.data,
    result: res.data.result || []
  }))
});

export const listOneAffiliate = createAppAsyncThunk('listOneAffiliate', async (data: any, ctx) => {
  const user: any = ctx.getState().auth.user;
  return await HTTP.post(`listOneAffiliate`, {
    ...data,
    // name: user.name,
    // mobile: user.mobile,
    userName: user.userName,
    // role: user.role
  }).then(res => ({
    ...res.data,
    result: res.data.result || []
  }))
});

export const getRequestPayment = createAppAsyncThunk('getRequestPayment', async (data: { invoiceId: string }, ctx) => {
  return await HTTP.post(`getRequestPayment`, {
    ...data,
  }).then(res => ({
    ...res.data,
  }))
});

export const paymentInvoiceCashout = createAppAsyncThunk('paymentInvoiceCashout', async (data: { paymentRequest: string }, ctx) => {
  return await HTTP.post(`paymentInvoiceCashout`, {
    ...data,
  }).then(res => ({
    ...res.data,
  }))
});

export const listAffiliateWithUserName = createAppAsyncThunk('listAffiliateWithUserName', async (data: any, ctx) => {
  const user: any = ctx.getState().auth.user;
  return await HTTP.post(`listAffiliateWithUserName`, {
    ...data,
    // name: user.name,
    // mobile: user.mobile,
    userName: user.userName,
    // role: user.role
  }).then(res => ({
    ...res.data,
    result: res.data.result || []
  }))
});

export const createAffilateWithDrawlRequest = createAppAsyncThunk('createAffilateWithDrawlRequest', async (data: any, ctx) => {
  return await HTTP.post(`createAffilateWithDrawlRequest`, {
    ...data
  }).then(res => ({
    ...res.data,
    result: res.data.result || []
  }))
});

export const createAffilateWithDrawlRequestWithInvoiceId = createAppAsyncThunk('createAffilateWithDrawlRequestWithInvoiceId', async (data: any, ctx) => {
  return await HTTP.post(`createAffilateWithDrawlRequestWithInvoiceId`, {
    ...data
  }).then(res => ({
    ...res.data,
    result: res.data.result || []
  }))
});

export const approveDataForCashout = createAppAsyncThunk('approveDataForCashout', async (data: any, ctx) => {
  const user = ctx.getState().auth.user;
  await HTTP.post(`approveDataForCashout`, {
    ...data,
  }).then(res => ({
    ...res.data,
  }))
});

export const rejectDataForCashout = createAppAsyncThunk('rejectDataForCashout', async (data: any, ctx) => {
  const user = ctx.getState().auth.user;
  await HTTP.post(`rejectDataForCashout`, {
    ...data,
  }).then(res => ({
    ...res.data,
    result: res.data.result || []
  }))
});