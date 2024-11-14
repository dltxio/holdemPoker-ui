import { Breadcrumb } from "@/components/shared/breadcrumb/Breadcrumb";
import { useBusyContext } from "@/components/shared/busy";
import { Button } from "@/components/shared/button/Button";
import { useConfirmationContext } from "@/components/shared/confirmation";
import { FilterForm, FilterInputType, FilterItem } from "@/components/shared/filter/Filter";
import { Heading } from "@/components/shared/heading/Heading";
import { PaginationProps } from "@/components/shared/pagination/Pagination";
import { Table, TableColumnType } from "@/components/shared/table/Table";
import { listPlayers } from "@/modules/passbook/store/action";
import { showAlert } from "@/store/global/action";
import { useAppDispatch } from "@/store/hooks";
import { unwrapResult } from "@reduxjs/toolkit";
import { FormInstance, Space } from "antd";

import { Fragment, useRef, useState } from "react";
import { disableOrEnablePlayerChat, playerChat } from "../../store/action";
import FileSaver from 'file-saver';


import "./PlayerChat.scss"
import dayjs from "dayjs";

export const PAGE_SIZE = 20;


const Actions = ({ row, reload }: any) => {
  const d = useAppDispatch();
  const cf = useConfirmationContext();
  const bs = useBusyContext();


  const handleDisable = async () => {
    const id = row._id;
    let status = 'disable';
    if (row?.settings?.adminChat === undefined || row?.settings?.adminChat === true) {
      status = 'disable';
    } else {
      status = 'enable';
    }
    await cf.showConfirm({
      message: `Are you sure you want to ${status} chat of this player!`
    })
    try {
      bs.showBusy();
      unwrapResult(await d(disableOrEnablePlayerChat({
        id,
        adminChat: status === 'enable'
      })));
      d(showAlert({ title: status === 'disable' ? `The player chat will be deactivated after end of this schedule.` : 'The chat of this player will be activated.' }));
      row.settings.adminChat = status === 'enable';
      reload && reload();
    } finally {
      bs.hideBusy();
    }
  }

  const exportHistory = (header: any, body: any) => {
    const blob = new Blob([header, '\n' + body], { type: 'text/plain;charset=utf-8' });
    FileSaver.saveAs(blob, `PlayerChatReport.csv`);
  }

  const handleViewChat = async () => {

    try {
      bs.showBusy();
      const res = await unwrapResult(await d(playerChat({
        playerName: row.userName,
      })));
      console.log(res)
      const list = res.map((x: any)=>({
        userName: x.playerName, 
        time: new Date(x.time),
        text: x.text,
        tableName: x.channelName
      }))
      const header = ['Player User Name','Time','Text Message','Table Name'].join(',')
      const body = list.map((item: any) => {
        return Object.values(item).join(',')
      }).join('\n');
      exportHistory(header,body);
    } finally {
      bs.hideBusy();
    }
  }

  return (
    <div className='d-flex align-items-center justify-content-center' >

      {(row?.settings?.adminChat === undefined || row?.settings?.adminChat === true) && <Button
        text="Disable"
        type="danger"
        rounded={true}
        onClick={handleDisable}
        icon="bi-pencil-square"
      />}

      {row?.settings?.adminChat === false && <Button
        text="Enable"
        type="info"
        rounded={true}
        onClick={handleDisable}
        icon="bi-pencil-square"
      />}
      <Button
        text="View chat"
        type="secondary"
        rounded={true}
        onClick={handleViewChat}
        icon="bi-download"
      />
    </div>
  )
}
const FilterFields: FilterItem[] = [
  {
    name: 'userId',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Player Username',
    },
  },
];


const columns: TableColumnType[] = [
  {
    title: 'S No.',
    dataIndex: 'NO.'
  },
  {
    title: 'Username',
    dataIndex: 'userName'
  },
  {
    title: 'Chat status',
    dataIndex: 'status'
  },
  {
    title: 'Actions',
    dataIndex: '',
    customRender(props) {
      return (
        <Actions {...props} />
      )
    }
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
      const res: any = await dispatch(listPlayers(formValues));
      const data = res?.payload;
      setData(data);
      console.log('data', data);
      if (data && Array.isArray(data)) {
        const pageSize = pagination.pageSize || PAGE_SIZE;
        const current = pagination.current || 1;
        const list = data.slice(pageSize * (current - 1), pageSize * current);
        setDisplayData(list);
      }
      setPagination({
        ...pagination,
        total: data.length
      });
    } finally {
      hideBusy();
    }
  };


  const handleOnReset = () => {
    filterFormRef.current?.resetFields();
    setDisplayData([]);
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
      setDisplayData(list);
    }
  };

  return (
    <Fragment>
      <div className="player-chat">
        <Breadcrumb />

        <Heading title='Player Chat Management' type='info' solid={true} />

        <div className="player-chat__wrapper default">
          <div className='player-chat__filter'>
            <FilterForm
              ref={filterFormRef}
              items={FilterFields}
              onFinish={handleFilterSubmit}
              onReset={handleOnReset}
              onExport={undefined}
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