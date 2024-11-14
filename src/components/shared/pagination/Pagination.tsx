import React from 'react';
import { Pagination as AntdPagination, PaginationProps as AntdPaginationProps } from 'antd';

import './Pagination.scss';

export type PaginationProps = AntdPaginationProps;

const Pagination: React.FC<PaginationProps> = (props) => {
  return (
    <AntdPagination
      {...props}
    />
  );
}

export { Pagination }