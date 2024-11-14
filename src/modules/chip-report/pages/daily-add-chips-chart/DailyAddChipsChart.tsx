import { Fragment } from 'react';
import clsx from 'clsx';
import { DatePicker } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';

// Components
import { Breadcrumb } from '@/components/shared/breadcrumb/Breadcrumb';
import { Heading } from '@/components/shared/heading/Heading';

import './DailyAddChipsChart.scss';
import dayjs from '@/core/dayjs';
import { useAppDispatch } from '@/store/hooks';
import ChipReportChartView from '../../components/ChipReportChart';
import { dailyChipsChart } from '../../store/action';

const Page = () => {
  
  const dispatch = useAppDispatch();
  const handleLoadData = async (values: any) => {
    const res = await dispatch(dailyChipsChart({
      addeddate: values.date.utcOffset(0).startOf('month').valueOf()
    }));
    const items = res.payload?.currentMonthChipsData.sort((a: any, b: any) => a.date - b.date) || []
    return items.map((item: any) => ({
      label: (dayjs(item.date).format('DD')),
      value: item.dailyChips
    }));
  }
  return (
    <ChipReportChartView
      title="DAILY ADD CHIPS CHART"
      loadData={handleLoadData}
    />
  )
};

export default Page;