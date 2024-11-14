import { useEffect, useMemo, useRef, useState } from 'react';
import { FormInstance } from 'antd';

// import './PlayerChipsReport.scss';
import TableReport from '@/components/table-report/TableReport';
import { FilterInputType, FilterItem } from '@/components/shared/filter/Filter';
import { useAppDispatch } from '@/store/hooks';
import { TableColumnType } from '@/components/shared/table/Table';
import { countDataInPlayerBonusReport, countDataInPlayerInfoReport, countDataInPlayerLoyalityPointsReport, listDataInPlayerBonusReport, listDataInPlayerInfoReport, listDataInPlayerLoyalityPointsReport } from '../../store/action';


const columns: TableColumnType[] = [
  {
    title: 'S No.',
    dataIndex: 'NO.'
  },
  {
    title: 'UserName',
    dataIndex: 'userName'
  },
  {
    title: 'Full Name',
    dataIndex: 'fullName'
  },
  {
    title: 'Mobile No.',
    dataIndex: 'mobileNumber'
  },
  {
    title: 'Email ID',
    dataIndex: 'emailId'
  },
]

const Page = () => {
  const dispatch = useAppDispatch();
  const formRef = useRef<FormInstance>(null);

  const getData = async (values: any) => {
    const res = await dispatch(listDataInPlayerInfoReport({
      ...values,
    }));
    const dataWithNo = res.payload.map((item: any, index: number) => ({
      ...item,
      'NO.': index + 1,
      'fullName': fullName(item.firstName, item.lastName)
    }))
    return {
      // data: res.payload as any[],
      data: dataWithNo as any[]
    }
  }

  const fullName = (firstName: any, lastName: any) => {
    return `${firstName} ${lastName}`;
  }

  const getTotal = (values: any) => {
    return dispatch(countDataInPlayerInfoReport(values)).then(res => res.payload)
  }

  const FilterFields: FilterItem[] = useMemo(() => ([
    {
      name: 'userName',
      type: FilterInputType.Input,
      inputProps: {
        placeholder: 'User Name'
      }
    },
    {
      name: 'email',
      type: FilterInputType.Input,
      inputProps: {
        placeholder: 'Email ID'
      }
    },
    {
      name: 'mobile',
      type: FilterInputType.Input,
      inputProps: {
        placeholder: 'Mobile No'
      }
    },
    {
      name: 'status',
      type: FilterInputType.Select,
      inputProps: {
        placeholder: 'Status',
        options: [
          {
            label: 'All',
            value: 'all'
          },
          {
            label: 'Active',
            value: 'Active'
          },
          {
            label: 'Block',
            value: 'Block'
          }
        ]
      }
    },
  ]), [formRef.current])

  return (
    <TableReport
      title='Player Info Report'
      formRef={formRef}
      columns={columns}
      filterFields={FilterFields}
      getData={getData}
      getTotal={getTotal}
      firstLoad={false}
    />
  )
};
export default Page;