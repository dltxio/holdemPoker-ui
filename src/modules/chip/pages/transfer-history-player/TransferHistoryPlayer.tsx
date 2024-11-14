import { Fragment, useEffect, useRef, useState } from 'react';
import { DatePicker, FormInstance } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';

// Components
import { Breadcrumb } from '@/components/shared/breadcrumb/Breadcrumb';
import { Heading } from '@/components/shared/heading/Heading';
import { Button } from '@/components/shared/button/Button';
import { Pagination, PaginationProps } from '@/components/shared/pagination/Pagination';
import { Note } from '@/components/shared/note/Note';

import './TransferHistoryPlayer.scss';
import { FilterForm, FilterInputType } from '@/components/shared/filter/Filter';
import { useAppDispatch } from '@/store/hooks';
import { cleanObject } from '@/helpers/object';
import { TransactionTypes } from '@/modules/transaction-history/models/transaction-history';
import { countPlayerHistory, fundTransferPlayerHistory } from '../../store/action';
import { Table, TableColumnType } from '@/components/shared/table/Table';
import { useBusyContext } from '@/components/shared/busy';
import { sleep } from '@/core/sleep';
import TableReport from '@/components/table-report/TableReport';
import { formatNumber } from '@/helpers/number';
import dayjs from "@/core/dayjs";
import { getLocalUser } from "@/modules/auth/store/action";

const columns: TableColumnType[] = [
  {
    title: 'S No.',
    dataIndex: 'NO.'
  },
  {
    title: 'Transfer To',
    dataIndex: 'transferTo'
  },
  {
    title: 'Number Of Chips',
    dataIndex: 'amount'
  },
  {
    title: 'Transaction Type',
    dataIndex: 'transactionType'
  },
  {
    title: 'Comment',
    dataIndex: 'description'
  },
  {
    title: 'Transfer Date',
    dataIndex: 'dateFormated'
  },
  {
    title: 'Transfer By',
    dataIndex: 'transferByText'
  }
]

const FilterFields = [
  {
    name: 'startTime',
    type: FilterInputType.Date,
    inputProps: {
      placeholder: 'Start Date',
    },
  },
  {
    name: 'endTime',
    type: FilterInputType.Date,
    inputProps: {
      placeholder: 'End Date',
    },
  },
  {
    name: 'transferBy',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Transfer By Username'
    }
  },
  {
    name: 'transferTo',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Transfer To Username'
    }
  },
  {
    name: 'transactionType',
    type: FilterInputType.Select,
    inputProps: {
      placeholder: 'Transaction type',
      options: TransactionTypes
    }
  },
]

const Page = () => {
  const dispatch = useAppDispatch();
  const [data, setData] = useState<any>({
    totalAmount: 0,
    items: []
  });
  const tableRef = useRef<any>(null);
  const formRef = useRef<FormInstance>(null);
  const roleUser: any = getLocalUser();

  const getData = async (values: any) => {
    let data;
    if (roleUser.data.role.level <= 0) {
      data = { ...values, userName: roleUser.data.userName }
    } else {
      data = { ...values }
    }
    const res: any = await dispatch(fundTransferPlayerHistory(data));
    const dataWithNo = res.payload.items.map((item: any, index: number) => ({
      ...item,
      "NO.": index + 1,
      "dateFormated": dateFormated(item.date),
      'transferByText': transferByText(item.transferBy, item.role)
    }))

    setData({
      ...res.payload,
      totalAmount: formatNumber(res.payload.totalAmount)
    });
    return {
      // data: (res.payload as any).items
      data: dataWithNo
    }
  }

  const transferByText = (transferBy: any, role: any) => {
    return `${transferBy}(${role?.name})`
  }

  const dateFormated = (timeString: any) => {
    return timeString && dayjs(timeString).format('MMM DD, YYYY HH:mm:ss A')
  }

  const getTotal = (values: any) => {
    let data;
    if (roleUser.data.role.level <= 0) {
      data = { ...values, userName: roleUser.data.userName }
    } else {
      data = { ...values }
    }
    return dispatch(countPlayerHistory(data)).then(res => res.payload)
  }

  return (
    <TableReport
      type='secondary'
      tableRef={tableRef}
      title="Transfer History Player"
      formRef={formRef}
      columns={columns}
      description={
        <div className="transfer-history-player-content__note">
          <Note
            content={`Total Amount: ${data.totalAmount}`}
            type="info"
          />
        </div>
      }
      filterFields={FilterFields}
      getData={getData}
      getTotal={getTotal}
      firstLoad={true}
      pageSize={20}
    />
  )
};

export default Page;