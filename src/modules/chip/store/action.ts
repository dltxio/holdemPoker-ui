import HTTP from "@/core/http";
import { createAppAsyncThunk } from "@/store/thunk";
import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { TransferHistoryPlayerModel } from "../models/TransferHistoryPlayerModel";

export const createAuthAction = (action: string) =>
	createAction(`auth/${action}`);

export const transferFundChips = createAppAsyncThunk(
	"transferFundChips",
	(data: any, ctx) => {
		const user = ctx.getState().auth.user;
		return HTTP.post(`transferFundChips`, {
			...data,
			role: user.role,
			transferBy: user.userName
		});
	}
);

export const transferFundChipsToAffiliate = createAppAsyncThunk(
	"transferFundChipsToAffiliate",
	(data: any, ctx) => {
		const user = ctx.getState().auth.user;
		return HTTP.post(`transferFundChipsToAffiliate`, {
			...data,
			role: user.role,
		});
	}
);

export const fundTransferPlayerHistory = createAppAsyncThunk(
	"fundTransferPlayerHistory",
	(data: any, ctx) => {
		const user: any = ctx.getState().auth.user;
		return HTTP.post(`fundTransferPlayerHistory`, {
			...data,
			role: user.role,
		}).then((res) => ({
			items:
				(res.data.result &&
					TransferHistoryPlayerModel.fromArray(res.data.result)) ||
				[],
			totalAmount: res.data.totalAmount || 0,
		}));
	}
);

export const countPlayerHistory = createAppAsyncThunk(
	"countPlayerHistory",
	(data: any, ctx) => {
		const user: any = ctx.getState().auth.user;
		return HTTP.post(`countPlayerHistory`, {
			...data,
			role: user.role,
		}).then((res) => res.data.result || 0);
	}
);

export const fundTransferAffiliateHistory = createAppAsyncThunk(
	"fundTransferAffiliateHistory",
	(data: any, ctx) => {
		const user = ctx.getState().auth.user;
		return HTTP.post(`fundTransferAffiliateHistory`, {
			...data,
			role: user.role,
		}).then((res) => ({
			items:
				(res.data.result &&
					TransferHistoryPlayerModel.fromArray(res.data.result)) ||
				[],
			totalAmount: res.data.totalAmount || 0,
		}));
	}
);

export const countAffiliateHistory = createAppAsyncThunk(
	"countAffiliateHistory",
	(data: any, ctx) => {
		const user = ctx.getState().auth.user;
		delete data.limit;
		delete data.skip;
		return HTTP.post(`countAffiliateHistory`, {
			...data,
			role: user.role,
		}).then((res) => res.data.result || 0);
	}
);

export const transferFundChipsToSubAffiliate = createAppAsyncThunk(
	"transferFundChipsToSubAffiliate",
	(data: any, ctx) => {
		const user = ctx.getState().auth.user;
		return HTTP.post(`transferFundChipsToSubAffiliate`, {
      ...data,
			// transferTo: "subagent01",
			// amount: 20,
			// transactionType: "Credit",
			role: user.role,
			transferBy: user.userName,
			// Name: "subagent01",
			approvedBy: user.userName,
			parentEmail: user.emailId,
			parentMobile: user.mobile,
		});
	}
);
