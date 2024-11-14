import HTTP, { wrapResponse } from '@/core/http';
import { createAppAsyncThunk } from '@/store/thunk';

// Interfaces
import { ICountUsersParams, IListUsersParams } from '../interfaces/ListUsers.interface';
import { ICreateUserParam, IUpdateUserParam, IUserDetailParam } from '../interfaces/CreateUser.interface';
import { ICountAgentsParams, IListAgentsParams } from '../interfaces/ListAgents.interface';
import { ICountSubAgentsParams, IListSubAgentsParams } from '../interfaces/ListSubAgents.interface';
import { ICountPlayersParams, IForgotPasswordParam, IListPlayersParams, IResendVerificationParam } from '../interfaces/ListPlayers.interface';
import { ICountAffiliateParams, IListAffiliateParams } from '../interfaces/ListAffiliate.interface';
import { ICountListSubAffiliateParams, IListSubAffiliateParams } from '../interfaces/ListSubAffiliate.interface';
import { IAgentDetailParam, ICreateAgentParam, IUpdateAgentParam } from '../interfaces/CreateAgent.interface';
import { ICreateSubAgentParam, ISubAgentDetailParam, IUpdateSubAgentParam } from '../interfaces/CreateSubAgent.interface';
import { ICreatePlayerParam, IPlayerDetailParam, IUpdatePlayerParam } from '../interfaces/CreatePlayer.interface';
import { IAffDetailParam, ICreateAffParam, IUpdateAffParam } from '../interfaces/CreateAff.interface';
import { ICreateSubAffParam, ISubAffDetailParam, IUpdateSubAffParam, IUpdateModuleAff } from '../interfaces/CreateSubAff.interface';

// Models
import { ListUsers } from '../models/ListUsers.model';
import { ListAgents } from '../models/ListAgents.model';
import { ListSubAgents } from '../models/ListSubAgents.model';
import { ListPlayers } from '../models/ListPlayers.model';
import { ListAffiliate } from '../models/ListAffiliate.model';
import { ListSubAffiliate } from '../models/ListSubAffiliate.model';

export const listUsers = createAppAsyncThunk('user/listUsers', async (params: IListUsersParams) => {
  const res = await HTTP.post('listUser', params);
  return ListUsers.fromArray(res.data.result);
});

export const countUsers = createAppAsyncThunk('user/countUsers', async (params: ICountUsersParams) => {
  const res = await HTTP.post('countUsers', params);
  return res.data.result;
});

export const createUser = createAppAsyncThunk('user/createUser', async (params: ICreateUserParam) => {
  const res: any = wrapResponse(await HTTP.post('createUser', params));
  return res.data.result;
});

export const listAgents = createAppAsyncThunk('user/listAgents', async (params: IListAgentsParams) => {
  const res = await HTTP.post('listAffiliate', params);
  return ListAgents.fromArray(res.data.result);
});

export const countAgents = createAppAsyncThunk('user/countAgents', async (params: ICountAgentsParams) => {
  const res = await HTTP.post('getAffiliateCount', params);
  return res.data.result;
});

export const listSubAgents = createAppAsyncThunk('user/listSubAgents', async (params: IListSubAgentsParams) => {
  const res = await HTTP.post('listSubAffiliate', params);
  return ListSubAgents.fromArray(res.data.result); 
});

export const countSubAgents = createAppAsyncThunk('user/countSubAgents', async (params: ICountSubAgentsParams) => {
  const res = await HTTP.post('getSubAffiliateCount', params);
  return res.data.result;
});

export const listPlayers = createAppAsyncThunk('user/listPlayers', async (params: IListPlayersParams) => {
  const res = await HTTP.post('listUsersAndCalculateBonus', params);
  return ListPlayers.fromArray(res.data.result);
});

export const countPlayers = createAppAsyncThunk('user/countPlayers', async (params: ICountPlayersParams) => {
  const res = await HTTP.post('countlistPlayer', params);
  return res.data.result;
});

export const listAffiliate = createAppAsyncThunk('user/listAffiliate', async (params: IListAffiliateParams) => {
  const res = await HTTP.post('listAffiliate', params);
  return ListAffiliate.fromArray(res.data.result);
});

export const countAffiliate = createAppAsyncThunk('user/countAffiliate', async (params: ICountAffiliateParams) => {
  const res = await HTTP.post('getAffiliateCount', params);
  return res.data.result;
});

export const listSubAffiliate = createAppAsyncThunk('user/listSubAffiliate', async (params: IListSubAffiliateParams) => {
  const res = await HTTP.post('listSubAffiliate', params);
  return ListSubAffiliate.fromArray(res.data.result);
});

