import { Fragment, useEffect, useRef, useState } from 'react'
import { FormInstance } from 'antd'
import { useAppDispatch } from '@/store/hooks'

// Components
import { Breadcrumb } from '@/components/shared/breadcrumb/Breadcrumb'
import { Heading } from '@/components/shared/heading/Heading'
import { PaginationProps, } from '@/components/shared/pagination/Pagination'
import { Note } from '@/components/shared/note/Note'
import { Table } from '@/components/shared/table/Table'
import TableReport from '@/components/table-report/TableReport'
import { useBusyContext } from '@/components/shared/busy'
import { FilterForm, FilterInputType } from '@/components/shared/filter/Filter'

// Helpers
import { cleanObject } from '@/helpers/object'

// Actions
import { playerRakeBackReport, countDataForRakeBack, currentCycle, countRakePLayerReportDataSearch } from '../../store/action'
import { listRakeBack } from '@/modules/rakeback-config/store/action'

import './RakeBackPlayerReport.scss'
import '../rakeback-commission-report/RakebackCommissionReport.scss'

import { showAlert } from "@/store/global/action";

const columns: any[] = [
  {
    title: 'S.No',
    dataIndex: 'NO.',
  },
  {
    title: 'User Name',
    dataIndex: 'showUserName',
  },
  {
    title: 'Date and Time',
    dataIndex: 'dateAndTime',
  },
  {
    title: 'Rake Back From 1st Line',
    dataIndex: 'rakebackFrom1stLine'
  },
  {
    title: 'Rake Back From 2nd Line',
    dataIndex: 'rakebackFrom2ndLine'
  },
  {
    title: 'Status',
    dataIndex: 'Status'
  }
]

const FilterFields = [
  {
    name: 'rakeByUsername',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Username',
    },
  },
  {
    name: 'startDate',
    type: FilterInputType.Date,
    inputProps: {
      placeholder: 'Start Time',
    },
  },
  {
    name: 'endDate',
    type: FilterInputType.Date,
    inputProps: {
      placeholder: 'End Time',
    },
  },
]

