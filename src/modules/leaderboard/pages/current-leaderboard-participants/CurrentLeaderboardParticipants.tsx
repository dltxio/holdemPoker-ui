import React, { Fragment, useMemo, useRef, useState } from 'react';

// Components
import { Breadcrumb } from '@/components/shared/breadcrumb/Breadcrumb';
import { Heading } from '@/components/shared/heading/Heading';
import { Button } from '@/components/shared/button/Button';
import { Pagination, PaginationProps } from '@/components/shared/pagination/Pagination';

import { FilterItem, FilterInputType, FilterForm } from '@/components/shared/filter/Filter';
import { LeaderboardStatusEnum, LeaderboardTypes, LeaderboardTypesEnum } from '../../models/Leaderboard';
import { Table, TableColumnType } from '@/components/shared/table/Table';
import { useAppDispatch } from '@/store/hooks';
import { useBusyContext } from '@/components/shared/busy';
import { FormInstance } from 'antd';
import { cleanObject } from '@/helpers/object';
import { getCurrentLeaderboardParticipants, listLeaderboard } from '../../store/action';
import './CurrentLeaderboardParticipants.scss';
import { Participant } from '../../models/Participant';
import { showAlert } from '@/store/global/action';
import dayjs from 'dayjs';

export const PAGE_SIZE = 20;

