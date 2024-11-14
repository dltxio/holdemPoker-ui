import { useEffect, useMemo, useRef, useState } from 'react';
import { FormInstance } from 'antd';

// import './PlayerChipsReport.scss';
import TableReport from '@/components/table-report/TableReport';
import { FilterInputType, FilterItem } from '@/components/shared/filter/Filter';
import { useAppDispatch } from '@/store/hooks';
import { TableColumnType } from '@/components/shared/table/Table';
import { CardInfo } from '@/components/shared/card-info/CardInfo';
import { Ribbon } from '@/components/shared/ribbon/Ribbon';
import DisplayNumber from '@/components/shared/DisplayNumber';
import { countlistRakeDataByDate, countlistRakeDataForRakeReport, listRakeDataAffiliatesByDate, listRakeDataPlayerByDate, listRakeDataRakeReport, countRake } from '../store/action';
import dayjs from '@/core/dayjs';
import { Note } from '@/components/shared/note/Note';
import { formatNumber } from '@/helpers/number';
// import { countDataInPlayerBonusReport, countDataInPlayerLoyalityPointsReport, listDataInPlayerBonusReport, listDataInPlayerLoyalityPointsReport } from '../../store/action';


const columns: TableColumnType[] = [
  {
    title: 'S No.',
    dataIndex: 'NO.'
  },
  {
    title: 'Name',
    dataIndex: 'userName'
  },
  {
    title: 'User Type',
    dataIndex: 'userType'
  },
  {
    title: 'Total Rake Generated',
    dataIndex: 'totalRake'
  }
]

type Props = {
  userTypeOptions?: any[],
  isParentUserName?: string,
  parentUser?: string,
  userNamePlaceHolder?: string,
  isAff?: boolean
}

const Page = ({ isParentUserName, parentUser, isAff, ...props }: Props) => {
  const dispatch = useAppDispatch();
  const formRef = useRef<FormInstance>(null);
  const [result, setResult] = useState<any>({});

  const defaultValue = {
    keyForRakeModules: true,
    filter: 'players'
    // startDate: dayjs().subtract(24, 'hour').valueOf(),
    // endDate: dayjs().valueOf(),
    // sortValue: 'addeddate'
  }

  const getData = async ({ searchDate, ...values }: any) => {
    const filter = values.filter || defaultValue.filter;
    if (filter === 'players') {
      const res = await dispatch(listRakeDataPlayerByDate({
        ...defaultValue,
        isParentUserName, parentUser,
        ...values,
        addeddate: searchDate ? dayjs(searchDate).valueOf() : undefined
      }));
      const rakeTotal: any = await dispatch(countRake({
        ...defaultValue,
        isParentUserName, parentUser,
        ...values,
        addeddate: searchDate ? dayjs(searchDate).valueOf() : undefined
      }));
      const dataWithNo = res.payload.playersArray.map((item: any, index: number) => ({
        ...item,
        'NO.': index + 1
      }))
      setResult({
        ...res.payload,
        result: undefined,
        totalRake: res.payload.playersArray.reduce((acc: any, val: any) => acc + val.totalRake, 0),
        // totalRake1: rakeTotal.payload.totalRake
        totalRake1: rakeTotal.payload.playersArray.reduce((acc: any, val: any) => acc + val.totalRake, 0),
      })
      return {
        // data: res.payload.playersArray as any[],
        data: dataWithNo
      }
    } else {
      const res = await dispatch(listRakeDataAffiliatesByDate({
        ...defaultValue,
        isParentUserName, parentUser,
        ...values,
        addeddate: searchDate ? dayjs(searchDate).valueOf() : undefined
      }));
      const dataWithNo = res.payload.affiliatesArray.map((item: any, index: number) => ({
        ...item,
        'NO.': index + 1
      }))
      setResult({
        ...res.payload,
        result: undefined
      })
      return {
        // data: res.payload.affiliatesArray as any[],
        data: dataWithNo
      }
    }
  }

  const getTotal = async ({searchDate, ...values}: any) => {
    return dispatch(countlistRakeDataByDate({
      ...defaultValue,
      isParentUserName, parentUser,
      ...values,
      limit: undefined,
      skip: undefined,
      addeddate: searchDate ? dayjs(searchDate).valueOf() : dayjs().startOf('D').valueOf()
    })).then(res => res.payload)
  }

  const FilterFields: FilterItem[] = useMemo(() => ([
    {
      name: 'searchDate',
      type: FilterInputType.Date,
      rules: [
        {required: true, message: 'Date is required'}
      ],
      inputProps: {
        placeholder: 'Start date',
      },
    },
    {
      name: 'filter',
      type: FilterInputType.Select,
      inputProps: {
        placeholder: 'User type',
        options: props.userTypeOptions ? props.userTypeOptions : [
          {
            label: 'Players',
            value: 'players'
          },
          {
            label: 'Agent/Sub-agent',
            value: 'affiliates'
          }
        ]
      }
    },
    {
      name: 'filterPlayer',
      type: FilterInputType.Input,
      rules: isAff ? [] : [
        {required: true, message: 'Player ID is required'}
      ],
      inputProps: {
        placeholder: props.userNamePlaceHolder ? props.userNamePlaceHolder : 'Player ID / Agent ID',
      }
    },
  ]), [formRef.current])

  return (
    <TableReport
      title='Rake Commission Summary by Date'
      formRef={formRef}
      columns={columns}
      filterFields={FilterFields}
      getData={getData}
      getTotal={getTotal}
      firstLoad={true}
      pageSize={20}
      description={
        <div className="bonus-transfer-history-content__note">
          <Note
            content={`Total Rake Generated: ${defaultValue.filter === 'players' ? formatNumber(result.totalRake1 || 0) : formatNumber(result.totalRake || 0)}`}
            type="info"
          />
        </div>
      }
    />
  )
};
export default Page;