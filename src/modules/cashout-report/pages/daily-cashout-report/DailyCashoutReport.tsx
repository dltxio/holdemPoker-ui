import { FilterInputType, FilterItem } from "@/components/shared/filter/Filter";
import { TableColumnType } from "@/components/shared/table/Table";
import TableReport from "@/components/table-report/TableReport";
import dayjs from "@/core/dayjs";
import { showAlert } from "@/store/global/action";
import { useAppDispatch } from "@/store/hooks";
import { FormInstance } from "antd";
import { useRef, useState } from "react";
import { findDailyCashoutDateFilter, findDailyCashoutReport } from "../../store/action";
import './DailyCashoutReport.scss';
const FilterFields: FilterItem[] = [
    {
        name: 'dateRange',
        type: FilterInputType.DateRange,
        rules:[{
            required: true,
            message:'Start Date or End Date are required.'
        }]
    },
    {
        name: 'referenceNo',
        type: FilterInputType.Input,
        inputProps: {
            placeholder: 'Reference no.',
        },
    },
    {
        name: 'sortValue',
        type: FilterInputType.Select,
        inputProps: {
            options: [
                {
                    label: 'Sort by Date',
                    value: 'date'
                },
                {
                    label: 'Sort by Amount',
                    value: 'amount'
                }
            ],
            defaultValue: 'date'
        },
    },
    {
        name: 'userId',
        type: FilterInputType.Input,
        inputProps: {
            placeholder: 'Username',
        },
    },
    {
        name: 'affiliateId',
        type: FilterInputType.Input,
        inputProps: {
            placeholder: 'Agent ID / Sub-Agent ID',
        },
    },
    {
        name: 'minAmount',
        type: FilterInputType.Input,
        inputProps: {
            placeholder: 'Min. Amount',
            type: 'number',
            min: 0
        },
    },
    {
        name: 'maxAmount',
        type: FilterInputType.Input,
        inputProps: {
            placeholder: 'Max. Amount',
            type: 'number',
            min: 0
        },
    },
];
const columns: TableColumnType[] = [
    {
        title: 'S No.',
        dataIndex: 'NO.'
    },
    {
        title: 'Date',
        dataIndex: 'displayDate',
    },
    {
        title: 'Amount',
        dataIndex: 'displayAmount'
    },
    {
        title: 'Username',
        dataIndex: 'userName'
    },
    {
        title: 'Reference ID',
        dataIndex: 'referenceId'
    },
    {
        title: 'Status',
        dataIndex: 'statusDisplay'
    },
    {
        title: 'Bank Transaction ID',
        dataIndex: 'transactionId'
    },
    {
        title: 'Agent ID/Sub-agent ID',
        dataIndex: 'agent'
    },
    {
        title: 'Transfer Mode',
        dataIndex: 'mode'
    }
]

enum Status {
    Success = 'Success',
    Approved = 'Approved'
}

const Page = () => {
    const dispatch = useAppDispatch();
    const formRef = useRef<FormInstance>(null);

    const [firstLoad, setFirstLoad] = useState(true);
    const getData = async (values: any) => {
        try {
            const params = {
                ...values,
            }

            delete params.skip;
            delete params.limit;
            if ((!params?.createdAt && !params?.createdAt) || firstLoad) {
                const res = await dispatch(findDailyCashoutReport({ ...params, sortValue: params.sortValue }));
                setFirstLoad(false)
                console.log(res)
                if (res?.payload?.result) {
                    const dataWithNo = res?.payload?.result.map((item: any, index: number) => ({
                        ...item,
                        'NO.': index + 1,
                        'displayDate': displayDate(item.createdAt, item.actionTakenAt),
                        'displayAmount': displayAmount(item.amount, item.requestedAmount),
                        'referenceId': referenceId(item.referenceNumber, item.referenceNo),
                        'statusDisplay': statusDisplay(item.status),
                        'agent': agent(item.affilateId, item.affiliateId),
                        'mode': mode(item.actionTakenAt)
                    }))
                    return {
                        // data: res?.payload?.result as any[],
                        data: dataWithNo as any[]
                    }
                } else {
                    throw res;
                }
            } else {
                params.createdAt = {};
                if (values.startDate) {
                    params.createdAt['$gte'] = values?.startDate?.valueOf()
                    delete params.startDate;
                }
                if (values.endDate) {
                    params.createdAt['$lte'] = values?.endDate?.valueOf()
                    delete params.endDate;
                }
                const res = await dispatch(findDailyCashoutDateFilter(params));
                if (res?.payload?.result) {
                    const dataWithNo = res?.payload?.result.map((item: any, index: number) => ({
                        ...item,
                        'NO.': index + 1,
                        'displayDate': displayDate(item.createdAt, item.actionTakenAt),
                        'displayAmount': displayAmount(item.amount, item.requestedAmount),
                        'referenceId': referenceId(item.referenceNumber, item.referenceNo),
                        'statusDisplay': statusDisplay(item.status),
                        'agent': agent(item.affilateId, item.affiliateId),
                        'mode': mode(item.actionTakenAt)
                    }))
                    return {
                        // data: res?.payload?.result as any[],
                        data: dataWithNo as any[]
                    }
                } else {
                    throw res;
                }
            }


        } catch (e: any) {
            console.log(e)
            dispatch(showAlert({ title: e?.error?.message }));
            return {
                data: []
            }
        }
    }

    const displayDate = (createdAt: any, actionTakenAt: any) => {

        if (
            createdAt && !
            actionTakenAt) {
            return dayjs(createdAt).format('DD-MM-YYYY HH:mm');
        } else if (actionTakenAt) {
            return dayjs(actionTakenAt).format('DD-MM-YYYY HH:mm');
        }
    }
    const displayAmount = (amount: any, requestedAmount: any) => {
        if (amount) {
            return amount;
        }
        if (requestedAmount) {
            return requestedAmount;
        }
        return 'N/A';
    }
    const referenceId = (referenceNumber: any, referenceNo: any) => {
        if (referenceNumber) {
            return referenceNumber;
        }
        if (referenceNo) {
            return referenceNo
        }
        return 'N/A';
    }

    const statusDisplay = (status: any) => {
        if (
            status === Status.Success || 
            status === Status.Approved){
            return 'Success'
        } else {
            return status;
        }
    }
    const agent = (affilateId: any, affiliateId: any) => {
        if(affilateId && !affiliateId){
            return affilateId;
        };
        if(!affilateId && affiliateId){
            return affiliateId
        };
        return 'N/A'
    }

    const mode = (actionTakenAt: any) => {
        if(actionTakenAt){
            return 'Direct Cashout';
        } else {
            return 'Bank Transfer';
        }
    }

    return (
        <TableReport
            title='Daily Cashout Report'
            columns={columns}
            filterFields={FilterFields}
            getData={getData}
            firstLoad={true}
            description={<span className="table-description">*Shows entries within last 24 hrs. by default</span>}
            formRef={formRef}
        />
    )
};

export default Page;