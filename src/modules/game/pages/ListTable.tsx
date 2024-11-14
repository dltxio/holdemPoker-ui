import { useMemo, useRef, useState, useEffect } from 'react';
import { FormInstance, Space, Button as AntButton } from 'antd';

import TableReport from '@/components/table-report-gameTable/TableReport';
import { FilterInputType, FilterItem } from '@/components/shared/filter/Filter';
import { useAppDispatch } from '@/store/hooks';
import { TableColumnType } from '@/components/shared/table/Table';
import { countListTable, disableTable, getListTable, revertTable } from '../store/action';
import dayjs from '@/core/dayjs';
import { Button } from '@/components/shared/button/Button';
import { useNavigate } from 'react-router';
import { useConfirmationContext } from '@/components/shared/confirmation';
import { useBusyContext } from '@/components/shared/busy';
import { showAlert } from '@/store/global/action';
import { GameVariations, PrivateTableOptions, TableChipsTypes, TableStates, TurnTimeOptions } from '../models/Table';
import { unwrapResult } from '@reduxjs/toolkit';
import schedule from 'node-schedule'

const Actions = ({ row, reload }: any) => {
  const d = useAppDispatch();
  const nav = useNavigate();
  const cf = useConfirmationContext();
  const bs = useBusyContext();
  
  const toogleEnable = async () => {
    await cf.showConfirm({
      message: `Are you sure you want to ${row.isActive ? 'disable' : 'enable'} this table?`
    });
  
    try {
      bs.showBusy();
      const id = row._id;
      const force = !row.isActive;
      await d(disableTable({ id: id, isActive: force }));
      d(showAlert({ title: 'Successfully !!' }));
  
      row.isActive = force;
  
      reload && reload();
    } finally {
      bs.hideBusy();
    }
  }

  const handleRevert = async () => {
    const id = row._id;
    await cf.showConfirm({
      message: 'Are you sure you want to revert this table?'
    })
    try {
      bs.showBusy();
      const data = unwrapResult(await d(revertTable({
        _id: id,
        isAutoMove: true
      })));
      if (data.success === true) {
        d(showAlert({ title: `Revert table successfully` }))
      } else {
        d(showAlert({ title: `${data.info}` }))
      }
      reload && reload();
    } finally {
      bs.hideBusy();
    }
  }

  const handleRevertAndRemove = async () => {
    const id = row._id;
    await cf.showConfirm({
      message: 'Are you sure you want to revert and remove this table?'
    })
    try {
      bs.showBusy();
      const data = unwrapResult(await d(revertTable({
        _id: id,
        isAutoMove: true,
        revertAndRemove: true
      })));
      if (data.success === true) {
        d(showAlert({ title: `Revert Remove table successfully` }))
      } else {
        d(showAlert({ title: `${data.info}` }))
      }
      reload && reload();
    } finally {
      bs.hideBusy();
    }
  } 

  return (
  <div className='d-flex' style={{width: 330}}>
    <Space
      size={5}
      direction='horizontal'
      wrap
    >
      
      <Button
        text="Edit"
        type="primary"
        rounded={true}
        onClick={() => nav('/table/edit/' + row._id)}
        icon="bi-pencil"
      />
      <Button
        text="View"
        type="primary"
        rounded={true}
        onClick={() => nav('/table/view/' + row._id)}
        icon="bi-pencil"
      />
      <Button
        text="Duplicate"
        type="primary"
        rounded={true}
        onClick={() => nav('/table/duplicate/' + row._id)}
        icon="bi-pencil"
      />
      <Button
        text={row.isActive ? "Disable" : 'Enable'}
        type={row.isActive ? "danger" : 'info'}
        rounded={true}
        onClick={toogleEnable}
        icon="bi-arrow-return-right"
      />
      <Button
        text="Revert"
        type="primary"
        rounded={true}
        onClick={handleRevert}
        icon="bi-pencil"
      />
      <Button
        text="Revert Remove"
        type="primary"
        rounded={true}
        onClick={handleRevertAndRemove}
        icon="bi-pencil"
      />
      <Button
        text="Update History"
        type="primary"
        rounded={true}
        onClick={() => nav('/table/viewUpdatesList/' + row._id)}
        icon="bi-pencil"
      />
    </Space>
  </div>
  )
}

