import { IApiParams } from '@/interfaces/global.interface';

export interface IListAgentsParams extends IApiParams {
  roleName?: string;
  status?: string;
  email?: string;
  loginId?: string;
  name?: string;
}

export interface ICountAgentsParams {
  roleName?: string;
  status?: string;
  email?: string;
  loginId?: string;
  name?: string;
}