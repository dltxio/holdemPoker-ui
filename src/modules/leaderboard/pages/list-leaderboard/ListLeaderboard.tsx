import { LeaderboardStatus, LeaderboardStatusEnum, LeaderboardTypes } from '../../models/Leaderboard';

// Components
import { FilterForm, FilterInputType, FilterItem } from "@/components/shared/filter/Filter";
import { Heading } from "@/components/shared/heading/Heading";
import { TableColumnType } from "@/components/shared/table/Table";
import TableReport from "@/components/table-report/TableReport";
import { useAppDispatch } from "@/store/hooks";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Breadcrumb } from "react-bootstrap";
import { FormInstance } from 'antd';
import { PaginationProps } from '@/components/shared/pagination/Pagination';
import { cleanObject } from "@/helpers/object";
import { useBusyContext } from '@/components/shared/busy';
import { Table } from '@/components/shared/table/Table';

import './ListLeaderboard.scss';
import { deleteLeaderboard, listLeaderboard } from '../../store/action';
import CustomInnerHtml from '@/components/shared/custom-inner-html/CustomInnerHtml';
import { getListTable } from '@/modules/game/store/action';
import { Button } from '@/components/shared/button/Button';
import { showAlert } from '@/store/global/action';
import { useNavigate } from 'react-router';
import { first } from 'lodash';

export const PAGE_SIZE = 20;

const Actions = ({ row, reload }: any) => {
  const dispatch = useAppDispatch();
  const { showBusy, hideBusy } = useBusyContext();
  const nav = useNavigate();
  const handleDelete = async () => {
    try {
      showBusy();
      const res = await dispatch(deleteLeaderboard({
        id: row._id,
        leaderboardData: row
      }));
      hideBusy();
      console.log(res);
      if (res?.payload?.success) {
        dispatch(showAlert({
          content: "Successfully deleted this leaderboard !!"
        }));
        reload && reload();
      } else {

        dispatch(showAlert({
          title: 'Error!',
          content: res.payload.info
        }))
      }
    } catch (e) {
      console.log(e);
      hideBusy();
    }

  }
  return (
    <Fragment>
      <div className="table-button-cell">
        {
          (row.status === LeaderboardStatusEnum.Running || row.status === LeaderboardStatusEnum.Waiting) &&
          <Button
            text="Edit"
            type="secondary"
            rounded={true}
            icon="bi-pencil-square"
            onClick={()=>nav(`/leaderboard/edit/${row._id}`)}
          />
        }
        <Button
          text="View"
          type="info"
          rounded={true}
          icon="bi-reply"
          onClick={()=>nav(`/leaderboard/view/${row._id}`)}
        />

        <Button
          text="Duplicate"
          type="primary"
          rounded={true}
          icon="bi-files"
          onClick={()=>nav(`/leaderboard/duplicate/${row._id}`)}
        />
        {
          row.status === LeaderboardStatusEnum.Waiting && <Button
            text="Delete"
            type="danger"
            rounded={true}
            icon="bi-pencil-square"
            onClick={handleDelete}
          />
        }

      </div>
    </Fragment>
  );
}

