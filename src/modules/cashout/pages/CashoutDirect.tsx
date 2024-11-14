import { useEffect, useMemo, useRef, useState } from 'react'
import { FormInstance, Space } from 'antd'

// import './PlayerChipsReport.scss';
import TableReport from '@/components/table-report/TableReport'
import { useAppDispatch } from '@/store/hooks'
import { TableColumnType } from '@/components/shared/table/Table'
// import { countlistRakeDataForRakeReport, listRakeDataRakeReport } from '../store/action';
import { countDataForCashout, findDataForCashout, getCashoutHistoryCount, listCashOutHistory, approveDataForCashout, rejectDataForCashout } from '../store/action'
import { useBusyContext } from '@/components/shared/busy'
import { useConfirmationContext } from '@/components/shared/confirmation'
import { Button } from '@/components/shared/button/Button'
import cache from '@/core/cache'
import { LOCAL_USER_KEY } from '@/configs/auth.config'
import { showAlert } from '@/store/global/action'
import { useLocation, useNavigate } from 'react-router';
export const getLocalUser = () => cache.getCache(LOCAL_USER_KEY)

const ActionButtons = ({ row, reload }: any) => {
  console.log("row: ", row);
  const localUser: any = getLocalUser()
  const approveAccess = localUser.data.role.level
  const d = useAppDispatch()
  const bs = useBusyContext()
  const cf = useConfirmationContext()
  const nav = useNavigate();
  const onApprove = async () => {
    await cf.showConfirm({
      message: 'Are you sure you want to approve this request?',
    })
    await bs.showBusy()
    try {
      let data: any = {}
      row.createdAt = Number(new Date());
      data.tempReqId = row._id;
      if (row.profile.toUpperCase() != "PLAYER") {
        data.amount = row.amount;
        data.affiliateId = row.affilateId;
        data.profile = "subAffiliate";
      } else {
        console.log("setting player data for approving the cashout");
        data.amount = row.requestedAmount;
        data.affiliateId = row.affiliateId;
      }
      await d(approveDataForCashout({
        ...data
      }))
      if (row.profile === "PLAYER") {
        d(showAlert({ title: 'success', content: "Cashout request successfully!" }))
      }
      if(row.profile != "PLAYER"){
        d(showAlert({ title: 'success', content: "Cashout request successfully!" }))
      } 
      
      reload && reload()
    } finally {
      bs.hideBusy()
    }
  }

  const onReject = async () => {
    await cf.showConfirm({
      message: 'Are you sure you want to remove this request?',
      showReason: true
    })
    await bs.showBusy()
    try {
      var data: any = {};
      console.log("inside rejectCashOut function data-->",row);
      data.profile = row.profile;
      data.tempReqId = row._id;
      data.createdAt = Number(new Date());
      data.amount = row.amount;
      if(row.profile != "PLAYER"){
      } else {
        data.amount = row.requestedAmount;
      }
      await d(rejectDataForCashout({
        ...data,
      }))
      d(showAlert({ title: 'success', content: "Cashout request rejected sucessfully!" }))
      reload && reload();
      // nav('/directCashoutHistory')
    } finally {
      bs.hideBusy()
    }
  }
  return (
    <Space
      size={5}
    >
      {/* {row.profile.toUpperCase() === "PLAYER" || approveAccess === 0 ? (
      <></>
      ): (
        // <Button
        //   danger
        //   icon={'bi-pencil-square'}
        //   containerProps={{
        //     className: 'd-inline'
        //   }}
        //   onClick={onApprove}
        // >
        //   Approve
        // </Button>
      ) } */}
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
          Reject
      </Button>
    </Space>
  )
}

const Page = () => {
  const dispatch = useAppDispatch()
  const tableRef = useRef<any>(null)
  const formRef = useRef<FormInstance>(null)
  const [result, setResult] = useState<any>({})

  const columns: TableColumnType[] = [
    {
      title: 'S No.',
      dataIndex: 'NO.'
    },
    {
      title: 'Username',
      dataIndex: 'userName'
    },
    {
      title: 'Profile',
      dataIndex: 'userType',
    },
    {
      title: 'Bank Details',
      dataIndex: 'referenceNo',
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
      title: 'Requested Amount',
      dataIndex: 'requestedAmountValue'
    },
    {
      title: 'Type',
      dataIndex: 'typeValue'
    },
    {
      title: 'Action',
      dataIndex: 'reason',
      customRender(props) {
        return <ActionButtons
          {...props}
          reload={() => tableRef.current?.reload()}
        />
      }
    }
  ]

  const getData = async ({startDate, endDate, ...values}: any) => {
    const res = await dispatch(findDataForCashout({
      // ...defaultValue,
      ...values,
      // createdAt: startDate && endDate ? {$gte: startDate, $lte: endDate} : undefined
    }))
    const dataWithNo = res.payload.result.map((item: any, index: number) => ({
      ...item,
      'NO.': index + 1,
      'userType': userType(item.profile),
      'requestedAmountValue': requestedAmountValue(item.amount, item.requestedAmount, item.profile),
      'typeValue': typeValue(item.profile, item.type)
    }))
    // setResult({
    //   ...res.payload,
    //   result: undefined
    // })
    setResult({
      dataWithNo
    })
    return {
      data: dataWithNo as any[],
    }
  }

  const getTotal = async ({ startDate, endDate, ...values }: any) => {
    return dispatch(countDataForCashout({
      ...values,
      // createdAt: startDate && endDate ? {$gte: startDate, $lte: endDate} : undefined
    })).then((res: any) => res.payload)
  }

  const userType = (profile: string) => {
    return profile === "subAffiliate" ? 'Sub-Agent' : profile !== "subAffiliate" ? profile.toUpperCase() : ""
  }

  const requestedAmountValue = (amount: any, requestedAmount: any, profile: any) => {
    return profile === "PLAYER" ? requestedAmount : amount
  }

  const typeValue = (profile: any, type: any) => {
    return profile === 'PLAYER' ? "Real Chips" : type
  }

  return (
    <TableReport
      title='Cash Out Request'
      tableRef={tableRef}
      formRef={formRef}
      columns={columns}
      filterFields={[]}
      getData={getData}
      getTotal={getTotal}
      firstLoad={true}
    />
  )
}
export default Page;