import { Fragment, useEffect, useRef, useState } from 'react';

// Components
import { Breadcrumb } from '@/components/shared/breadcrumb/Breadcrumb';
import { Heading } from '@/components/shared/heading/Heading';
import { Button } from '@/components/shared/button/Button';
import { PaginationProps } from '@/components/shared/pagination/Pagination';

import './ListLeaderboardSet.scss';
import { Table, TableColumnType } from '@/components/shared/table/Table';
import { changeViewOfSet, countLeaderboardSets, deleteLeaderboardSet, getLeaderboardSets } from '../../store/action';
import { useAppDispatch } from '@/store/hooks';
import { cleanObject } from '@/helpers/object';
import { FilterForm, FilterInputType, FilterItem } from '@/components/shared/filter/Filter';
import { FormInstance } from 'antd/es/form/Form';
import { showAlert } from '@/store/global/action';
import { useNavigate } from 'react-router';
import TableReport from '@/components/table-report/TableReport';
import { useConfirmationContext } from '@/components/shared/confirmation';
import { useBusyContext } from '@/components/shared/busy';
import { Space } from 'antd';
import { useParams } from 'react-router';

const FilterFields: FilterItem[] = [
  {
    name: 'leaderboardSetName',
    type: FilterInputType.Input,
    label: 'Leaderboard Set Name:',
    inputProps: {
      placeholder: 'Leaderboard Set Name'
    }
  },
  {
    name: 'leaderboardSetId',
    label: 'Leaderboard Set Id:',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Leaderboard Set Id'
    }
  },
]

const Actions = ({ row, reload }: any) => {
  const d = useAppDispatch();
  const nav = useNavigate();
  const cf = useConfirmationContext();
  const bs = useBusyContext();
  
  const toogleEnable = async () => {
    try {
      bs.showBusy();
      const id = row.leaderboardSetId;
      const force = !row.onView;
      await d(changeViewOfSet({ leaderboardSetId: id,  onView: force}));
      d(showAlert({ title: `Sucessfully ${force ? 'enabled' : 'disabled'} this leaderboard set!` }))
      reload && reload();
    } finally {
      bs.hideBusy();
    }
  }

  const handleDelete = async () => {
    const id = row._id;
    await cf.showConfirm({
      message: 'Are you sure you want to delete the leaderboard set?'
    })
    try {
      bs.showBusy();
      await d(deleteLeaderboardSet(row));
      d(showAlert({ title: `Sucessfully deleted this this leaderboard set!` }))
      reload && reload();
    } finally {
      bs.hideBusy();
    }
  } 

  return (
  <div className='d-flex'>
    <Space
      size={'small'}
      direction='horizontal'
    >
    <Button
      text={row.onView ? "Disable" : 'Enable'}
      type={row.onView ? "danger" : 'primary'}
      rounded={true}
      onClick={toogleEnable}
      icon="bi-arrow-return-right"
    />
    {/* <Button
      text="View"
      type="info"
      rounded={true}
      onClick={() => {}}
      icon="bi-arrow-return-right"
    /> */}

    {/* <Button
      text="Edit"
      type="warning"
      rounded={true}
      onClick={() => nav('/leaderboardSet/edit/' + row.leaderboardSetId)}
      icon="bi-pencil"
    />
    <Button
      text="Delete"
      type="danger"
      rounded={true}
      onClick={handleDelete}
      icon="bi-arrow-return-right"
    /> */}
    </Space>
  </div>
  )
}

const Page = () => {
  const dispatch = useAppDispatch();
  const tableRef = useRef<any>(null);
  const formRef = useRef<FormInstance>(null);
  const params = useParams();
  const [initialValues, setInitialValues] = useState<any>({})
  const columns: TableColumnType[] = [
    {
      title: 'Sr no.',
      dataIndex: 'NO.'
    },
    {
      title: 'Leaderboard Set Name',
      dataIndex: 'leaderboardSetName'
    },
    {
      title: 'Leaderboard Set Id',
      dataIndex: 'leaderboardSetId'
    },
    {
      title: 'Created At',
      dataIndex: 'createdAtFormated'
    },
    {
      title: 'Actions',
      dataIndex: '',
      customRender: (props) => <Actions {...props} reload={() => tableRef.current?.reload()}/>
    }
  ]

  const getData = async (values: any) => {
    const res = await dispatch(getLeaderboardSets({
      ...values,
      leaderboardSetId: params.id
    }));
    const leaderboard = res.payload.length ? res.payload[0].leaderboardList[0] : null;
    if (leaderboard) {
      formRef.current?.setFieldsValue({
        leaderboardSetName: leaderboard.leaderboardName,
        leaderboardSetId: leaderboard.leaderboardId
      })
      setInitialValues({
        leaderboardSetName: leaderboard.leaderboardName,
        leaderboardSetId: leaderboard.leaderboardId
      })
    }
    return {
      data: res.payload
    }
  }

  const getTotal = () => dispatch(countLeaderboardSets({})).then(res => res.payload);

  return (
    <TableReport
      title="View Leaderboard Set"
      formRef={formRef}
      tableRef={tableRef}
      columns={columns}
      filterFields={FilterFields}
      getData={getData}
      getTotal={getTotal}
      firstLoad={true}
      formProps={{
        disabled: true,
        hideAllActions: true,
        initialValues
      }}
      pageSize={20}
    />
  )
};

export default Page;