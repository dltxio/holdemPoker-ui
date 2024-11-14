import { Fragment, useEffect, useRef, useState } from 'react';
import { FormInstance } from 'antd';
import { useAppDispatch } from '@/store/hooks';
import { useNavigate } from 'react-router';

// Actions
import { countAgents, listAgents } from '../../store/action';
import { showAlert } from '@/store/global/action';

// Components
import { Breadcrumb } from '@/components/shared/breadcrumb/Breadcrumb';
import { Button } from '@/components/shared/button/Button';
import { Table, TableColumnType } from '@/components/shared/table/Table';
import { PaginationProps } from '@/components/shared/pagination/Pagination';
import { FilterForm } from '@/components/shared/filter/Filter';

// Constants
import {
  CountAgentsDefaultParams,
  FilterFields,
  ListAgentsDefaultPagination,
  ListAgentsDefaultParams
} from '../../constants/ListAgents.constant';

// Interfaces
import { ICountAgentsParams, IListAgentsParams } from '../../interfaces/ListAgents.interface';

// Helpers
import { cleanObject } from '@/helpers/object';

import './ListAgent.scss';

const Actions = ({ row }: any) => {
  const nav = useNavigate();

  const handleEdit = () => {
    nav(`/listOfAffiliate/edit/${row._id}`);
  };

  const handleView = () => {
    nav(`/listOfAffiliate/view/${row._id}`);
  };

  const handleListSubAgents = () => {
    nav(`/listSubAffiliate/${row.userName}`);
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
          text="Sub-Agents List"
          type="secondary"
          rounded={true}
          onClick={handleListSubAgents}
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
    title: 'Commission %',
    dataIndex: 'rakeCommision'
  },
  {
    title: 'Commission Earned',
    dataIndex: 'profit',
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

  const [listParams, setListParams] = useState<IListAgentsParams>(ListAgentsDefaultParams);
  const [countParams, setCountParams] = useState<ICountAgentsParams>(CountAgentsDefaultParams);
  const [pagination, setPagination] = useState<PaginationProps>(ListAgentsDefaultPagination);
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
    setPagination({ ...pagination, ...ListAgentsDefaultPagination });
    setListParams({ ...listParams, ...ListAgentsDefaultParams });
    setCountParams({ ...countParams, ...CountAgentsDefaultParams });
  }

  const handlePagination = (current: number) => {
    setListParams({
      ...listParams,
      skip: (current - 1) * (listParams.limit || 0),
    });
    setPagination({ ...pagination, current });
  }

  const getListAgents = async () => {
    try {
      const params = cleanObject({
        ...filterFormRef.current?.getFieldsValue(),
        ...listParams
      });
      const res: any = await dispatch(listAgents(params));

      if (res.payload && !res.payload.length) {
        dispatch(showAlert({ title: 'No data found.' }));
      }

      const dataWithNo = res.payload.map((item: any, index: number) => ({
        ...item,
        'NO.': index + 1,
        'displayName': displayName(item.name, item.userName)
      }))

      // setData(res.payload);
      setData(dataWithNo);
    } catch (e) {
      console.log(e);
    }
  }
  

  const displayName = (name: any, userName: any) => {
    return `${name} / ${userName}`;
  }

  const getTotalAgents = async () => {
    try {
      const params = cleanObject({
        ...filterFormRef.current?.getFieldsValue(),
        ...countParams
      });
      const res = await dispatch(countAgents(params));

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
    getListAgents();
  }, [listParams]);

  useEffect(() => {
    getTotalAgents();
  }, [countParams]);

  return (
    <Fragment>
      <div className="list-agent-content">
        <Breadcrumb />

        <div className="list-agent-content__filter">
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