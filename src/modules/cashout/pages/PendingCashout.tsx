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
import { getCashOutRequestCount, listPendingCashOutRequest, processApproveCashout, removeCashoutRequestOnAction, insertIntoCashoutHistory } from '../store/action';
import { Button } from '@/components/shared/button/Button';
import { Icon } from '@/components/shared/icon/Icon';
import { useBusyContext } from '@/components/shared/busy';
import { useConfirmationContext } from '@/components/shared/confirmation';
import { showAlert } from '@/store/global/action';
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
      d(showAlert({ title: 'success', content: "Cashout request raised successfully!" }))
      await d(removeCashoutRequestOnAction({
        ...row,
        title: "Pending Cashout"
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
      await d(insertIntoCashoutHistory({
        ...row
      }))
      await d(removeCashoutRequestOnAction({
        ...row,
        title: "Pending Cashout"
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
    const dataWithNo = res.payload.result.map((item: any, index: number) => ({
      ...item,
      'NO.': index + 1,
      'displayName': displayName(item.userName, item.realName, item.name),
      'mobileNumber': mobileNumber(item.profile, item.affiliateMobile, item.mobile),
      'parentDetail': parentDetail(item.affiliateId, item.affiliateMobile, item.profile),
      'requestedAtText': requestedAtText(item.requestedAt)
    }))
    setResult({
      ...res.payload,
      result: undefined
    })
    return {
      // data: res.payload.result as any[],
      data: dataWithNo
    }
  }

  const displayName = (userName: any, realName: any, name: any) => {
    return `${userName} (${realName || name})`;
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

  const parentDetail = (affiliateId: any, affiliateMobile: any, profile: any) => {
    return `${affiliateId}${(affiliateId && affiliateMobile && profile != 'Sub-Affiliate') ? `/${affiliateMobile}` : ''}`
  }

  const requestedAtText = (requestedAt: any) => {
    return dayjs(requestedAt).format('MMM DD, YYYY HH:mm:ss A');
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
      name: 'requestedAt',
      type: FilterInputType.Date,
      inputProps: {
        placeholder: 'Start date',
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
      name: 'profile',
      type: FilterInputType.Select,
      inputProps: {
        placeholder: 'User Type',
        options: UserTypes
      }
    },
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
      title='Pending Cashout'
      tableRef={tableRef}
      formRef={formRef}
      columns={columns}
      filterFields={FilterFields}
      getData={getData}
      getTotal={getTotal}
      firstLoad={true}
      description={
        <div className='row'>
          <div className='col'>
            <Ribbon
              type="info"
              title="PENDING PLAYER CHIPS"
              content={<DisplayNumber value={result.playerPending || 0}/>}
            />
          </div>
          <div className='col'>
            <Ribbon
              type="primary"
              title="PENDING AGENT RAKE"
              content={<DisplayNumber value={result.agentRakePending || 0}/>}
            />
          </div>
          <div className='col'>
            <Ribbon
              type="warning"
              title="PENDING AFFILIATE RAKE"
              content={<DisplayNumber value={result.affRakePending || 0}/>}
            />
          </div>
          <div className='col'>
            <Ribbon
              type="info"
              title="PENDING AGENT CHIPS"
              content={<DisplayNumber value={result.agentRealPending || 0}/>}
            />
          </div>
        </div>
      }
    />
  )
};
export default Page;