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
import { countlistRakeDataForRakeReport, countRakeDataForRakeReportAffiliate, listRakeDataForRakeReportAffiliate, listRakeDataRakeReport } from '../store/action';
import dayjs from '@/core/dayjs';
import { Note } from '@/components/shared/note/Note';
import { formatNumber } from '@/helpers/number';
// import { countDataInPlayerBonusReport, countDataInPlayerLoyalityPointsReport, listDataInPlayerBonusReport, listDataInPlayerLoyalityPointsReport } from '../../store/action';
import { getCurrentUserData } from "@/helpers/common";

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
    title: 'Agent',
    dataIndex: 'debitToAffiliatename'
  },
  {
    title: 'Sub-Agent',
    dataIndex: 'debitToSubaffiliatename'
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
    title: 'Rake to Agent',
    dataIndex: 'debitToAffiliateamount'
  },
  {
    title: 'Rake to Sub-Agent',
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
  const [user, setUser] = useState<any>({});
  const [isSubAffiliate, setIsSubAffiliate] = useState(false);
  const [userLevel, setUserLevel] = useState("");

  const defaultValue = {
    keyForRakeModules: true,
    // startDate: dayjs().subtract(24, 'hour').valueOf(),
    // endDate: dayjs().valueOf(),
    sortValue: 'addeddate'
  }

  
  useEffect(() => {
    const currentUser = getCurrentUserData();
    if (currentUser.role.level === -1) {
      setIsSubAffiliate(true);
    }
    setUserLevel(currentUser.role.name)
  }, [])

  const getData = async (values: any) => {
    const res = await dispatch(listRakeDataForRakeReportAffiliate({
      ...defaultValue,
      ...values,
    }));
    const dataWithNo = res.payload.result.map((item: any, index: number) => ({
      ...item,
      'NO.': index + 1,
      'displayName': displayName(item.rakeByName, item.rakeByUsername),
      'displayMegaCircle': displayMegaCircle(item.megaCircle),
      'displayDebitToAffiliatename': displayDebitToAffiliatename(item.debitToAffiliatename),
      'displayAddDate': displayAddDate(item.addeddate),
      'debitToSubaffiliateamount': debitToSubaffiliateamount(item.debitToSubaffiliateamount),
      'debitToSubaffiliatename': debitToSubaffiliatename(item.debitToSubaffiliatename),
    }))
    setResult({
      ...res.payload,
      result: undefined
    })
    return {
      // data: res.payload.result as any[],
      data: dataWithNo
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

  const debitToSubaffiliateamount = (debitToSubaffiliateamount: any) => {
    return debitToSubaffiliateamount != null ? debitToSubaffiliateamount : '-'
  }

  const debitToSubaffiliatename = (debitToSubaffiliatename: any) => {
    return debitToSubaffiliatename != null ? debitToSubaffiliatename : '-'
  }

  const getTotal = async (values: any) => {
    return dispatch(countRakeDataForRakeReportAffiliate({
      ...defaultValue,
      ...values,
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
        placeholder: 'Sort by',
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
        <div className="bonus-transfer-history-content__note">
          {/* <Note
            content={currentUser.department === "subAffiliate" || currentUser.department === "newsubAffiliate" ?
              `Total Rake to Sub-Agent: ${formatNumber(result.totalRakeSubAffiliate || 0) || 0}` : 
              `Total Rake to Affiliate: ${formatNumber(result.totalRakeAffiliate || 0) || 0}` }
            type="info"
              // currentUser.department === "subAffiliate" 
              //   ? `Total Rake to Sub-Agent: ${formatNumber(result.totalRakeSubAffiliate || 0) || 0}`
              //   : currentUser.department === "affiliate" 
              //   ? `Total Rake to Agent: ${formatNumber(result.totalRakeAffiliate || 0) || 0}`
              //   : currentUser.department !== "affiliate"
              //   ? `Total Rake to Affiliate: ${formatNumber(result.totalRakeAffiliate || 0) || 0}`
              //   : currentUser.department !== "subAffiliate" || currentUser.department === "newsubAffiliate"
              //   ? `Total Rake to sub-Affiliate: ${formatNumber(result.totalRakeSubAffiliate || 0) || 0}`
              //   : ``
          /> */}
          <Note
            content={
              !isSubAffiliate && userLevel == "affiliate" 
              ? `Total Rake to Agent: ${formatNumber(result.totalRakeAffiliate || 0) || 0}`
              : !isSubAffiliate && userLevel != 'affiliate'
              ? `Total Rake to Affiliate: ${formatNumber(result.totalRakeAffiliate || 0) || 0}`
              : isSubAffiliate && userLevel == 'subAffiliate'
              ? `Total Rake to Sub-Agent: ${formatNumber(result.totalRakeSubAffiliate || 0) || 0}`
              : isSubAffiliate && userLevel != 'subAffiliate'
              ? `Total Rake to sub-Affiliate: ${formatNumber(result.totalRakeSubAffiliate || 0) || 0}`
              : ``
            }
            type="info"
          />
        </div>
      }
    />
  )
};
export default Page;