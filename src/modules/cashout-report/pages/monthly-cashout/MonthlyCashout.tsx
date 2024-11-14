import { FilterInputType, FilterItem } from "@/components/shared/filter/Filter";
import { TableColumnType } from "@/components/shared/table/Table";
import TableReport from "@/components/table-report/TableReport";
import dayjs from "@/core/dayjs";
import { showAlert } from "@/store/global/action";
import { useAppDispatch } from "@/store/hooks";
import { Fragment, useState } from "react";
import { findDailyCashoutDateFilter, findDailyCashoutReport, monthlyCashoutReport } from "../../store/action";
import './MonthlyCashout.scss';
const FilterFields: FilterItem[] = [
    {
        name: 'dateRange',
        type: FilterInputType.DateRange,
        inputProps: {
            placeholder:['Start Month','End Month']
        },
        rules:[{
            required: true,
            message:'Please provide start date & end date.'
        }]
    }
];
const columns: TableColumnType[] = [
    {
        title: 'S No.',
        dataIndex: 'NO.'
    },
    {
        title: 'Month',
        dataIndex: 'displayDate',
    },
    {
        title: 'Total Amount',
        dataIndex: 'totalAmount'
    },
    {
        title: 'Rejected Amount',
        dataIndex: 'rejectedAmount'
    },
    {
        title: 'Approved Amount',
        dataIndex: 'successAmount'
    },
    {
        title: 'Transfer Mode',
        dataIndex: 'transferMode'
    }
]
const Page = () => {
    const dispatch = useAppDispatch();
    const [firstLoad, setFirstLoad] = useState(true);

    const getData = async (values: any) => {
        try {
            console.log(values)

            // if (!values.endDate && !values.endDate && !firstLoad) {
            //     dispatch(showAlert({ title: 'Please provide start date & end date.' }));
            //     return {
            //         data: []
            //     }
            // }

            const params = {
                ...values,
                createdAt: {
                    '$gte': values?.startDate?.valueOf() || dayjs().add(-1, 'months').startOf('month').valueOf(),
                    '$lte': values?.endDate?.valueOf() || dayjs().startOf('month').valueOf()
                }
            }
            if (params.startDate) {
                delete params.startDate;
            }
            if (params.endDate) {
                delete params.endDate;
            }
            delete params.skip;
            delete params.limit;
            let startDate = new Date(values?.startDate?.valueOf());
            let endDate = new Date(values?.endDate?.valueOf());
            startDate.setDate(1);
            endDate.setDate(1);
            endDate.setMonth(endDate.getMonth() + 1);
            const res = await dispatch(monthlyCashoutReport({
                ...params,
                createdAt: {
                    '$gte': values?.startDate?.valueOf() || dayjs().add(-1,'months').valueOf(),
                    '$lt': values?.endDate?.valueOf() || dayjs().valueOf()
                }
            }));
            if (res?.payload?.result) {
                const dataWithNo = res?.payload?.result.map((item: any, index: number) => ({
                    ...item,
                    'NO.': index + 1,
                    'totalAmount': totalAmount(item.successAmount, item.rejectedAmount),
                    'displayDate': displayDate(item.date)
                }))
                return {
                    // data: res?.payload?.result as any[],
                    data: dataWithNo as any[]
                }
            } else {
                throw res;
            }


        } catch (e: any) {
            console.log(e)
            dispatch(showAlert({ title: e?.error?.message }));
            return {
                data: []
            }
        } finally {
            setFirstLoad(false);
        }
    }

    const totalAmount = (successAmount: any, rejectedAmount: any) => {
        return successAmount + rejectedAmount;
    }
    const displayDate = (date: any) => {
        return dayjs(date).format('MMM-YYYY');
    }

    return (
        <TableReport
            title='Monthly Cashout Report'
            columns={columns}
            filterFields={FilterFields}
            getData={getData}
            firstLoad={true}
            description={
                <Fragment>
                    <p className="table-description">*Shows current month & previous month data by default</p>
                    <p className="table-description">*Cancelled amount data will not display here.</p>
                </Fragment>
            }
        />
    )
};

export default Page;