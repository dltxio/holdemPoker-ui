export interface IEvent {
  type: string;
  data: any;
}

export interface IAlertData {
  title?: string;
  content?: string;
}

export interface IApiParams {
  limit?: number;
  skip?: number;
}

export interface IPagination {
  current?: number;
  total?: number;
  pageSize?: number;
}

export interface IRoleParam {
  name: string;
  level: number;
}

export interface IStorageDataRole {
  name?: string;
  level?: number;
}

export interface IStorageData {
  department?: string;
  email?: string;
  isParent?: string;
  loggedinUserMobileNum?: number;
  module?: number[];
  name?: string;
  role?: IStorageDataRole;
  timestamp?: number;
  token?: string;
  uniqueSessionId?: string;
  userName?: string;
  password?: string;
  reportingTo?: string;
}

export interface IStorage {
  data?: IStorageData;
  timeout?: number;
}