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

import './RakebackCommissionReport.scss';
import { FilterForm, FilterInputType } from '@/components/shared/filter/Filter';
import { cleanObject } from '@/helpers/object';
import { listRakebackCommissionData, countRakeDataReportData, totalRakeDataForRakeReportSearch } from '../../store/action';
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
        dataIndex: 'username',
    },
    {
        title: 'Rake Generated',
        dataIndex: 'RakeGenerated',
    },
    {
        title: 'Hand Id',
        dataIndex: 'HandId',
    },
    {
        title: 'Timestamp',
        dataIndex: 'time',
    },
    {
        title: 'GameType',
        dataIndex: 'GameType',
    },
    {
        title: 'Table Name',
        dataIndex: 'TableName',
    },
    {
        title: 'Rake To Admin',
        dataIndex: 'RakeToAdmin',
    },
    {
        title: 'Rake To 1st Line',
        dataIndex: 'RakeTo1StLine',
    },
    {
        title: 'Rake To 2nd Line',
        dataIndex: 'RakeTo2ndLine',
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
    name: 'sortValue',
    type: FilterInputType.Select,
    inputProps: {
      placeholder: 'sortValue',
      options: [
        {
          label: '-All-',
          value: null
        },
        ...TableStates
      ]
    }
  },
  {
    name: 'rakeByUsername',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'username',
    },
    },
    {
        name: 'rakeByTableName',
        type: FilterInputType.Input,
        inputProps: {
          placeholder: 'Table Name',
        },
    },
    {
        name: 'rakeByHandId',
        type: FilterInputType.Input,
        inputProps: {
          placeholder: 'Hand Id',
        },
      },
];

