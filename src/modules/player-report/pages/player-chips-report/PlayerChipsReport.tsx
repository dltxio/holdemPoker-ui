import { useMemo, useRef } from 'react';
import { FormInstance } from 'antd';

import './PlayerChipsReport.scss';
import TableReport from '@/components/table-report/TableReport';
import { FilterInputType, FilterItem } from '@/components/shared/filter/Filter';
import { useAppDispatch } from '@/store/hooks';
import { TableColumnType } from '@/components/shared/table/Table';
import { listDataInPlayerChipsReport } from '../../store/action';


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
    title: 'Parent',
    dataIndex: 'isParentUserName'
  },
  {
    title: 'Total Available Chips',
    dataIndex: 'totalAvailableChips'
  },
  {
    title: 'Withdrawable Chips',
    dataIndex: 'realChips'
  },
  {
    title: 'Instant Bonus Chips',
    dataIndex: 'instantBonusAmount'
  },
  {
    title: 'Locked Bonus',
    dataIndex: 'lockedBonus'
  },
  {
    title: 'Claimed Bonus Chips',
    dataIndex: 'claimedLockedBonus'
  },
  {
    title: 'Instant Chips Released',
    dataIndex: 'claimedInstantBonus'
  }
]

const Page = () => {
  const dispatch = useAppDispatch();
  const formRef = useRef<FormInstance>(null);
  const getData = async (values: any) => {
    const res = await dispatch(listDataInPlayerChipsReport({
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

  const FilterFields: FilterItem[] = useMemo(() => ([
    {
      name: 'userName',
      type: FilterInputType.Input,
      inputProps: {
        placeholder: 'User Name'
      }
    },
  ]), [formRef.current])

  return (
    <TableReport
      title='Player Chips Report'
      formRef={formRef}
      columns={columns}
      filterFields={FilterFields}
      getData={getData}
      firstLoad={false}
    />
  )
};
export default Page;