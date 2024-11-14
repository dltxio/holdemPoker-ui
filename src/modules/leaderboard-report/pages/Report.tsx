import { Button } from "@/components/shared/button/Button";
import { FilterInputType, FilterItem } from "@/components/shared/filter/Filter";
import { TableColumnType } from "@/components/shared/table/Table";
import TableReport from "@/components/table-report/TableReport";
import { LeaderboardTypes } from "@/modules/leaderboard/models/Leaderboard";
import { useAppDispatch } from "@/store/hooks";
import { FormInstance } from "antd";
import { Fragment, useRef } from "react";
import { useNavigate } from "react-router";
import { listLeaderboardReport, getLeaderboardReportCount } from "../store/action";
import dayjs from "@/core/dayjs";

const Actions = ({ row }: any) => {
  const nav = useNavigate();


  const handleView = () => {
    nav(`/leaderboardReport/detail/${row._id}`);
  };

  return (
    <Fragment>
      <div className="table-button-cell">
        <Button
          text="View Result"
          type="secondary"
          rounded={true}
          onClick={handleView}
          icon="bi-pencil-square"
        />

      </div>
    </Fragment>
  );
}

const FilterFields: FilterItem[] = [
  {
    name: 'startTime',
    type: FilterInputType.Date,
    inputProps: {
      placeholder: 'Start time',
      picker: 'date',
      showTime: true
    }
  },

  {
    name: 'endTime',
    type: FilterInputType.Date,
    inputProps: {
      placeholder: 'End Time',
      picker: 'date',
      showTime: true
    }
  },
  {
    name: 'leaderboardId',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Leaderboard Id'
    }
  },
  {
    name: 'leaderboardType',
    type: FilterInputType.Select,
    inputProps: {
      placeholder: 'Leaderboard Type',
      options: LeaderboardTypes,
    }
  },
]

const columns: TableColumnType[] = [
  {
    title: 'S No.',
    dataIndex: 'NO.'
  },
  {
    title: 'Leaderboard Id',
    dataIndex: 'leaderboardId'
  },
  {
    title: 'Leaderboard Name',
    dataIndex: 'leaderboardName'
  },
  {
    title: 'Leaderboard Type',
    dataIndex: 'leaderboardTypeDisPlay'
  },
  {
    title: 'Start Time',
    dataIndex: 'startTimeDisplay'
  },
  {
    title: 'End Time',
    dataIndex: 'endTimeDisplay'
  },
  {
    title: 'Min. Leaderboard Points',
    dataIndex: 'minVipPoints'
  },
  {
    title: 'Min. Hands',
    dataIndex: 'minHands'
  },
  {
    title: 'Total Prize Pool',
    dataIndex: 'totalPrizePool'
  },
  {
    title: 'Actions',
    dataIndex: '',
    customRender: (props) => <Actions {...props} />
  }
]

const Page = () => {
  const dispatch = useAppDispatch();
  const formRef = useRef<FormInstance>(null);

  const getData = async (values: any) => {
    const res = await dispatch(listLeaderboardReport({
      ...values,
    }));
    console.log(res);
    const dataWithNo = res.payload.map((item: any, index: number) => ({
      ...item,
      'NO.': index + 1,
      'leaderboardTypeDisPlay': leaderboardTypeDisPlay(item.leaderboardType),
      'startTimeDisplay': startTimeDisplay(item.startTime),
      'endTimeDisplay': startTimeDisplay(item.endTime),
      
    }))
    return {
      data: dataWithNo as any[],
    }
  }

  const startTimeDisplay = (timeString: any) => {
    return dayjs(timeString).format('DD-MM-YYYY hh:mm a')
}

  const leaderboardTypeDisPlay = (leaderboardType: any) => {
    return LeaderboardTypes.find(x => x.value === leaderboardType)?.label;
}

  const getTotal = (values: any) => {
    return dispatch(getLeaderboardReportCount({})).then(res => res.payload);
  }


  const onReset = () => {
    formRef.current?.setFieldValue('leaderboardType', undefined)
  }
  return (
    <TableReport
      title='Leaderboard Report'
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