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
import { countlistRakeDataForRakeReport, listRakeDataRakeReport } from '../store/action';
import dayjs from '@/core/dayjs';
// import { countDataInPlayerBonusReport, countDataInPlayerLoyalityPointsReport, listDataInPlayerBonusReport, listDataInPlayerLoyalityPointsReport } from '../../store/action';


const columns: TableColumnType[] = [
  {
    title: 'S No.',
    dataIndex: 'NO.'
  },
  {
    title: 'Player name (Player Id)',
    dataIndex: 'displayName'
  },
  {
    title: 'Affiliate / Agent',
    dataIndex: 'displayDebitToAffiliatename'
  },
  {
    title: 'Rake Generated',
    dataIndex: 'amount'
  },
  {
    title: 'Rake to Admin',
    dataIndex: 'debitToCompany'
  },
  {
    title: 'Rake to Affiliate',
    dataIndex: 'debitToAffiliateamount'
  },
  {
    title: 'Rake to Sub-Affiliate',
    dataIndex: 'debitToSubaffiliateamount'
  },
  {
    title: 'Cash Table',
    dataIndex: 'channelName'
  },
  {
    title: 'Date/Time',
    dataIndex: 'displayAddDate'
  }
]

const Page = () => {
  const dispatch = useAppDispatch();
  const formRef = useRef<FormInstance>(null);
  const [result, setResult] = useState<any>({});

  const defaultValue = {
    keyForRakeModules: true,
    startDate: dayjs().subtract(24, 'hour').valueOf(),
    endDate: dayjs().valueOf(),
    sortValue: 'addeddate'
  }

  const getData = async (values: any) => {
    const startDate = values.startDate
    const endDate = values.endDate
    console.log("values: ", values);
    const res = await dispatch(listRakeDataRakeReport({
      // ...defaultValue,
      ...values,
      startDate,
      endDate,
    }));
    if (res.payload.result.length > 0) {
      const dataWithNo = res.payload.result.map((item: any, index: number) => ({
        ...item,
        'NO.': index + 1,
        'displayName': displayName(item.rakeByName, item.rakeByUsername),
        'displayMegaCircle': displayMegaCircle(item.megaCircle),
        'displayDebitToAffiliatename': displayDebitToAffiliatename(item.debitToAffiliatename),
        'displayAddDate': displayAddDate(item.addeddate)
      }))
      setResult({
        ...res.payload,
        result: undefined
      })
      return {
        // data: res.payload.result as any[],
        data: dataWithNo
      }
    } else {
      return {
        // data: res.payload.result as any[],
        data: []
      }
    }
  }

  const displayName = (rakeByName: any, rakeByUsername: any) => {
    return `${rakeByName} (${rakeByUsername})`;
  }

  const displayMegaCircle = (megaCircle: any) => {
    if(megaCircle == 1){
      return 'Bronze';    
    }
    if(megaCircle == 2){
      return 'Chrome';    
    }
    if(megaCircle == 3){
      return 'Silver';    
    }
    if(megaCircle == 4){
      return 'Gold';    
    }
    if(megaCircle == 5){
      return 'Diamond';    
    }
    if(megaCircle == 6){
      return 'Platinum';    
    }
  }

  const displayDebitToAffiliatename = (debitToAffiliatename: any) => {
    return debitToAffiliatename || '-';
  }

  const displayAddDate = (addeddate: any) => {
    return addeddate && dayjs(addeddate).format('DD-MM-YYYY HH:mm:ss') || 'IST';
  }

  const getTotal = async (values: any) => {
    const startDate = values.startDate
    const endDate = values.endDate
    return dispatch(countlistRakeDataForRakeReport({
      // ...defaultValue,
      ...values,
      startDate,
      endDate,
      limit: undefined,
      skip: undefined
    })).then(res => res.payload)
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
        placeholder: 'End date'
      }
    },
    {
      name: 'sortValue',
      type: FilterInputType.Select,
      inputProps: {
        placeholder: 'Sort by Date',
        options: [
          {
            label: 'Sort by Date',
            value: 'addeddate'
          },
          {
            label: 'Sort by Amount',
            value: 'amount'
          }
        ]
      }
    },
    {
      name: 'rakeByUsername',
      type: FilterInputType.Input,
      inputProps: {
        placeholder: 'User Name'
      }
    },
  ]), [formRef.current])

  return (
    <TableReport
      title='Rake Commission Report'
      formRef={formRef}
      columns={columns}
      filterFields={FilterFields}
      getData={getData}
      getTotal={getTotal}
      firstLoad={true}
      description={
        <div className='row'>
          <div className='col'>
            <Ribbon
              type="info"
              title="Total rake"
              content={<DisplayNumber value={result.totalRake || 0}/>}
            />
          </div>
          <div className='col'>
            <Ribbon
              type="info"
              title="Admin rake"
              content={<DisplayNumber value={result.totalRakeToAdmin || 0}/>}
            />
          </div>
          <div className='col'>
            <Ribbon
              type="info"
              title="Affiliate rake"
              content={<DisplayNumber value={result.totalRakeToAffiliate || 0}/>}
            />
          </div>
          <div className='col'>
            <Ribbon
              type="info"
              title="Sub-aff rake"
              content={<DisplayNumber value={result.totalRakeToSubAffiliate || 0}/>}
            />
          </div>
        </div>
      }
    />
  )
};
export default Page;