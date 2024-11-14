import { useMemo, useRef } from 'react';
import { FormInstance } from 'antd';

import TableReport from '@/components/table-report/TableReport';
import { FilterInputType, FilterItem } from '@/components/shared/filter/Filter';
import { useAppDispatch } from '@/store/hooks';
import { TableColumnType } from '@/components/shared/table/Table';
import { listMonthlyBonusChipsReport, monthlyChipsReport } from '../../store/action';
import dayjs from '@/core/dayjs';

const Page = () => {
  const dispatch = useAppDispatch();
  const formRef = useRef<FormInstance>(null);

  const getData = async ({...values}: any) => {
    delete values.skip;
    delete values.limit;
    const res = await dispatch(listMonthlyBonusChipsReport({
      ...values,
      addeddate: values.addeddate.utcOffset(0).valueOf()
    }));
    const dataWithNo = { ...res.payload }
    return {
      // data: [res.payload],
      data: [dataWithNo].map((item: any, index: number) => ({
        ...item,
        'NO.': index + 1
      }))
    }
  }

  const FilterFields: FilterItem[] = useMemo(() => ([
    {
      name: 'addeddate',
      type: FilterInputType.Date,
      // label: 'Month:',
      inputProps: {
        placeholder: 'Month',
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
      title: 'Total Deposit Amount',
      dataIndex: 'totalDepositAmount',
    },
    {
      title: 'Total Locked Bonus',
      dataIndex: 'totalInstantBonus',
    },
    {
      title: 'Total Instant Bonus',
      dataIndex: 'totalLockedBonus'
    },
  ]), [])

  return (
    <TableReport
      title='Monthly Bonus Chips Report'
      formRef={formRef}
      columns={columns}
      filterFields={FilterFields}
      formProps={{
        layout: 'vertical'
      }}
      getData={getData}
      // getTotal={getTotal}
      firstLoad={false}
    />
  )
};
export default Page;