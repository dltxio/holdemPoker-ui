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
import { countlistRakeDataByCashTable, listRakeDataAffiliatesByPlayerOrAffiliate, listRakeDataByCashTable, listRakeDataPlayerByPlayerOrAffiliate } from '../store/action';
import dayjs from '@/core/dayjs';
import { Note } from '@/components/shared/note/Note';
import { formatNumber } from '@/helpers/number';
import { listAllCashTable } from '@/modules/customer-support/store/action';
// import { countDataInPlayerBonusReport, countDataInPlayerLoyalityPointsReport, listDataInPlayerBonusReport, listDataInPlayerLoyalityPointsReport } from '../../store/action';

const columns: TableColumnType[] = [
  {
    title: 'S No.',
    dataIndex: 'NO.'
  },
  {
    title: 'Name',
    dataIndex: 'tableName'
  },
  {
    title: 'Date',
    dataIndex: 'displayDate'
  },
  {
    title: 'Rake Generated',
    dataIndex: 'dailyRake',
  }
]

const Page = () => {
  const dispatch = useAppDispatch();
  const formRef = useRef<FormInstance>(null);
  const [result, setResult] = useState<any>({});
  const [cashTables, setCashTables] = useState<any>([]);


  const defaultValue = {
    // keyForRakeModules: true,
    // filter: 'players'
    // startDate: dayjs().subtract(24, 'hour').valueOf(),
    // endDate: dayjs().valueOf(),
    // sortValue: 'addeddate'
  }

  // console.log('cashTables', cashTables)

  const loadCashTables = async () => {
    const res = await dispatch(listAllCashTable({}));
    setCashTables(res.payload || []);
  }

  useEffect(() => {
    loadCashTables();
  }, []);

  const getData = async ({ ...values }: any) => {
    const res = await dispatch(listRakeDataByCashTable({
      ...defaultValue,
      ...values,
      limit: 0,
      skip: 0,
      // addeddate: searchDate ? dayjs(searchDate).valueOf() : dayjs().startOf('D').valueOf()
    }));
    const dataWithNo = res.payload.result.map((item: any, index: number) => ({
      ...item,
      'NO.': index + 1,
      'displayDate': displayDate(item.date)
    }))
    setResult({
      ...res.payload,
      result: undefined
    });
    const tableName = cashTables.find((x: any) => x._id === values.tableId).channelName
    return {
      // data: (res.payload.result as any[]).map(item => ({
      //   ...item,
      //   displayDate: item.displayDate,
      //   tableName
      // })),
      data: (dataWithNo as any[]).map(item => ({
        ...item,
        displayDate: item.displayDate,
        tableName
      }))
    }
  }

  const displayDate = (date: number) => {
    return date && dayjs(date).format('DD-MM-YYYY HH:mm:ss') || 'IST';
  }

  const getTotal = async ({tableId, ...values}: any) => {
    return 0;
    // return dispatch(countlistRakeDataByCashTable({
    //   ...defaultValue,
    //   ...values,
    //   tableId,
    //   // tableName: cashTables.find((x: any) => x._id === tableId).channelName,
    //   limit: undefined,
    //   skip: undefined,
    // })).then(res => res.payload)
  }

  const FilterFields: FilterItem[] = useMemo(() => ([
    {
      name: 'startDate',
      type: FilterInputType.Date,
      inputProps: {
        placeholder: 'Start date',
      },
    },
    {
      name: 'endDate',
      type: FilterInputType.Date,
      inputProps: {
        placeholder: 'End date',
      },
    },
    {
      name: 'tableId',
      type: FilterInputType.Select,
      rules: [{required: true, message: 'Cash table is required'}],
      inputProps: {
        placeholder: 'Select cash table',
        options: cashTables.map((item: any) => ({
          label: item.channelName,
          value: item._id,
        })),
      }
    },
    // {
    //   name: 'userName',
    //   type: FilterInputType.Input,
    //   inputProps: {
    //     placeholder: 'Player ID / Agent ID'
    //   }
    // },
  ]), [formRef.current, cashTables])

  return (
    <TableReport
      title='Rake Commission Summary by Cash Table'
      formRef={formRef}
      columns={columns}
      filterFields={FilterFields}
      getData={getData}
      getTotal={getTotal}
      firstLoad={false}
      pageSize={20}
      description={
        <div className="bonus-transfer-history-content__note">
          <Note
            content={`Total Rake Generated: ${formatNumber(result.totalRake || 0) || 0}`}
            type="info"
          />
        </div>
      }
    />
  )
};
export default Page;