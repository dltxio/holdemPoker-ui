import { useEffect, useMemo, useRef, useState } from 'react';
import { FormInstance } from 'antd';

// import './PlayerChipsReport.scss';
import TableReport from '@/components/table-report/TableReport';
import { FilterInputType, FilterItem } from '@/components/shared/filter/Filter';
import { useAppDispatch } from '@/store/hooks';
import { TableColumnType } from '@/components/shared/table/Table';
import { countDataInPlayerBonusReport, countDataInPlayerInfoReport, countDataInPlayerLoyalityPointsReport, countDataInPlayerParentHistory, listDataInPlayerBonusReport, listDataInPlayerInfoReport, listDataInPlayerLoyalityPointsReport, listDataInPlayerParentHistory } from '../../store/action';
import dayjs from '@/core/dayjs';

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
    title: 'Previous Parent',
    dataIndex: 'oldParent'
  },
  {
    title: 'Previous Parent Type',
    dataIndex: 'oldParentType'
  },
  {
    title: 'New Parent',
    dataIndex: 'newParent'
  },
  {
    title: 'New Parent Type',
    dataIndex: 'newParentType'
  },
  {
    title: 'Updated By(Type)',
    dataIndex: 'updatedByRole'
  },
  {
    title: 'Updated At',
    dataIndex: 'updatedAtFormated'
  },
]

const Page = () => {
  const dispatch = useAppDispatch();
  const formRef = useRef<FormInstance>(null);

  const getData = async (values: any) => {
    const res = await dispatch(listDataInPlayerParentHistory({
      ...values,
    }));
    const dataWithNo = res.payload.map((item: any, index: number) => ({
      ...item,
      'NO.': index + 1,
      'updatedAtFormated': updatedAtFormated(item.updatedAt)
    }))
    return {
      // data: res.payload as any[],
      data: dataWithNo as any[]
    }
  }

  const updatedAtFormated = (updatedAt: any) => {
    return dayjs(updatedAt).format('DD MMM, YYYY HH:mm:ss');
  }

  const getTotal = (values: any) => {
    return dispatch(countDataInPlayerParentHistory(values)).then(res => res.payload)
  }

  const FilterFields: FilterItem[] = useMemo(() => ([
    {
      name: 'userName',
      type: FilterInputType.Input,
      inputProps: {
        placeholder: 'User Name'
      }
    },
  ]), [formRef.current])

  return (
    <TableReport
      title='Player Parent History'
      formRef={formRef}
      columns={columns}
      filterFields={FilterFields}
      getData={getData}
      getTotal={getTotal}
      // firstLoad={false}
    />
  )
};
export default Page;