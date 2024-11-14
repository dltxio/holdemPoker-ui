import { Breadcrumb } from "@/components/shared/breadcrumb/Breadcrumb";
import { useBusyContext } from "@/components/shared/busy";
import { FilterForm, FilterInputType, FilterItem } from "@/components/shared/filter/Filter";
import { Heading } from "@/components/shared/heading/Heading";
import { PaginationProps } from "@/components/shared/pagination/Pagination";
import { Table, TableColumnType } from "@/components/shared/table/Table";
import { cleanObject } from "@/helpers/object";
import { showAlert } from "@/store/global/action";
import { useAppDispatch } from "@/store/hooks";
import { FormInstance } from "antd";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PlayerPassbook } from "../models/PlayerPassbook";
import { countDataForPlayerPassbook, listPlayers } from "../store/action";
import "./PlayerPassbook.scss";
export const PAGE_SIZE = 20;

const disabledDate = (current: any) => {
  // Can not select days before today and today
  return dayjs().isBefore(dayjs(current));
};

const FilterFieldsDefault: FilterItem[] = [
  {
    name: 'dateRange',
    type: FilterInputType.DateRange,
    inputProps: {
      disabledDate: disabledDate,
      showTime: true
    },
  },
  {
    name: 'userName',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Username',
    },
  },
  {
    name: 'parentUsername',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Parent Aff/Agent',
    },
  },
  {
    name: 'transactionCategory',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Transaction Category',
    },
  },
  {
    name: 'transactionSubCategory',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Transaction Sub Category',
    },
  },
  {
    name: 'tableName',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Table Name',
    },
  },
];


const columns: TableColumnType[] = [
  {
    title: 'S No.',
    dataIndex: 'NO.'
  },
  {
    title: 'Date And Time',
    dataIndex: 'timeDisplay'
  },
  {
    title: 'Previous Amount',
    dataIndex: 'prevAmtDisplay'
  },
  {
    title: 'Amount',
    dataIndex: 'amountDisplay'
  },
  {
    title: 'Closing Amount',
    dataIndex: 'newAmtDisplay'
  },
  {
    title: 'Transaction Category',
    dataIndex: 'category'
  },
  {
    title: 'Transaction Sub Category',
    dataIndex: 'subCategory'
  },
  {
    title: 'Table Name',
    dataIndex: 'tableNameDisplay'
  },

]

const Page = () => {
  const dispatch = useAppDispatch();
  const { showBusy, hideBusy } = useBusyContext();
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    total: 0,
    pageSize: PAGE_SIZE,
  });

  const [data, setData] = useState<any>({});
  const [displayData, setDisplayData] = useState<any>([]);

  const filterFormRef = useRef<FormInstance>(null);
  const tableRef = useRef<any>(null);
  const [parentName, setParentname] = useState('');
  const [players, setPlayers] = useState([]);
  const [filters, setFilters] = useState(FilterFieldsDefault);

  const getListPlayers = useCallback(debounce(async (parent: string) => {

    if (parent) {
      const res = await dispatch(listPlayers({ parent }));
      const list = res.payload;
      setPlayers(list);
      let filters = [...FilterFieldsDefault];
      filters[1] = {
        name: 'userName',
        type: FilterInputType.Select,
        inputProps: {
          placeholder: 'Players of Parent',
          options: list.map((x: any) => (
            {
              label: x.userName,
              value: x.userName
            }
          ))
        },
      };
      setFilters(filters)
    } else {
      setFilters(FilterFieldsDefault)
    }
  }, 200), [])


  const validateForm = (formValues: any)=>{
    if(!formValues?.dateRange){
      dispatch(showAlert({
        title:'kindly provide the date range filters to search !!'
      }))
      return false;
    }

    if(!formValues?.userName){
      dispatch(showAlert({
        title:'Kindly Provide the player username to search'
      }))
      return false;
    }
    return true;
  }
  const load = async () => {
    try {
      
      const formValues = {
        ...filterFormRef.current?.getFieldsValue()
      };
      const validate = validateForm(formValues);
      if(!validate){
        return;
      }
      showBusy();
      const [start, end] = formValues.dateRange || formValues.startDate && formValues.endDate && [formValues.startDate, formValues.endDate] || [null, null];
      const { userName, transactionCategory, transactionSubCategory, tableName } = formValues;
      const values = cleanObject({
        startDate: start && start.valueOf(),
        endDate: end && end.valueOf(),
        userName,
        transactionCategory,
        transactionSubCategory,
        tableName
      });

      const res: any = await dispatch(countDataForPlayerPassbook(values));
      const dataWithNo = res?.payload[0]?.history.map((item: any, index: number) => ({
        ...item,
        'NO.': index + 1
      }))
      // const history = PlayerPassbook.fromArray(res?.payload[0]?.history);
      const history = PlayerPassbook.fromArray(dataWithNo);
      setData(history);
      console.log('history', history);
      if (history && Array.isArray(history)) {
        const pageSize = pagination.pageSize || PAGE_SIZE;
        const current = pagination.current || 1;
        const list = history.slice(pageSize * (current - 1), pageSize * current);
        setDisplayData(list);
      }
      setPagination({
        ...pagination,
        total: history.length
      });
    } finally {
      hideBusy();
    }
  };


  const handleOnReset = () => {
    setFilters(FilterFieldsDefault)
    filterFormRef.current?.resetFields();
    setDisplayData([]);
    setPagination({
      current: 1,
      total: 0,
      pageSize: PAGE_SIZE,
    });
  };

  const handleExport = async () => {
    if(!data){
      await load();
    }
    tableRef.current.exportCsv('PlayerPassbookReport');
  };

  const handleFilterSubmit = (values: any) => {
    load();
  };


  const handlePagination = (current: number) => {
    setPagination({
      ...pagination,
      current,
    });
    const result = [...data];
    if (result && Array.isArray(result)) {
      const pageSize = pagination.pageSize || PAGE_SIZE;
      const list = result.slice(pageSize * (current - 1), pageSize * current);
      console.log('handlePagination', list)
      setDisplayData(list);
    }
  };
  const handleFormChange = (values: any) => {
    setParentname(values.parentUsername)
  }
  useEffect(() => {
    getListPlayers(parentName);
  }, [parentName]);
  

  return (
    <Fragment>
      <div className="passbook-content">
        <Breadcrumb />

        <Heading title='Player Passbook' type='info' solid={true} />

        <div className="passbook-content__wrapper default">
          <div className='passbook-content__filter'>
            <FilterForm
              ref={filterFormRef}
              items={filters}
              onFinish={handleFilterSubmit}
              onReset={handleOnReset}
              onExport={handleExport}
              onValuesChange={handleFormChange}
            />
          </div>

          <Table
            ref={tableRef}
            columns={columns}
            pagination={pagination}
            data={displayData || []}
            onPageChange={handlePagination}
          />
        </div>
      </div>
    </Fragment>
  )
};

export default Page;