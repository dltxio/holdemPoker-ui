import { useMemo, useRef } from 'react';
import { FormInstance } from 'antd';

import TableReport from '@/components/table-report/TableReport';
import { FilterInputType, FilterItem } from '@/components/shared/filter/Filter';
import { useAppDispatch } from '@/store/hooks';
import { TableColumnType } from '@/components/shared/table/Table';
import { monthlyChipsReport } from '../../store/action';
import dayjs from '@/core/dayjs';

const Page = () => {
  const dispatch = useAppDispatch();
  const formRef = useRef<FormInstance>(null);

  const getData = async ({...values}: any) => {
    const startDate = values.startDate || dayjs().utcOffset(0).subtract(1, 'month').startOf('month').valueOf();
    const endDate = values.endDate || dayjs().utcOffset(0).endOf('month').valueOf();
    // delete values.startDate;
    // delete values.endDate;
    delete values.skip;
    delete values.limit;
    const res = await dispatch(monthlyChipsReport({
      date: {
        $gte: startDate,
        $lt: endDate,
      },
      ...values,
    }));
    const dataWithNo = res.payload.map((item: any, index: number) => ({
      ...item,
      'NO.': index + 1,
      'displayDate': displayDate(item.date)
    }))
    return {
      // data: res.payload as any[],
      data: dataWithNo as any[]
    }
  }

  const displayDate = (date: any) => {
    return dayjs(date).format('MMM-YYYY');
  }

  // const getTotal = (values: any) => {
  //   return dispatch(countDataForDailyChips(values)).then(res => res.payload)
  // }

  const FilterFields: FilterItem[] = useMemo(() => ([
    {
      name: 'startDate',
      type: FilterInputType.Date,
      label: 'Start month:',
      inputProps: {
        placeholder: 'Start date',
        picker: 'month'
      }
    },
    {
      name: 'endDate',
      label: 'End month:',
      type: FilterInputType.Date,
      inputProps: {
        placeholder: 'End date',
        picker: 'month'
      }
    },
  ] as FilterItem[]), [formRef.current])

  const columns: TableColumnType[] = useMemo(() => ([
    {
      title: 'S No.',
      dataIndex: 'NO.'
    },
    {
      title: 'Month',
      dataIndex: 'displayDate',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
    },
    {
      title: 'Transfer Mode',
      dataIndex: 'transferMode'
    },
  ]), [])

  return (
    <TableReport
      title='Monthly Add Chips Report'
      description={<>
        <strong>*Shows current month & previous month data by default</strong>
        <br/>
        <strong>*It will show the total amount of fund transfer by authorized users to player, affiliates & sub-affiliates.</strong>
      </>}
      type='secondary'
      formRef={formRef}
      columns={columns}
      filterFields={FilterFields}
      formProps={{
        layout: 'vertical'
      }}
      getData={getData}
      // getTotal={getTotal}
      // firstLoad={false}
    />
  )
};
export default Page;