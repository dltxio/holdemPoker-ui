import { Fragment, useRef, useState } from 'react';
import clsx from 'clsx';
import { DatePicker, Form, FormInstance } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';

// Components
import './PlayerRakeChart.scss';
import { useAppDispatch } from '@/store/hooks';
import { findPlayerDataChart } from '../../store/action';
import dayjs from '@/core/dayjs';
import PlayerReportChartView from '../../components/PlayerReportChart';

const Page = () => {
  const dispatch = useAppDispatch();
  const handleLoadData = async (values: any) => {
    const res = await dispatch(findPlayerDataChart({
      ...values,
      addeddate: values.date.startOf('month').valueOf()
    }));
    const items = res.payload.sort((a: any, b: any) => a.date - b.date)
    return items.map((item: any) => ({
      label: (dayjs(item.date).format('DD')),
      value: item.dailyRake
    }));
  }
  return (
    <PlayerReportChartView
      title="Player Rake Chart"
      loadData={handleLoadData}
    />
  )
};

export default Page;