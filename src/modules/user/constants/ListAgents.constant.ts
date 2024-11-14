import { FilterInputType } from '@/components/shared/filter/Filter';

export const AgentStatus = [
  { label: 'All Agents', value: '' },
  { label: 'Active Agents', value: 'Active' },
  { label: 'Blocked Agents', value: 'Block' },
];

export const FilterFields = [
  {
    name: 'name',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Name',
    }
  },
  {
    name: 'loginId',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Username',
    }
  },
  // {
  //   name: 'email',
  //   type: FilterInputType.Input,
  //   inputProps: {
  //     placeholder: 'E-mail',
  //   }
  // },
  {
    name: 'status',
    type: FilterInputType.Select,
    inputProps: {
      placeholder: 'Status',
      defaultValue: 'Active',
      options: AgentStatus
    }
  },
];

export const ListAgentsDefaultParams = {
  limit: 20,
  skip: 0,
  roleName: 'affiliate',
  status: 'Active',
}

export const ListAgentsDefaultPagination = {
  current: 1,
  pageSize: ListAgentsDefaultParams.limit,
  total: 0,
}

export const CountAgentsDefaultParams = {
  roleName: 'affiliate',
  status: 'Active',
}