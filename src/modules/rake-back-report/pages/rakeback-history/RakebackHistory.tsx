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

import './RakebackHistory.scss';
import { FilterForm, FilterInputType } from '@/components/shared/filter/Filter';
import { cleanObject } from '@/helpers/object';
import { countRakeDataReportData, listRakeDataRakeHistory, countRakeDataRakeHistory } from '../../store/action';
import { Table } from '@/components/shared/table/Table';
import { useBusyContext } from '@/components/shared/busy';
import { unwrapResult } from '@reduxjs/toolkit';

const TableStates = [
    {
      label: 'Sort by Date',
      value: 'addeddate'
    },
    {
      label: 'Sort by Amount',
      value: 'amount'
    },
]

const columns: any[] = [
  {
    title: 'S.No',
    dataIndex: 'No.',
  },
  {
    title: 'User Name',
    dataIndex: 'userName',
  },
  {
    title: 'Date',
    dataIndex: 'createdAt',
  },
  {
    title: 'Rakeback cycle',
    dataIndex: 'rakebackCycle',
  },
  {
    title: 'Reference No.',
    dataIndex: 'referenceNo.',
  },
  {
    title: 'total rakeback( 1st line)',
    dataIndex: 'total rakeback( 1st line)',
  },
  {
    title: 'total rakeback( 2nd line)',
    dataIndex: 'total rakeback( 2nd line)',
  },
  {
    title: 'previous balance',
    dataIndex: 'previous balance',
  },
  {
    title: 'next balance',
    dataIndex: 'next balance',
  },
  {
    title: '1St Line Status',
    dataIndex: '1St Line Status',
  },
  {
    title: '2nd Line Status',
    dataIndex: '2nd Line Status'
  }
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
    name: 'rakeByUsername',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'username',
    },
  },
];

const Page = () => {
  const { showBusy, hideBusy } = useBusyContext();
  const dispatch = useAppDispatch();
  const [data, setData] = useState<any>([]);
  const [dataSearch, setDataSearch] = useState<any>([]);
  const [isSearch, setIsSearch] = useState(false);
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    total: 0,
    pageSize: 20,
  });
  const [paginationSearch, setPaginationSearch] = useState<PaginationProps>({
    current: 1,
    total: 0,
    pageSize: 20,
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
    const countData = await dispatch(countRakeDataRakeHistory(values));
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
        pageSize: 20,
      });
    }
  };

  const loadTotalSearch = async () => {
    const values = cleanObject({
      ...filterFormRef.current?.getFieldsValue(),
    });
    const countData = await dispatch(countRakeDataRakeHistory(values));
    if (countData.payload && !isNaN(countData.payload)) {
      setPaginationSearch({
        total: countData.payload,
        current: paginationSearch.current,
        pageSize: paginationSearch.pageSize,
      });
    } else {
      setPaginationSearch({
        current: 1,
        total: 0,
        pageSize: 20,
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
        pageSize: pagination?.pageSize,
      });
      const res: any = await dispatch(listRakeDataRakeHistory(values));
      const dataWithSNo = res.payload.map((item: any, index: any) => ({
        ...item,
        'No.': index + 1 + values.skip,
        'createdAt': dateString(item.createdAt),
        'rakebackCycle': `${dateString(item.from)} - ${dateString(item.to)}`,
        'referenceNo.': item._id,
        'total rakeback( 1st line)': item.totalRakeBackFirstLine.toFixed(2),
        'total rakeback( 2nd line)': item.totalRakeBackSecondLine.toFixed(2),
        'previous balance': item.previousAmount ? item.previousAmount.toFixed(2) : "-",
        'next balance': item.nextAmount ? item.nextAmount.toFixed(2) : '-',
        '1St Line Status': item.isFirstLineApproved === true ? 'approved' : 'rejected',
        '2nd Line Status': item.isSecondLineApproved === true ? 'approved' : 'rejected'
      }))
      setData(dataWithSNo)
      
    } finally {
      hideBusy();
    }

  };

  const loadSearch = async () => {
    try {
      showBusy();
      const values = cleanObject({
        ...filterFormRef.current?.getFieldsValue(),
        skip:
          ((paginationSearch?.current && paginationSearch?.current - 1) || 0) *
          (paginationSearch?.pageSize || 10),
        pageSize: paginationSearch?.pageSize,
      });
      const res: any = await dispatch(listRakeDataRakeHistory(values));
      const dataWithSNo = res.payload.map((item: any, index: any) => ({
        ...item,
        'No.': index + 1 + values.skip,
        'createdAt': dateString(item.createdAt),
        'rakebackCycle': `${dateString(item.from)} - ${dateString(item.to)}`,
        'referenceNo.': item._id,
        'total rakeback( 1st line)': item.totalRakeBackFirstLine.toFixed(2),
        'total rakeback( 2nd line)': item.totalRakeBackSecondLine.toFixed(2),
        'previous balance': item.previousAmount ? item.previousAmount.toFixed(2) : "-",
        'next balance': item.nextAmount ? item.nextAmount.toFixed(2) : '-',
        '1St Line Status': item.isFirstLineApproved === true ? 'approved' : 'rejected',
        '2nd Line Status': item.isSecondLineApproved === true ? 'approved' : 'rejected'
      }))
      setDataSearch(dataWithSNo)
      
    } finally {
      hideBusy();
    }

  };

  const dateString = (inputDate: string) => {
    const date = new Date(inputDate);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    // Function to get the day suffix (st, nd, rd, th)
    function getDaySuffix(day: any) {
      if (day >= 11 && day <= 13) {
        return 'th';
      }
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    }
    
    // Function to format hours into 12-hour format
    function formatHours(hours: any) {
      const formattedHours = hours % 12 || 12;
      return formattedHours;
    }
    
    // Function to get AM or PM
    function getAmPm(hours: any) {
      return hours >= 12 ? 'PM' : 'AM';
    }
    
    const daySuffix = getDaySuffix(day);
    const formattedHours = formatHours(hours);
    const amPm = getAmPm(hours);
    
    return `${day}${daySuffix} ${month} ${formattedHours}:${minutes.toString().padStart(2, '0')} ${amPm}`;
  }

  const handleOnReset = () => {
    filterFormRef.current?.resetFields();
    setIsSearch(false);
    load();
    loadTotal();
    // loadSearch();
    // loadTotalSearch();
  };
  

  const handleExport = () => {
    tableRef.current.exportCsv('rake-back-history');
  };

  const handleFilterSubmit = (values: any) => {
    setIsSearch(true);
    // load();
    // loadTotal();
    loadSearch();
    loadTotalSearch();
  };

  const handlePagination = (current: number) => {
    setPagination({
      ...pagination,
      current,
    });
  };

  const handlePaginationSearch = (current: number) => {
    setPaginationSearch({
      ...paginationSearch,
      current,
    })

    loadSearch();
  };

  useEffect(() => {
    loadSearch();
    // loadTotalSearch();
  }, [isSearch])

  useEffect(() => {
    loadSearch();
  }, [paginationSearch.current]);

  return (
    <Fragment>
        <div className="rakeback-transaction-history-report-content">
            <PageTitle text='Rakeback History' />

            <Breadcrumb />

            <Heading
                title='View Rakeback History '
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
                pagination={isSearch ? paginationSearch : pagination}
                data={(isSearch ? dataSearch : data) || []}
                onPageChange={isSearch ? handlePaginationSearch : handlePagination}
            />
        </div>
    </Fragment>
  );
};

export default Page;
