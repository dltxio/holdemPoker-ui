

import { FilterInputType, FilterItem } from '@/components/shared/filter/Filter';
import { TableColumnType } from '@/components/shared/table/Table';
import TableReport from '@/components/table-report/TableReport';
import { useAppDispatch } from '@/store/hooks';
import { FormInstance } from 'antd';
import { useRef } from 'react';
import { countDirectEntryHistory, directEntryHistoryPlayer, } from '../../store/action';
import './DirectLeaderboardEntryHistory.scss';
const FilterFields: FilterItem[] = [
  {
    name: 'bonusCode',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'BONUS CODE'
    },
    rules: [
      {
        required: true,
        message: 'kindly enter the bonus code to search'
      }
    ]
  },
]
const columns: TableColumnType[] = [
  {
    title: 'S No.',
    dataIndex: 'NO.'
  },
  {
    title: 'User Name',
    dataIndex: 'userName'
  },
  {
    title: 'Bonus code',
    dataIndex: 'name'
  },
  {
    title: 'Used At',
    dataIndex: 'createdAt'
  },
  {
    title: 'Entry Mode',
    dataIndex: 'fromBackend'
  },

]

const Page = () => {
  const dispatch = useAppDispatch();
  const formRef = useRef<FormInstance>(null);

  const getData = async (values: any) => {
    const res = await dispatch(directEntryHistoryPlayer({
      ...values,
    }));
    console.log(res)
    return {
      data: res.payload as any[],
    }
  }

  const getTotal = (values: any) => {
    return dispatch(countDirectEntryHistory({bonusCode: values.bonusCode})).then(res => res.payload);
  }

  return (
    <TableReport
      title='Direct Entry Leaderboard History'
      formRef={formRef}
      columns={columns}
      filterFields={FilterFields}
      getData={getData}
      getTotal={getTotal}
      firstLoad={false}
      pageSize={20}
      formProps={{
        onExport: undefined
      }}
    />
  )
};
export default Page;