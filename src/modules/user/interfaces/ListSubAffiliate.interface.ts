import { IApiParams } from '@/interfaces/global.interface';

export interface IListSubAffiliateParams extends IApiParams {
  loginId?: string;
  name?: string;
  roleName?: string;
  status?: string;
  parentUser?: string;
}

export interface ICountListSubAffiliateParams {
  loginId?: string;
  name?: string;
  roleName?: string;
  status?: string;
  parentUser?: string;
}
