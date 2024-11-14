import { useEffect, useMemo, useRef, useState } from 'react';
import { FormInstance } from 'antd';

// import './PlayerChipsReport.scss';
import TableReport from '@/components/table-report/TableReport';
import { FilterInputType, FilterItem } from '@/components/shared/filter/Filter';
import { useAppDispatch } from '@/store/hooks';
import { TableColumnType } from '@/components/shared/table/Table';
import { claimPlayerLockedBonus, countPlayerBonusInfo, listPlayerLockedBonusInfo } from '../../store/action';
import { Button } from '@/components/shared/button/Button';
import { useBusyContext } from '@/components/shared/busy';
import { useConfirmationContext } from '@/components/shared/confirmation';
import dayjs from "@/core/dayjs";

export const States = [
  {
    label: 'Expired',
    value: 1
  },
  {
    label: 'Released',
    value: 2
  },
  {
    label: 'Active',
    value: 0
  }
]

const Page = () => {
  const dispatch = useAppDispatch();
  const formRef = useRef<FormInstance>(null);
  const bs = useBusyContext();
  const cf = useConfirmationContext();

  const getData = async (values: any) => {
    const res = await dispatch(listPlayerLockedBonusInfo({
      ...values,
    }));
    const dataWithNo = res.payload.map((item: any, index: number) => ({
      ...item,
      'NO.': index + 1,
      'createdAtFormated': createdAtFormated(item.createdAt),
      'expireAtFormated': expireAtFormated(item.expireAt),
      'statusLabel': statusLabel(item.expireStatus),
      'releasedTimeFormated': releasedTimeFormated(item.releasedTime),
      'remainingPointsFormated': remainingPointsFormated(item.remainingPoints),
      'isAvailableToClaim': isAvailableToClaim(item.remainingPointsFormated),
    }))
    return {
      // data: res.payload as any[],
      data: dataWithNo as any[]
    }
  }

  const createdAtFormated = (createdAt: any) => {
    return dayjs(createdAt).format('MMM DD, YYYY HH:mm:ss A')
  }
  const expireAtFormated = (expireAt: any) => {
    return dayjs(expireAt).format('MMM DD, YYYY HH:mm:ss A')
  }

  const statusLabel = (expireStatus: any) => {
    return States.find(x => x.value === expireStatus)?.label
  }

  const releasedTimeFormated = (releasedTime: any) => {
    return dayjs(releasedTime).format('MMM DD, YYYY HH:mm:ss A')
  }

  const remainingPointsFormated = (remainingPoints: any) => {
    return remainingPoints || 0;
  }

  const isAvailableToClaim = (remainingPointsFormated: any) => {
    return remainingPointsFormated > 0;
  }

  const getTotal = (values: any) => {
    return dispatch(countPlayerBonusInfo(values)).then(res => res.payload)
  }

  const claimBonus = async (item: any) => {
    await cf.showConfirm({
      message: 'Are you sure you want to clamin the bonus?'
    })
    try {
      bs.showBusy();
      await dispatch(claimPlayerLockedBonus(item))
    } finally {
      bs.hideBusy();
    }
  }

  const FilterFields: FilterItem[] = useMemo(() => ([
    {
      name: 'playerName',
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
      title: 'Locked Bonus Amount',
      dataIndex: 'lockedBonusAmount',
    },
    {
      title: 'Current VIP Points',
      dataIndex: 'newVipPoints',
      customRender: ({ row, value }) => (
        <span>
          {row.newVipLevel}
          <br/>
          {value?.toFixed(2) || 0}
        </span>
      )
    },
    {
      title: 'Credited On',
      dataIndex: 'createdAtFormated'
    },
    {
      title: 'Mode Of Bonus',
      dataIndex: 'mode'
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expireAtFormated'
    },
    {
      title: 'Status',
      dataIndex: 'statusLabel'
    },
    {
      title: 'Points Remaining',
      dataIndex: 'remainingPointsFormated'
    },
    {
      title: 'Actions',
      dataIndex: '',
      customRender: ({row}) => (
        <>
          <Button
            type='warning'
            disabled={!row.isAvailableToClaim}
            onClick={() => claimBonus(row)}
          >
            Claim Now
          </Button>
        </>
      )
    },
  ]), [])

  return (
    <TableReport
      title='Player Locked Bonus Report'
      formRef={formRef}
      columns={columns}
      filterFields={FilterFields}
      getData={getData}
      getTotal={getTotal}
      firstLoad={false}
    />
  )
};
export default Page;