import HTTP from '@/core/http'
import { createAppAsyncThunk } from '@/store/thunk'
import { createAction, createAsyncThunk } from '@reduxjs/toolkit'
import { TransactionHistory, TransactionTypeEnums, TransferModeEnum } from '../models/transaction-history'
export const createAuthAction = (action: string) => createAction(`auth/${action}`)

export const login = createAsyncThunk('auth/login', (data: { username: string, password: string }) => {
  return HTTP.post(`auth/login`, data)
})

export const listTransactionHistory = createAppAsyncThunk('listTransactionHistory', async (data: any) => {
  data.startDate = data.startDate?.valueOf()
  data.endDate = data.endDate?.valueOf()

  const res = await HTTP.post<any>(`listTransactionHistory`, {
    skip: data.skip,
    limit: data.pageSize,
    ...data
  })
  
  let totalFundTransfer = 0
  let totalOnlineTransfer = 0
  let totalScratchcardTransfer = 0
  let totalDebit = 0
  let totalCredit = 0

  if (res.data?.result && res.data?.result.resultList && res.data.result.resultList.length > 0) {
    const listResult = res.data.result.resultList
    listResult.forEach((item: any) => {
      if (item.transferMode === TransferModeEnum.onlineTransfer) {
        totalOnlineTransfer += item.amount
      } else if (item.transferMode === TransferModeEnum.scratchCard) {
        totalScratchcardTransfer += item.amount
      } else if (item.transferMode === TransferModeEnum.funTransfer) {
        totalFundTransfer += item.amount
      }
    })
  }

  if (res.data?.result && res.data?.result.financeStatus && res.data.result.financeStatus.length > 0) {
    const financeStatus = res.data.result.financeStatus
    financeStatus.forEach((item: any) => {
      if (item._id === TransactionTypeEnums.credit) {
        totalCredit += item.totalAmount
      } else if (item._id === TransactionTypeEnums.debit) {
        totalDebit += item.totalAmount
      }
    })
  }

  return {
    result: res.data?.result || [],
    totalFundTransfer,
    totalOnlineTransfer,
    totalScratchcardTransfer,
    totalDebit,
    totalCredit,
  }
})

export const countDataInTransactionHistory = createAppAsyncThunk('countDataInTransactionHistory', async (data: any) => {
  data.startDate = data.startDate?.valueOf()
  data.endDate = data.endDate?.valueOf()
  const res = await HTTP.post(`countDataInTransactionHistory`, {
    ...data
  })
  return res.data.result
})

export const listDepositInvoice = createAppAsyncThunk('listDepositInvoice', async (data: any) => {
  const res = await HTTP.post(`listDepositInvoice`, {
    skip: data.skip,
    limit: data.pageSize,
    ...data
  })
  return res.data.result
})

export const countDepositInvoice = createAppAsyncThunk('countDepositInvoice', async (data: any) => {
  const res = await HTTP.post(`countDepositInvoice`, {
    ...data
  })
  return res.data.result
})


export const register = createAuthAction('login')
