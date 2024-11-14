import { useEffect, useMemo, useRef, useState } from 'react';
import { FormInstance } from 'antd';

// import './PlayerChipsReport.scss';
import TableReport from '@/components/table-report/TableReport';
import { FilterInputType, FilterItem } from '@/components/shared/filter/Filter';
import { useAppDispatch } from '@/store/hooks';
import { TableColumnType } from '@/components/shared/table/Table';
import { listRakeDataByGameVariant, listRakeDataDatewise } from '../store/action';
import { Note } from '@/components/shared/note/Note';
import { formatNumber } from '@/helpers/number';
import { GameVariations } from '@/modules/game/models/Table';
import dayjs from '@/core/dayjs'
// import { countDataInPlayerBonusReport, countDataInPlayerLoyalityPointsReport, listDataInPlayerBonusReport, listDataInPlayerLoyalityPointsReport } from '../../store/action';
import { getLocalUser } from "../../auth/store/action";

const columns: TableColumnType[] = [
  {
    title: 'S No.',
    dataIndex: 'NO.'
  },
  {
    title: 'Agent/Sub-Agent Name',
    dataIndex: 'userName'
  },
  {
    title: 'Parent Agent',
    dataIndex: 'parentUser'
  },
  {
    title: 'Rake Commission(%)',
    dataIndex: 'rakeCommision'
  },
  {
    title: 'Rake Generated',
    dataIndex: 'dailyAllRake',
  },
  {
    title: 'Rake Commission',
    dataIndex: 'dailyRake',
  },
  {
    title: 'Date',
    dataIndex: 'displayDate',
  }
]
type Props = {
  userTypeOptions?: any[],
  isParentUserName?: string,
  parentUser?: string,
  userNamePlaceHolder?: string,
  isAff?: boolean
  description?: any
}