const Page = () => {
  const nav = useNavigate();
  const dispatch = useAppDispatch();
  const formRef = useRef<FormInstance>(null);
  const [searchText, setSearchText] = useState('');
  const [dataTable, setDataTable] = useState([]);

  const getData = async ({ ...values }: any) => {
    const res = await dispatch(getListTable({
      channelType: "NORMAL",
      // channelVariation: "Texas Hold’em",
      channelName: searchText,
      ...values,
    }));
    return {
      data: res.payload as any[],
    }
  }

  // useEffect(() => {
  //   const fetchData = async () => {
  //     console.log("aaaa");
      
  //   }

  //   const scheduleJob = schedule.scheduleJob('*/1 * * * *', fetchData);
  // });

  const fetchDataPeriodically = () => {
    console.log("Fetching data...");
    const timeoutId = setTimeout(async () => {
      await getData({});
      console.log("Data fetched.");
      fetchDataPeriodically();
    }, 60000);

    return timeoutId;
  };

  useEffect(() => {
    const timeoutId = fetchDataPeriodically();

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);


  const getTotal = (values: any) => {
    return dispatch(countListTable({ channelType: "NORMAL", ...values })).then(res => res.payload)
  }

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    console.log("value: ", typeof parseInt(value));
    if (e.key === '+' || e.key === '-') {
      e.preventDefault();
    }
  };

  const FilterFields: FilterItem[] = useMemo(() => ([
    {
      name: 'channelName',
      type: FilterInputType.Input,
      inputProps: {
        placeholder: 'Name'
      }
    },
    {
      name: 'channelVariation',
      type: FilterInputType.Select,
      inputProps: {
        placeholder: 'Type',
        options: [
          {
            label: '-All-',
            value: null
          },
          ...GameVariations
        ]
      }
    },
    {
      name: 'isActive',
      type: FilterInputType.Select,
      inputProps: {
        placeholder: 'status',
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
      name: 'isPrivateTabel',
      type: FilterInputType.Select,
      inputProps: {
        placeholder: 'Private Table',
        disabled: false,
        options: [
          {
            label: '-All-',
            value: null
          },
          ...PrivateTableOptions
        ]
      }
    },
    {
      name: 'minSmallBlind',
      type: FilterInputType.Input,
      inputProps: {
        placeholder: 'Small Blind(min.)',
        type: 'number',
        min: 0,
        onChange: handleInputChange
      }
    },
    {
      name: 'maxSmallBlind',
      type: FilterInputType.Input,
      inputProps: {
        placeholder: 'Small Blind(max.)',
        type: 'number',
        min: 0,
        onChange: handleInputChange
      }
    },
    {
      name: 'minBuyInMin',
      type: FilterInputType.Input,
      inputProps: {
        placeholder: 'Min Buy-In(min.)',
        type: 'number',
        min: 0,
        onChange: handleInputChange
      }
    },
    {
      name: 'minBuyInMax',
      type: FilterInputType.Input,
      inputProps: {
        placeholder: 'Min Buy-In(max.)',
        type: 'number',
        min: 0,
        onChange: handleInputChange
      }
    },
    {
      name: 'minPlayerLimit',
      type: FilterInputType.Input,
      inputProps: {
        placeholder: 'Players(min.)',
        type: 'number',
        min: 0,
        onChange: handleInputChange
      }
    },
    {
      name: 'maxPlayerLimit',
      type: FilterInputType.Input,
      inputProps: {
        placeholder: 'Players(max.)',
        type: 'number',
        min: 0,
        onChange: handleInputChange
      }
    },
    {
      name: 'turnTime',
      type: FilterInputType.Select,
      inputProps: {
        placeholder: 'Select Turn Time',
        options: [
          {
            label: '-All-',
            value: null
          },
          ...TurnTimeOptions
        ]
      }
    },
    {
      name: 'isRealMoney',
      type: FilterInputType.Select,
      inputProps: {
        placeholder: 'Select Chips Type',
        options: [
          {
            label: '-All-',
            value: null
          },
          ...TableChipsTypes
        ]
      }
    },
  ] as FilterItem[]), [formRef.current])

  const columns: TableColumnType[] = useMemo(() => ([
    {
      title: 'Name',
      dataIndex: 'channelName',
    },
    {
      title: 'Game Type',
      dataIndex: 'gameInfoGameVariation',
    },
    {
      title: 'Chips Type',
      dataIndex: 'gameInfoChipsType'
    },
    {
      title: 'Small/Big Blind',
      dataIndex: 'smallOrBigBlind'
    },
    {
      title: 'Min/Max Buy-In',
      dataIndex: 'minMaxBuyIn'
    },
    {
      title: 'Players On Table',
      dataIndex: 'maxPlayers',
    },
    {
      title: 'Active',
      dataIndex: 'activeText'
    },
    {
      title: 'Created At',
      dataIndex: 'CreatedAt'
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy'
    },
    {
      title: 'Last Played',
      dataIndex: 'LastPlayed'
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
      title='Table View & Creation'
      // type='secondary'
      formRef={formRef}
      columns={columns}
      filterFields={FilterFields}
      formProps={{
        layout: 'vertical',
        onExport: undefined
      }}
      getData={getData}
      getTotal={getTotal}
      pageSize={20}
      breadcrumbProps={{
        customActions() {
          return (
            <AntButton
              onClick={() => nav('/createTable')}
              style={{
                height: 'auto',
                background: 'var(--info)',
                border: 'none'
              }}
            >
              <span style={{fontSize: 25, color: 'white'}}>Create</span>
            </AntButton>
          )
        }
      }}
      // getTotal={getTotal}
      // firstLoad={false}
    />
  )
};
export default Page;