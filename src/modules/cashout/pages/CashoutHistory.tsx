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
import { getCashoutHistoryCount, getCashOutRequestCount, listCashOutHistory, listPendingCashOutRequest, processApproveCashout, removeCashoutRequestOnAction } from '../store/action';
import { Button } from '@/components/shared/button/Button';
import { Icon } from '@/components/shared/icon/Icon';
import { useBusyContext } from '@/components/shared/busy';
import { useConfirmationContext } from '@/components/shared/confirmation';
import { Note } from '@/components/shared/note/Note';
import { formatNumber } from '@/helpers/number';
// import { countDataInPlayerBonusReport, countDataInPlayerLoyalityPointsReport, listDataInPlayerBonusReport, listDataInPlayerLoyalityPointsReport } from '../../store/action';
import { getLocalUser } from "../../auth/store/action";

const Page = () => {
  const dispatch = useAppDispatch();
  const tableRef = useRef<any>(null);
  const formRef = useRef<FormInstance>(null);
  const [result, setResult] = useState<any>({});
  const roleUser: any = getLocalUser();

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
    // {
    //   title: 'Customer Name',
    //   dataIndex: 'name'
    // },
    {
      title: 'Username / Role',
      dataIndex: 'displayName'
    },
    // {
    //   title: 'Approved By, Supervised By, Transfer By',
    //   dataIndex: 'changeDetail',
    // },
    // {
    //   title: 'Reference No.',
    //   dataIndex: 'referenceNo'
    // },
    {
      title: 'Requested Amount',
      dataIndex: 'requestedAmount'
    },
    {
      title: 'Net Amount',
      dataIndex: 'netAmount'
    },
    {
      title: 'Invoice Id',
      dataIndex: 'invoiceId'
    },
    {
      title: 'Transaction Id',
      dataIndex: 'transactionId'
    },
    {
      title: 'Status',
      dataIndex: 'status'
    },
    {
      title: 'Reason',
      dataIndex: 'reason'
    }
  ];

  const getData = async ({ startDate, endDate, ...values }: any) => {
    let data;
    if (roleUser.data.role.level === 0 || roleUser.data.role.level === -1) {
      data = { ...values, userName: roleUser.data.userName }
    } else {
      data = { ...values }
    }
    const res = await dispatch(listCashOutHistory({
      // ...defaultValue,
      ...data,
      createdAt: startDate && endDate ? {$gte: startDate, $lte: endDate} : undefined
    }));
    console.log("res==== ", res);
    if (res.payload) {
      const dataWithNo = res.payload.result.map((item: any, index: number) => ({
        ...item,
        'NO.': index + 1,
        'displayName': displayName(item.userName, item.profile),
        'mobileNumber': mobileNumber(item.profile, item.affiliateMobile, item.mobile),
        'changeDetail': changeDetail(item.approveBy || "N/A", item.supervisedby || "N/A", item.transferBy || "N/A"),
        'parentDetail': parentDetail(item.affiliateId, item.affiliateMobile, item.profile),
        'requestedAtText': requestedAtText(item.requestedAt),
        'createdAtText': createdAtText(item.approvedAt)
      }))
      setResult({
        ...res.payload,
        result: undefined
      })
      return {
        // data: res.payload.result as any[],
        data: dataWithNo as any[]
      }
    } else {
      return {
        data: []
      }
    }
  }

  const displayName = (userName: any, profile: any) => {
    return `${userName} / ${profile}`;
  }

  const mobileNumber = (profile: any, affiliateMobile: any, mobile: any) => {
    if (profile == 'Sub-Affiliate' || profile == 'AFFILIATE') {
      return affiliateMobile;
    }
    if (profile != 'Sub-Affiliate' && profile != 'AFFILIATE' && mobile) {
      return mobile;
    }
    return 'N/A'
  }

  const changeDetail = (approveBy: any, supervisedby: any, transferBy: any) => {
    return `${approveBy}, ${supervisedby}, ${transferBy}`;
  }

  const parentDetail = (affiliateId: any, affiliateMobile: any, profile: any) => {
    return `${affiliateId}${(affiliateId && affiliateMobile && profile != 'Sub-Affiliate') ? `/${affiliateMobile}` : ''}`
  }

  const requestedAtText = (requestedAt: any) => {
    return dayjs(requestedAt).format('MMM DD, YYYY HH:mm:ss A');
  }

  const createdAtText = (createdAt: any) => {
    return dayjs(createdAt).format('MMM DD, YYYY HH:mm:ss A');
  }

  const getTotal = async ({ startDate, endDate, ...values }: any) => {
    let data;
    if (roleUser.data.role.level === 0 || roleUser.data.role.level === -1) {
      data = { ...values, userName: roleUser.data.userName }
    } else {
      data = { ...values }
    }
    return dispatch(getCashoutHistoryCount({
      ...data,
      createdAt: startDate && endDate ? {$gte: startDate, $lte: endDate} : undefined
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
        placeholder: 'End date',
      },
    },
    {
      name: 'referenceNo',
      type: FilterInputType.Input,
      inputProps: {
        placeholder: 'Reference No.'
      }
    },
    {
      name: 'userName',
      type: FilterInputType.Input,
      inputProps: {
        placeholder: 'User Name'
      }
    },
    {
      name: 'bankTransactionId',
      type: FilterInputType.Input,
      inputProps: {
        placeholder: 'Bank Transaction Id'
      }
    },
    {
      name: 'status',
      type: FilterInputType.Select,
      inputProps: {
        placeholder: 'Cashout status',
        options: [
          {
            label: 'Success',
            value: 'Success'
          },
          {
            label: 'Cancelled',
            value: 'Cancelled'
          },
          {
            label: 'Rejected',
            value: 'Rejected'
          }
        ]
      }
    },
  ]), [formRef.current])

  return (
    <TableReport
      title='Cashout history'
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
            content={`Total Approved Amount: ${formatNumber(result.approvedAmount || 0) || 0}`}
            type="info"
          />
        </div>
      }
    />
  )
};
export default Page;