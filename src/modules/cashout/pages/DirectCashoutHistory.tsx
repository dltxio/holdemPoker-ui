import { useEffect, useMemo, useRef, useState } from 'react';
import { FormInstance, Space } from 'antd';

// import './PlayerChipsReport.scss';
import TableReport from '@/components/table-report/TableReport';
import { FilterInputType, FilterItem } from '@/components/shared/filter/Filter';
import { useAppDispatch } from '@/store/hooks';
import { TableColumnType } from '@/components/shared/table/Table';
import { CardInfo } from '@/components/shared/card-info/CardInfo';
import { Ribbon } from '@/components/shared/ribbon/Ribbon';
import DisplayNumber from '@/components/shared/DisplayNumber';
// import { countlistRakeDataForRakeReport, listRakeDataRakeReport } from '../store/action';
import dayjs from '@/core/dayjs';
import { UserTypes } from '@/modules/transaction-history/models/transaction-history';
import { countDataForCashoutHistory, findDataForCashoutHistory, getCashoutHistoryCount, getCashOutRequestCount, listCashOutHistory, listPendingCashOutRequest, processApproveCashout, removeCashoutRequestOnAction } from '../store/action';
import { Button } from '@/components/shared/button/Button';
import { Icon } from '@/components/shared/icon/Icon';
import { useBusyContext } from '@/components/shared/busy';
import { useConfirmationContext } from '@/components/shared/confirmation';
import { Note } from '@/components/shared/note/Note';
import { formatNumber } from '@/helpers/number';
import { getCurrentUserData, formatTime } from "@/helpers/common";
// import { countDataInPlayerBonusReport, countDataInPlayerLoyalityPointsReport, listDataInPlayerBonusReport, listDataInPlayerLoyalityPointsReport } from '../../store/action';

const Page = () => {
  const dispatch = useAppDispatch();
  const tableRef = useRef<any>(null);
  const formRef = useRef<FormInstance>(null);
  const [result, setResult] = useState<any>({});

  const defaultValue = {
    // keyForRakeModules: true,
    // startDate: dayjs().subtract(24, 'hour').valueOf(),
    // endDate: dayjs().valueOf(),
    // sortValue: 'addeddate'
  }

  const columns: TableColumnType[] = [
    {
      title: 'S No.',
      dataIndex: 'NO.'
    },
    {
      title: 'Date & Time',
      dataIndex: 'createdAtText'
    },
    {
      title: 'Customer Name',
      dataIndex: 'name'
    },
    {
      title: 'Profile',
      dataIndex: 'Profile'
    },
    {
      title: 'Parent Details',
      dataIndex: 'affilateId'
    },
    {
      title: 'Reference No.',
      dataIndex: 'referenceNumber'
    },
    {
      title: 'Requested Amount',
      dataIndex: 'requestedAmount'
    },
    {
      title: 'Type',
      dataIndex: 'type'
    },
    {
      title: 'Status',
      dataIndex: 'status'
    },
  ];

  const getData = async ({...values}: any) => {
    const res = await dispatch(findDataForCashoutHistory({
      // ...defaultValue,
      ...values,
      // createdAt: startDate && endDate ? {$gte: startDate, $lte: endDate} : undefined
    }));
    console.log("res== ", res);
    const dataWithNo = res.payload.result.map((item: any, index: number) => ({
      ...item,
      'createdAtText': createdAtText(item.actionTakenAt),
      'changeDetail': item.affilateId,
      'Profile': Profile(item.profile),
      'requestedAmount': requestedAmount(item.amount, item.requestedAmount)
    }))
    setResult({
      ...res.payload,
      result: undefined
    })
    return {
      data: dataWithNo as any[],
    }
  }

  const createdAtText = (createdAt: any) => {
    return formatTime(createdAt);
  }

  const Profile = (profile: string) => {
    return profile === 'subAffiliate' ? 'SUB-AGENT' : profile.toUpperCase()
  }

  const requestedAmount = (amount: any, requestedAmount: any) => {
    return amount ? amount : requestedAmount
  }

  const getTotal = async ({ ...values }: any) => {
    return dispatch(countDataForCashoutHistory({
      ...values,
      // createdAt: startDate && endDate ? {$gte: startDate, $lte: endDate} : undefined
    })).then((res: any) => res.payload)
  }

  const FilterFields: FilterItem[] = useMemo(() => ([
    {
      name: 'startDate',
      type: FilterInputType.Date,
      inputProps: {
        placeholder: 'Start date',
      },
    },
    {
      name: 'endDate',
      type: FilterInputType.Date,
      inputProps: {
        placeholder: 'Start date',
      },
    },
    {
      name: 'userNameFilter',
      type: FilterInputType.Input,
      inputProps: {
        placeholder: 'User Name'
      }
    },
    {
      name: 'statusFilter',
      type: FilterInputType.Select,
      inputProps: {
        placeholder: 'Select Status',
        options: [
          {
            label: 'APPROVED',
            value: 'Approved'
          },
          {
            label: 'REJECTED',
            value: 'Rejected'
          }
        ]
      }
    },
    {
      name: 'userTypeFilter',
      type: FilterInputType.Select,
      inputProps: {
        placeholder: 'Select User',
        options: [
          {
            label: 'SUB-AGENT',
            value: 'subAffiliate'
          },
          {
            label: 'PLAYER',
            value: 'Player'
          }
        ]
      }
    },
    {
      name: 'referenceNo',
      type: FilterInputType.Input,
      inputProps: {
        placeholder: 'Reference No.'
      }
    },
  ]), [formRef.current])

  return (
    <TableReport
      title='Direct Cashout History'
      tableRef={tableRef}
      formRef={formRef}
      columns={columns}
      filterFields={FilterFields}
      getData={getData}
      getTotal={getTotal}
      firstLoad={true}
      description={
        <div className="bonus-transfer-history-content__note">
          <Note
            content={`Total Approved Amount: ${formatNumber(result.totalApprovedAmount || 0) || 0}`}
            type="info"
          />
        </div>
      }
    />
  )
};
export default Page;