const Page = () => {

  const dispatch = useAppDispatch();
  const { showBusy, hideBusy } = useBusyContext();


  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    total: 0,
    pageSize: PAGE_SIZE,
  });

  const [data, setData] = useState<any>({});
  const [displayData, setDisplayData] = useState<any>([]);
  const [leaderboardData, setLeaderboardData] = useState<any>(null);
  const [leaderboards, setLeaderboards] = useState<any>([]);
  const filterFormRef = useRef<FormInstance>(null);
  const tableRef = useRef<any>(null);

  const load = async () => {
    try {
      showBusy();
      const formValues = {
        ...filterFormRef.current?.getFieldsValue()
      };
      const values = cleanObject({
        ...formValues,
      });

      const res: any = await dispatch(getCurrentLeaderboardParticipants(values));
      setLeaderboardData(res.payload)
      console.log(res.payload)
      let result = Participant.fromArray(res?.payload?.participantsArray?.[0]?.participantArray || []);
      result = Participant.initRank(result)

      setData(result);
      if (result && Array.isArray(result)) {
        const pageSize = pagination.pageSize || PAGE_SIZE;
        const current = pagination.current || 1;
        const list = result.slice(pageSize * (current - 1), pageSize * current);
        setDisplayData([...list]);
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
    filterFormRef.current?.setFieldValue('status',undefined);
    filterFormRef.current?.setFieldValue('leaderboardId',undefined);
    setLeaderboardData(null);
    setData([]);
    setDisplayData([]);
  };

  const handleExport = () => {
    if(leaderboardData){
      tableRef.current.exportCsv('Player-Loyality-Points');
    } else {
      return;
    }
  };

  const handleFilterSubmit = (values: any) => {
    if (!values.status || !values.leaderboardId) {
      dispatch(showAlert({
        content: 'kindly select the leaderboard from the list !!'
      }))
      return;
    }
    load();
  };

  const handlePagination = (current: number) => {
    setPagination({
      ...pagination,
      current,
    });
    let result = Participant.fromArray(leaderboardData?.participantsArray?.[0]?.participantArray || []);
    result = Participant.initRank(result)
    if (result && Array.isArray(result)) {
      const pageSize = pagination.pageSize || PAGE_SIZE;
      const list = result.slice(pageSize * (current - 1), pageSize * current);
      setDisplayData(list);
    }
  };
  const handleFormChange = async (values: any) => {
    if (values.status) {
      const res = await dispatch(listLeaderboard({
        status: values.status
      }));
      setLeaderboards([...res.payload]);
      filterFormRef.current?.setFieldValue('leaderboardId', undefined);
    }
  }
  const FilterFields: FilterItem[] = useMemo(() => (
    [
      {
        name: 'status',
        type: FilterInputType.Select,
        inputProps: {
          placeholder: "Select status",
          options: [
            {
              label: LeaderboardStatusEnum.Running,
              value: LeaderboardStatusEnum.Running,
            },
            {
              label: LeaderboardStatusEnum.Waiting,
              value: LeaderboardStatusEnum.Waiting,
            },
          ],

        }
      },
      {
        name: 'leaderboardId',
        type: FilterInputType.Select,
        inputProps: {
          placeholder: 'Select Leaderboards',
          options: leaderboards ? leaderboards.map((x: any) => ({
            label: x.leaderboardName,
            value: x.leaderboardId
          })) : [],
        },
      },
    ]
  ), [leaderboards])

  const columns: TableColumnType[] = useMemo(() => {
    let list: any = [];
    const leaderboardType = leaderboardData?.leaderboardData?.leaderboardType;
    if (leaderboardType === LeaderboardTypesEnum.closedVip || leaderboardType === LeaderboardTypesEnum.openVip) {
      list = [
        // {
        //   title: 'S No.',
        //   dataIndex: 'NO.'
        // },
        {
          title: 'Username',
          dataIndex: 'userName'
        },
        {
          title: 'Leaderboard Points',
          dataIndex: 'total',
          customRender(props: any) {
            return (
              <span>{props?.value?.toFixed(4) || 'N/A'}</span>
            )
          }
        },
        {
          title: 'Hands Played',
          dataIndex: 'myCount'
        },
        {
          title: 'Parent Name',
          dataIndex: 'parentName',
          customRender(props: any) {
            return (
              <span>{props?.value || 'N/A'}</span>
            )
          }
        },
        {
          title: 'Rank',
          dataIndex: 'rank'
        },
      ]
    } else if (leaderboardType === LeaderboardTypesEnum.closedHand || leaderboardType === LeaderboardTypesEnum.openHand) {
      list = [
        // {
        //   title: 'S No.',
        //   dataIndex: 'NO.'
        // },
        {
          title: 'Username',
          dataIndex: 'userName'
        },

        {
          title: 'Hands Played',
          dataIndex: 'total'
        },
        {
          title: 'HeadsUP Hands',
          dataIndex: 'headsUP'
        },
        {
          title: 'Total Hands Played',
          dataIndex: 'myCount'
        },
        {
          title: 'Parent Name',
          dataIndex: 'parentName'
        },
        {
          title: 'Rank',
          dataIndex: 'rank'
        },
      ]
    }
    return list;
  }, [leaderboardData]);

  const getType = (leaderboardType: string) => {
    return leaderboardType ? LeaderboardTypes.find(x => x.value === leaderboardType)?.label : 'N/A';
  }
  const formatTime = (time: any) => {
    return time ? dayjs(time).format('MMM DD, YYYY hh:mm:ss A') : 'N/A'
  }
  return (
    <Fragment>
      <div className="current-leaderboard-participants-content">
        <Breadcrumb />

        <Heading title='CURRENT / WAITING LEADERBOARD PARTICIPANTS' type='info' solid={true} />

        <div className="current-leaderboard-participants-content__wrapper default">
          <div className='current-leaderboard-participants-content__filter'>
            <FilterForm
              ref={filterFormRef}
              items={FilterFields}
              onFinish={handleFilterSubmit}
              onReset={handleOnReset}
              onExport={handleExport}
              onValuesChange={handleFormChange}
            />
          </div>
          {
            leaderboardData && <div className='row card-content'>
              <div className="col-md-4 card-content__item">
                <div className="note">
                  <h3>Leaderboard Type - <span className='note__values'>{getType(leaderboardData?.leaderboardData?.leaderboardType)}</span></h3>
                </div>
              </div>
              <div className="col-md-4 card-content__item">
                <div className="note">
                  <h3>Start Date - <span className='note__values'>{formatTime(leaderboardData?.leaderboardData?.startTime)}</span></h3>
                </div>
              </div>
              <div className="col-md-4 card-content__item">
                <div className="note">
                  <h3>End Date - <span className='note__values'>{formatTime(leaderboardData?.leaderboardData?.endTime)}</span></h3>
                </div>
              </div>
            </div>
          }
          <Table
            ref={tableRef}
            columns={columns}
            pagination={pagination}
            data={displayData || []}
            onPageChange={handlePagination}
            customEmptyContent={() => (
              leaderboardData && displayData?.length <= 0 && <div className="empty-content">
                <h4 className='empty-content__messages'>All players are participant</h4>
              </div>
            )}
          />
        </div>
      </div>
    </Fragment>
  )
};

export default Page;