const Page = () => {
  const { showBusy, hideBusy } = useBusyContext();
  const dispatch = useAppDispatch();
  const [data, setData] = useState<any>([]);
  const [dataSearch, setDataSearch] = useState<any>([]);
  const [allData, setAllData] = useState([])
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
    const [totalRakeCommission, setTotalrakeCommission] = useState<any>([
        {
            title: "TOTAL RAKE GENERATED",
            amount: 0
        },
        {
            title: "RAKE TO ADMIN",
            amount: 0
        },
    ])

  const filterFormRef = useRef<FormInstance>(null);
  const tableRef = useRef<any>(null);
  useEffect(() => {
    load();
    loadDataExport();
  }, [pagination]);

  useEffect(() => {
    loadTotal();
  }, []);

  const loadTotal = async () => {
    const values = cleanObject({
      ...filterFormRef.current?.getFieldsValue(),
    });
    const countData = await dispatch(countRakeDataReportData(values));
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
    const countData = await dispatch(countRakeDataReportData(values));
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
        pageSize: pagination?.pageSize
      });
      const res: any = await dispatch(listRakebackCommissionData(values));
        // setData(res.payload);
        let totalRakeGenerated = 0;
        let rakeToAdmin = 0;
        let time = ""
        const resData: any = await dispatch(totalRakeDataForRakeReportSearch(values));
        resData.payload.forEach((item: any) => {
            totalRakeGenerated += item.RakeGenerated;
            rakeToAdmin += item.RakeToAdmin;
            time = dateString(item.Timestamp)
        });
        setTotalrakeCommission([
            {
                title: "TOTAL RAKE GENERATED",
                amount: totalRakeGenerated.toFixed(1)
            },
            {
                title: "RAKE TO ADMIN",
                amount: rakeToAdmin.toFixed(1)
            },
        ])
        const dataWithSNo = res.payload.map((item: any, index: any) => ({
            ...item,
            'No.': index + 1 + values.skip,
            'time': dateString(item.Timestamp)
        }))
        dataWithSNo.map((dat:any)=>{
          if (dat.RakeTo1StLineName &&  dat.RakeTo1StLineName.length > 0) {
            dat.RakeTo1StLine = dat.RakeTo1StLine + "("+dat.RakeTo1StLineName+")";
          }
          if (dat.RakeTo2ndLine &&  dat.RakeTo2ndLineName.length > 0) {
            dat.RakeTo2ndLine = dat.RakeTo2ndLine + "("+dat.RakeTo2ndLineName+")";
          }
        })
        setData(dataWithSNo)
    } finally {
      hideBusy();
    }

  };

  const loadDataExport = async () => {
    try {
      showBusy();
      const values = cleanObject({
        ...filterFormRef.current?.getFieldsValue(),
        skip: undefined,
        pageSize: undefined
      });
      const res: any = await dispatch(listRakebackCommissionData(values));

      const dataWithSNo = res.payload.map((item: any, index: any) => ({
        'S.No': index + 1,
        'User Name': item.username,
        'Rake Generated	': item.RakeGenerated,
        'Hand Id': item.HandId,
        'Timestamp': dateString(item.Timestamp),
        'GameType': item.GameType,
        'Table Name': item.TableName,
        'Rake To Admin': item.RakeToAdmin,
        'Rake To 1st Line': item.RakeTo1StLineName && item.RakeTo1StLineName.length > 0 ? item.RakeTo1StLine + "("+item.RakeTo1StLineName+")" : item.RakeTo1StLine,
        'Rake To 2nd Line': item.RakeTo2ndLine && item.RakeTo2ndLineName.length > 0 ? item.RakeTo2ndLine + "("+item.RakeTo2ndLineName+")" : item.RakeTo2ndLine
      }))
      dataWithSNo.map((dat:any)=>{
        if (dat.RakeTo1StLineName &&  dat.RakeTo1StLineName.length > 0) {
          dat.RakeTo1StLine = dat.RakeTo1StLine + "("+dat.RakeTo1StLineName+")";
        }
        if (dat.RakeTo2ndLine &&  dat.RakeTo2ndLineName.length > 0) {
          dat.RakeTo2ndLine = dat.RakeTo2ndLine + "("+dat.RakeTo2ndLineName+")";
        }
      })
         
      setAllData(dataWithSNo)
    } finally {
      hideBusy();
    }
  }

  const loadSearch = async () => {
    try {
      showBusy();
      const values = cleanObject({
        ...filterFormRef.current?.getFieldsValue(),
        skip:
          ((paginationSearch?.current && paginationSearch?.current - 1) || 0) *
          (paginationSearch?.pageSize || 10),
        pageSize: paginationSearch?.pageSize
      });

      const res: any = await dispatch(listRakebackCommissionData(values));
        // setData(res.payload);
        let totalRakeGenerated = 0;
        let rakeToAdmin = 0;
        let time = ""
        const resData: any = await dispatch(totalRakeDataForRakeReportSearch(values));
        resData.payload.forEach((item: any) => {
            totalRakeGenerated += item.RakeGenerated;
            rakeToAdmin += item.RakeToAdmin;
            time = dateString(item.Timestamp)
        });
        setTotalrakeCommission([
            {
                title: "TOTAL RAKE GENERATED",
                amount: totalRakeGenerated.toFixed(1)
            },
            {
                title: "RAKE TO ADMIN",
                amount: rakeToAdmin.toFixed(1)
            },
        ])
        const dataWithSNo = res.payload.map((item: any, index: any) => ({
            ...item,
            'No.': index + 1 + values.skip,
            'time': dateString(item.Timestamp)
        }))
         
        setDataSearch(dataWithSNo)
    } finally {
      hideBusy();
    }

  };
  
  const dateString = (date: string) => {
    const dateTime = new Date(date);
    const year = dateTime.getFullYear();
    const month = (dateTime.getMonth() + 1).toString().padStart(2, '0'); 
    const day = dateTime.getDate().toString().padStart(2, '0'); 
    const hours = dateTime.getUTCHours().toString().padStart(2, '0'); 
    const minutes = dateTime.getUTCMinutes().toString().padStart(2, '0'); 
    const seconds = dateTime.getUTCSeconds().toString().padStart(2, '0'); 

    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDateTime;
  }

  const handleOnReset = () => {
    filterFormRef.current?.resetFields();
    setIsSearch(false);
    load();
    loadTotal();
    loadDataExport();
    loadSearch();
  };
  

  const handleExport = () => {
    tableRef.current.exportCsv('rake-back-commission-report');
  };

  const handleFilterSubmit = (values: any) => {
    if (values.endTime || values.rakeByHandId || values.rakeByTableName || values.rakeByUsername || values.sortValue || values.startTime) {
      setIsSearch(true);
      loadSearch();
      loadTotalSearch();
    }
    // load();
    loadTotal();
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
            <PageTitle text='Rakeback Commission Report' />

            <Breadcrumb />

            <Heading
                title='View Rakeback Commission '
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
              
            <div className='rake'>
                {totalRakeCommission.map((item: any, index: number) => (
                    <div className='rake-total' key={index}>
                        <h3 className='rake-title'>{ item.title}</h3>
                        <span className='rake-amount'>{ item.amount || 0 }</span>  
                    </div>  
                    
                )) }      
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
