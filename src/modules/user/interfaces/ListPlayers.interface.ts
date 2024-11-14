import { IApiParams } from '@/interfaces/global.interface';

export interface IListPlayersParams extends IApiParams {
  isOrganic?: string | boolean;
  parent?: string;
  promoBonusAwarded?: boolean;
  userId?: string;
  status?: string;
  userName?: string;
}

export interface ICountPlayersParams {
  isOrganic?: string | boolean;
  parent?: string;
  promoBonusAwarded?: boolean;
  userId?: string;
  status?: string;
  userName?: string;
}

export interface IForgotPasswordParam {
  emailId?: string;
}

export interface IResendVerificationParam {
  emailId?: string;
  userName?: string;
}