const Page = () => {
  const { showBusy, hideBusy } = useBusyContext()
  const dispatch = useAppDispatch()
  const [data, setData] = useState<any>([])
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    pageSize: 10,
  })
  // console.log("1111",pagination)
  const [isCurrentCycle, setIsCurrentCycle] = useState<boolean>(false)

  const filterFormRef = useRef<FormInstance>(null)
  const tableRef = useRef<any>(null)

  const [totalRakePlayerReport, setTotalRakePlayerReport] = useState<any>([
    {
      title: "TOTAL RAKE BACK GENERATED FROM 1ST LINE",
      amount: 0
    },
    {
      title: "TOTAL RAKE BACK GENERATED FROM 2ND LINE",
      amount: 0
    },
    {
      title: "TOTAL RAKE BACK COLLECTED FROM 1ST LINE",
      amount: 0
    },
    {
      title: "TOTAL RAKE BACK COLLECTED FROM 2ND LINE",
      amount: 0
    }
  ])

  const [totalCurrentRakePlayerReport, setTotalCurrentRakePlayerReport] = useState<any>([
    {
      title: "TOTAL RAKE BACK GENERATED FROM 1ST LINE",
      amount: 0
    },
    {
      title: "TOTAL RAKE BACK GENERATED FROM 2ND LINE",
      amount: 0
    },
    {
      title: "TOTAL RAKE BACK COLLECTED FROM 1ST LINE",
      amount: 0
    },
    {
      title: "TOTAL RAKE BACK COLLECTED FROM 2ND LINE",
      amount: 0
    },
    {
      title: "RAKE GENERATED FOR 1ST LINE",
      amount: 0
    },
    {
      title: "RAKE GENERATED FOR 2ND LINE",
      amount: 0
    }
  ])

  const loadTotal = async (url: any, current: number) => {
    const values = cleanObject({
      ...filterFormRef.current?.getFieldsValue(),
      pageSize: pagination.pageSize,
      skip: ((current && current - 1) || 0) * (pagination?.pageSize || 10),
    })

    const countData: any = await dispatch(countRakePLayerReportDataSearch(values))
    if (countData.payload) {
      setPagination({
        total: countData.payload,
        current: current,
        pageSize: pagination.pageSize,
      })
    }
  }

  const load = async (current: number) => {
    try {
      showBusy()
      const values = cleanObject({
        ...filterFormRef.current?.getFieldsValue(),
        pageSize: pagination.pageSize,
        skip:
        ((current && current - 1) || 0) *
        (pagination?.pageSize || 10),
      })
      console.log("values====== ", values);
      const res: any = await dispatch(playerRakeBackReport(values))
      loadTotal(playerRakeBackReport, current)
      let dataList = res.payload.data.count
      for (let i of dataList) {
        if (i.RakeTo1StLineName === values.rakeByUsername) {
          i.showUserName = i.RakeTo1StLineName
        } else {
          i.RakeTo1StLine = 0
        }
        if (i.RakeTo2ndLineName === values.rakeByUsername) {
          i.showUserName = i.RakeTo2ndLineName
        } else {
          i.RakeTo2ndLine = 0
        }
        i.status = i.firstStatus == "approved" || i.secondStatus == "approved" ? "approved" : "rejected"
        i.dateAndTime = dateAndTime(i.Timestamp)
      }
      setTotalRakePlayerReport([
        {
          title: "TOTAL RAKE BACK GENERATED FROM 1ST LINE",
          amount: res.payload.data.generatedFrom1stLine&&res.payload.data.generatedFrom1stLine[0] ? res.payload.data.generatedFrom1stLine[0].generatedRakeBack.toFixed(2) : 0
        },
        {
          title: "TOTAL RAKE BACK GENERATED FROM 2ND LINE",
          amount: res.payload.data.generatedFrom2ndLine&&res.payload.data.generatedFrom2ndLine[0] ? res.payload.data.generatedFrom2ndLine[0].generatedRakeBack.toFixed(2) : 0
        },
        {
          title: "TOTAL RAKE BACK COLLECTED FROM 1ST LINE",
          amount: res.payload.data.collectedFrom1stLine&&res.payload.data.collectedFrom1stLine[0] ? res.payload.data.collectedFrom1stLine[0].generatedRakeBack.toFixed(2) : 0
        },
        {
          title: "TOTAL RAKE BACK COLLECTED FROM 2ND LINE",
          amount: res.payload.data.collectedFrom2ndLine&&res.payload.data.collectedFrom2ndLine[0] ? res.payload.data.collectedFrom2ndLine[0].generatedRakeBack.toFixed(2) : 0
        }
      ])
      const dataWithNo = dataList.map((item: any, index: number) => ({
        ...item,
        'NO.': index + 1,
        'Status': Status(item),
        'rakebackFrom1stLine': rakeback1st(item),
        'rakebackFrom2ndLine': rakeback2nd(item)
      }))
      setData(dataWithNo)

    } finally {
      hideBusy()
    }
  }

  const rakeback1st = (data: any) => {
    let rake
    if (data.RakeTo1StLineName === data.showUserName) {
      rake = data.RakeTo1StLine.toFixed(2) + "(" + data.username + ")";
    } else {
      rake = "-"
    }
    
    return rake
  }

  const rakeback2nd = (data: any) => {
    let rake
    if (data.RakeTo2ndLineName === data.showUserName) {
      rake = data.RakeTo2ndLine.toFixed(2) + "(" + data.username + ")";
    } else {
      rake = "-"
    }
    return rake
  }

  const Status = (data: any) => {
    if (data.RakeTo1StLineName === data.showUserName) {
      let status1 = data.firstStatus ? data.firstStatus : "Inreview"
      return status1
    }
    if (data.RakeTo2ndLineName === data.showUserName) {
      let status2 = data.secondStatus ? data.secondStatus : "Inreview"
      return status2
    }
  }

  const dateAndTime = (dateString: any) => {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleString('default', { month: 'short' })
    const hours = date.getHours()
    const minutes = date.getMinutes()
    
    // Function to get the day suffix (st, nd, rd, th)
    const getDaySuffix = (day: any) => {
      if (day >= 11 && day <= 13) {
        return 'th'
      }
      switch (day % 10) {
        case 1: return 'st'
        case 2: return 'nd'
        case 3: return 'rd'
        default: return 'th'
      }
    }
    
    // Function to format hours into 12-hour format
    const formatHours = (hours: any) => {
      const formattedHours = hours % 12 || 12
      return formattedHours
    }
    
    // Function to get AM or PM
    const getAmPm = (hours: any) => {
      return hours >= 12 ? 'PM' : 'AM'
    }
    
    const daySuffix = getDaySuffix(day)
    const formattedHours = formatHours(hours)
    const amPm = getAmPm(hours)
    
    return `${day}${daySuffix} ${month} ${formattedHours}:${minutes.toString().padStart(2, '0')} ${amPm}`
  }

  const handleOnReset = () => {
    filterFormRef.current?.resetFields()
    setData([])
    setTotalRakePlayerReport([
      {
        title: "TOTAL RAKE BACK GENERATED FROM 1ST LINE",
        amount: 0
      },
      {
        title: "TOTAL RAKE BACK GENERATED FROM 2ND LINE",
        amount: 0
      },
      {
        title: "TOTAL RAKE BACK COLLECTED FROM 1ST LINE",
        amount: 0
      },
      {
        title: "TOTAL RAKE BACK COLLECTED FROM 2ND LINE",
        amount: 0
      }
    ])
    setIsCurrentCycle(false)
    setTotalCurrentRakePlayerReport([
      {
        title: "TOTAL RAKE BACK GENERATED FROM 1ST LINE",
        amount: 0
      },
      {
        title: "TOTAL RAKE BACK GENERATED FROM 2ND LINE",
        amount: 0
      },
      {
        title: "TOTAL RAKE BACK COLLECTED FROM 1ST LINE",
        amount: 0
      },
      {
        title: "TOTAL RAKE BACK COLLECTED FROM 2ND LINE",
        amount: 0
      },
      {
        title: "RAKE GENERATED FOR 1ST LINE",
        amount: 0
      },
      {
        title: "RAKE GENERATED FOR 2ND LINE",
        amount: 0
      }
    ])
    setPagination({
      current: 1,
      total: 0,
      pageSize: 20,
    })
  }

  const handleCurrentCycle = async () => {
    setIsCurrentCycle(true)
    const values = cleanObject({
      ...filterFormRef.current?.getFieldsValue(),
      pageSize: pagination.pageSize,
      skip:
      ((pagination?.current && pagination?.current - 1) || 0) *
      (pagination?.pageSize || 10),
    })
    const res: any = await dispatch(currentCycle(values))
    const rakeTarget: any = await dispatch(listRakeBack())
    loadTotal(currentCycle, 1);
    let dataList = res.payload.data.count
      for (let i of dataList) {
        if (i.RakeTo1StLineName === values.rakeByUsername) {
          i.showUserName = i.RakeTo1StLineName
        } else {
          i.RakeTo1StLine = 0
        }
        if (i.RakeTo2ndLineName === values.rakeByUsername) {
          i.showUserName = i.RakeTo2ndLineName
        } else {
          i.RakeTo2ndLine = 0
        }
        i.status = i.firstStatus == "approved" || i.secondStatus == "approved" ? "approved" : "rejected"
        i.dateAndTime = dateAndTime(i.Timestamp)
      }
      setTotalCurrentRakePlayerReport([
        {
          title: "TOTAL RAKE BACK GENERATED FROM 1ST LINE",
          amount: res.payload.data.generatedFrom1stLine&&res.payload.data.generatedFrom1stLine[0] ? res.payload.data.generatedFrom1stLine[0].generatedRakeBack.toFixed(2) : 0
        },
        {
          title: "TOTAL RAKE BACK GENERATED FROM 2ND LINE",
          amount: res.payload.data.generatedFrom2ndLine&&res.payload.data.generatedFrom2ndLine[0] ? res.payload.data.generatedFrom2ndLine[0].generatedRakeBack.toFixed(2) : 0
        },
        {
          title: "TOTAL RAKE BACK COLLECTED FROM 1ST LINE",
          amount: res.payload.data.collectedFrom1stLine&&res.payload.data.collectedFrom1stLine[0] ? res.payload.data.collectedFrom1stLine[0].generatedRakeBack.toFixed(2) : 0
        },
        {
          title: "TOTAL RAKE BACK COLLECTED FROM 2ND LINE",
          amount: res.payload.data.collectedFrom2ndLine&&res.payload.data.collectedFrom2ndLine[0] ? res.payload.data.collectedFrom2ndLine[0].generatedRakeBack.toFixed(2) : 0
        },
        {
          title: "RAKE GENERATED FOR 1ST LINE",
          amount: `${res.payload.data.playerGeneratedRake&&res.payload.data.playerGeneratedRake[0] ? res.payload.data.playerGeneratedRake[0].totalRake.toFixed(2) : 0}/${rakeTarget.payload[0].target1stLine ? rakeTarget.payload[0].target1stLine : 0}`
        },
        {
          title: "RAKE GENERATED FOR 2ND LINE",
          amount: `${res.payload.data.playerGeneratedRake&&res.payload.data.playerGeneratedRake[0] ? res.payload.data.playerGeneratedRake[0].totalRake.toFixed(2) : 0}/${rakeTarget.payload[0].target2ndLine ? rakeTarget.payload[0].target2ndLine : 0}`
        }
      ]) 
      const dataWithNo = dataList.map((item: any, index: number) => ({
        ...item,
        'NO.': index + 1,
        'Status': Status(item) || "Inreview" ,
        'rakebackFrom1stLine': rakeback1st(item),
        'rakebackFrom2ndLine': rakeback2nd(item)
      }))
      setData(dataWithNo)
  }

  const handleExport = () => {
    tableRef.current.exportCsv('rake-back-report')
  }

  const handleFilterSubmit = (values: any) => {
    load(1)
    // loadTotal();
  }

  const handlePagination = (current: number) => {
    console.log("current: ", current);
    const newPagination = {
      ...pagination,
      current,
    };
    
    load(current)
    setPagination(newPagination);
  }
  
  // useEffect(() => {
  //   load();
  // }, [pagination]);

  // useEffect(() => {
  //   loadTotal("");
  // }, []);

  return (
    <Fragment>
      <div className='rakeback-player-report-content'>
        <Breadcrumb />

        <Heading title='Rakeback Player Report' type='info' solid={true} />

        <div className="rakeback-player-report-content__filter">
          <FilterForm
            ref={filterFormRef}
            items={FilterFields}
            onFinish={handleFilterSubmit}
            onReset={handleOnReset}
            onExport={handleExport}
            onCurrentCycle={handleCurrentCycle}
          />
        </div>

        {isCurrentCycle ? (
          <div className="rakeback-transaction-history-report-content">
            <div className='rake'>
                  {totalCurrentRakePlayerReport.map((item: any, index: number) => (
                      <div className='rake-total-player' key={index}>
                          <h3 className='rake-title-rake-player'>{ item.title}</h3>
                          <span className='rake-amount-player'>{ item.amount || 0 }</span>  
                      </div>  
                      
                  )) }      
              </div>
          </div>
        ): (
          <div className="rakeback-transaction-history-report-content">
            <div className='rake'>
                  {totalRakePlayerReport.map((item: any, index: number) => (
                      <div className='rake-total-player' key={index}>
                          <h3 className='rake-title-rake-player'>{ item.title}</h3>
                          <span className='rake-amount-player'>{ item.amount ? item.amount : 0 }</span>  
                      </div>  
                      
                  )) }      
              </div>
          </div>
        )}

        <Table
          ref={tableRef}
          columns={columns}
          pagination={pagination}
          data={data || []}
          onPageChange={handlePagination}
          
        />
      </div>
    </Fragment>
  )
}

export default Page;
