import { useBusyContext } from "@/components/shared/busy";
import { FilterInputType, FilterItem } from "@/components/shared/filter/Filter";
import { TableColumnType } from "@/components/shared/table/Table";
import TableReport from "@/components/table-report/TableReport";
import { getListTable } from "@/modules/player-report/store/action";
import { showAlert } from "@/store/global/action";
import { useAppDispatch } from "@/store/hooks";
import { FormInstance } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { listChatHistory, countChatHistory } from "../../store/action";
import dayjs from "dayjs";


const columns: TableColumnType[] = [
  {
    title: 'S No.',
    dataIndex: 'NO.',
  },
  {
    title: 'Username',
    dataIndex: 'playerName'
  },
  {
    title: 'Time',
    dataIndex: 'times'
  },
  {
    title: 'Chat Text',
    dataIndex: 'text'
  },
]

const Page = () => {
  const dispatch = useAppDispatch();
  const bs = useBusyContext();

  const formRef = useRef<FormInstance>(null);
  const [tables, setTables] = useState<any[]>([]);
  useEffect(() => {
    getTables();
  }, [])

  const getTables = async () => {
    try {
      bs.showBusy();
      const res = await dispatch(getListTable({
        "isRealMoney": "true",
        "channelType": "NORMAL"
      }));
      setTables(res.payload)
    } finally {
      bs.hideBusy();
    }
  }
  const FilterFields: FilterItem[] = useMemo(() => ([
    {
      name: 'dateRange',
      type: FilterInputType.DateRange,
      inputProps: {
      }
    },

    {
      name: 'channelId',
      type: FilterInputType.Select,
      inputProps: {
        placeholder: 'Select Tables',
        options: tables.map(item => ({
          label: item.channelName,
          value: item._id
        }))
      }
    },
  ]), [formRef.current, tables]);

  const getData = async (values: any) => {
    console.log("values", values)
    if (Object.values(values).length >= 3) {
      const res = await dispatch(listChatHistory({ ...values }));
      const dataWithSNo = res.payload.map((item: any, index: any) => ({
        ...item,
        'NO.': index + 1,
        times: dayjs(item.time).format('DD-MM-YYYY hh:mm:ss')
      }));

      return {
        data: dataWithSNo,
      }
    } else {
      return {
        data: [],
      }
    }
  }

  const getTotal = (values: any) => {
    if (validate(values)) {
      let params = {
        ...values
      }
      delete params.skip;
      delete params.limit;
      return dispatch(countChatHistory({ ...params })).then(res => res.payload);
    } else {
      return Promise.resolve(0);
    }
  }

  const validate = (values: any) => {
    if (Object.keys(values).length <= 0) {
      dispatch(showAlert({
        title: 'Please provide atleast one filter to search !!'
      }))
      return false;
    }
    if (!values.channelId) {
      // dispatch(showAlert({
      //   title: 'kindly select the table name for search!!'
      // }))
      return false;
    }
    return true;
  }
  return (
    <TableReport
      title='Chat History'
      formRef={formRef}
      columns={columns}
      filterFields={FilterFields}
      getData={getData}
      getTotal={getTotal}
      pageSize={20}
      firstLoad={false}
    />
  )
};

export default Page