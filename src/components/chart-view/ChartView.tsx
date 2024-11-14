import React, { Fragment, MutableRefObject, useEffect, useRef, useState } from 'react';
import { FormInstance } from 'antd';

// Components
import { Breadcrumb, BreadcrumbProps } from '@/components/shared/breadcrumb/Breadcrumb';
import { Heading } from '@/components/shared/heading/Heading';
import { Pagination, PaginationProps } from '@/components/shared/pagination/Pagination';

import './ChartView.scss';
import { Table, TableColumnType, TableProps } from '@/components/shared/table/Table';
import { FilterForm, FilterInputType, FilterItem, FilterProps } from '@/components/shared/filter/FilterRakeAnalytics';
import { useBusyContext } from '@/components/shared/busy';
import { cleanObject } from '@/helpers/object';

export type ChartViewProps = {
  title: string,
  type?: 'default' | 'secondary',
  description?: string | React.ReactNode,
  filterFields?: FilterItem[],
  firstLoad?: boolean,
  formRef?: MutableRefObject<FormInstance | null>,
  chartData?: any,
  formProps?: Omit<Omit<Omit<FilterProps, 'items'>, 'onExportAll'>, 'onSendFileToMail'> & {
    items?: FilterItem[],
    onExportAll?: (items: any[]) => void,
    onSendFileToMail?: (args: any, items: any[]) => void,
    customRenderTitle?: React.FC<any>
  },
  breadcrumbProps?: BreadcrumbProps,
  getData: (filterValues: any) => Promise<{
    // data: Array<any>,
    // skip?: number,
    // limit?: number
  }>,
  pageSize?: number,
  chart: React.FC<any>
}

export const ChartView = ({
  title, description, filterFields,
  getData, formRef, chartData, breadcrumbProps,
  formProps, type = 'default', firstLoad = true,
  chart: Chart
}: ChartViewProps) => {
  const { showBusy, hideBusy } = useBusyContext();
  const [init, setInit] = useState<Boolean>(false);
  const [data, setData] = useState<any>({
    totalAmount: 0,
    items: []
  });
  const filterFormRef = useRef<FormInstance | null>(null);
  const _tableRef = useRef<any | null>(null);

  useEffect(() => {
    if (init || firstLoad) {
      load(true);
    }
    setInit(true);
  }, []);

  const getDefaultValues = () => (
    filterFields?.reduce((prev, item) => {
      prev[item.name] = item.inputProps?.defaultValue || item.inputProps?.value || '';
      return prev;
    }, {} as any) || {}
  )

  const load = async (loadTotal = true) => {
    try {
      showBusy();
      // const limit = pagination?.pageSize || 10;
      const formValues = {
        ...filterFormRef.current?.getFieldsValue()
      };
      const [start, end] = formValues.dateRange || formValues.startDate && formValues.endDate && [formValues.startDate, formValues.endDate] || [null, null];
      const values = cleanObject({
        ...formValues,
        startDate: start && start.utcOffset(0).startOf('day').valueOf(),
        endDate: end && end.utcOffset(0).endOf('day').valueOf(),
        dateRange: undefined,
        // limit: limit,
        // skip: (pagination?.current && pagination?.current - 1 || 0) * limit,
      });
      console.log('sdfsdfsdf', values)
      const res = await getData(values);
      // setData({
      //   items: res.data
      // });
    } finally {
      hideBusy();
    }
  }

  const exportCsv = async (name = 'data', chartData: any) => {
    if (!chartData) {
      console.error('No chart data to export.');
      return;
    }

    const data = chartData.datasets[0].data;
    const labels = chartData.labels;

    const csvData = labels.map((label: any, index: number) => [label, data[index]]);
    const csvContent = "data:text/csv;charset=utf-8," + csvData.map((row: any) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.csv`;

    a.click();  
    window.URL.revokeObjectURL(url);
  }

  const handleExport = () => {
    // _tableRef.current.exportCsv(title.replace(/ /gi, '-').toLocaleLowerCase());
    exportCsv(title.replace(/ /gi, '-').toLocaleLowerCase(), chartData)
  }
  const handleFilterSubmit = (values: any) => {
    load();
  };

  const handleOnReset = () => {
    filterFormRef.current?.resetFields();
    load();
    if (formProps?.onReset) {
      formProps?.onReset();
    }

    filterFields?.forEach((item, index) => {
      if (item.type === FilterInputType.Select) {
        filterFormRef.current?.setFieldValue(item.name, undefined)
      }
    })
  };

  const handleFormRef = (ref: any) => {
    filterFormRef.current = ref;
    if (formRef) {
      formRef.current = ref;
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
          {Chart && <Chart />}
        </div>
      </div>
    </Fragment>
  )
};

export default ChartView;