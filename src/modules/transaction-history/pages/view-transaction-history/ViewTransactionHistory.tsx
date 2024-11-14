import { FormInstance } from 'antd'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

// Components
import { Breadcrumb } from '@/components/shared/breadcrumb/Breadcrumb'
import { Heading } from '@/components/shared/heading/Heading'
import { PaginationProps } from '@/components/shared/pagination/Pagination'
import { Note } from '@/components/shared/note/Note'
import { useBusyContext } from '@/components/shared/busy'
import { FilterForm, FilterInputType } from '@/components/shared/filter/Filter'
import { Table } from '@/components/shared/table/Table'

// Models
import {
  SortTypes,
  TransactionTypes,
  TransferModeTypes,
  UserTypes,
} from '@/modules/transaction-history/models/transaction-history'

// Helpers
import { cleanObject } from '@/helpers/object'

// Actions
import {
  countDataInTransactionHistory,
  listTransactionHistory,
} from '../../store/action'

import './ViewTransactionHistory.scss'
import { getCurrentUserData, formatTime } from "@/helpers/common"

const columns: any[] = [
  {
    title: 'S.No',
    dataIndex: 'NO.',
  },
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Username',
    dataIndex: 'userName',
  },
  {
    title: 'Date',
    dataIndex: 'dateAndTime',
  },
  {
    title: 'Reference Number',
    dataIndex: 'referenceNumber',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
  },
  {
    title: 'Transfer mode',
    dataIndex: 'transferModeDisplay',
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
    title: 'Locked Bonus Amount',
    dataIndex: 'lockedBonusAmountDisplay',
  },
  {
    title: 'Instant Bonus Amount',
    dataIndex: 'bonusAmount',
  },
  {
    title: 'VIP points',
    dataIndex: 'getMegaPoints',
  },
  {
    title: 'Approved By',
    dataIndex: 'approvedBy',
  },
  {
    title: 'Transaction Type',
    dataIndex: 'transactionType',
  },
]

export const enum TransferModeEnum {
  funTransfer = 'FUND TRANSFER',
  onlineTransfer = 'ONLINE TRANSFER',
  scratchCard = 'Scratch Card',
}