const Page = () => {
  const dispatch = useAppDispatch();
  const { showBusy, hideBusy } = useBusyContext();

  const filterFormRef = useRef<FormInstance>(null);
  const tableRef = useRef<any>(null);

  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    total: 0,
    pageSize: PAGE_SIZE,
  });

  const [data, setData] = useState<any>([]);
  const [displayData, setDisplayData] = useState<any>([]);
  const [listLeaderBoard, setListLeaderBoard] = useState<any>([]);



  const FilterFields: FilterItem[] = useMemo(() => (
    [
      {
        name: 'id',
        type: FilterInputType.Select,
        inputProps: {
          placeholder: 'Select Leaderboard',
          options: listLeaderBoard && listLeaderBoard.map((item: any) => {
            return {
              label: item?.leaderboardName,
              value: item?._id
            }
          })
        },
      },
      {
        name: 'leaderboardId',
        type: FilterInputType.Input,
        inputProps: {
          placeholder: 'Leaderboard Id'
        },
      },
      {
        name: 'leaderboardType',
        type: FilterInputType.Select,
        inputProps: {
          placeholder: 'Leaderboard Type',
          options: LeaderboardTypes
        },
      },
      {
        name: 'status',
        type: FilterInputType.Select,
        inputProps: {
          placeholder: 'Leaderboard Status',
          options: LeaderboardStatus
        },
      }
    ]
  ), [listLeaderBoard])

  const columns: TableColumnType[] = useMemo(() => ([
    {
      title: 'S No.',
      dataIndex: 'NO.'
    },
    {
      title: 'Leaderboard Name',
      dataIndex: 'leaderboardName'
    },
    {
      title: 'Leaderboard ID',
      dataIndex: 'leaderboardId'
    },
    {
      title: 'Start Time',
      dataIndex: 'startTimeDisplay'
    },
    {
      title: 'End Time',
      dataIndex: 'endTimeDisplay'
    },
    {
      title: 'Leaderboard Type',
      dataIndex: 'leaderboardTypeDisPlay'
    },
    {
      title: 'Selected Tables',
      dataIndex: 'table',
      customRender(props) {
        return (
          <CustomInnerHtml {...props} />
        )
      }
    },
    {
      title: 'Status',
      dataIndex: 'status'
    },
    {
      title: 'Percent Points Accumulation',
      dataIndex: 'percentAccumulation'
    },
    {
      title: 'Min. Leaderboard Points',
      dataIndex: 'minVipPoints'
    },
    {
      title: 'Min. Rake',
      dataIndex: 'minRakeDisplay',
    },
    {
      title: 'Min. Hands',
      dataIndex: 'minHandsDisplay'
    },
    {
      title: 'Total prize pool',
      dataIndex: 'totalPrizePool'
    },
    {
      title: 'No. of winners',
      dataIndex: 'noOfWinners'
    },
    {
      title: 'Actions',
      dataIndex: '',
      customRender(props) {
        return (
          <Actions {...props} reload={() => load()} />
        )
      }
    },
  ]), []);


  const load = async (first = false) => {
    try {
      showBusy();
      const formValues = {
        ...filterFormRef.current?.getFieldsValue()
      };
      const values = cleanObject({
        ...formValues,
      });

      const res: any = await dispatch(listLeaderboard(values));
      setData(res.payload);
      if(first){
        setListLeaderBoard(res.payload)
      }
      const result = res.payload;
      if (result && Array.isArray(result)) {
        const pageSize = pagination.pageSize || PAGE_SIZE;
        const current = pagination.current || 1;
        const list = result.slice(pageSize * (current - 1), pageSize * current);
        setDisplayData(list);
      }
      setPagination({
        ...pagination,
        total: res.payload.length
      });

    } finally {
      hideBusy();
    }
  };


  const handleOnReset = () => {
    filterFormRef.current?.resetFields();
    // filterFormRef.current?.setFieldValue('leaderboardType',undefined);
    // filterFormRef.current?.setFieldValue('id',undefined);
    // filterFormRef.current?.setFieldValue('status',undefined);
    // // setCount(0);
    for(const item of FilterFields){
      if(item.type === FilterInputType.Select){
        filterFormRef.current?.setFieldValue(item.name, undefined)
      }
    }
  };

  const handleFilterSubmit = (values: any) => {
    load();
  };

  const handlePagination = (current: number) => {
    setPagination({
      ...pagination,
      current,
    });
    if (data && Array.isArray(data)) {
      const pageSize = pagination.pageSize || PAGE_SIZE;
      const list = data.slice(pageSize * (current - 1), pageSize * current);
      setDisplayData(list);
    }
  };


  useEffect(() => {
    load(true);
  }, [])
  return (
    <Fragment>
      <div className="list-leaderboard-content">
        <Breadcrumb />

        <Heading title='Leaderboard Lists' type='info' solid={true} />

        <div className="list-leaderboard-content__wrapper default">
          <div className='list-leaderboard-content__filter'>
            <FilterForm
              ref={filterFormRef}
              items={FilterFields}
              onFinish={handleFilterSubmit}
              onReset={handleOnReset}
            />
          </div>

          <Table
            ref={tableRef}
            columns={columns}
            pagination={pagination}
            data={displayData || []}
            onPageChange={handlePagination}
          />
        </div>
      </div>
    </Fragment>
  )
};

export default Page;