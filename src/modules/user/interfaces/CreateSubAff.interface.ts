import { IRoleParam } from '@/interfaces/global.interface';
import { IChipsManagement, ICreatedBy } from './CreateAgent.interface';

export interface ICreateSubAffParam {
  address?: string;
  cityName?: string;
  createdAt?: number;
  createdBy?: ICreatedBy;
  creditLimit?: string | null;
  deposit?: number;
  dob?: string | null;
  email?: string;
  mobile?: string | null;
  module?: number[];
  name?: string;
  parentUser?: string;
  password?: string;
  profit?: number;
  pulledRealChips?: number;
  rakeCommision?: number | null;
  role?: IRoleParam;
  status?: string | null;
  upDateAt?: number;
  userName?: string;
  withdrawal?: number;
  withdrawalChips?: number;
  isAuthenticatorEnabled?: string;
}

export interface ISubAffDetailParam {
  limit?: number;
  roleName?: string;
  skip?: number;
  _id?: string;
}

export interface IUpdateSubAffParam {
  address?: string;
  chipsManagement?: IChipsManagement;
  cityName?: string;
  createdAt?: number;
  createdBy?: ICreatedBy;
  creditLimit?: string | null;
  deposit?: number;
  dob?: string | null;
  email?: string;
  mobile?: string | null;
  module?: number[];
  name?: string;
  parentName?: string;
  parentUser?: string;
  password?: string;
  profit?: number;
  pulledRealChips?: number;
  rakeCommision?: number | null;
  role?: IRoleParam;
  status?: string | null;
  upDateAt?: number;
  userName?: string;
  withdrawal?: number;
  withdrawalChips?: number;
  _id?: string;
  isAuthenticatorEnabled?: string;
}

export interface IUpdateModuleAff {
  userName?: string;
  module?: []
}