const Page = () => {
  const { showBusy, hideBusy } = useBusyContext()
  const dispatch = useAppDispatch()
  const [isShowTotal, setIsShowTotal] = useState(true)
  const [data, setData] = useState<any>({})
  const { user } = useAppSelector(store => store.auth);
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    total: 0,
    pageSize: 20,
  })
  
  const filterFormRef = useRef<FormInstance>(null)
  const tableRef = useRef<any>(null)
  
  // useEffect(() => {
  //   const currentUser = getCurrentUserData()
  //   setUser(currentUser)
  // }, [])

  const FilterFields = [
    {
      name: 'startDate',
      type: FilterInputType.Date,
      inputProps: {
        placeholder: 'Start Date',
      },
    },
    {
      name: 'endDate',
      type: FilterInputType.Date,
      inputProps: {
        placeholder: 'End Date',
      },
    },
    {
      name: 'Name',
      type: FilterInputType.Input,
      inputProps: {
        // placeholder: user.userName,
        placeholder: 'User Name',
      },
    },
    {
      name: 'bonusCode',
      type: FilterInputType.Input,
      inputProps: {
        placeholder: 'BONUS CODE',
      },
    },
    {
      name: 'transactionType',
      type: FilterInputType.Select,
      inputProps: {
        placeholder: 'Transaction type',
        options: TransactionTypes,
      },
    },
    {
      name: 'transferMode',
      type: FilterInputType.Select,
      inputProps: {
        placeholder: 'Transfer Mode',
        options: TransferModeTypes,
      },
    },
    {
      name: 'sortValue',
      type: FilterInputType.Select,
      inputProps: {
        placeholder: '',
        options: SortTypes,
      },
    },
    {
      name: 'referenceNumber',
      type: FilterInputType.Input,
      inputProps: {
        placeholder: 'Reference No.',
      },
    },
    {
      name: 'userType',
      type: FilterInputType.Select,
      inputProps: {
        placeholder: 'User Type',
        options: UserTypes,
      },
    },
  ]
  

  useEffect(() => {
    load()
  }, [pagination])

  useEffect(() => {
    load(),
    loadTotal()
  }, [])

  const loadTotal = async () => {
    const values = cleanObject({
      ...filterFormRef.current?.getFieldsValue(),
    })
    let data
    if (user && user.role.level <= 0) {
      data = { ...values, loginId: user.userName }
    } else {
      data = { ...values }
    }
    const countData = await dispatch(countDataInTransactionHistory(data))
    setPagination({
      total: countData.payload,
      current: pagination.current,
      pageSize: pagination.pageSize,
    })
  }

  const load = async () => {
    try {
      showBusy()
      const values = cleanObject({
        ...filterFormRef.current?.getFieldsValue(),
        pageSize: pagination.pageSize,
        skip:
          ((pagination?.current && pagination?.current - 1) || 0) *
          (pagination?.pageSize || 10),
      })
      let data
      if (user && user.role.level <= 0) {
        data = { ...values, loginId: user.userName }
      } else {
        data = { ...values }
      }
      const res: any = await dispatch(listTransactionHistory(data))
      console.log("res: ", res)
      if (res.payload.result.resultList) {
        const dataWithNo = res.payload.result.resultList.map((item: any, index: number) => ({
          ...item,
          'NO.': index + 1,
          'dateAndTime': dateAndTime(item.date),
          'name': name(item.transferMode, item.names, item.Name),
          'userName': userName(item.transferMode, item.loginType, item.loginId, item.profileScratchCard),
          'transferModeDisplay': transferModeDisplay(item.scratchCardType, item.userLevel, item.transferMode),
          'getMegaPoints': getMegaPoints(item.megaPoints),
          'lockedBonusAmountDisplay': lockedBonusAmountDisplay(item.lockedBonusAmount)
        }))
        let totalAmount = { 
          totalFundTransfer: 0,
          totalOnlineTransfer: 0,
          totalScratchCard: 0,
          totalCredit: 0,
          totalDebit: 0
        }
        for (let item of res.payload.result.resultList) {
          if (item.transferMode === "ONLINE TRANSFER") {
            totalAmount.totalOnlineTransfer += item.amount 
          }
          if (item.transferMode === "FUND TRANSFER") { 
            totalAmount.totalFundTransfer += item.amount 
          }
          if (item.transferMode === "Scratch Card") {
            totalAmount.totalScratchCard += item.amount
          }
        }
        for (let item of res.payload.result.financeStatus) {
          if (item._id === "Credit") {
            totalAmount.totalCredit += item.totalAmount
          }
          if (item._id === "Deposit") {
            totalAmount.totalDebit += item.totalAmount
          }
        }
        setData({ result: dataWithNo, totalAmount })
      }
    } finally {
      hideBusy()
    }
  }

  const dateAndTime = (date: any) => {
    return formatTime(date)
  }

  const name = (transferMode: any, names: any, Name: any) => {
    if (transferMode === TransferModeEnum.funTransfer) {
      return names
    }

    if (transferMode !== TransferModeEnum.funTransfer) {
      return Name
    }

    return ''
  }

  const userName = (transferMode: any, loginType: any, loginId: any, profileScratchCard: any) => {
    let result = ''

    if (transferMode === TransferModeEnum.funTransfer) {
      return loginType
    }

    if (transferMode !== TransferModeEnum.funTransfer && transferMode !== TransferModeEnum.scratchCard) {
      return loginType
    }

    if (transferMode === TransferModeEnum.scratchCard) {
      result = `${loginId} ${profileScratchCard ? `/${profileScratchCard}` : ''}`
    }
    return result
  }

  const transferModeDisplay = (scratchCardType: any, userLevel: any, transferMode: any) => {
    let result = ''
    if (scratchCardType && !userLevel) {
      result = `/(${scratchCardType})`
    }

    if (scratchCardType && userLevel) {
      result += `/(${userLevel})`
    }
    return `${transferMode}${result}`
  }

  const getMegaPoints = (megaPoints: any) => {
    return Number(megaPoints).toFixed(4)
  }

  const lockedBonusAmountDisplay = (lockedBonusAmount: any) => {
    return lockedBonusAmount || 'N/A'
  }

  const handleOnReset = () => {
    filterFormRef.current?.resetFields()
    load()
    setIsShowTotal(true)
    // setCount(0);
  }

  const handleExport = () => {
    tableRef.current.exportCsv('trsansaction-history')
  }

  const handleFilterSubmit = (values: any) => {
    load()
    loadTotal()
    setIsShowTotal(false)
  }

  const handlePagination = (current: number) => {
    setPagination({
      ...pagination,
      current,
    })
    setIsShowTotal(false)
  }

  return (
    <Fragment>
      <div className="view-transaction-history-content">
        <Breadcrumb />

        <Heading title='View Transaction History' type='info' solid={true} />

        <div className="view-transaction-history-content__filter">
          <FilterForm
            ref={filterFormRef}
            items={FilterFields}
            onFinish={handleFilterSubmit}
            onReset={handleOnReset}
            onExport={handleExport}
          />
        </div>

        {!isShowTotal && data.totalDebit > 0 && (
          <>
            <div className='rakeback-player-report-content__note'>
              <Note
                content={`Total Debit: ${data?.result.totalDebit || 0}`}
                type='info'
              />
            </div>
          </>
        )}
        
        {isShowTotal ? (
          <div className="total">
            <div className="totalAmount">
              <h5>Total Fund Transfer</h5>
              <span>{data?.totalAmount?.totalFundTransfer || 0}</span>
            </div>
            <div className="totalAmount">
              <h5>Total Online Transfer</h5>
              <span>{data?.totalAmount?.totalOnlineTransfer || 0}</span>
            </div>
            <div className="totalAmount">
              <h5>Total Scratch Card</h5>
              <span>{data?.totalAmount?.totalScratchCard || 0}</span>
            </div>
          </div>
        ) : (
          <>
            <div className='rakeback-player-report-content__note'>
              <Note
                content={`Total Credit: ${data?.totalAmount?.totalCredit || 0}`}
                type='info'
              />
            </div>
            <div className='rakeback-player-report-content__note'>
              <Note
                content={`Total Debit: ${data?.totalAmount?.totalDebit || 0}`}
                type='info'
              />
            </div>
          </>
        )}

        <Table
          ref={tableRef}
          columns={columns}
          pagination={pagination}
          data={data?.result || []}
          onPageChange={handlePagination}
          
        />
      </div>
    </Fragment>
  )
}

export default Page;
