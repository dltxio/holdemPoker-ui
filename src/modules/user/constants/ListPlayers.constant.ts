import { FilterInputType } from '@/components/shared/filter/Filter';

export const PlayerTypes = [
  { label: 'All', value: 'All' },
  { label: 'Organic', value: true },
  { label: 'Inorganic', value: false },
];

export const PromoBonusAwardedTypes = [
  { label: 'Yes', value: true },
  { label: 'No', value: false },
];

export const PromoBonusAwardedTypesPlaceholder = [
  { label: 'Promo Bonus Awarded', value: '' }
]

export const PlayerStatus = [
  { label: 'All Players', value: 'all' },
  { label: 'Active', value: 'Active' },
  { label: 'Blocked', value: 'Block' },
];

export const FilterFields = [
  {
    name: 'isOrganic',
    type: FilterInputType.Select,
    inputProps: {
      placeholder: 'Players type',
      defaultValue: 'All',
      options: PlayerTypes
    }
  },
  {
    name: 'userId',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Username',
    }
  },
  {
    name: 'parent',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Parent Username',
    }
  },
  {
    name: 'promoBonusAwarded',
    type: FilterInputType.Select,
    inputProps: {
      placeholder: 'Promo Bonus Awarded',
      options: PromoBonusAwardedTypes,
      defaultValue: 'Promo Bonus Awarded'
    }
  },
  {
    name: 'status',
    type: FilterInputType.Select,
    inputProps: {
      placeholder: 'Status',
      defaultValue: 'Active',
      options: PlayerStatus
    }
  },
];

export const FilterFieldss = [
  {
    name: 'isOrganic',
    type: FilterInputType.Select,
    inputProps: {
      placeholder: 'Players type',
      defaultValue: 'All',
      options: PlayerTypes
    }
  },
  {
    name: 'userId',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Username',
    }
  },
  {
    name: 'parent',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Parent Username',
    }
  },
  {
    name: 'promoBonusAwarded',
    type: FilterInputType.Select,
    inputProps: {
      placeholder: 'Promo Bonus Awarded',
      options: PromoBonusAwardedTypes,
      defaultValue: 'Promo Bonus Awarded'
    }
  },
  {
    name: 'status',
    type: FilterInputType.Select,
    inputProps: {
      placeholder: 'Status',
      defaultValue: 'Active',
      options: PlayerStatus
    }
  },
  {
    name: "email",
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Email',
    }
  }
];


export const ListPlayersDefaultParams = {
  limit: 20,
  skip: 0,
  isOrganic: 'All',
  status: 'Active',
}

export const ListAffPlayersDefaultParams = {
  limit: 20,
  skip: 0,
  isOrganic: 'All',
}

export const ListPlayersDefaultPagination = {
  current: 1,
  pageSize: ListPlayersDefaultParams.limit,
  total: 0,
}

export const CountPlayersDefaultParams = {
  isOrganic: 'All',
  status: 'Active',
}

export const CountAffPlayersDefaultParams = {
  isOrganic: 'All',
}