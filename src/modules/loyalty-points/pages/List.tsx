import { useBusyContext } from "@/components/shared/busy";
import { Button } from "@/components/shared/button/Button";
import { useConfirmationContext } from "@/components/shared/confirmation";
import { FilterInputType, FilterItem } from "@/components/shared/filter/Filter";
import { Note } from "@/components/shared/note/Note";
import { TableColumnType } from "@/components/shared/table/Table";
import TableReport from "@/components/table-report/TableReport";
import { formatNumber } from "@/helpers/number";
import { useAppDispatch } from "@/store/hooks";
import { FormInstance } from "antd";
import dayjs from "dayjs";
import { Fragment, useRef, useState } from "react";
import { useNavigate } from "react-router";

import { listLoyaltyPoints } from "../store/action";

const Actions = ({ row, reload }: any) => {
  const dispatch = useAppDispatch();
  const { showBusy, hideBusy } = useBusyContext();
  const nav = useNavigate();
  const cf = useConfirmationContext();

  return (
    <Fragment>
       <div className="table-button-cell">
          <Button
            text="Edit Loyalty points"
            type="secondary"
            rounded={true}
            icon="bi-pencil-square"
            onClick={() => nav(`/loyaltyPoints/${row._id}`)}
          />
        </div>
    </Fragment>
  );
}

const columns: TableColumnType[] = [
  {
    title: ' Loyalty Level',
    dataIndex: 'loyaltyLevel'
  },
  {
    title: 'Level Threshold Amount',
    dataIndex: 'levelThreshold'
  },
  {
    title: 'Percent Reward',
    dataIndex: 'percentReward'
  },
  {
    title: 'Last Updated',
    dataIndex: 'times'
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
    const res = await dispatch(listLoyaltyPoints({
      ...values,
    }));
    const dataWithSNo = res.payload.map((item: any, index: any) => ({
      ...item,
      times: dayjs(item.updatedAt).format('DD-MM-YYYY hh:mm:ss')
    }));

    return {
      data: dataWithSNo,
    }
  }

  return (
    <TableReport
      title='List Loyalty Points'
      formRef={formRef}
      columns={columns}
      getData={getData}
      firstLoad={true}
      pageSize={20}
      formProps={{
        onExport: undefined
      }}
    />
  )
};


export default Page;