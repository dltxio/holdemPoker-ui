import { useRef, useState } from 'react';
import { FormInstance } from 'antd';
import { useAppDispatch } from '@/store/hooks';

// Components
import { Note } from '@/components/shared/note/Note';
import { TableColumnType } from '@/components/shared/table/Table';
import { FilterInputType } from '@/components/shared/filter/Filter';
import TableReport from '@/components/table-report/TableReport';

// Actions
// import { countInstantBonusHistory, getInstantBonusHistory } from '../../store/action';

// Models
// import { TransferTypes } from '../../models/instantBonusHistory';

// Helpers
import { formatNumber } from '@/helpers/number';
import { countInstantChipsPulledHistory, listInstantChipsPulledHistory } from '../store/action';
import dayjs from "@/core/dayjs";

const columns: TableColumnType[] = [
  {
    title: 'S.No',
    dataIndex: 'NO.'
  },
  {
    title: 'User Name',
    dataIndex: 'userName'
  },
  {
    title: 'Pulled By(Role)',
    dataIndex: 'pulledByUsername',
    emptyValue: 'N/A'
  },
  {
    title: 'Instant Chips Pulled',
    dataIndex: 'amount'
  },
  {
    title: 'Pulled At',
    dataIndex: 'pulledAtText'
  },
  {
    title: 'Reason',
    dataIndex: 'reason'
  },
];

const FilterFields = [
  {
    name: 'userName',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Username'
    }
  }
];

const Page = () => {
  const dispatch = useAppDispatch();
  const formRef = useRef<FormInstance>(null);
  const [totalAmount, setTotal] = useState<number>(0);

  const getData = async (values: any) => {
    const res = await dispatch(listInstantChipsPulledHistory({
      ...values,
    }));
    // setTotal(res.payload.totalAmount);
    const dataWithNo = res.payload.map((item: any, index: number) => ({
      ...item,
      'NO.': index + 1,
      'pulledAtText': pulledAtText(item.pulledAt)
    }))
    return {
      // data: res.payload as any[],
      data: dataWithNo as any[]
    }
  }

  const pulledAtText = (pulledAt: any) => {
    return dayjs(pulledAt).format('DD-MMM-YYYY HH:mm:ss')
  }

  const getTotal = async (values: any) => {
    return dispatch(countInstantChipsPulledHistory({...values})).then(res => res.payload);
  }

  return (
    <TableReport
      title='Instant Chips Pull History'
      formRef={formRef}
      columns={columns}
      filterFields={FilterFields}
      getData={getData}
      getTotal={getTotal}
      firstLoad={true}
      pageSize={20}
    />
  )
};

export default Page;