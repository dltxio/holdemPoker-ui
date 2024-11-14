import { Fragment, useEffect, useRef, useState } from 'react';
import { FormInstance } from 'antd';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useNavigate, useParams } from 'react-router';

// Actions
import { countSubAffiliate, listSubAffiliate } from '../../store/action';
import { showAlert } from '@/store/global/action';

// Components
import { Breadcrumb } from '@/components/shared/breadcrumb/Breadcrumb';
import { Button } from '@/components/shared/button/Button';
import { Table, TableColumnType } from '@/components/shared/table/Table';
import { PaginationProps } from '@/components/shared/pagination/Pagination';
import { FilterForm } from '@/components/shared/filter/Filter';

// Constants
import {
  CountSubAffiliateDefaultParams,
  FilterFields,
  ListSubAffiliateDefaultPagination,
  ListSubAffiliateDefaultParams
} from '../../constants/ListSubAffiliate.constant';

// Interfaces
import { ICountListSubAffiliateParams, IListSubAffiliateParams } from '../../interfaces/ListSubAffiliate.interface';

// Helpers
import { cleanObject } from '@/helpers/object';

import './ListSubAffiliate.scss';

const Actions = ({ row }: any) => {
  const nav = useNavigate();

  const handleEdit = () => {
    nav(`/listNewSubAffiliate/edit/${row._id}`);
  };

  const handleView = () => {
    nav(`/listNewSubAffiliate/view/${row._id}`);
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
          text="Player List"
          type="secondary"
          rounded={true}
          onClick={handleListPlayer}
          icon="bi-pencil-square"
        />
        <Button
          text="Copy link"
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
    title: 'Parent Affiliate',
    dataIndex: 'displayParent'
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
  const { username } = useParams();

  const { user } = useAppSelector(store => store.auth);

  const [listParams, setListParams] = useState<IListSubAffiliateParams>(ListSubAffiliateDefaultParams);
  const [countParams, setCountParams] = useState<ICountListSubAffiliateParams>(CountSubAffiliateDefaultParams);
  const [pagination, setPagination] = useState<PaginationProps>(ListSubAffiliateDefaultPagination);
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
    setPagination({ ...pagination, ...ListSubAffiliateDefaultPagination });
    setListParams({ ...listParams, ...ListSubAffiliateDefaultParams });
    setCountParams({ ...countParams, ...CountSubAffiliateDefaultParams });
  }

  const handlePagination = (current: number) => {
    setListParams({
      ...listParams,
      skip: (current - 1) * (listParams.limit || 0),
    });
    setPagination({ ...pagination, current });
  }

  const getListSubAffiliate = async () => {
    try {
      const payloadParams = username ? { ...listParams, parentUser: username } : listParams;

      const params = cleanObject({
        ...filterFormRef.current?.getFieldsValue(),
        ...payloadParams
      });
      const res: any = await dispatch(listSubAffiliate(params));

      if (res.payload && !res.payload.length) {
        dispatch(showAlert({ title: 'No data found.' }));
      }

      setData(res.payload);
    } catch (e) {
      console.log(e);
    }
  }

  const getTotalSubAffiliate = async () => {
    try {
      const payloadParams = username ? { ...countParams, parentUser: username } : countParams;

      const params = cleanObject({
        ...filterFormRef.current?.getFieldsValue(),
        ...payloadParams
      });
      const res = await dispatch(countSubAffiliate(params));

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
    getListSubAffiliate();
  }, [listParams]);

  useEffect(() => {
    getTotalSubAffiliate();
  }, [countParams]);

  useEffect(() => {
    if (user && user.role.level <= 0) {
      setListParams({ ...listParams, parentUser: user.userName });
      setCountParams({ ...countParams, parentUser: user.userName });
    }
  }, [user]);

  return (
    <Fragment>
      <div className="list-sub-affiliate-content">
        <Breadcrumb />

        <div className="list-sub-affiliate-content__filter">
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