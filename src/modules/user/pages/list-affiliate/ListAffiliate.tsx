import { Fragment, useEffect, useRef, useState } from 'react';
import { FormInstance } from 'antd';
import { useAppDispatch } from '@/store/hooks';
import { useNavigate } from 'react-router';

// Actions
import { countAffiliate, listAffiliate } from '../../store/action';
import { showAlert } from '@/store/global/action';

// Components
import { Breadcrumb } from '@/components/shared/breadcrumb/Breadcrumb';
import { Button } from '@/components/shared/button/Button';
import { Table, TableColumnType } from '@/components/shared/table/Table';
import { PaginationProps } from '@/components/shared/pagination/Pagination';
import { FilterForm } from '@/components/shared/filter/Filter';

// Constants
import {
  CountAffiliateDefaultParams,
  FilterFields,
  ListAffiliateDefaultPagination,
  ListAffiliateDefaultParams
} from '../../constants/ListAffiliate.constant';

// Interfaces
import { ICountAffiliateParams, IListAffiliateParams } from '../../interfaces/ListAffiliate.interface';

// Helpers
import { cleanObject } from '@/helpers/object';

import './ListAffiliate.scss';

const Actions = ({ row }: any) => {
  const nav = useNavigate();

  const handleEdit = () => {
    nav(`/listNewAffiliate/edit/${row._id}`);
  };

  const handleView = () => {
    nav(`/listNewAffiliate/view/${row._id}`);
  };

  const handleListSubAffiliates = () => {
    nav(`/listSubaff/${row.userName}`);
  };

  const handleListPlayer = () => {
    nav(`/listAffiliatePlayer/${row.userName}`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://texashodl.net/?v=${row.userName}`);
    alert("Link copied.")
  }

  return (
    <Fragment>
      <div className="table-button-cell">
        <Button
          text="Edit"
          type="secondary"
          rounded={true}
          onClick={handleEdit}
          icon="bi-pencil-square"
        />

        <Button
          text="View"
          type="secondary"
          rounded={true}
          onClick={handleView}
          icon="bi-pencil-square"
        />

        <Button
          text="Sub-Affiliates List"
          type="secondary"
          rounded={true}
          onClick={handleListSubAffiliates}
          icon="bi-pencil-square"
        />

        <Button
          text="Player List"
          type="secondary"
          rounded={true}
          onClick={handleListPlayer}
          icon="bi-pencil-square"
        />
        <Button
          text="Copy Link"
          type="secondary"
          rounded={true}
          onClick={handleCopyLink}
          icon="bi-pencil-square"
        />
      </div>
    </Fragment>
  );
}

const columns: TableColumnType[] = [
  {
    title: 'Sr No.',
    dataIndex: 'NO.',
    exportable: false,
  },
  {
    title: 'Name/Username',
    dataIndex: 'displayName'
  },
  {
    title: 'Status',
    dataIndex: 'status'
  },
  {
    title: 'Commission %',
    dataIndex: 'rakeCommision'
  },
  {
    title: 'Commission Earned',
    dataIndex: 'profit',
  },
  {
    title: 'Actions',
    dataIndex: '',
    exportable: false,
    customRender: (props) => <Actions {...props} />
  },
];

const Page = () => {
  const dispatch = useAppDispatch();

  const [listParams, setListParams] = useState<IListAffiliateParams>(ListAffiliateDefaultParams);
  const [countParams, setCountParams] = useState<ICountAffiliateParams>(CountAffiliateDefaultParams);
  const [pagination, setPagination] = useState<PaginationProps>(ListAffiliateDefaultPagination);
  const [data, setData] = useState<any>([]);

  const tableRef = useRef<any>(null);
  const filterFormRef = useRef<FormInstance>(null);

  const handleSubmit = () => {
    resetData();
  };

  const handleOnReset = () => {
    filterFormRef.current?.resetFields();
    resetData();
  };

  const handleExport = () => {
    tableRef.current.exportCsv('AffiliateList');
  }

  const resetData = () => {
    setPagination({ ...pagination, ...ListAffiliateDefaultPagination });
    setListParams({ ...listParams, ...ListAffiliateDefaultParams });
    setCountParams({ ...countParams, ...CountAffiliateDefaultParams });
  }

  const handlePagination = (current: number) => {
    setListParams({
      ...listParams,
      skip: (current - 1) * (listParams.limit || 0),
    });
    setPagination({ ...pagination, current });
  }

  const getListAffiliate = async () => {
    try {
      const params = cleanObject({
        ...filterFormRef.current?.getFieldsValue(),
        ...listParams
      });
      const res: any = await dispatch(listAffiliate(params));

      if (res.payload && !res.payload.length) {
        dispatch(showAlert({ title: 'No data found.' }));
      }

      setData(res.payload);
    } catch (e) {
      console.log(e);
    }
  }

  const getTotalAffiliate = async () => {
    try {
      const params = cleanObject({
        ...filterFormRef.current?.getFieldsValue(),
        ...countParams
      });
      const res = await dispatch(countAffiliate(params));

      if (res.payload === 0 || res.payload.result === 0) {
        setPagination({ ...pagination, total: 0 });
      } else {
        setPagination({ ...pagination, total: res.payload });
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getListAffiliate();
  }, [listParams]);

  useEffect(() => {
    getTotalAffiliate();
  }, [countParams]);

  return (
    <Fragment>
      <div className="list-affiliate-content">
        <Breadcrumb />

        <div className="list-affiliate-content__filter">
          <div className="row">
            <FilterForm
              ref={filterFormRef}
              items={FilterFields}
              onFinish={handleSubmit}
              onExport={handleExport}
              onReset={handleOnReset}
            />
          </div>
        </div>

        <Table
          ref={tableRef}
          columns={columns}
          data={data || []}
          pagination={pagination}
          onPageChange={handlePagination}
        />
      </div>
    </Fragment>
  )
};

export default Page;