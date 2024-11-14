import { FilterInputType } from '@/components/shared/filter/Filter';

export const SubAgentStatus = [
  { label: 'Status', value: ''},
  { label: 'Active', value: 'Active' },
  { label: 'Block', value: 'Block' },
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
  {
    name: 'status',
    type: FilterInputType.Select,
    inputProps: {
      placeholder: 'Status',
      options: SubAgentStatus
    }
  },
];

export const ListSubAgentsDefaultParams = {
  limit: 20,
  skip: 0,
  roleName: 'subAffiliate',
}

export const ListSubAgentsDefaultPagination = {
  current: 1,
  pageSize: ListSubAgentsDefaultParams.limit,
  total: 0,
}

export const CountSubAgentsDefaultParams = {
  roleName: 'subAffiliate',
}