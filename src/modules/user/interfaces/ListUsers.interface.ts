import { IApiParams } from '@/interfaces/global.interface';

export interface IListUsersFilter {
  name?: string;
  level?: number;
  status?: 'Active' | 'Block',
}

export interface IListUsersParams extends IApiParams {
  level?: number;
  department?: number;
  name?: string;
  status?: string;
}

export interface ICountUsersParams {
  level?: number;
  department?: number;
  name?: string;
  status?: string;
}