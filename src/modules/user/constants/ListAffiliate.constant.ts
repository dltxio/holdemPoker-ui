import { FilterInputType } from '@/components/shared/filter/Filter';

export const AffiliateStatus = [
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
      options: AffiliateStatus
    }
  },
];

export const ListAffiliateDefaultParams = {
  limit: 20,
  skip: 0,
  roleName: 'newaffiliate',
}

export const ListAffiliateDefaultPagination = {
  current: 1,
  pageSize: ListAffiliateDefaultParams.limit,
  total: 0,
}

export const CountAffiliateDefaultParams = {
  roleName: 'newaffiliate',
}