import { IRoleParam } from '@/interfaces/global.interface';

export interface ICreateUserParam {
  createdBy: string;
  module: number[];
  name: string;
  password: string;
  reportingTo: string;
  role: IRoleParam;
  status: string;
  userName: string;
}

export interface IUserDetailParam {
  level?: number;
  _id: string;
}

export interface IUpdateUserParam {
  createdAt?: number;
  createdBy?: string;
  id?: string;
  module?: string[];
  name?: string;
  password?: string;
  reportingTo?: string;
  role: IRoleParam;
  roleName?: string;
  status?: string;
  userName?: string;
  _id?: string;
  isAuthenticatorEnabled?: string;
}