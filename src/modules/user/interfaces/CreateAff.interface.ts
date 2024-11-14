import { IRoleParam } from '@/interfaces/global.interface';
import { IChipsManagement, ICreatedBy } from './CreateAgent.interface';

export interface ICreateAffParam {
  address?: string;
  cityName?: string;
  createdAt?: number;
  createdBy?: ICreatedBy;
  dob?: string | null;
  email?: string;
  mobile?: string | null;
  module?: number[];
  name?: string;
  password?: string;
  profit?: number;
  rakeCommision?: number | null;
  role?: IRoleParam;
  status?: string | null;
  upDateAt?: number;
  userName?: string;
  withdrawal?: number;
  withdrawalChips?: number;
  creditLimit?: string;
  isAuthenticatorEnabled?: string;
}

export interface IAffDetailParam {
  limit?: number;
  roleName?: string;
  skip?: number;
  _id?: string;
}

export interface IUpdateAffParam {
  address?: string;
  chipsManagement?: IChipsManagement;
  cityName?: string;
  createdAt?: number;
  createdBy?: ICreatedBy;
  dob?: string | null;
  email?: string;
  mobile?: string | null;
  module?: number[];
  name?: string;
  password?: string;
  profit?: number;
  rakeCommision?: number | null;
  role?: IRoleParam;
  status?: string | null;
  upDateAt?: number;
  userName?: string;
  withdrawal?: number;
  withdrawalChips?: number;
  _id?: string;
}