import React, { Fragment, MutableRefObject, useEffect, useRef, useState } from 'react';
import { FormInstance } from 'antd';

// Components
import { Breadcrumb, BreadcrumbProps } from '@/components/shared/breadcrumb/Breadcrumb';
import { Heading } from '@/components/shared/heading/Heading';
import { Pagination, PaginationProps } from '@/components/shared/pagination/Pagination';

import './TableReportPlayerReport.scss';
// import { Table, TableColumnType, TableProps } from '@/components/shared/table/Table';
import { FilterForm, FilterInputType, FilterItem, FilterProps } from '@/components/shared/filter/Filter';
import { useBusyContext } from '@/components/shared/busy';
import { cleanObject } from '@/helpers/object';
import { useAppDispatch } from "@/store/hooks";
import { showAlert } from "@/store/global/action";
import { Table, TableColumnType, TableProps } from "@/components/shared/table/TablePlayerReport";

export type TableReportProps = {
  title: string,
  type?: 'default' | 'secondary',
  description?: string | React.ReactNode,
  columns: TableColumnType[],
  filterFields?: FilterItem[],
  firstLoad?: boolean,
  formRef?: MutableRefObject<FormInstance | null>,
  tableRef?: MutableRefObject<any>,
  formProps?: Omit<Omit<Omit<FilterProps, 'items'>, 'onExportAll'>, 'onSendFileToMail'> & {
    items?: FilterItem[],
    onExportAll?: (items: any[]) => void,
    onSendFileToMail?: (args: any, items: any[]) => void,
    customRenderTitle?: React.FC<any>
  },
  tableProps?: Omit<Omit<TableProps, 'columns'>, 'data'> & {

  },
  breadcrumbProps?: BreadcrumbProps,
  getTotal?: (filterValues: any) => Promise<number>,
  getData: (filterValues: any) => Promise<{
    data: Array<any>,
    skip?: number,
    limit?: number
  }>,
  pageSize?: number,
}

export const TableReportPLayerReport = ({
  title, description, columns, filterFields,
  getData, getTotal, tableRef, formRef, tableProps, breadcrumbProps,
  formProps, type = 'default', firstLoad = true,
  pageSize = 10,
}: TableReportProps) => {
  const { showBusy, hideBusy } = useBusyContext();
  const dispatch = useAppDispatch();
  const [init, setInit] = useState<Boolean>(false);
  const [data, setData] = useState<any>({
    totalAmount: 0,
    items: []
  });
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    total: 0,
    pageSize,
  });
  const [resetSearch, setResetSearch] = useState<Boolean>(false);
  const _tableRef = useRef<any | null>(null);
  const filterFormRef = useRef<FormInstance | null>(null);

  useEffect(() => {
    if (init || firstLoad) {
      load(true);
    }
    setInit(true);
  }, [pagination.current, pagination.pageSize]);

  const getDefaultValues = () => (
    filterFields?.reduce((prev, item) => {
      prev[item.name] = item.inputProps?.defaultValue || item.inputProps?.value || '';
      return prev;
    }, {} as any) || {}
  )

  const load = async (loadTotal = true) => {
    try {
      showBusy();
      const limit = pagination?.pageSize || 10;
      const formValues = {
        ...filterFormRef.current?.getFieldsValue()
      };
      const [start, end] = formValues.dateRange || formValues.startDate && formValues.endDate && [formValues.startDate, formValues.endDate] || [null, null];
      const values = cleanObject({
        ...formValues,
        startDate: start && start.utcOffset(0).startOf('day').valueOf(),
        endDate: end && end.utcOffset(0).endOf('day').valueOf(),
        dateRange: undefined,
        limit: limit,
        skip: (pagination?.current && pagination?.current - 1 || 0) * limit,
      });
      if (loadTotal && getTotal) {
        const totalValues = { ...values };
        delete totalValues.limit;
        delete totalValues.skip;
        const total = await getTotal({
          ...values,
          limit: undefined,
          skip: undefined,
        });
        setPagination({
          ...pagination,
          total
        });
      }
      const res = await getData(values);
      setData({
        items: res.data
      });
    } finally {
      hideBusy();
    }
  }

  
  const handleExport = () => {
    _tableRef.current.exportCsv(title.replace(/ /gi, '-').toLocaleLowerCase());
  }
  const handleFilterSubmit = (values: any) => {
    const checkValid = Object.values(values).some((item) => item !== undefined)
    if (checkValid) {
      load();
    } else {
      dispatch(showAlert({
        title:'PLEASE PROVIDE ANY ONE FILTER',
      }))
      return {
        data: [],
      }
    }
  };

  const handleOnReset = () => {
    filterFormRef.current?.resetFields();
    if (formProps?.onReset) {
      formProps?.onReset();
    }
    // load();
    filterFields?.forEach((item, index) => {
      // if (item.type === FilterInputType.Select) {
      //   filterFormRef.current?.setFieldValue(item.name, undefined)
      //   setData([])
      // }
      filterFormRef.current?.setFieldValue(item.name, undefined)
      setData([]);
      setPagination({
        current: 1,
        total: 0,
        pageSize,
      });
      setResetSearch(true);
    })
  };

  const handleResetSearch = () => {
    console.log("aaaa");
    
  }

  const handlePagination = (current: number, pageSize?: number) => {
    setPagination({
      ...pagination,
      current,
    });
  }

  const handleShowSizeChange = (current: number, pageSize: number) => {
    pagination.pageSize = pageSize;
  }

  const handleFormRef = (ref: FormInstance) => {
    filterFormRef.current = ref;
    if (formRef) {
      formRef.current = ref;
    }
  }

  const handleTableRef = (ref: any) => {
    _tableRef.current = ref;
    if (tableRef) {
      tableRef.current = ref;
    }
  }

  const handleExportAll = () => {
    if (formProps?.onExportAll) {
      formProps?.onExportAll(data.items);
    }
  }

  const handleSendMail = async (args: any) => {
    if (formProps?.onSendFileToMail) {
      await formProps?.onSendFileToMail(args, data.items);
    }
  }

  return (
    <Fragment>
      <div className="table-report-content">
        <Breadcrumb
          {...breadcrumbProps}
        />

        <Heading
          title={title}
          type="info"
          solid={true}
        />

        <div className={`table-report-content__wrapper ${type || 'default'}`}>
          {filterFields && filterFields.length > 0 && <div className='table-report-content__filter'>
            <FilterForm
              ref={handleFormRef}
              onExport={handleExport}
              {...formProps}
              items={filterFields}
              onFinish={handleFilterSubmit}
              onReset={handleOnReset}
              onExportAll={formProps?.onExportAll ? handleExportAll : undefined}
              onSendFileToMail={formProps?.onSendFileToMail ? handleSendMail : undefined}
            />
          </div>}

          {description && <p>{description}</p>}

          <Table
            ref={handleTableRef}
            pagination={pagination}
            {...tableProps}
            columns={columns}
            data={data.items || []}
            onPageChange={handlePagination}
            onShowSizeChange={handleShowSizeChange}
            onReload={() => load()}
            resetSearch={resetSearch}
          />
        </div>
      </div>
    </Fragment>
  )
};

export default TableReportPLayerReport;