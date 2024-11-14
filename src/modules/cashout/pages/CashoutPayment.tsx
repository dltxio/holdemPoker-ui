import { useEffect, useMemo, useRef, useState } from 'react';
import { FormInstance, Input, Modal, ModalProps, Space, Form } from 'antd';

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
import { approveCashoutCount, getCashOutRequestCount, insertIntoCashoutHistoryOnTransfer, listApproveCashOutRequest, listPendingCashOutRequest, processApproveCashout, removeCashoutRequestOnAction, removeFromCashsoutApprovel, getRequestPayment, paymentInvoiceCashout } from '../store/action';
import { Button } from '@/components/shared/button/Button';
import { Icon } from '@/components/shared/icon/Icon';
import { useBusyContext } from '@/components/shared/busy';
import { useConfirmationContext } from '@/components/shared/confirmation';
// import { countDataInPlayerBonusReport, countDataInPlayerLoyalityPointsReport, listDataInPlayerBonusReport, listDataInPlayerLoyalityPointsReport } from '../../store/action';
import { showAlert } from '@/store/global/action';

const TransferModal = (props: any & {
  item: any
}) => {
  const [isSuccessed, setIsSuccessed] = useState(false); 
  const bs = useBusyContext();
  const d = useAppDispatch();
  

  const handleSubmit = async () => {
    
    try {
      bs.showBusy();
      const insert = await d(insertIntoCashoutHistoryOnTransfer(props.item));
      if (insert.payload.success) {
        const getRequestPaymentWithInvoiceId = await d(getRequestPayment({ invoiceId: props.item.invoiceId }));
        if (getRequestPaymentWithInvoiceId.payload.result) {
          const paymentInvoice = await d(paymentInvoiceCashout({ paymentRequest: getRequestPaymentWithInvoiceId.payload.result.paymentRequest }));
          if (paymentInvoice.payload.result) {
            d(showAlert({ title: 'success', content: 'Transfer successful!' }));
          }
        }
        await d(removeFromCashsoutApprovel({ _id: props.item._id }));
        props.onCancel();
        d(showAlert({ title: 'success', content: 'Transfer successful!' }));
      }
      window.location.reload();
      // const getRequestPaymentWithInvoiceId = await d(getRequestPayment({ invoiceId: props.item.invoiceId }));
      // if (getRequestPaymentWithInvoiceId.payload.result) {
      //   const paymentInvoice = await d(paymentInvoiceCashout({ paymentRequest: getRequestPaymentWithInvoiceId.payload.result.paymentRequest }));
      //   const insert = await d(insertIntoCashoutHistoryOnTransfer(props.item));
      //   await d(removeFromCashsoutApprovel({ _id: props.item._id }));
      //   if (paymentInvoice.payload.result) {
      //     d(showAlert({ title: 'success', content: 'Transfer successful!' }));
      //   }
      // }
    } finally {
      bs.hideBusy();
    }
  }

  return (
    <Modal
      title="Transaction"
      {...props}
      okText="Proceed"
      onOk={handleSubmit}
    >
      <div className='text-center'>
        <i className={`fa ${isSuccessed ? 'fa-check text-success' : 'fa-info-circle'}`} style={{ fontSize: '4rem' }}></i>
        <Form
          className='mt-5'
          onFinish={handleSubmit}
        >
          {/* <Form.Item
            name={'transactionId'}
            className='text-left'
            rules={[{ required: true, message: 'Transaction ID is required' }]}
          >
            <Input
              placeholder='Transaction ID'
            />
          </Form.Item> */}
          
          <Form.Item
            name={'supervisedby'}
            className='mb-0 text-left'
            rules={[{ required: true, message: 'Supervised By is required' }]}
          >
            <Input
              placeholder='Supervised By'
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ display: 'none' }}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}

