import { FilterInputType, FilterItem } from "@/components/shared/filter/Filter";
import { Note } from "@/components/shared/note/Note";
import { TableColumnType } from "@/components/shared/table/Table";
import TableReport from "@/components/table-report/TableReport";
import { formatNumber } from "@/helpers/number";
import { useAppDispatch } from "@/store/hooks";
import { FormInstance } from "antd";
import { useRef, useState } from "react";
import { PlayerStatus } from "../models/PlayerInfoReport";
import { countDataInPlayerInfoReport, listDataInPlayerInfoReport } from "../store/action";



const FilterFields: FilterItem[] = [
  {
    name: 'userName',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Username'
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
      placeholder: 'Mobile No.'
    }
  },
  {
    name: 'status',
    type: FilterInputType.Select,
    inputProps: {
      placeholder: 'Player Status',
      options: PlayerStatus,
      defaultValue:'Active'
    }
  },
]
const columns: TableColumnType[] = [
  {
    title: 'S No.',
    dataIndex: 'NO.'
  },
  {
    title: 'User Name',
    dataIndex: 'userName'
  },
  {
    title: 'Full Name',
    dataIndex: 'fullName'
  },
  {
    title: 'Parent Name/Type',
    dataIndex: 'parentNameType'
  },
  {
    title: 'Status',
    dataIndex: 'status'
  },
  {
    title: 'Last Active Since',
    dataIndex: 'lastActiveSince'
  },
  {
    title: 'Registered At',
    dataIndex: 'registeredAt'
  },
  {
    title: 'Mobile No.',
    dataIndex: 'mobileNo'
  },
  {
    title: 'Email ID',
    dataIndex: 'emailId'
  }
]

const Page = () => {
  const dispatch = useAppDispatch();
  const formRef = useRef<FormInstance>(null);

  const getData = async (values: any) => {
    const res = await dispatch(listDataInPlayerInfoReport({
      ...values,
    }));
    console.log(res)
    return {
      data: res.payload as any[],
    }
  }

  const getTotal = (values: any) => {
    return dispatch(countDataInPlayerInfoReport({...values})).then(res => res.payload);
  }

  return (
    <TableReport
      title='Player Info Report'
      formRef={formRef}
      columns={columns}
      filterFields={FilterFields}
      getData={getData}
      getTotal={getTotal}
      firstLoad={true}
      pageSize={20}
      formProps={{
        onExport: undefined
      }}
    />
  )
};


export default Page;