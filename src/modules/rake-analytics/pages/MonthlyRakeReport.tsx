import { useEffect, useMemo, useRef, useState } from 'react';
import { FormInstance } from 'antd';

// import './PlayerChipsReport.scss';
import TableReport from '@/components/table-report/TableReport';
import { FilterInputType, FilterItem } from '@/components/shared/filter/Filter';
import { useAppDispatch } from '@/store/hooks';
import { TableColumnType } from '@/components/shared/table/Table';
import { listRakeBackMonthlyReport } from '../store/action';
import dayjs from '@/core/dayjs';
// import { countDataInPlayerBonusReport, countDataInPlayerLoyalityPointsReport, listDataInPlayerBonusReport, listDataInPlayerLoyalityPointsReport } from '../../store/action';


const columns: TableColumnType[] = [
  {
    title: 'S No.',
    dataIndex: 'NO.'
  },
  {
    title: 'userName',
    dataIndex: '_id'
  },
  {
    title: 'state',
    dataIndex: 'state'
  },
  {
    title: 'Rake to Admin',
    dataIndex: 'totalAdminRake',
  },
  {
    title: 'Rake to Affiliate',
    dataIndex: 'totalAffRake',
  },
  {
    title: 'Rake to Sub-Affiliate',
    dataIndex: 'totalSubAffRake',
  },
  {
    title: 'GST',
    dataIndex: 'totalGst',
  }
]

const Page = () => {
  const dispatch = useAppDispatch();
  const formRef = useRef<FormInstance>(null);
  const [result, setResult] = useState<any>({});


  const defaultValue = {
    // keyForRakeModules: true,
    // filter: 'players'
    // startDate: dayjs().subtract(24, 'hour').valueOf(),
    // endDate: dayjs().valueOf(),
    // sortValue: 'addeddate'
  }

  const getData = async ({ month, parentUsername, ...values }: any) => {
    const selectedDate = dayjs(month);
    const startOfMonth = selectedDate.startOf('month');
    const res = await dispatch(listRakeBackMonthlyReport({
      ...defaultValue,
      ...values,
      addeddate: startOfMonth.valueOf(),
      name: parentUsername,
      limit: undefined,
      skip: undefined,
      // addeddate: searchDate ? dayjs(searchDate).valueOf() : dayjs().startOf('D').valueOf()
    }));
    setResult({
      ...res.payload,
      result: undefined
    });
    if (res.payload.result.length > 0) {
      const dataWithNo = res.payload.result.map((item: any, index: number) => ({
        ...item,
        'NO.': index + 1
      }))
      return {
        // data: (res.payload.result as any[] || []).map((item) => ({...item, state: item.state || 'N/A'})),
        data: (dataWithNo as any[] || []).map((item) => ({...item, state: item.state || 'N/A'}))
      }
    } else {
      return {
        data: []
      }
    }
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
      name: 'month',
      type: FilterInputType.Date,
      inputProps: {
        placeholder: 'Month',
        picker: 'month'
      },
    },
    {
      name: 'parentUsername',
      type: FilterInputType.Input,
      inputProps: {
        placeholder: 'Parent name',
      },
    },
    
  ]), [formRef.current])

  return (
    <TableReport
      title='Monthly Rake Report'
      formRef={formRef}
      columns={columns}
      type="secondary"
      filterFields={FilterFields}
      getData={getData}
      getTotal={getTotal}
      firstLoad={false}
      pageSize={20}
      // description={
      //   <div className="bonus-transfer-history-content__note">
      //     <Note
      //       content={`Total Rake Generated: ${formatNumber(result.totalRake || 0) || 0}`}
      //       type="info"
      //     />
      //   </div>
      // }
    />
  )
};
export default Page;