const ActionButtons = ({ row, reload }: any) => {
  const d = useAppDispatch();
  const bs = useBusyContext();
  const cf = useConfirmationContext();
  const [isOpenTransfer, setIsOpenTransfer] = useState(false);
  const onApprove = async () => {
    setIsOpenTransfer(true);
    // await cf.showConfirm({
    //   message: 'Are you sure you want to approve this request?',
    // });
    // await bs.showBusy();
    // try {
    //   await d(processApproveCashout({
    //     ...row
    //   }));
    //   reload && reload();
    // } finally {
    //   bs.hideBusy();
    // }
  }

  const onReject = async () => {
    const res = await cf.showConfirm({
      message: 'Are you sure you want to remove this request?',
      showReason: true
    });
    await bs.showBusy();
    try {
      const rejectReqData = row;
      const tempReqId = rejectReqData._id;
      rejectReqData.transactionId = "N/A";
      rejectReqData.supervisedby  = "N/A"; 
      rejectReqData.transferBy    = "N/A";
      if(!rejectReqData.tds){
        rejectReqData.tds    = "N/A";
      }
      rejectReqData.approveBy  = "NA";
      if(!rejectReqData.netAmount) rejectReqData.netAmount  = "NA";
      rejectReqData.status = "Rejected";
      rejectReqData.reason = "Information incomplete.";
      rejectReqData.createdAt = Number(new Date());
      rejectReqData.reason = res.data.reason;
      await d(insertIntoCashoutHistoryOnTransfer(rejectReqData));
      await d(removeFromCashsoutApprovel({
        _id: tempReqId
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
        Transfer
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
          Incomplete
      </Button>
      <TransferModal
        open={isOpenTransfer}
        item={row}
        onCancel={() => setIsOpenTransfer(false)}
      />
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
      title: 'Customer Name',
      dataIndex: 'realName'
    },
    {
      title: 'User Name/Parent',
      dataIndex: 'displayName'
    },
    {
      title: 'Date and Time',
      dataIndex: 'approvedAtText'
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
      title: 'Profile',
      dataIndex: 'profile'
    },
    {
      title: 'Reference No.',
      dataIndex: 'referenceNo'
    },
    {
      title: 'Amount to be transfer',
      dataIndex: 'requestedAmount'
    },
    {
      title: 'Invoice Id',
      dataIndex: 'invoiceId'
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
    const res: any = await dispatch(listApproveCashOutRequest({
      // ...defaultValue,
      ...values,
      // limit: undefined,
      // skip: undefined
      // requestedAt: requestedAt ? {
        //   $gte: dayjs(requestedAt).startOf('D').valueOf(),
        //   $lte: dayjs(requestedAt).endOf('D').valueOf()
        // } : undefined
      }));
    console.log("res=== ", res);
    if (res?.payload?.result) {
      const dataWithNo = res.payload.result.map((item: any, index: number) => ({
        ...item,
        'NO.': index + 1,
        'displayName': displayName(item.userName, item.realName),
        'mobileNumber': mobileNumber(item.profile, item.affiliateMobile, item.mobile),
        'parentDetail': parentDetail(item.affiliateId, item.affiliateMobile, item.profile),
        'requestedAtText': requestedAtText(item.requestedAt),
        'approvedAtText': approvedAtText(item.approvedAt)
      }))
      setResult({
        ...res.payload,
        result: undefined
      })
      return {
        // data: res.payload.result as any[],
        data: dataWithNo as any []
      }
    } else {
      return {
        // data: res.payload.result as any[],
        data: []
      }
    }
  }

  const displayName = (userName: any, realName: any) => {
    return `${userName} (${realName})`;
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

  const parentDetail = (affiliateId: any, affiliateMobile: any, profile: any, ) => {
    return `${affiliateId}${(affiliateId && affiliateMobile && profile != 'Sub-Affiliate') ? `/${affiliateMobile}` : ''}`
  }

  const requestedAtText = (requestedAt: any) => {
    return dayjs(requestedAt).format('MMM DD, YYYY HH:mm:ss A');
  }

  const approvedAtText = (approvedAt: any) => {
    return dayjs(approvedAt).format('MMM DD, YYYY HH:mm:ss A');
  }

  const getTotal = async ({ requestedAt, ...values }: any) => {
    return dispatch(approveCashoutCount({
      ...values,
      limit: undefined,
      skip: undefined
      // requestedAt: requestedAt ? {
      //   $gte: dayjs(requestedAt).startOf('D').valueOf(),
      //   $lte: dayjs(requestedAt).endOf('D').valueOf()
      // } : undefined
    })).then((res: any) => res.payload)
  }

  const FilterFields: FilterItem[] = useMemo(() => ([
    // {
    //   name: 'requestedAt',
    //   type: FilterInputType.Date,
    //   inputProps: {
    //     placeholder: 'Start date',
    //   },
    // },
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
      title='Cashout Payment'
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