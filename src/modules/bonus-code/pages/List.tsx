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
import { BonusCodeStatusEnum } from "../models/DepositCode";

import { countBonusDeposit, instantBonusExpire, listBonusDeposit } from "../store/action";

const Actions = ({ row, reload }: any) => {
  const dispatch = useAppDispatch();
  const { showBusy, hideBusy } = useBusyContext();
  const nav = useNavigate();
  const cf = useConfirmationContext();

  const handleExpire = async () => {
    try {
      await cf.showConfirm({
        message: 'Are you sure about expiring this bonus code?'
      })
      showBusy();
      const res = await dispatch(instantBonusExpire({
        id: row._id
      }));
      row.status = BonusCodeStatusEnum.EXPIRED;
      hideBusy();
    } catch (e) {
      console.log(e);
      hideBusy();
    }

  }
  return (
    <Fragment>
      {
        (row.status !== BonusCodeStatusEnum.EXPIRED) &&
        <div className="table-button-cell">
          <Button
            text="Edit description"
            type="secondary"
            rounded={true}
            icon="bi-pencil-square"
            onClick={() => nav(`/bonusDeposit/${row._id}`)}
          />
          <Button
            text="Instant expire"
            type="danger"
            rounded={true}
            icon="bi-pencil-square"
            onClick={handleExpire}
          />
        </div>

      }
    </Fragment>
  );
}


const FilterFields: FilterItem[] = [
  {
    name: 'codeName',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Bonus Code Name'
    }
  },

  {
    name: 'createdBy',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'CREATED BY'
    }
  },
]
const columns: TableColumnType[] = [
  {
    title: 'S No.',
    dataIndex: 'NO.'
  },
  {
    title: ' Bonus Code Name',
    dataIndex: 'codeName'
  },
  {
    title: 'Bonus Code Type',
    dataIndex: 'typeName'
  },
  {
    title: 'Bonus Code Category',
    dataIndex: 'categoryName'
  },
  {
    title: 'Created By',
    dataIndex: 'createdBy'
  },
  {
    title: 'Instant Bonus Percent',
    dataIndex: 'instantBonusPercent',
    customRender: ({ row, value }) => {
      return <span>{value}%</span>
    }
  },
  {
    title: 'Locked Bonus Percent',
    dataIndex: 'lockedBonusPercent',
    customRender: ({ row, value }) => {
      return <span>{value}%</span>
    }
  },
  {
    title: 'Min. Loyality Level',
    dataIndex: 'loyalityLevelName'
  },
  {
    title: 'Min. Amount',
    dataIndex: 'minAmount'
  },
  {
    title: 'Max. Amount',
    dataIndex: 'maxAmount'
  },
  {
    title: 'Instant Cap Amount',
    dataIndex: 'instantCap',
    customRender: ({ row, value }) => {
      return <span>{value || '0'}</span>
    }
  },
  {
    title: 'Locked Cap Amount',
    dataIndex: 'lockedCap'
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    customRender: ({ row, value }) => {
      return <span>{dayjs(value).format('DD-MM-YYYY')}</span>
    }
  },
  {
    title: 'Total Used',
    dataIndex: 'totalUsed'
  },
  {
    title: 'Expires On',
    dataIndex: 'validTill',
    customRender: ({ row, value }) => {
      return <span>{dayjs(value).format('DD-MM-YYYY')}</span>
    }
  },
  {
    title: 'Status',
    dataIndex: 'status'
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
    const res = await dispatch(listBonusDeposit({
      ...values,
      keyFromDashboard: 1
    }));
    console.log(res)
    return {
      data: res.payload as any[],
    }
  }

  const getTotal = (values: any) => {
    return dispatch(countBonusDeposit({
      ...values,
      keyFromDashboard: 1
    })).then((res: any) => res.payload);
  }

  return (
    <TableReport
      title='Deposit Code List'
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