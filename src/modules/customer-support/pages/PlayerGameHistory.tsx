import { FilterInputType, FilterItem } from "@/components/shared/filter/Filter"
import { TableColumnType } from "@/components/shared/table/Table"
import TableReport from "@/components/table-report/TableReport"
import { useAppDispatch } from "@/store/hooks"
import { FormInstance } from "antd"
import { useEffect, useRef, useState } from "react"
import { ICashTable } from "../interfaces/CashTable.interface"
import { ChipTypes, GameVariation } from "../models/PlayerGameHistory"
import { countPlayerGameHistory, listAllCashTable, listPlayerGameHistory } from "../store/action"
import dayjs from "dayjs"

const columns: TableColumnType[] = [
  {
    title: 'S No.',
    dataIndex: 'NO.'
  },
  {
    title: 'Table Name',
    dataIndex: 'channelName'
  },
  {
    title: 'Game Started At',
    dataIndex: 'gameStartTime'
  },
  {
    title: 'Game Variation',
    dataIndex: 'channelVariation'
  },
  {
    title: 'Stakes',
    dataIndex: 'stakes'
  },
  {
    title: 'Total Pot Amount',
    dataIndex: 'totalPotAmount'
  },
  {
    title: 'Refund Amount',
    dataIndex: 'refundAmount'
  },
  {
    title: 'Player Cards',
    dataIndex: 'playerCardsString'
  },
  {
    title: 'Chips At Beginning',
    dataIndex: 'chipsAtBegin'
  },
  {
    title: 'Seat Index',
    dataIndex: 'seatIndex'
  },
  {
    title: 'Player Chips',
    dataIndex: 'playerChips'
  },
  {
    title: 'Total Players',
    dataIndex: 'totalPlayers'
  },
  {
    title: 'Community Cards',
    dataIndex: 'communityCardsString'
  },
  {
    title: 'Winning Amount',
    dataIndex: 'winningAmount'
  },
  {
    title: 'Game Winners',
    dataIndex: 'allGameWinners'
  },
  {
    title: 'Winners Hand-strength',
    dataIndex: 'winnersHandStrength'
  },
  {
    title: 'Player IP',
    dataIndex: 'playerIp'
  },
  {
    title: 'Player Device Type',
    dataIndex: 'playerDeviceType'
  },
  {
    title: 'Cards Folded At',
    dataIndex: 'cardsFoldStage'
  },
  {
    title: 'Left Table At',
    dataIndex: 'leftTableStage'
  },
  {
    title: 'Rake Deducted',
    dataIndex: 'rakeDeducted'
  },
  {
    title: 'Auto Buy',
    dataIndex: 'autoBuy'
  },
  {
    title: 'Chips Added',
    dataIndex: 'chipsAdded'
  },
  {
    title: 'Run It Twice',
    dataIndex: 'runItTwiceStr'
  },
  {
    title: 'Straddle',
    dataIndex: 'straddleStr'
  },
  {
    title: 'Auto Muck',
    dataIndex: 'autoMuckStr'
  },
  {
    title: 'Hand ID',
    dataIndex: 'roundNumber'
  },
]

