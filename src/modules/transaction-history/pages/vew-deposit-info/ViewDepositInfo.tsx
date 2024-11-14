import { useMemo, useRef, useState } from 'react';
import { FormInstance, Space, Button as AntButton } from 'antd';

import TableReport from '@/components/table-report/TableReport';
import { FilterInputType, FilterItem } from '@/components/shared/filter/Filter';
import { useAppDispatch } from '@/store/hooks';
import { TableColumnType } from '@/components/shared/table/Table';
import {
    countDepositInvoice,
    listDepositInvoice,
} from '../../store/action';
import { useNavigate } from 'react-router';
import { Note } from '@/components/shared/note/Note';

const Page = () => {
    const nav = useNavigate();
    const dispatch = useAppDispatch();
    const formRef = useRef<FormInstance>(null);
    const [searchText, setSearchText] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);

    const getData = async ({ ...values }: any) => {
        const res = await dispatch(listDepositInvoice({
            ...values,
        }));
        const dataWithSNo = res.payload.map((item: any, index: any) => ({
            ...item,
            'NO.': index + 1,
            "date": dateTime(item.createdAt)
        }))
        setTotalAmount(res.payload.reduce((acc: any, val: any) => acc + val.amount, 0));
        return {
            data: dataWithSNo as any[],
        }
    }
    
    const dateTime = (dateString: any) => {
        const date = new Date(dateString);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        return formattedDate;
    }

    const getTotal = async (values: any) => {
        const countData = await dispatch(countDepositInvoice(values));
        return countData.payload;
    }

    const FilterFields: FilterItem[] = useMemo(() => ([
        {
            name: 'userName',
            type: FilterInputType.Input,
            inputProps: {
                placeholder: 'User Name'
            }
        },
    ] as FilterItem[]), [formRef.current])

    const columns: TableColumnType[] = useMemo(() => ([
        {
            title: 'S.No',
            dataIndex: 'NO.',
        },
        {
            title: 'Username',
            dataIndex: 'userName',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
        },
        {
            title: 'Date',
            dataIndex: 'date',
        },
        {
            title: 'InvoiceId',
            dataIndex: 'invoiceId',
        },
        {
            title: 'Status',
            dataIndex: 'status',
        },
    ]), [])

    return (
        <TableReport
            title='View Deposit Invoice'
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
            totalAmount={totalAmount}
            
            
            // getTotal={getTotal}
            // firstLoad={false}
        />
    )
};
export default Page;