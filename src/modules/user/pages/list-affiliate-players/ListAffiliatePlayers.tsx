import { Fragment, useEffect, useRef, useState } from 'react';
import { FormInstance } from 'antd';
import { useAppDispatch } from '@/store/hooks';
import { useNavigate, useParams } from 'react-router';

// Actions
import { countPlayers, listPlayers } from '../../store/action';
import { showAlert } from '@/store/global/action';

// Components
import { Breadcrumb } from '@/components/shared/breadcrumb/Breadcrumb';
import { Button } from '@/components/shared/button/Button';
import { Table, TableColumnType } from '@/components/shared/table/Table';
import { PaginationProps } from '@/components/shared/pagination/Pagination';
import { FilterForm } from '@/components/shared/filter/Filter';

// Constants
import {
  CountAffPlayersDefaultParams,
  FilterFields,
  ListAffPlayersDefaultParams,
  ListPlayersDefaultPagination,
} from '../../constants/ListPlayers.constant';

// Interfaces
import { ICountPlayersParams, IListPlayersParams } from '../../interfaces/ListPlayers.interface';

// Helpers
import { cleanObject } from '@/helpers/object';

import './ListAffiliatePlayers.scss';

const Actions = ({ row }: any) => {
  const nav = useNavigate();

  const handleEdit = () => {
    nav(`/player/edit/${row._id}`);
  };

  const handleView = () => {
    nav(`/player/view/${row._id}`);
  };

  const handleResendPasswordLink = () => {

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

        <Button
          text="Resend set password link"
          type="secondary"
          rounded={true}
          onClick={handleResendPasswordLink}
          icon="bi-pencil-square"
        />
      </div>
    </Fragment>
  );
}

const columns: TableColumnType[] = [
  {
    title: 'Sr no.',
    dataIndex: 'NO.',
    exportable: false,
  },
  {
    title: 'Actions',
    dataIndex: '',
    exportable: false,
    customRender: (props) => <Actions {...props} />
  },
  {
    title: 'User Name',
    dataIndex: 'userName'
  },
  {
    title: 'Name',
    dataIndex: 'displayName'
  },
  {
    title: 'Email',
    dataIndex: 'emailId',
  },
  {
    title: 'Mobile',
    dataIndex: 'mobileNumber'
  },
  {
    title: 'Total Available Chips',
    dataIndex: 'displayChips'
  },
  {
    title: 'Created At',
    dataIndex: 'displayCreatedAt'
  },
  {
    title: 'Status',
    dataIndex: 'status'
  },
  {
    title: 'Unclaimed Bonus',
    dataIndex: 'unclaimedBonusAmount'
  },
  {
    title: 'Instant Bonus Amount',
    dataIndex: 'displayInstantBonusAmount'
  },
  {
    title: 'Parent',
    dataIndex: 'displayParent'
  },
  {
    title: 'Last Active Since',
    dataIndex: 'displayLastActive'
  },
  {
    title: 'Promo Bonus Awarded',
    dataIndex: 'displayPromoBonusAwarded'
  },
  {
    title: 'Pan Verified',
    dataIndex: 'displayPanVerified'
  },
];

const Page = () => {
  const dispatch = useAppDispatch();
  const { isParentUserName } = useParams();

  const [listParams, setListParams] = useState<IListPlayersParams>(ListAffPlayersDefaultParams);
  const [countParams, setCountParams] = useState<ICountPlayersParams>(CountAffPlayersDefaultParams);
  const [pagination, setPagination] = useState<PaginationProps>(ListPlayersDefaultPagination);
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
    setPagination({ ...pagination, ...ListPlayersDefaultPagination });
    setListParams({ ...listParams, ...ListAffPlayersDefaultParams });
    setCountParams({ ...countParams, ...CountAffPlayersDefaultParams });
  }

  const handlePagination = (current: number) => {
    setListParams({
      ...listParams,
      skip: (current - 1) * (listParams.limit || 0),
    });
    setPagination({ ...pagination, current });
  }

  const getListPlayers = async () => {
    try {
      const payloadParams = isParentUserName ? { ...listParams, isParentUserName } : listParams;
      
      const params = cleanObject({
        ...filterFormRef.current?.getFieldsValue(),
        ...payloadParams
      });
      const res: any = await dispatch(listPlayers(params));

      if (res.payload && !res.payload.length) {
        dispatch(showAlert({ title: 'No data found.' }));
      }

      setData(res.payload);
    } catch (e) {
      console.log(e);
    }
  }

  const getTotalPlayers = async () => {
    try {
      const payloadParams = isParentUserName ? { ...countParams, isParentUserName } : countParams;

      const params = cleanObject({
        ...filterFormRef.current?.getFieldsValue(),
        ...payloadParams
      });
      const res = await dispatch(countPlayers(params));

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
    getListPlayers();
  }, [listParams]);

  useEffect(() => {
    getTotalPlayers();
  }, [countParams]);

  return (
    <Fragment>
      <div className="list-players-content">
        <Breadcrumb />

        <div className="list-players-content__filter">
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