const Page = () => {
  const dispatch = useAppDispatch()
  const formRef = useRef<FormInstance>(null)
  const [filterFields, setFilterFields] = useState([])
  const [cashTable,setCashTable] = useState<ICashTable[]>([])
  const getData = async (values: any) => {
    const cash = cashTable.find(x=>x._id === values.channelName)
    const variation = GameVariation.find(x=>x.value === values.channelVariation)
    const res = await dispatch(listPlayerGameHistory({
      ...values,
      channelName: cash?.channelName,
      channelVariation: variation?.label || '',
    }))
    const dataWithNo = res.payload.map((item: any, index: number) => ({
      ...item,
      'NO.': index + 1,
      'channelName': table(item.rawResponse),
      'gameStartTime': gameStartTime(item.rawResponse),
      'channelVariation': channelVariation(item.rawResponse),
      'stakes': stakes(item.rawResponse),
      'roundNumber': roundNumber(item.rawResponse),
      'autoBuy': autoBuy(item.autoReBuy),
      'runItTwiceStr': runItTwiceStr(item.runItTwice),
      'straddleStr': straddleStr(item.straddle),
      'autoMuckStr': autoMuckStr(item.autoMuck),
      'playerCardsString': item.playerCardsString || "",
      "chipsAtBegin": item.chipsAtBegin || "",

    }))
    console.log(res)
    return {
      // data: res.payload as any[],
      data: dataWithNo as any[]
    }
  }

  const table = (rawResponse: any) =>{
    return rawResponse?.params?.table?.channelName
  }
  const channelName = (table: any) =>{
      return table?.channelName
  }

  const gameStartTime = (rawResponse: any) => {
      const time = rawResponse?.params?.table?.gameStartTime || new Date()
      return dayjs(time).format('DD-MMM-YYYY HH:mm:ss')
  }
  const channelVariation = (rawResponse: any) =>{
      return rawResponse?.params?.table?.channelVariation
  }
  const stakes = (rawResponse: any) => {
      return `${rawResponse?.params?.table?.smallBlind}/${rawResponse?.params?.table?.bigBlind}`
  }
  const roundNumber = (rawResponse: any) => {
      return rawResponse?.params?.table?.roundNumber
  }
  const autoBuy = (autoReBuy: any) => {
      return autoReBuy?.toString() || ""
  }
  const runItTwiceStr = (runItTwice: any) => {
      return runItTwice?.toString() || ""
  }
  const straddleStr = (straddle: any) => {
      return straddle?.toString() || ""
  }
  const autoMuckStr = (autoMuck: any) =>{
      return autoMuck?.toString() || ""
  }

  const getTotal = (values: any) => {
    const cash = cashTable.find(x=>x._id === values.channelName)
    const variation = GameVariation.find(x=>x.value === values.channelVariation)
    return dispatch(countPlayerGameHistory({
      ...values,
      channelName: cash?.channelName,
      channelVariation: variation?.label || '',
    })).then(res => res.payload)
  }

  const getAllCashTable = async () =>{
    const res = await dispatch(listAllCashTable({}))
    const listCashTable = res?.payload?.map((cash: ICashTable)=>({
      value: cash._id,
      label: cash.channelName
    }))
    setCashTable(res?.payload)
    const fields = [
      {
        name: 'userName',
        type: FilterInputType.Input,
        inputProps: {
          placeholder: 'Player ID'
        }
      },
      {
        name: 'isRealMoney',
        type: FilterInputType.Select,
        inputProps: {
          placeholder: 'Chips Type',
          options: ChipTypes
        }
      },
      {
        name: 'channelVariation',
        type: FilterInputType.Select,
        inputProps: {
          placeholder: 'Player Status',
          options: GameVariation
        }
      },
      {
        name: 'channelName',
        type: FilterInputType.Select,
        inputProps: {
          placeholder: 'Select Table',
          options: listCashTable
        }
      },
      {
        name: 'roundId',
        type: FilterInputType.Input,
        inputProps: {
          placeholder: 'Hand ID'
        }
      },
      {
        name: 'startDate',
        type: FilterInputType.Date,
        label: 'Start Time:',
        inputProps: {
          placeholder: 'Start Time',
          picker:'date',
          // showTime: true
        }
      },
      {
        name: 'endDate',
        type: FilterInputType.Date,
        label: 'End Time:',
        inputProps: {
          placeholder: 'End Time',
          picker:'date',
          // showTime: true
        }
      },
    ] as any

    setFilterFields(fields)

  }
  useEffect(() => {
    getAllCashTable()
  },[])
  return (
    filterFields?.length > 0 && <TableReport
      title='Player Game History'
      formRef={formRef}
      columns={columns}
      filterFields={filterFields}
      getData={getData}
      getTotal={getTotal}
      firstLoad={false}
      pageSize={20}
    />
  )
}

export default Page;