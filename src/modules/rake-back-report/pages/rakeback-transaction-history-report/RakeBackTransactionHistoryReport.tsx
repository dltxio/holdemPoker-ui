import { Fragment, useEffect, useRef, useState } from 'react';
import { DatePicker, FormInstance } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch } from '@/store/hooks';
// Components
import { Breadcrumb } from '@/components/shared/breadcrumb/Breadcrumb';
import { Heading } from '@/components/shared/heading/Heading';
import { Button } from '@/components/shared/button/Button';
import { Pagination, PaginationProps } from '@/components/shared/pagination/Pagination';
import { Note } from '@/components/shared/note/Note';
import { PageTitle } from '@/components/shared/page-title/PageTitle';

import './RakeBackTransactionHistoryReport.scss';
import { FilterForm, FilterInputType } from '@/components/shared/filter/Filter';
import { cleanObject } from '@/helpers/object';
import { listRakebackData, countRakebackData } from '../../store/action';
import { Table } from '@/components/shared/table/Table';
import { useBusyContext } from '@/components/shared/busy';
import { unwrapResult } from '@reduxjs/toolkit';
import { formatTime } from '@/helpers/common';

const columns: any[] = [
  {
    title: 'S.No',
    dataIndex: 'NO.',
  },
  {
    title: 'Date & Time',
    dataIndex: 'dateAndTime',
  },
  {
    title: 'User Name',
    dataIndex: 'rakeByUsername',
  },
  {
    title: 'Parent Username',
    dataIndex: 'parentUser',
  },
  {
    title: 'Reference Number',
    dataIndex: 'referenceNumber',
  },
  {
    title: 'Hands Played',
    dataIndex: 'handsPlayed',
  },
  {
    title: 'Rake Generated',
    dataIndex: 'amount',
  },
  {
    title: 'Rakeback Amount',
    dataIndex: 'playerRakeBack',
  },
  {
    title: 'Previous Balance',
    dataIndex: 'prevBalanceDisplay',
  },
  {
    title: 'New Balance',
    dataIndex: 'prevNewBalanceDisplay',
  },
];

const FilterFields = [
  {
    name: 'startTime',
    type: FilterInputType.Date,
    inputProps: {
      placeholder: 'Start Date & Time',
    },
  },
  {
    name: 'endTime',
    type: FilterInputType.Date,
    inputProps: {
      placeholder: 'End Date & Time',
    },
  },
  {
    name: 'filterReferenceNo',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Reference No',
    },
  },
  {
    name: 'filterPlayer',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'username',
    },
  },
  {
    name: 'parentUser',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Parent User',
    },
  },
];

const Page = () => {
  const { showBusy, hideBusy } = useBusyContext();
  const dispatch = useAppDispatch();
  const [data, setData] = useState<any>([]);
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    total: 0,
    pageSize: 10,
  });

  const filterFormRef = useRef<FormInstance>(null);
  const tableRef = useRef<any>(null);
  useEffect(() => {
    load();
  }, [pagination]);

  useEffect(() => {
    loadTotal();
  }, []);

  const loadTotal = async () => {
    const values = cleanObject({
      ...filterFormRef.current?.getFieldsValue(),
    });
    const countData = await dispatch(countRakebackData(values));
    if (countData.payload && !isNaN(countData.payload)) {
      setPagination({
        total: countData.payload,
        current: pagination.current,
        pageSize: pagination.pageSize,
      });
    } else {
      setPagination({
        current: 1,
        total: 0,
        pageSize: 10,
      });
    }
  };

  const load = async () => {
    try {
      showBusy();
      const values = cleanObject({
        ...filterFormRef.current?.getFieldsValue(),
        skip:
          ((pagination?.current && pagination?.current - 1) || 0) *
          (pagination?.pageSize || 10),
        pageSize: pagination.pageSize
      });
      const res: any = await dispatch(listRakebackData(values));
      const resData = res.payload.map((item: any, index: number) => ({
        ...item,
        'NO.': index + 1,
        'dateAndTime': dateAndTime(item.addedDate),
        'prevBalanceDisplay': item.prevBalance ? item.prevBalance.toFixed(2): 0,
        'prevNewBalanceDisplay': item.newBalance ? item.newBalance.toFixed(2) : 0,
        'playerRakeBack': item.playerRakeBack ? item.playerRakeBack.toFixed(2) : 0,
        'amount': item.amount ? item.amount.toFixed(2) : 0,

      }))
      setData(resData);
    } finally {
      hideBusy();
    }

  };

  const dateAndTime = (timeString: any) => {
    return formatTime(timeString);
  }

  const handleOnReset = () => {
    filterFormRef.current?.resetFields();
    load();
  };

  const handleExport = () => {
    tableRef.current.exportCsv('rake-back-transaction-history');
  };

  const handleFilterSubmit = (values: any) => {
    load();
    loadTotal();
  };

  const handlePagination = (current: number) => {
    setPagination({
      ...pagination,
      current,
    });
  };

  return (
    <Fragment>
      <div className="rakeback-transaction-history-report-content">
        <PageTitle text='Rakeback Transaction History Report' />

        <Breadcrumb />

        <Heading
          title='View Transaction History'
          type='info'
          solid={true}
        />

        <div className="rakeback-transaction-history-report-content__filter">
          <FilterForm
            ref={filterFormRef}
            items={FilterFields}
            onFinish={handleFilterSubmit}
            onReset={handleOnReset}
            onExport={handleExport}
          />
        </div>

        <Table
          ref={tableRef}
          columns={columns}
          pagination={pagination}
          data={data || []}
          onPageChange={handlePagination}
        />
      </div>
    </Fragment>
  );
};

export default Page;
