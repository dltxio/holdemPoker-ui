import { Fragment, useEffect, useRef, useState } from 'react';
import { FormInstance } from 'antd';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useNavigate, useParams } from 'react-router';

// Actions
import { countPlayers, forgotPassword, listPlayers, resendVerification } from '../../store/action';
import { showAlert } from '@/store/global/action';

// Components
import { Breadcrumb } from '@/components/shared/breadcrumb/Breadcrumb';
import { Button } from '@/components/shared/button/Button';
import { Table, TableColumnType } from '@/components/shared/table/Table';
import { PaginationProps } from '@/components/shared/pagination/Pagination';
import { FilterForm } from '@/components/shared/filter/Filter';

// Constants
import {
  CountPlayersDefaultParams,
  FilterFields,
  ListPlayersDefaultPagination,
  ListPlayersDefaultParams,
  FilterFieldss
} from '../../constants/ListPlayers.constant';

// Interfaces
import { ICountPlayersParams, IListPlayersParams } from '../../interfaces/ListPlayers.interface';

// Helpers
import { cleanObject } from '@/helpers/object';

import './ListPlayers.scss';

const Actions = ({ row }: any) => {
  // console.log("row==== ", row);
  const nav = useNavigate();
  const dispatch = useAppDispatch();

  const handleEdit = () => {
    nav(`/player/edit/${row._id}`);
  };

  const handleView = () => {
    nav(`/player/view/${row._id}`);
  };

  const handleResendVerification = async () => {
    try {
      const res: any = await dispatch(resendVerification({
        emailId: row.emailId,
        userName: row.userName,
      }));

      // if (res.error.message) {
      //   throw new Error();
      // }

      dispatch(showAlert({ title: 'Success!', content: 'A link to verify email has been sent on registered email.' }));
    } catch (e) {
      console.log(e);
      dispatch(showAlert({ title: 'Error!', content: 'Getting error from server' }));
    }
  };

  const handleForgotPassword = async () => {
    try {
      const res: any = await dispatch(forgotPassword({ emailId: row.emailId }));

      // if (res.error.message) {
      //   throw new Error();
      // }

      dispatch(showAlert({ title: 'Success!', content: 'A link to reset your password has been sent to your registered email.' }));
    } catch (e) {
      console.log(e);
      dispatch(showAlert({ title: 'Error!', content: 'Getting error from server' }));
    }
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
        {!row.isEmailVerificationTokenExpire || row.isEmailVerificationTokenExpire === ""  ? (
          <Button
            text="Send Verification Email"
            type="secondary"
            rounded={true}
            onClick={handleResendVerification}
            icon="bi-pencil-square"
          />
        ): (
          <Button
            text="Send Forgot Password"
            type="secondary"
            rounded={true}
            onClick={handleForgotPassword}
            icon="bi-pencil-square"
          />
        ) }
        {/* {row.isOrganic ? (
          <Button
            text="Resend email verification link"
            type="secondary"
            rounded={true}
            onClick={handleResendVerification}
            icon="bi-pencil-square"
          />
        ) : (
          <Button
            text="Resend set password link"
            type="secondary"
            rounded={true}
            onClick={handleForgotPassword}
            icon="bi-pencil-square"
          />
        )} */}
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
    title: 'Grand parent',
    dataIndex: 'displayGrandParent'
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
  const { username } = useParams();
  const { user } = useAppSelector(store => store.auth);

  const [listParams, setListParams] = useState<IListPlayersParams>(ListPlayersDefaultParams);
  const [countParams, setCountParams] = useState<ICountPlayersParams>(CountPlayersDefaultParams);
  const [pagination, setPagination] = useState<PaginationProps>(ListPlayersDefaultPagination);
  const [data, setData] = useState<any>([]);

  const tableRef = useRef<any>(null);
  const filterFormRef = useRef<FormInstance>(null);
  const prevListParamsRef = useRef<IListPlayersParams>(ListPlayersDefaultParams);

  const handleSubmit = async () => {
    await getListPlayers();
    await getTotalPlayers();
    resetData();
  };

  const handleOnReset = () => {
    filterFormRef.current?.resetFields();
    resetData();
  };

  const handleExport = () => {
    tableRef.current.exportCsv('PlayerList');
  }

  const resetData = async () => {
    setPagination({ ...pagination, ...ListPlayersDefaultPagination });
    setListParams((prevListParams) => ({ ...prevListParams, ...ListPlayersDefaultParams }));
    setCountParams((prevCountParams) => ({ ...prevCountParams, ...CountPlayersDefaultParams }));
    await getListPlayers();
    await getTotalPlayers();
  }

  // useEffect(() => {
  //   prevListParamsRef.current = listParams;
  // }, [listParams]);


  const handlePagination = (current: number) => {
    setListParams((prevListParams) => ({
      ...prevListParams,
      skip: (current - 1) * (prevListParams.limit || 10),
    }));
    setPagination({ ...pagination, current });
    // getListPlayers();
  }

  useEffect(() => {
    getListPlayers();
  }, [listParams]);


  const getListPlayers = async () => {
    try {
      let payloadParams;
      if (user && user.role.level <= 0) {
        payloadParams = { ...listParams, userName: username ? username : user.userName };
      } else {
        payloadParams = username ? { ...listParams, userName: username } : listParams;
      }
      
      const params = cleanObject({
        ...payloadParams,
        ...filterFormRef.current?.getFieldsValue(),
      });
      
      if (params.promoBonusAwarded === 'Promo Bonus Awarded') {
        delete params.promoBonusAwarded;
      }
      console.log("params=== ", params);
      console.log("payloadParams: ", payloadParams);
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
      let payloadParams;
      if (user && user.role.level > 0) {
        payloadParams = { ...countParams };
      } else {
        payloadParams = { ...countParams, userName: username ? username : user.userName };
      }

      const params = cleanObject({
        ...payloadParams,
        ...filterFormRef.current?.getFieldsValue(),
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
  }, []);

  useEffect(() => {
    getTotalPlayers();
  }, []);

  return (
    <Fragment>
      <div className="list-players-content">
        <Breadcrumb />

        <div className="list-players-content__filter">
          <div className="row">
            <FilterForm
              ref={filterFormRef}
              items={FilterFieldss}
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
          pagination={{ ...pagination, pageSize: listParams.limit || 10 }}
          onPageChange={handlePagination}
        />
      </div>
    </Fragment>
  )
};

export default Page;