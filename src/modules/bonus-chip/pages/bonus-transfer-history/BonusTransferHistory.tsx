import { useRef, useState } from 'react';
import { FormInstance } from 'antd';
import { useAppDispatch } from '@/store/hooks';

// Components
import { Note } from '@/components/shared/note/Note';
import { TableColumnType } from '@/components/shared/table/Table';
import { FilterInputType } from '@/components/shared/filter/Filter';
import TableReport from '@/components/table-report/TableReport';

// Actions
import { countInstantBonusHistory, getInstantBonusHistory } from '../../store/action';

// Models
import { TransferTypes } from '../../models/instantBonusHistory';

// Helpers
import { formatNumber } from '@/helpers/number';

import './BonusTransferHistory.scss';

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
    title: 'Parent User Name',
    dataIndex: 'parentUserName',
    emptyValue: 'N/A'
  },
  {
    title: 'Bonus Chips Type',
    dataIndex: 'bonusChipsType'
  },
  {
    title: 'Instant Bonus Amount',
    dataIndex: 'amount'
  },
  {
    title: 'Locked Bonus Amount',
    dataIndex: 'lockedBonusAmount'
  },
  {
    title: 'Transfer Type',
    dataIndex: 'type'
  },
  {
    title: 'Promo Code',
    dataIndex: 'promoCode',
    emptyValue: 'N/A'
  },
  {
    title: 'Transfer At',
    dataIndex: 'timeFormated'
  },
  {
    title: 'Comments',
    dataIndex: 'comments',
    emptyValue: 'N/A'
  }
];

const FilterFields = [
  {
    name: 'userName',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Username'
    }
  },
  {
    name: 'parentUserName',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Parent Username'
    }
  },
  {
    name: 'promoCode',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Promo code'
    }
  },
  {
    name: 'type',
    type: FilterInputType.Select,
    inputProps: {
      placeholder: 'Transfer type',
      options: TransferTypes
    }
  },
];

const Page = () => {
  const dispatch = useAppDispatch();
  const formRef = useRef<FormInstance>(null);
  const [totalAmount, setTotal] = useState<number>(0);

  const getData = async (values: any) => {
    const res = await dispatch(getInstantBonusHistory({
      ...values,
    }));
    setTotal(res.payload.totalAmount);
    const dataWithNo = res.payload.instantBonusHistoryList.map((item: any, index: number) => ({
      ...item,
      "NO.": index + 1,
      "timeFormated": timeFormated(item.time)
    }));
    return {
      data: dataWithNo as any[],
    }
  }

  const timeFormated = (timeString: any) => {
    return dayjs(timeString).format('DD-MMM-YYYY HH:mm:ss')
  }

  const getTotal = (values: any) => {
    return dispatch(countInstantBonusHistory()).then(res => res.payload);
  }

  return (
    <TableReport
      title='Bonus Transfer History'
      formRef={formRef}
      description={
        <div className="bonus-transfer-history-content__note">
          <Note
            content={`Total Amount: ${formatNumber(totalAmount) || 0}`}
            type="info"
          />
        </div>
      }
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