import { FilterInputType } from '@/components/shared/filter/Filter';

export const SubAffiliateStatus = [
  { label: 'All status', value: '' },
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
      defaultValue: '',
      options: SubAffiliateStatus
    }
  },
];

export const ListSubAffiliateDefaultParams = {
  limit: 20,
  skip: 0,
  roleName: 'newsubAffiliate',
}

export const ListSubAffiliateDefaultPagination = {
  current: 1,
  pageSize: ListSubAffiliateDefaultParams.limit,
  total: 0,
}

export const CountSubAffiliateDefaultParams = {
  roleName: 'newsubAffiliate',
}