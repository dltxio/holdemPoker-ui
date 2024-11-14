import { Fragment, useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { FormInstance } from 'antd/es/form/Form';
import { useNavigate } from 'react-router';

// Components
import { Breadcrumb } from '@/components/shared/breadcrumb/Breadcrumb';
import { Button } from '@/components/shared/button/Button';
import { Table, TableColumnType } from '@/components/shared/table/Table';
import { FilterForm } from '@/components/shared/filter/Filter';
import { PaginationProps } from '@/components/shared/pagination/Pagination';

// Actions
import { listUsers, countUsers } from '../../store/action';
import { showAlert } from '@/store/global/action';

// Interfaces
import { ICountUsersParams, IListUsersParams } from '../../interfaces/ListUsers.interface';

// Constants
import {
  CountUsersDefaultParams,
  FilterFields,
  ListUsersDefaultPagination,
  ListUsersDefaultParams,
  FilterFieldsListUser
} from '../../constants/ListUsers.constant';

// Helpers
import { cleanObject } from '@/helpers/object';
import { checkAvailableParams } from '@/helpers/common';
import { formatTime } from '@/helpers/common';

import './ListUsers.scss';

const Actions = ({ row }: any) => {
  const nav = useNavigate();

  const handleEdit = () => {
    nav(`/editUser/${row._id}`);
  };

  const handleView = () => {
    nav(`/viewUser/${row._id}`);
  };

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
      </div>
    </Fragment>
  );
}

const Page = () => {
  const columns: TableColumnType[] = [
    {
      title: 'Sr No.',
      dataIndex: 'Sr No.',
      // exportable: false,
    },
    {
      title: 'Name (Username)',
      dataIndex: 'displayName'
    },
    {
      title: 'Level',
      dataIndex: 'displayRoleName'
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy'
    },
    {
      title: 'Created On',
      dataIndex: 'displayCreatedOn',
    },
    {
      title: 'Status',
      dataIndex: 'status'
    },
    {
      title: 'Actions',
      dataIndex: '',
      exportable: false,
      customRender: (props) => <Actions {...props} />
    },
  ];

  const dispatch = useAppDispatch();

  const [listParams, setListParams] = useState<IListUsersParams>(ListUsersDefaultParams);
  const [countParams, setCountParams] = useState<ICountUsersParams>(CountUsersDefaultParams);
  const [pagination, setPagination] = useState<PaginationProps>(ListUsersDefaultPagination);
  const [data, setData] = useState<any>([]);

  const filterFormRef = useRef<FormInstance>(null);
  const tableRef = useRef<any>(null);

  const handleSubmit = () => {
    console.log("vao day");
    
    if (!checkAvailableParams(FilterFieldsListUser, filterFormRef.current?.getFieldsValue())) {
      dispatch(showAlert({ title: 'Please provide at least one input.' }));
      return;
    }

    resetData();
  };

  const handleOnReset = () => {
    filterFormRef.current?.resetFields();
    resetData();
  };

  const handleExport = () => {
    console.log("tableRef: ", tableRef);
    tableRef.current.exportCsv('UserList');
  }

  const resetData = () => {
    setPagination({ ...pagination, ...ListUsersDefaultPagination });
    setListParams({ ...listParams, ...ListUsersDefaultParams });
    setCountParams({ ...countParams, ...CountUsersDefaultParams });
  }

  const handlePagination = (current: number) => {
    setListParams({
      ...listParams,
      skip: (current - 1) * (listParams.limit || 0),
    });
    setPagination({ ...pagination, current });
  }

  const getListUsers = async () => {
    
    try {
      const params = cleanObject({
        ...filterFormRef.current?.getFieldsValue(),
        ...listParams
      });
      if (params.status === "Status") {
        delete params.status
      }

      const res: any = await dispatch(listUsers(params));

      if (res.payload && res.payload.length) {
        const dataWithIndex = res.payload.map((record: any, index: number) => ({
          ...record,
          'Sr No.': index + 1,
          "displayCreatedOn": formatTime(record.createdAt),
          "displayRoleName": record.role.name,
          "displayName": `${record.name} (${record.userName})`
        }));
        setData(dataWithIndex);
      } else {
        setData([]);
        dispatch(showAlert({ title: 'Error!', content: 'No users found!' }));
      }
    } catch (e) {
      console.log(e);
    }
  }

  const getTotalUsers = async () => {
    try {
      const params = cleanObject({
        ...filterFormRef.current?.getFieldsValue(),
        ...countParams
      });
      const res = await dispatch(countUsers(params));

      if (res.payload && !isNaN(res.payload)) {
        setPagination({ ...pagination, total: res.payload });
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getListUsers();
  }, [listParams]);

  useEffect(() => {
    getTotalUsers();
  }, [countParams]);

  return (
    <Fragment>
      <div className="list-users-content">
        <Breadcrumb />

        <div className="list-users-content__filter">
          <div className="row">
            <FilterForm
              ref={filterFormRef}
              items={FilterFieldsListUser}
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