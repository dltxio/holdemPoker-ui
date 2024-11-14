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
import { getCashOutRequestCount, listPendingCashOutRequest, processApproveCashout, removeCashoutRequestOnAction } from '../store/action';
import { Button } from '@/components/shared/button/Button';
import { Icon } from '@/components/shared/icon/Icon';
import { useBusyContext } from '@/components/shared/busy';
import { useConfirmationContext } from '@/components/shared/confirmation';
// import { countDataInPlayerBonusReport, countDataInPlayerLoyalityPointsReport, listDataInPlayerBonusReport, listDataInPlayerLoyalityPointsReport } from '../../store/action';


const ActionButtons = ({ row, reload }: any) => {
  const d = useAppDispatch();
  const bs = useBusyContext();
  const cf = useConfirmationContext();
  const onApprove = async () => {
    await cf.showConfirm({
      message: 'Are you sure you want to approve this request?',
    });
    await bs.showBusy();
    try {
      await d(processApproveCashout({
        ...row
      }));
      reload && reload();
    } finally {
      bs.hideBusy();
    }
  }

  const onReject = async () => {
    await cf.showConfirm({
      message: 'Are you sure you want to remove this request?',
      showReason: true
    });
    await bs.showBusy();
    try {
      await d(removeCashoutRequestOnAction({
        ...row,
      }));
      reload && reload();
    } finally {
      bs.hideBusy();
    }
  }
  return (
    <Space
      size={5}
    >
      <Button
        danger
        icon={'bi-pencil-square'}
        containerProps={{
          className: 'd-inline'
        }}
        onClick={onApprove}
      >
        Approve
      </Button>
      <Button
        danger
        icon={'fa-share'}
        iconType='fa'
        containerProps={{
          className: 'd-inline'
        }}
        onClick={onReject}
      >
          Reject with mail
      </Button>
    </Space>
  )
}

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
      title: 'UserName',
      dataIndex: 'displayName'
    },
    {
      title: 'Bank Details',
      dataIndex: 'displayDebitToAffiliatename',
      customRender({ row }) {
        return (
          <div style={{textAlign: 'left'}}>
            Name: {row.name || 'N/A'}
            <br/>
            Account No.: {row.accountNumber || 'N/A'}
            <br/>
            Account type: {row.accountType || 'N/A'}
            <br/>
            Bank Name: {row.bankName || 'N/A'}
            <br/>
            IFSC Code: {row.ifcsCode || 'N/A'}
          </div>
        )
      }
    },
    {
      title: 'Reference No.',
      dataIndex: 'referenceNo'
    },
    {
      title: 'Requested Amount',
      dataIndex: 'requestedAmount'
    },
    {
      title: 'Net Amount',
      dataIndex: 'netAmount'
    },
    {
      title: 'Mobile Number',
      dataIndex: 'mobileNumber'
    },
    {
      title: 'Parent Details',
      dataIndex: 'parentDetail'
    },
    {
      title: 'Player VIP Points',
      dataIndex: 'playerVipPoints'
    },
    {
      title: 'Player Available Real Chips',
      dataIndex: 'playerAvailableRealChips'
    },
    {
      title: 'Player Available Instant',
      dataIndex: 'playerAvailableInstant'
    },
    {
      title: 'Profile',
      dataIndex: 'profile'
    },
    {
      title: 'Requested on',
      dataIndex: 'requestedAtText'
    },
    {
      title: 'Action',
      dataIndex: 'displayAddDate',
      customRender(props) {
        return <ActionButtons
          {...props}
          reload={() => tableRef.current?.reload()}
        />
      }
    }
  ];

  const getData = async ({requestedAt, ...values}: any) => {
    const res = await dispatch(listPendingCashOutRequest({
      // ...defaultValue,
      ...values,
      requestedAt: requestedAt ? {
        $gte: dayjs(requestedAt).startOf('D').valueOf(),
        $lte: dayjs(requestedAt).endOf('D').valueOf()
      } : undefined
    }));
    setResult({
      ...res.payload,
      result: undefined
    })
    return {
      data: res.payload.result as any[],
    }
  }

  const getTotal = async ({ requestedAt, ...values }: any) => {
    return dispatch(getCashOutRequestCount({
      ...values,
      requestedAt: requestedAt ? {
        $gte: dayjs(requestedAt).startOf('D').valueOf(),
        $lte: dayjs(requestedAt).endOf('D').valueOf()
      } : undefined
    })).then((res: any) => res.payload)
  }

  const FilterFields: FilterItem[] = useMemo(() => ([
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
      title='Pending Cashout Requests'
      tableRef={tableRef}
      formRef={formRef}
      columns={columns}
      filterFields={FilterFields}
      getData={getData}
      getTotal={getTotal}
      firstLoad={true}
    />
  )
};
export default Page;