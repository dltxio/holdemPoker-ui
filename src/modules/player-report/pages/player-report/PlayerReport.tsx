import { Fragment, useEffect, useRef, useState } from 'react'
import { DatePicker, FormInstance } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons'

// Components
import { Breadcrumb } from '@/components/shared/breadcrumb/Breadcrumb'
import { Heading } from '@/components/shared/heading/Heading'
import { Button } from '@/components/shared/button/Button'
import { Pagination, PaginationProps } from '@/components/shared/pagination/Pagination'

import './PlayerReport.scss'
import { Table, TableColumnType } from '@/components/shared/table/Table'
import { FilterForm, FilterInputType, FilterItem } from '@/components/shared/filter/Filter'
import { useAppDispatch } from '@/store/hooks'
import { useBusyContext } from '@/components/shared/busy'
import { cleanObject } from '@/helpers/object'
import { TransactionTypes } from '@/modules/transaction-history/models/transaction-history'
import TableReportPLayerReport from '@/components/table-report-player-report/TableReportPlayerReport';
import { findPlayersReportDateFilter, findPlayersReport } from '../../store/action'
import dayjs from '@/core/dayjs'
import { showAlert } from '@/store/global/action';

const columns: TableColumnType[] = [
  {
    title: 'S No.',
    dataIndex: 'stt'
  },
  {
    title: 'UserName',
    dataIndex: 'userName'
  },
  {
    title: 'Name',
    dataIndex: 'name'
  },
  {
    title: 'Agent/Affiliate Name',
    dataIndex: 'isParentUserName'
  },
  {
    title: 'Chips Balance',
    dataIndex: 'realChips'
  },
  {
    title: 'Loyality Points',
    dataIndex: 'statisticsMegaPoints'
  },
  {
    title: 'Loyality Level',
    dataIndex: 'statisticsMegaPointLevel'
  },
  {
    title: 'HandsPlayed',
    dataIndex: 'statisticsHandsPlayedRM'
  },
  {
    title: 'HandsWon',
    dataIndex: 'statisticsHandsWonRM'
  },
  {
    title: 'Percentage Of Hands Won',
    dataIndex: 'percentageHandsWon'
  },
  {
    title: 'Total Rake',
    dataIndex: 'totalRake'
  },
  {
    title: 'Average Daily Rake',
    dataIndex: 'averageRakeGenerated'
  },
  {
    title: 'Average Rake/Hand',
    dataIndex: 'averageRakePerHand'
  },
  {
    title: 'Total Winnings',
    dataIndex: 'totalWinnings'
  },
  {
    title: 'Total Cashout',
    dataIndex: 'totalCashout'
  },
  {
    title: 'Number of Tournaments Played',
    dataIndex: 'tournamentsPlayed'
  },
  {
    title: 'Average Tournament Winnings',
    dataIndex: 'averageTournamentWinnings'
  },
  {
    title: 'No. of days',
    dataIndex: 'numberOfDays'
  },
  {
    title: 'City',
    dataIndex: 'address.city'
  }
]

const FilterFields: FilterItem[] = [
  {
    name: 'userName',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Player UserName'
    }
  },
  // {
  //   name: 'dateRange',
  //   type: FilterInputType.DateRange,
  //   rules: [
  //     // {required: true, message: 'Start date and End date is required'}
  //   ],
  //   inputProps: {
  //     placeholder: 'Date range',
  //     // value: [dayjs().startOf('month'), dayjs().endOf('month')]
  //   }
  // },
  {
    name: 'dateRange',
    type: FilterInputType.DateRange,
    inputProps: {
      options: TransactionTypes,
    }
  },
  {
    name: 'isParentUserName',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Player Parent(Agent/Aff) Id'
    }
  },
  {
    name: 'city',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'City'
    }
  },
  {
    name: 'minRake',
    type: FilterInputType.Input,
    inputProps: {
      type: 'number',
      placeholder: 'Min. Rake'
    }
  },
  {
    name: 'maxRake',
    type: FilterInputType.Input,
    inputProps: {
      type: 'number',
      placeholder: 'Max. Rake'
    }
  },
  {
    name: 'minHandsPlayed',
    type: FilterInputType.Input,
    inputProps: {
      type: 'number',
      placeholder: 'Hands Played(min.)'
    }
  },
  {
    name: 'maxHandsPlayed',
    type: FilterInputType.Input,
    inputProps: {
      type: 'number',
      placeholder: 'Hands Played(max.)'
    }
  },
  {
    name: 'minPercentHandsWon',
    type: FilterInputType.Input,
    inputProps: {
      type: 'number',
      placeholder: 'Min. Hands Won(%)'
    }
  },
  {
    name: 'maxPercentHandsWon',
    type: FilterInputType.Input,
    inputProps: {
      type: 'number',
      placeholder: 'Max. Hands Won(%)'
    }
  },
  {
    name: 'minWinnings',
    type: FilterInputType.Input,
    inputProps: {
      type: 'number',
      placeholder: 'Min. Winnings'
    }
  },
  {
    name: 'maxWinnings',
    type: FilterInputType.Input,
    inputProps: {
      type: 'number',
      placeholder: 'Max. Winnings'
    }
  }
]

