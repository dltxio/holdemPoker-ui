import { FilterInputType } from "@/components/shared/filter/Filter";
import { TableColumnType } from "@/components/shared/table/Table";
import TableReport from "@/components/table-report/TableReport";
import { showAlert } from "@/store/global/action";
import { useAppDispatch } from "@/store/hooks";
import { transactionHistoryCustomerSupport } from "../store/action";

const FilterFields = [
  {
    name: 'userName',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Username',
    },
  },
  {
    name: 'email',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Email',
    },
  },
  {
    name: 'mobileNumber',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Mobile Number',
    },
  },
  {
    name: 'transactionId',
    type: FilterInputType.Input,
    inputProps: {
      placeholder: 'Transaction ID',
    },
  },
];
const columns: TableColumnType[] = [
  {
    title: 'S No.',
    dataIndex: 'NO.'
  },
  {
    title: 'Date and Time ',
    dataIndex: 'dateAndTime'
  },
  {
    title: 'Amount',
    dataIndex: 'displayAmount'
  },
  {
    title: 'AddChips/Cashout',
    dataIndex: 'AddChipsCashOut'
  },
  {
    title: 'Transfer Mode',
    dataIndex: 'transferModeDisplay'
  },
  {
    title: 'Bonus Code',
    dataIndex: 'bonusCode'
  },
  {
    title: 'Bonus Amount',
    dataIndex: 'bonusAmount'
  },
  {
    title: 'Net Amount',
    dataIndex: 'netAmountDispay'
  },
  {
    title: 'Status',
    dataIndex: 'status'
  },
  {
    title: 'Transaction Id',
    dataIndex: 'transactionIdDisplay'
  },
]
const Page = () => {
  const dispatch = useAppDispatch();
  const getData = async (values: any) => {
    try {
      console.log(values)

      if (!values.userName && !values.transactionId && !values.email && !values.mobileNumber) {
        // dispatch(showAlert({ title: 'Error!', content: 'Please provide at least one filter' }));
        return {
          data: []
        }
      }
      const res = await dispatch(transactionHistoryCustomerSupport({
        ...values,
        limit: 0,
        skip: 0
      }));
      if(res?.payload?.result){
        return {
          data: res?.payload?.result as any[],
        }
      } else {
        throw res;
      }
   
    } catch (e: any) {
      dispatch(showAlert({ title: e?.error?.message }));
      return {
        data: []
      }
    }
  }
  return (
    <TableReport
      title='Transaction History Of Player'
      columns={columns}
      filterFields={FilterFields}
      getData={getData}
      firstLoad={false}
      formProps={{
        onExport: undefined
      }}
    />
  )
};

export default Page;