const Page = ({ isParentUserName, parentUser, isAff, ...props }: Props) => {
  const dispatch = useAppDispatch();
  const formRef = useRef<FormInstance>(null);
  const [result, setResult] = useState<any>({});
  const [userId, setUserId] = useState("");
  const roleUser: any = getLocalUser();
  console.log("roleUser: ", roleUser);

  let defaultValue: any = {
    filter: "affiliates"
  }

  useEffect(() => {
    if (roleUser.data.role.level < 0) {
      setUserId(roleUser.data.userName)
    }
  }, [])
  
  const getData = async ({ ...values }: any) => {
    // if (roleUser?.data?.role?.level < 0) {
    //   defaultValue.filter = "self";
    //   userId = roleUser?.data?.userName;
    // }
    // if (userId && (userId.toUpperCase() == roleUser.data.userName.toUpperCase())) {
    //   defaultValue.filter = "self"
    // }
    // if (defaultValue.filter === "affiliates") {
    //   defaultValue.filterAffiliate = roleUser?.data?.userName;
    // }
    let valueData: any = {};

    valueData.containsFilters = false;

    if (values.startDate) {
      valueData.startDate = values.startDate;
    }

    if (values.endDate) {
      valueData.endDate = values.endDate;
    }

    if (userId) {
      valueData.filterAffiliate = userId
    }

    if(values.minRake){
      valueData.containsFilters = true;
      valueData.minRake = values.minRake;
    }

    if(values.maxRake){
      valueData.containsFilters = true;
      valueData.maxRake = values.maxRake;
    }

    if(values.minCommission){
      valueData.containsFilters = true;
      valueData.minCommission = values.minCommission;
    }

    if(values.maxCommission){
      valueData.containsFilters = true;
      valueData.maxCommission = values.maxCommission;
    }

    if(values.minCommissionPercent){
      valueData.containsFilters = true;
      valueData.minCommissionPercent = values.minCommissionPercent;
    }

    if(values.maxCommissionPercent){
      valueData.containsFilters = true;
      valueData.maxCommissionPercent = values.maxCommissionPercent;
    }

    if (roleUser.data.role.level <= 0) {
      valueData.parentUser = roleUser.data.userName;
    }

    valueData.filter = "affiliates";

    if (userId && (userId.toUpperCase() === parentUser?.toUpperCase())) {
      valueData.filter = 'self';
    }
    
    // const res = await dispatch(listRakeDataDatewise({
    //   ...defaultValue,
    //   containsFilters: false,
    //   parentUser,
    //   ...values,
    //   // limit: 0,
    //   // skip: 0,
    //   // addeddate: searchDate ? dayjs(searchDate).valueOf() : dayjs().startOf('D').valueOf()
    // }));
    const res = await dispatch(listRakeDataDatewise({
      ...valueData,
      // limit: 0,
      // skip: 0,
      // addeddate: searchDate ? dayjs(searchDate).valueOf() : dayjs().startOf('D').valueOf()
    }));
    let sum=0;
    let k = 0;
    let sum1=0;
    const data = [];
    const result = res.payload.result;
    console.log("result======+ ", result);
    for(var i=0; i<result.length; i++){
      if (result[i].dailyRakeData) {
        for(var j=0; j<result[i].currentMonthRakeData.length; j++){
          console.log("j: ", result[i].currentMonthRakeData[j]);
          data[k] = result[i].currentMonthRakeData[j];
          data[k].rakeCommision = result[i].rakeCommision;
          data[k].userName = result[i].userName;
          data[k].parentUser = result[i].parentUser;
          data[k].displayDate = dayjs(data[k].date).format('DD-MM-YYYY');
          // sum = sum + result[i].dailyRakeData[j].dailyRake;
          sum = sum + result[i].dailyRakeData[j].dailyRake;
          data[k].dailyAllRake = result[i].dailyRakeData[j].dailyAllRake;
          sum1 = sum1 + result[i].dailyRakeData[j].dailyRake;
          data[k].dailyRake = result[i].dailyRakeData[j].dailyRake;
          k++;
        }
      } else {
        const newData: any = {
          rakeCommision: result[i].rakeCommision,
          userName: result[i].userName,
          parentUser: result[i].parentUser,
          dailyAllRake: 0,
          dailyRake: 0,
          displayDate: "N/A"
          // displayDate: dayjs(data[k].date).format('DD-MM-YYYY')
        };
        data.push(newData);
      }
    }
    const totalRake = sum.toFixed(2);
    console.log("totalRake: ", totalRake);
    setResult({
      ...res.payload,
      totalRake,
      result: undefined
    });
    const dataWithNo = data.map((item: any, index: number) => ({
      ...item,
      'NO.': index + 1
    }))
    return {
      data: data,
      // data: result
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
      name: 'userId',
      type: FilterInputType.Input,
      // rules: [{required: true, message: 'Cash table is required'}],
      inputProps: {
        placeholder: 'Agent ID / Sub-agent ID',
      }
    },
    {
      name: 'minRake',
      type: FilterInputType.Input,
      // rules: [{required: true, message: 'Cash table is required'}],
      inputProps: {
        placeholder: 'Min. Rake Generated',
      }
    },
    {
      name: 'maxRake',
      type: FilterInputType.Input,
      // rules: [{required: true, message: 'Cash table is required'}],
      inputProps: {
        placeholder: 'Max. Rake Generated',
      }
    },
    {
      name: 'minCommission',
      type: FilterInputType.Input,
      // rules: [{required: true, message: 'Cash table is required'}],
      inputProps: {
        placeholder: 'Min. Commission',
      }
    },
    {
      name: 'maxCommission',
      type: FilterInputType.Input,
      // rules: [{required: true, message: 'Cash table is required'}],
      inputProps: {
        placeholder: 'Max. Commission',
      }
    },
    {
      name: 'minCommissionPercent',
      type: FilterInputType.Input,
      // rules: [{required: true, message: 'Cash table is required'}],
      inputProps: {
        placeholder: 'Min. Commission%',
      }
    },
    {
      name: 'minCommissionPercent',
      type: FilterInputType.Input,
      // rules: [{required: true, message: 'Cash table is required'}],
      inputProps: {
        placeholder: 'Max. Commission%',
      }
    },
  ]), [formRef.current])

  return (
    <TableReport
      title='Rake Commission Summary Datewise'
      formRef={formRef}
      columns={columns}
      filterFields={FilterFields}
      getData={getData}
      getTotal={getTotal}
      firstLoad={true}
      pageSize={20}
      // description={
      //   props.description ? props.description :
      //   <div className="bonus-transfer-history-content__note">
      //     <strong>
      //       *Rake Generated : This amount is the total rake generated by all the players playing under that agent and his sub-agents, and in case of sub-agent, total rake generated by his players only.
      //     </strong>
      //     <br/>
      //     <strong>*Rake Commission : This amount is the rake commission earned by that agent or sub-agent.</strong>

      //     <Note
      //       content={`Total Rake Generated: ${formatNumber(result.totalRake || 0)}`}
      //     />
      //   </div>
      // }
      description={
        props.description ? (
          <>
            {props.description}
            <Note
              content={`Total Rake Generated: ${formatNumber(result.totalRake || 0)}`}
            />
          </>
        ) : (
          <div className="bonus-transfer-history-content__note">
            <strong>
              *Rake Generated : This amount is the total rake generated by all the players playing under that agent and his sub-agents, and in case of sub-agent, total rake generated by his players only.
            </strong>
            <br/>
            <strong>*Rake Commission : This amount is the rake commission earned by that agent or sub-agent.</strong>

            <Note
              content={`Total Rake Generated: ${formatNumber(result.totalRake || 0)}`}
            />
          </div>
        )
      }
    />
  )
};
export default Page;