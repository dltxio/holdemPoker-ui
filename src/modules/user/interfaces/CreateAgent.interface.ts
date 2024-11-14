import { IRoleParam } from '@/interfaces/global.interface';

export interface ICreatedBy {
  id?: string;
  name?: string;
  role?: IRoleParam;
  userName?: string;
}

export interface ICreateAgentParam {
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
  password?: string;
  profit?: number;
  pulledRealChips?: number;
  rakeCommision?: number | null;
  realChips?: number;
  role?: IRoleParam;
  status?: string | null;
  upDateAt?: number;
  userName?: string;
  withdrawal?: number;
  withdrawalChips?: number;
  isAuthenticatorEnabled?: string;
}

export interface IAgentDetailParam {
  limit?: number;
  roleName?: string;
  skip?: number;
  _id?: string;
}

export interface IChipsManagement {
  deposit?: number;
  profitCount?: number;
  profitWithdrawlDate?: number;
  withdrawl?: number;
  withdrawlCount?: number;
  withdrawlDate?: number;
  withdrawlPercent?: number;
}

export interface IUpdateAgentParam {
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
  password?: string;
  profit?: number;
  pulledRealChips?: number;
  rakeCommision?: number | null;
  realChips?: number;
  role?: IRoleParam;
  status?: string | null;
  upDateAt?: number;
  userName?: string;
  withdrawal?: number;
  withdrawalChips?: number;
  _id?: string;
}