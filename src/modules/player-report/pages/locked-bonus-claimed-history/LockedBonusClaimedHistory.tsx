import { useEffect, useMemo, useRef, useState } from 'react';
import { FormInstance } from 'antd';

// import './PlayerChipsReport.scss';
import TableReport from '@/components/table-report/TableReport';
import { FilterInputType, FilterItem } from '@/components/shared/filter/Filter';
import { useAppDispatch } from '@/store/hooks';
import { TableColumnType } from '@/components/shared/table/Table';
import { countLockedClaimedHistory, listLockedClaimedHistory } from '../../store/action';
import { useBusyContext } from '@/components/shared/busy';
import { useConfirmationContext } from '@/components/shared/confirmation';

const Page = () => {
  const dispatch = useAppDispatch();
  const formRef = useRef<FormInstance>(null);
  const bs = useBusyContext();
  const cf = useConfirmationContext();

  const getData = async (values: any) => {
    const res = await dispatch(listLockedClaimedHistory({
      ...values,
    }));
    return {
      data: res.payload as any[],
    }
  }

  const getTotal = (values: any) => {
    return dispatch(countLockedClaimedHistory(values)).then(res => res.payload)
  }

  const FilterFields: FilterItem[] = useMemo(() => ([
    {
      name: 'startDate',
      type: FilterInputType.Date,
      inputProps: {
        placeholder: 'Start date'
      }
    },
    {
      name: 'endDate',
      type: FilterInputType.Date,
      inputProps: {
        placeholder: 'End date'
      }
    },
    {
      name: 'userName',
      type: FilterInputType.Input,
      inputProps: {
        placeholder: 'User Name'
      }
    },
  ]), [formRef.current])

  const columns: TableColumnType[] = useMemo(() => ([
    {
      title: 'S No.',
      dataIndex: 'NO.'
    },
    {
      title: 'Player User Name',
      dataIndex: 'userName',
    },
    {
      title: 'Reference No.',
      dataIndex: 'refrenceNumber'
    },
    {
      title: 'Claimed Bonus',
      dataIndex: 'lockedBonusAmount'
    },
    {
      title: 'Date and Time',
      dataIndex: 'releasedTimeFormated'
    },
    {
      title: 'Previous VIP Level(Points)',
      dataIndex: 'prevVipPoints',
      customRender: ({ row, value }) => (
        <span>
          {row.prevVipLevel}
          <br/>
          {value?.toFixed(2) || 0}
        </span>
      )
    },
    {
      title: 'Current VIP Level(Points)',
      dataIndex: 'newVipPoints',
      customRender: ({ row, value }) => (
        <span>
          {row.newVipLevel}
          <br/>
          {value?.toFixed(2) || 0}
        </span>
      )
    },
  ]), [])

  return (
    <TableReport
      title='Locked Bonus Claimed History'
      formRef={formRef}
      columns={columns}
      filterFields={FilterFields}
      getData={getData}
      getTotal={getTotal}
      firstLoad={true}
      formProps={{
        onExport: undefined
      }}
    />
  )
};
export default Page;