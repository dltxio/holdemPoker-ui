import { Fragment } from 'react';
import clsx from 'clsx';
import { DatePicker } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';

// Components
import { Breadcrumb } from '@/components/shared/breadcrumb/Breadcrumb';
import { Heading } from '@/components/shared/heading/Heading';

import './PlayerGamesPlayedChart.scss';
import PlayerReportChartView from '../../components/PlayerReportChartPLayed';
import dayjs from '@/core/dayjs';
import { useAppDispatch } from '@/store/hooks';
import { findPlayerDataChartGamesPlayed } from '../../store/action';

const Page = () => {
  
  const dispatch = useAppDispatch();
  const handleLoadData = async (values: any) => {
    const res = await dispatch(findPlayerDataChartGamesPlayed({
      userName: values.userName,
      timestamp: values.date.utcOffset(0).startOf('month').valueOf()
    }));
    const items = res.payload?.gameDataCurrentMonth.sort((a: any, b: any) => a.date - b.date) || []
    return items.map((item: any) => ({
      label: (dayjs(item.date).format('DD')),
      value: item.handsPlayed
    }));
  }
  return (
    <PlayerReportChartView
      title="Player Report Chart Games Played"
      loadData={handleLoadData}
    />
  )
};

export default Page;