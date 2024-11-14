import { FilterForm, FilterInputType } from "@/components/shared/filter/Filter";
import { Heading } from "@/components/shared/heading/Heading";
import { TableColumnType } from "@/components/shared/table/Table";
import TableReport from "@/components/table-report/TableReport";
import { useAppDispatch } from "@/store/hooks";
import { Fragment, useEffect, useRef, useState } from "react";
import { Breadcrumb } from "react-bootstrap";
import { playerMagnetChipsDetails } from "../../store/action";
import { FormInstance } from 'antd';
import { PaginationProps } from '@/components/shared/pagination/Pagination';
import { cleanObject } from "@/helpers/object";
import { useBusyContext } from '@/components/shared/busy';
import { Table } from '@/components/shared/table/Table';
import { showAlert } from "@/store/global/action";

import "./PlayerLoyalityPointsHistory.scss";
export const PAGE_SIZE = 20;
const FilterFields = [
  {
    name: 'startDate',
    type: FilterInputType.Date,
    inputProps: {
      placeholder: 'Start Month',
    },
  },
  {
    name: 'endDate',
    type: FilterInputType.Date,
    inputProps: {
      placeholder: 'End Month'
    },
  },
  {
    name: 'userName',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Username',
      required: true
    },
  }
];
const columns: TableColumnType[] = [
  {
    title: 'S No.',
    dataIndex: 'NO.'
  },
  {
    title: 'Month',
    dataIndex: 'displayDate'
  },
  {
    title: 'Amount',
    dataIndex: 'displayAmount'
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

  const load = async () => {
    try {
      showBusy();
      const formValues = {
        ...filterFormRef.current?.getFieldsValue()
      };
      const [start, end] = formValues.dateRange || formValues.startDate && formValues.endDate && [formValues.startDate, formValues.endDate] || [null, null];
      if (!start) {
        dispatch(showAlert({
          title:'Please select a start date!',
        }))
      }
      if (!end) {
        dispatch(showAlert({
          title:'Please select a end date!',
        }))
      }
      if (!formValues.userName) {
        dispatch(showAlert({
          title:'Please enter a username!',
        }))
      }
      const values = cleanObject({
        ...formValues,
        startDate: start && start.utcOffset(0).startOf('day').valueOf(),
        endDate: end && end.utcOffset(0).endOf('day').valueOf(),
        limit: 0,
        skip: 10
      });

      const res: any = await dispatch(playerMagnetChipsDetails(values));
      setData(res.payload);
      console.log('res.payload',res.payload);
      const result = res.payload.result;
      if(result && Array.isArray(result)){
        const pageSize = pagination.pageSize || PAGE_SIZE;
        const current = pagination.current || 1;
        const list = result.slice(pageSize*(current -1), pageSize*current);
        setDisplayData(list);
      }
      setPagination({
        ...pagination,
        total: res.payload.result.length
      });
    } finally {
      hideBusy();
    }
  };


  const handleOnReset = () => {
    filterFormRef.current?.resetFields();
    // setCount(0);
    setDisplayData([]);
    setPagination({
      current: 1,
      total: 0,
      pageSize: PAGE_SIZE,
    })
  };

  const handleExport = () => {
    tableRef.current.exportCsv('Player-Loyality-Points');
  };

  const handleFilterSubmit = (values: any) => {
    load();
  };

  const handlePagination = (current: number) => {
    setPagination({
      ...pagination,
      current,
    });
    const result = data.result;
    if(result && Array.isArray(result)){
      const pageSize = pagination.pageSize || PAGE_SIZE;
      const list = result.slice(pageSize*(current -1), pageSize*current);
      setDisplayData(list);
    }
  };
  return (
    <Fragment>
      <div className="player-loyality-points-history-content">
        <Breadcrumb />

        <Heading title='Player Loyality Points' type='info' solid={true} />

        <div className="player-loyality-points-history-content__wrapper default">
          <div className='player-loyality-points-history-content__filter'>
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
            data={displayData || []}
            onPageChange={handlePagination}
          />
        </div>
      </div>
    </Fragment>
  )
};

export default Page;