export const countSubAffiliate = createAppAsyncThunk('user/countSubAffiliate', async (params: ICountListSubAffiliateParams) => {
  const res = await HTTP.post('getSubAffiliateCount', params);
  return res.data.result;
});

export const createAgent = createAppAsyncThunk('user/createAgent', async (params: ICreateAgentParam) => {
  const res: any = wrapResponse(await HTTP.post('createNewAffiliate', params));
  return res.data.result;
});

export const createSubAgent = createAppAsyncThunk('user/createSubAgent', async (params: ICreateSubAgentParam) => {
  const res: any = wrapResponse(await HTTP.post('createSubAffiliate', params));
  return res.data.result;
});

export const createPlayer = createAppAsyncThunk('user/createPlayer', async (params: ICreatePlayerParam) => {
  const res: any = wrapResponse(await HTTP.post('createPlayer', params));
  return res.data.result;
});

export const createAff = createAppAsyncThunk('user/createAff', async (params: ICreateAffParam) => {
  const res: any = wrapResponse(await HTTP.post('createNewAffiliate', params));
  return res.data.result;
});

export const createSubAff = createAppAsyncThunk('user/createSubAff', async (params: ICreateSubAffParam) => {
  const res: any = wrapResponse(await HTTP.post('createSubAffiliate', params));
  return res.data.result;
});

export const getUserDetail = createAppAsyncThunk('user/getUserDetail', async (params: IUserDetailParam) => {
  const res: any = await HTTP.post('listUser', params);
  return res.data.result;
});

export const updateUser = createAppAsyncThunk('user/updateUser', async (params: IUpdateUserParam) => {
  const res: any = await HTTP.post('updateUserInfo', params);
  return res.data.result;
});

export const getAgentDetail = createAppAsyncThunk('user/getAgentDetail', async (params: IAgentDetailParam) => {
  const res: any = await HTTP.post('listAffiliate', params);
  return res.data.result;
});

export const updateAgent = createAppAsyncThunk('user/updateAgent', async (params: IUpdateAgentParam) => {
  console.log("paramsupdateAgent ", params);
  const res: any = await HTTP.post('updateAffiliate', params);
  return res.data.result;
});

export const getSubAgentDetail = createAppAsyncThunk('user/getSubAgentDetail', async (params: ISubAgentDetailParam) => {
  const res: any = await HTTP.post('listSubAffiliate', params);
  return res.data.result;
});

export const updateSubAgent = createAppAsyncThunk('user/updateSubAgent', async (params: IUpdateSubAgentParam) => {
  const res: any = await HTTP.post('updateSubAffiliate', params);
  return res.data.result;
});

export const getPlayerDetail = createAppAsyncThunk('user/getPlayerDetail', async (params: IPlayerDetailParam) => {
  const res: any = await HTTP.post('listUsersAndCalculateBonus', params);
  return ListPlayers.fromArray(res.data.result);
});

export const updatePlayer = createAppAsyncThunk('user/updatePlayer', async (params: IUpdatePlayerParam) => {
  const res: any = await HTTP.post('updatePlayer', params);
  return res.data.result;
});

export const getAffDetail = createAppAsyncThunk('user/getAffDetail', async (params: IAffDetailParam) => {
  const res: any = await HTTP.post('listAffiliate', params);
  return res.data.result;
});

export const updateAff = createAppAsyncThunk('user/updateAff', async (params: IUpdateAffParam) => {
  const res: any = await HTTP.post('updateAffiliate', params);
  return res.data.result;
});

export const getSubAffDetail = createAppAsyncThunk('user/getSubAffDetail', async (params: ISubAffDetailParam) => {
  const res: any = await HTTP.post('listSubAffiliate', params);
  return res.data.result;
});

export const updateSubAff = createAppAsyncThunk('user/updateSubAff', async (params: IUpdateSubAffParam) => {
  const res: any = await HTTP.post('updateSubAffiliate', params);
  return res.data.result;
});

export const forgotPassword = createAppAsyncThunk('forgotPasswordUser', async (params: IForgotPasswordParam) => {
  return wrapResponse(await HTTP.post('forgotPasswordUser', params));
});

export const resendVerification = createAppAsyncThunk('resendVerificationLinkDasboard', async (params: IResendVerificationParam) => {
  return wrapResponse(HTTP.post('resendVerificationLinkDasboard', params));
});

export const updateModuleAff = createAppAsyncThunk('user/updateModuleAff', async (params: IUpdateModuleAff) => {
  return wrapResponse(HTTP.post('updateModuleAff', params));
});

export const checkUserSessionInDb = createAppAsyncThunk('user/checkUserSessionInDb', async (params: any) => {
  const res: any = await HTTP.post('checkUserSessionInDb', { uniqueSessionId: params.uniqueSessionId, userName: params.userName });
  return res.data.result;
});