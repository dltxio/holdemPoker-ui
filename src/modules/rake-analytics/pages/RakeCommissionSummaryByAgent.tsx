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
import { listRakeDataAffiliatesByPlayerOrAffiliate, listRakeDataPlayerByPlayerOrAffiliate } from '../store/action';
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
    title: 'Date',
    dataIndex: 'displayDate'
  },
  {
    title: 'Rake Generated',
    dataIndex: 'DailyRake',
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
  const [totalRake, setTotalRake] = useState(0);

  const defaultValue = {
    keyForRakeModules: true,
    filter: 'players'
    // startDate: dayjs().subtract(24, 'hour').valueOf(),
    // endDate: dayjs().valueOf(),
    // sortValue: 'addeddate'
  }

  useEffect(() => {
    formRef.current?.setFieldValue('filter', defaultValue.filter);
  }, [])

  const getData = async ({ searchDate, userName, ...values }: any) => {
    const filter = values.filter || defaultValue.filter;
    if (filter === 'players') {
      const res = await dispatch(listRakeDataPlayerByPlayerOrAffiliate({
        ...defaultValue,
        ...values,
        filterPlayer: userName,
        // addeddate: searchDate ? dayjs(searchDate).valueOf() : dayjs().startOf('D').valueOf()
      }));
      const dataWithNo = res.payload.result.map((item: any, index: number) => ({
        ...item,
        'NO.': index + 1,
        'displayDate': displayDate(item.date),
        'DailyRake': dailyRake(item.dailyRake, item.dailyAllRake)
      }));
      setResult({
        ...res.payload,
        result: undefined
      })
      return {
        // data: res.payload.result as any[],
        data: dataWithNo
      }
    } else {
      const res = await dispatch(listRakeDataAffiliatesByPlayerOrAffiliate({
        ...defaultValue,
        ...values,
        filterAffiliate: userName,
        // addeddate: searchDate ? dayjs(searchDate).valueOf() : dayjs().startOf('D').valueOf()
      }));
      const dataWithNo = res.payload.result.map((item: any, index: number) => ({
        ...item,
        'NO.': index + 1,
        'displayDate': displayDate(item.date),
        'DailyRake': dailyRake(item.dailyRake, item.dailyAllRake)
      }));
      setResult({
        ...res.payload,
        result: undefined
      })
      return {
        // data: res.payload.result as any[],
        data: dataWithNo
      }
    }
  }

  const displayDate = (date: any) => {
    return date && dayjs(date).format('DD-MM-YYYY HH:mm:ss') || 'IST';
  }

  const dailyRake = (dailyRake: any, dailyAllRake: any) => {
    return dailyRake ? dailyRake : dailyAllRake
  }

  const getTotal = async ({searchDate, ...values}: any) => {
    return 0;
    // return dispatch(countlistRakeDataByDate({
    //   ...defaultValue,
    //   ...values,
    //   limit: undefined,
    //   skip: undefined,
    //   addeddate: searchDate ? dayjs(searchDate).valueOf() : dayjs().startOf('D').valueOf()
    // })).then(res => res.payload)
  }

  const FilterFields: FilterItem[] = useMemo(() => ([
    {
      name: 'startDate',
      type: FilterInputType.Date,
      rules: [
        {required: true, message: 'Start date is required'}
      ],
      inputProps: {
        placeholder: 'Start date',
      },
    },
    {
      name: 'endDate',
      type: FilterInputType.Date,
      rules: [
        {required: true, message: 'End date is required'}
      ],
      inputProps: {
        placeholder: 'End date',
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
      name: 'userName',
      rules: [
        {required: true, message: 'Start date is required'}
      ],
      type: FilterInputType.Input,
      inputProps: {
        placeholder: 'Player ID / Agent ID'
      }
    },
  ]), [formRef.current])

  return (
    <TableReport
      title='Rake Commission Summary by Agent/Player'
      formRef={formRef}
      columns={columns}
      filterFields={FilterFields}
      getData={getData}
      getTotal={getTotal}
      firstLoad={false}
      pageSize={100}
      // description={
      //   <div className="bonus-transfer-history-content__note">
      //     <Note
      //       content={`Total Rake Generated: ${formatNumber(result.totalRake || 0) || formatNumber(result.totalAllRake || 0)}`}
      //       type="info"
      //     />
      //   </div>
      // }
    />
  )
};
export default Page;