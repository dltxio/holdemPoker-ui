import { FilterInputType } from '@/components/shared/filter/Filter';
import { ROOT } from '@/constants';

const Levels = [
  {
    label: '-All-', value: ''
  }
];

export const FilterFields = [
  {
    name: 'name',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Username',
    }
  },
  {
    name: 'department',
    type: FilterInputType.Select,
    inputProps: {
      placeholder: 'Level',
      options: [...Levels, ...ROOT.employeeList]
    }
  },
  {
    name: 'status',
    type: FilterInputType.Select,
    inputProps: {
      placeholder: 'Status',
      options: ROOT.employeeStatus,
      defaultValue: 'Status'
    }
  },
];

export const FilterFieldsListUser = [
  {
    name: 'name',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Name',
    }
  },
  {
    name: 'department',
    type: FilterInputType.Select,
    inputProps: {
      placeholder: 'Level',
      options: [...Levels, ...ROOT.employeeList]
    }
  },
  {
    name: 'status',
    type: FilterInputType.Select,
    inputProps: {
      placeholder: 'Status',
      options: ROOT.employeeStatus,
      defaultValue: 'Status'
    }
  },
];

export const ListUsersDefaultParams = {
  level: 7,
  limit: 20,
  skip: 0,
}

export const ListUsersDefaultPagination = {
  current: 1,
  pageSize: ListUsersDefaultParams.limit,
  total: 0,
}

export const CountUsersDefaultParams = {
  level: ListUsersDefaultParams.level
}
