import { useMemo, useRef, useState } from 'react';
import { FormInstance, Space, Button } from 'antd';

import TableReport from '@/components/table-update/TableReport';
import { FilterInputType, FilterItem } from '@/components/shared/filter/Filter';
import { useAppDispatch } from '@/store/hooks';
import { TableColumnType } from '@/components/shared/table/Table';
import { getTableUpdate, getCountTableUpdate } from '../../store/action';
import dayjs from '@/core/dayjs';
import { useParams, useNavigate } from 'react-router';
import { useConfirmationContext } from '@/components/shared/confirmation';
import { useBusyContext } from '@/components/shared/busy';

const buttonStyle = {
  borderRadius: '5px',
  gap: '10%',
  backgroundColor: 'white',
  color: '#3598dc'
};

const iconStyle = {
  color: 'red',
};

const hoverButtonStyle = {
  backgroundColor: '#3598dc',
  color: 'white',
};

const Actions = ({ row, reload }: any) => {
  const d = useAppDispatch();
  const nav = useNavigate();
  const cf = useConfirmationContext();
  const bs = useBusyContext();

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className='d-flex' style={{ width: 330 }}>
      <Space
        size={5}
        direction='horizontal'
        wrap
      >
        <Button
          type="primary"
          style={isHovered ? hoverButtonStyle : buttonStyle}
          onClick={() => nav('/table/viewUpdateRecord/' + row._id)}
          className="button"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <i className="bi bi-pencil" style={iconStyle}></i>
          View Edited Fields
        </Button>
      </Space>
    </div>
  )
}

const Page = () => {
  const dispatch = useAppDispatch();
  const formRef = useRef<FormInstance>(null);
  const params = useParams();

  const getData = async ({...values }: any) => {
    console.log("values============  ", values);
    // const startDate = values.startDate || dayjs().utcOffset(0).subtract(1, 'month').startOf('month').valueOf();
    // const endDate = values.endDate || dayjs().utcOffset(0).endOf('month').valueOf();
    const startDate = values.startDate
    const endDate = values.endDate
    // delete values.startDate;
    // delete values.endDate;
    const res = await dispatch(getTableUpdate({
      // date: {
        //   $gte: startDate,
        //   $lt: endDate,
        // },
        // date: {
          //   startDate: startDate,
          //   endDate: endDate,
          // },
          ...values,
          startDate,
          endDate,
          channelId: params.id
        }));
        console.log("res==== ", res);
    return {
      data: res.payload as any[],
    }
  }

  const getTotal = (values: any) => {
    return dispatch(getCountTableUpdate(values)).then(res => res.payload)
  }

  const FilterFields: FilterItem[] = useMemo(() => ([
    {
      name: 'startDate',
      type: FilterInputType.Date,
      inputProps: {
        placeholder: 'Start date',
        // picker: 'month'
      }
    },
    {
      name: 'endDate',
      type: FilterInputType.Date,
      inputProps: {
        placeholder: 'End date',
        // picker: 'month'
      }
    },
  ] as FilterItem[]), [formRef.current])

  const columns: TableColumnType[] = useMemo(() => ([
    {
      title: 'Table Name',
      dataIndex: 'tableName'
    },
    {
      title: 'Edited by',
      dataIndex: 'displayDate',
    },
    {
      title: 'Edited on',
      dataIndex: 'amount',
    },
    {
      title: 'Edited from (IP address)',
      dataIndex: 'transferMode'
    },
    {
      title: 'Updated Fields',
      dataIndex: 'updateFields'
    },
    {
      title: 'Actions',
      dataIndex: '',
      customRender(props) {
        return (
          <Actions {...props} />
        )
      }
    }
  ]), [])

  return (
    <TableReport
      title='Updates History'
      formRef={formRef}
      columns={columns}
      filterFields={FilterFields}
      formProps={{
        layout: 'vertical'
      }}
      getData={getData}
      getTotal={getTotal}
      // firstLoad={false}
    />
  )
};
export default Page;