import { useEffect, useMemo, useRef, useState } from 'react';
import { FormInstance } from 'antd';

// import './PlayerChipsReport.scss';
import TableReport from '@/components/table-report/TableReport';
import { FilterInputType, FilterItem } from '@/components/shared/filter/Filter';
import { useAppDispatch } from '@/store/hooks';
import { TableColumnType } from '@/components/shared/table/Table';
import { countDataInPlayerBonusReport, countDataInPlayerLoyalityPointsReport, listDataInPlayerBonusReport, listDataInPlayerLoyalityPointsReport } from '../../store/action';


const columns: TableColumnType[] = [
  {
    title: 'S No.',
    dataIndex: 'NO.'
  },
  {
    title: 'UserName',
    dataIndex: 'userName'
  },
  {
    title: 'Date And Time',
    dataIndex: 'date'
  },
  {
    title: 'VIP Level',
    dataIndex: 'megaPointLevel'
  },
  {
    title: 'VIP Points Earned',
    dataIndex: 'earnedPoints'
  },
  {
    title: 'Instant Bonus Released',
    dataIndex: 'channelName'
  },
  {
    title: 'Current Locked Bonus',
    dataIndex: ''
  },
  {
    title: 'Locked Bonus Released',
    dataIndex: ''
  }
]

const Page = () => {
  const dispatch = useAppDispatch();
  const formRef = useRef<FormInstance>(null);

  const getData = async (values: any) => {
    const res = await dispatch(listDataInPlayerBonusReport({
      ...values,
    }));
    const dataWithNo = res.payload.map((item: any, index: number) => ({
      ...item,
      'NO.': index + 1
    }))
    return {
      // data: res.payload as any[],
      data: dataWithNo as any[]
    }
  }

  const getTotal = (values: any) => {
    return dispatch(countDataInPlayerBonusReport(values)).then(res => res.payload)
  }

  const FilterFields: FilterItem[] = useMemo(() => ([
    {
      name: 'userName',
      type: FilterInputType.Input,
      inputProps: {
        placeholder: 'User Name'
      }
    },
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
  ]), [formRef.current])

  return (
    <TableReport
      title='Player Bonus Report'
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