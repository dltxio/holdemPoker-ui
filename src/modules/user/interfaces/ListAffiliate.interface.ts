import { IApiParams } from '@/interfaces/global.interface';

export interface IListAffiliateParams extends IApiParams {
  loginId?: string;
  name?: string;
  roleName?: string;
  status?: string;
}

export interface ICountAffiliateParams {
  loginId?: string;
  name?: string;
  roleName?: string;
  status?: string;
}
