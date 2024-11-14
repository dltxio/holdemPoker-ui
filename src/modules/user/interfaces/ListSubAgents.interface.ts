import { IApiParams } from '@/interfaces/global.interface';

export interface IListSubAgentsParams extends IApiParams {
  roleName?: string;
  loginId?: string;
  name?: string;
  status?: string;
  parentUser?: string;
}

export interface ICountSubAgentsParams {
  roleName?: string;
  loginId?: string;
  name?: string;
  status?: string;
  parentUser?: string;
}
