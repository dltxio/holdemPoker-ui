import { useMemo, useRef } from 'react';
import { FormInstance } from 'antd';

import TableReport from '@/components/table-report/TableReport';
import { FilterInputType, FilterItem } from '@/components/shared/filter/Filter';
import { useAppDispatch } from '@/store/hooks';
import { TableColumnType } from '@/components/shared/table/Table';
import { countDataForDailyChips, dailyChipsReport } from '../../store/action';
import dayjs from "@/core/dayjs";

const Page = () => {
  const dispatch = useAppDispatch();
  const formRef = useRef<FormInstance>(null);

  const getData = async (values: any) => {
    const res = await dispatch(dailyChipsReport({
      ...values,
    }));
    const dataWithNo = res.payload.map((item: any, index: number) => ({
      ...item,
      'NO.': index + 1,
      'username': username(item.transferMode, item.loginType, item.loginId),
      'displayName': displayName(item.transferMode, item.names, item.Name),
      'displayScratchCardType': displayScratchCardType(item.scratchCardType, item.userLevel),
      'displayUserLevel': displayUserLevel(item.scratchCardType, item.userLevel),
      'displayDate': displayDate(item.date),
      'approvedby': approvedby(item.approvedBy)
    }))
    return {
      // data: res.payload as any[],
      data: dataWithNo as any[]
    }
  }

  const username = (transferMode: any, loginType: any, loginId: any) => {
    return transferMode === 'FUND TRANSFER' ? loginType : loginId;
  }

  const displayName = (transferMode: any, names: any, Name: any) => {
    return transferMode === 'FUND TRANSFER' ? names : Name;
  }


  const displayScratchCardType = (scratchCardType: any, userLevel: any) => {
    return scratchCardType && !userLevel ? scratchCardType : null;
  }

  const displayUserLevel = (scratchCardType: any, userLevel: any) => {
    return scratchCardType && userLevel ? userLevel : null;
  }

  const displayDate = (date: any) => {
    return dayjs(date).format('DD-MM-YYYY HH:mm:ss')
  }

  const approvedby = (approvedBy: any) => {
    return approvedBy ? approvedBy : 'N/A'
  }

  const getTotal = (values: any) => {
    return dispatch(countDataForDailyChips(values)).then(res => res.payload)
  }

  const FilterFields: FilterItem[] = useMemo(() => ([
    {
      name: 'startDate',
      type: FilterInputType.Date,
      label: 'Start date:',
      inputProps: {
        placeholder: 'Start date'
      }
    },
    {
      name: 'endDate',
      label: 'End date:',
      type: FilterInputType.Date,
      inputProps: {
        placeholder: 'End date'
      }
    },
    {
      name: 'referenceNumber',
      label: 'Reference No:',
      type: FilterInputType.Input,
      inputProps: {
        placeholder: 'Reference No'
      }
    },
    {
      name: 'sortValue',
      label: 'Sort by',
      type: FilterInputType.Select,
      inputProps: {
        options: [
          {
            label: 'Date',
            value: 'date'
          },
          {
            label: 'Amount',
            value: 'amount'
          }
        ]
      }
    },
    {
      name: 'Name',
      label: 'Name',
      type: FilterInputType.Input,
      inputProps: {
        placeholder: 'Name'
      }
    },
    {
      name: 'userName',
      label: 'User Name',
      type: FilterInputType.Input,
      inputProps: {
        placeholder: 'Username'
      }
    },
    {
      name: 'minChips',
      label: 'Min Chips',
      type: FilterInputType.Input,
      inputProps: {
        placeholder: 'Chips added(min.)'
      }
    },
    {
      name: 'maxChips',
      label: 'Max Chips',
      type: FilterInputType.Input,
      inputProps: {
        placeholder: 'Chips added(max.)'
      }
    },
    {
      name: 'transferMode',
      label: 'Transfer Mode',
      type: FilterInputType.Select,
      inputProps: {
        placeholder: "transfer Mode",
        options: [
          {
            label: 'Scratch Card',
            value: 'Scratch Card'
          },
          {
            label: 'FUND TRANSFER',
            value: 'FUND TRANSFER'
          },
          {
            label: 'ONLINE TRANSFER',
            value: 'ONLINE TRANSFER'
          }
        ]
      }
    }
  ]), [formRef.current])

  const columns: TableColumnType[] = useMemo(() => ([
    {
      title: 'S No.',
      dataIndex: 'NO.'
    },
    {
      title: 'Name',
      dataIndex: 'displayName',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      customRender({ row, value }) {
        return (
          <div>
            {value}
            {row.displayScratchCardType && <div>{row.displayScratchCardType}</div>}
            {row.displayUserLevel && <div>{row.displayUserLevel}</div>}
          </div>
        )
      }
    },
    {
      title: 'Date',
      dataIndex: 'displayDate',
    },
    {
      title: 'Reference Number',
      dataIndex: 'referenceNumber'
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
    },
    {
      title: 'Transfer Mode',
      dataIndex: 'transferMode'
    },
    {
      title: 'Payment Id',
      dataIndex: 'paymentId',
    },
    {
      title: 'Bonus Code',
      dataIndex: 'bonusCode',
    },
    {
      title: 'Bonus Amount',
      dataIndex: 'bonusAmount',
    },
    {
      title: 'Approved By',
      dataIndex: 'approvedby',
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Transaction Type',
      dataIndex: 'transactionType',
    }
  ]), [])

  return (
    <TableReport
      title='Daily Add Chips Report'
      type='secondary'
      formRef={formRef}
      columns={columns}
      filterFields={FilterFields}
      formProps={{
        layout: 'vertical'
      }}
      getData={getData}
      getTotal={getTotal}
    />
  )
};
export default Page;