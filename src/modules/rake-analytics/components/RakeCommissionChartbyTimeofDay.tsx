import { Fragment, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { DatePicker, Form, FormInstance } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';

// Components
import { Breadcrumb } from '@/components/shared/breadcrumb/Breadcrumb';
import { Heading } from '@/components/shared/heading/Heading';

import './RakeCommissionReportChart.scss';
import Input from 'antd/lib/input/Input';
import { Line } from 'react-chartjs-2';
// import { useAppDispatch } from '@/store/hooks';
// import { findPlayerDataChart } from '../../store/action';
import { useBusyContext } from '@/components/shared/busy';
import ChartView from '@/components/chart-view/ChartView';
import { FilterInputType, FilterItem } from '@/components/shared/filter/FilterRakeAnalytics';
import { useAppDispatch } from '@/store/hooks';
import { generateRakeByTimeChart } from '../store/action';
import { Table } from '@/components/shared/table/Table';


export type RakeCommissionChartViewProps = {
  // title: string,
  // loadData: (values: any) => Promise<Array<{
  //   label: string,
  //   value: number
  // }>>
} 

const RakeCommissionChartbyTimeofDay = ({ }: RakeCommissionChartViewProps) => {
  const busy = useBusyContext();
  const formRef = useRef<FormInstance>(null);
  const [data, setData] = useState<any>(null);
  const d = useAppDispatch();

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
  ]), [formRef.current])

  const handleSubmit = async (values: any) => {
    // const valid = await formRef.current?.validateFields();
    // if (!valid) return {};
    console.log('sdfsd', values);
    try {
      busy.showBusy();
      const res = await d(generateRakeByTimeChart({...values}));
      // const res = await loadData({
      //   ...values,
      // });
      const data = [];
      console.log("*****************", res.payload.result);
      const result = res.payload.result;
      let  j = 1;
      for(let i = result.length-1; i>=0;i--){
          let tempObj: any = {};
          // tempObj.dailyRakeCurrentMonth = res.result.currentMonthRakeData[i].dailyAllRake;
          tempObj.label = new Date(result[i].date).getHours() + ":"+ new Date(result[i].date).getMinutes();
          if(new Date(result.date).getMinutes() == 0){
            tempObj.label = tempObj.day + "0";
          }
          tempObj.value = result[i].hourlyAllRake;
          // j = j + 1;
          data.push(tempObj);
        }
        setData({
          datasets: [
            {
              label: 'Rake',
              data: data.map((x) => x.value),
              // barThickness: 25,
              // maxBarThickness: 25,
              borderColor: 'rgb(253, 212, 0)',
              backgroundColor: 'rgb(253, 212, 0)'
            }
          ],
          labels: data.map((x) => `Rake on: ${x.label}`)
        })
        
      } finally {
        busy.hideBusy();
        return {};
      }
    }
  return (
    <>
      <ChartView
        title='Rake Commission Chart by Time of Day'
        filterFields={FilterFields}
        getData={handleSubmit}
        chartData={data}
        chart={() => (
          data && <Line
          data={data}
        /> || <></>
        )}
      />
    </>
  )
};

export default RakeCommissionChartbyTimeofDay;