const Page = () => {
  const dispatch = useAppDispatch()
  const urlApiDate = async (values: any) => {
    const res = await dispatch(findPlayersReportDateFilter({
      ...values,
      limit: 0,
      skip: 0
    }))
    return res
  }

  const urlApi = async (values: any) => {
    const res = await dispatch(findPlayersReport({
      ...values,
      limit: 0,
      skip: 0
    }))
    return res
  }

  const getData = async (values: any) => {
    if (values.startDate || values.endDate) {
      if (
        (values.minRake ||
        values.maxRake ||
        values.minHandsPlayed || 
        values.maxHandsPlayed || 
        values.minPercentHandsWon || 
        values.maxPercentHandsWon || 
        values.minWinnings || 
        values.city ||
        values.maxWinnings) && (!values.isParentUserName)
        
      ) {
        values.containsFilters = true
      }
      const res = await urlApiDate(values)
      console.log("res====== ", res)
      if (res.payload.result) {
        const dataWithSNo = res.payload.result.map((item: any, index: any) => ({
          ...item,
          'stt': index + 1,
          'name': `${item.firstName} ${item.lastName}`,
          "statisticsMegaPoints": item.statistics.megaPoints,
          "statisticsMegaPointLevel": item.statistics.megaPointLevel,
          "statisticsHandsPlayedRM": item.statistics.handsPlayedRM || 0,
          "statisticsHandsWonRM": item.statistics.handsWonRM || 0,
        }))
        return {
          data: dataWithSNo as any[],
        }
      } else {
        return {
          data: []
        }
      }
    } else {
      if (
        (values.minRake ||
        values.maxRake ||
        values.minHandsPlayed || 
        values.maxHandsPlayed || 
        values.minPercentHandsWon || 
        values.maxPercentHandsWon || 
        values.minWinnings || 
        values.maxWinnings) && (!values.isParentUserName)
      ) {
        dispatch(showAlert({ title: 'error', content: 'Please enter startDate and endDate' }))
      }
      const res = await urlApi(values);
      if (res.payload.result.result.data) {
        const dataWithSNo = res.payload.result.result.data.map((item: any, index: any) => ({
          ...item,
          'stt': index + 1,
          'name': `${item.firstName} ${item.lastName}`,
          "statisticsMegaPoints": res.payload.result.result.data.reduce((acc: number, val: any) => acc + val.statistics.megaPoints, 0).toFixed(),
          "statisticsMegaPointLevel": res.payload.result.result.data.map((item: any) => item.statistics.megaPointLevel),
          "statisticsHandsPlayedRM": res.payload.result.result.data.map((item: any) => item.statistics.handsPlayedRM),
          "statisticsHandsWonRM": res.payload.result.result.data.map((item: any) => item.statistics.handsWonRM),
          "percentageHandsWon": res.payload.result.result.data.map((acc: any) => (acc.statistics.handsWonRM / acc.statistics.handsPlayedRM) * 100 || 0),
          "totalRake": res.payload.result.totalRake,
          "averageRakeGenerated": res.payload.result.averageRakeGenerated,
          "averageRakePerHand": res.payload.result.averageRakePerHand,
          "address.city": item.address.city,
          "numberOfDays": res.payload.result.numberOfDays,
          "totalWinnings": res.payload.result.totalWinnings,
          "tournamentsPlayed": res.payload.result.tournamentsPlayed,
          "averageTournamentWinnings": res.payload.result.averageTournamentWinnings,
          "totalCashout": res.payload.result.totalCashout
        }))
        return {
          data: dataWithSNo as any[],
        }
      } else {
        return {
          data: []
        }
      }
      
    }
    // const res = await dispatch(findPlayersReportDateFilter({
    //   ...values,
    //   limit: 0,
    //   skip: 0
    // }))
    // console.log("res====== ", res);
    // const dataWithSNo = res.payload.result.map((item: any, index: any) => ({
    //   ...item,
    //   'stt': index + 1,
    //   'name': `${item.firstName} ${item.lastName}`
    // }))
    // return {
    //   data: dataWithSNo as any[],
    // }
  }

  return (
    <TableReportPLayerReport
      title='Player report'
      columns={columns}
      filterFields={FilterFields}
      getData={getData}
      firstLoad={false}
      tableProps={{
        pagination: undefined
      }}
    />
  )
}

export default Page;