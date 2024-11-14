import { Fragment, useEffect, useRef, useState } from 'react';
import { FormInstance } from 'antd';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useNavigate, useParams } from 'react-router';

// Actions
import { countSubAgents, listSubAgents } from '../../store/action';
import { showAlert } from '@/store/global/action';

// Components
import { Breadcrumb } from '@/components/shared/breadcrumb/Breadcrumb';
import { Button } from '@/components/shared/button/Button';
import { Table, TableColumnType } from '@/components/shared/table/Table';
import { PaginationProps } from '@/components/shared/pagination/Pagination';
import { FilterForm } from '@/components/shared/filter/Filter';

// Constants
import {
  CountSubAgentsDefaultParams,
  FilterFields,
  ListSubAgentsDefaultPagination,
  ListSubAgentsDefaultParams
} from '../../constants/ListSubAgents.constant';

// Interfaces
import { ICountSubAgentsParams, IListSubAgentsParams } from '../../interfaces/ListSubAgents.interface';

// Helpers
import { cleanObject } from '@/helpers/object';

import './ListSubAgents.scss';

const Actions = ({ row }: any) => {
  const nav = useNavigate();

  const handleEdit = () => {
    nav(`/listSubAffiliate/edit/${row._id}`);
  };

  const handleView = () => {
    nav(`/listSubAffiliate/view/${row._id}`);
  };

  const handleListPlayer = () => {
    nav(`/listPlayer/${row.userName}`);
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
    title: 'Parent Agent',
    dataIndex: 'displayParentName'
  },
  {
    title: 'Commission %',
    dataIndex: 'rakeCommision',
  },
  {
    title: 'Commission Earned',
    dataIndex: 'profit'
  },
  {
    title: 'Credit Limit',
    dataIndex: 'creditLimit'
  },
  {
    title: 'Total Chips',
    dataIndex: 'realChips'
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

  const [listParams, setListParams] = useState<IListSubAgentsParams>(ListSubAgentsDefaultParams);
  const [countParams, setCountParams] = useState<ICountSubAgentsParams>(CountSubAgentsDefaultParams);
  const [pagination, setPagination] = useState<PaginationProps>(ListSubAgentsDefaultPagination);
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
    tableRef.current.exportCsv('SubAffiliateList');
  }

  const resetData = () => {
    setPagination({ ...pagination, ...ListSubAgentsDefaultPagination });
    setListParams({ ...listParams, ...ListSubAgentsDefaultParams });
    setCountParams({ ...countParams, ...CountSubAgentsDefaultParams });
  }

  const handlePagination = (current: number) => {
    setListParams({
      ...listParams,
      skip: (current - 1) * (listParams.limit || 0),
    });
    setPagination({ ...pagination, current });
  }

  const getListSubAgents = async () => {
    try {
      const payloadParams = username ? { ...listParams, parentUser: username } : listParams;

      const params = cleanObject({
        ...filterFormRef.current?.getFieldsValue(),
        ...payloadParams
      });
      console.log("params: ", params);
      const res: any = await dispatch(listSubAgents(params));
      console.log("res=== ", res);

      // if (res.payload && !res.payload.length) {
      //   dispatch(showAlert({ title: 'No data found.' }));
      // }

      setData(res.payload);
    } catch (e) {
      console.log(e);
    }
  }

  const getTotalSubAgents = async () => {
    try {
      const payloadParams = username ? { ...countParams, parentUser: username } : countParams;

      const params = cleanObject({
        ...filterFormRef.current?.getFieldsValue(),
        ...payloadParams
      });
      const res = await dispatch(countSubAgents(params));

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
    getListSubAgents();
  }, [listParams]);

  useEffect(() => {
    getTotalSubAgents();
  }, [countParams]);

  useEffect(() => {
    if (user && user.role.level <= 0) {
      setListParams({ ...listParams, parentUser: user.userName });
      setCountParams({ ...countParams, parentUser: user.userName });
    }
  }, [user]);

  return (
    <Fragment>
      <div className="list-sub-agents-content">
        <Breadcrumb />

        <div className="list-sub-agents-content__filter">
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