import { useRef, useState } from 'react';
import { FormInstance } from 'antd';
import { useAppDispatch } from '@/store/hooks';

// Components
import { Note } from '@/components/shared/note/Note';
import { TableColumnType } from '@/components/shared/table/Table';
import TableReport from '@/components/table-report/TableReport';
import { FilterInputType } from '@/components/shared/filter/Filter';

// Models
import { TransactionTypes } from '@/modules/transaction-history/models/transaction-history';

// Actions
import { countAffiliateHistory, fundTransferAffiliateHistory } from '../../store/action';

// Helpers
import { formatNumber } from '@/helpers/number';

import './TransferHistoryAgent.scss';

import dayjs from "@/core/dayjs";

import { getLocalUser } from "@/modules/auth/store/action";

const columns: TableColumnType[] = [
  {
    title: 'S No.',
    dataIndex: 'NO.'
  },
  {
    title: 'Transfer To',
    dataIndex: 'transferToText'
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
    name: 'transferTo',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Transfer To Username'
    }
  },
  {
    name: 'transferBy',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Transfer By Username'
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
  {
    name: 'usersType',
    type: FilterInputType.Select,
    inputProps: {
      placeholder: 'User type',
      options: [
        {
          label: 'All',
          value: ''
        },
        {
          label: 'Agent',
          value: 'Affiliates'
        },
        {
          label: 'Sub-Agent',
          value: 'Sub-affiliates'
        }
      ]
    }
  },
];

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
      data = { ...values, userName: 'Admin' }
    }
    const res: any = await dispatch(fundTransferAffiliateHistory(data));
    const dataWithNo = res.payload.items.map((item: any, index: number) => ({
      ...item,
      'NO.': index + 1,
      'dateFormated': dateFormated(item.date),
      'transferByText': transferByText(item.transferBy, item.role),
      'transferToText': transferToText(item.transferToText, item.userTypeLabel),
      'userTypeLabel': userTypeLabel(item.userType)
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

  const dateFormated = (timeString: any) => {
    return timeString && dayjs(timeString).format('MMM DD, YYYY HH:mm:ss A')
  }

  const transferByText = (transferBy: any, role: any) => {
    return `${transferBy}(${role?.name})`
  }

  const transferToText = (transferTo: any, userTypeLabel: any) => {
    return `${transferTo} (${userTypeLabel})`
  }

  const userTypeLabel = (userType: any) => {
    if (userType === 'affiliate') return 'Agent';
    if (userType === 'subAffiliate') return 'Sub-Agent';
    return userType;
  }

  const getTotal = (values: any) => {
    let data;
    if (roleUser.data.role.level <= 0) {
      data = { ...values, userName: roleUser.data.userName }
    } else {
      data = { ...values, userName: 'Admin' }
    }
    return dispatch(countAffiliateHistory(data)).then(res => res.payload)
  }

  return (
    <TableReport
      type='secondary'
      tableRef={tableRef}
      title="Transfer History Agent/Sub-Agent"
      formRef={formRef}
      columns={columns}
      description={
        <div className="transfer-history-agent-content__note">
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
  );
};

export default Page;