import { useEffect, useMemo, useRef, useState } from 'react';
import { FormInstance } from 'antd';

// import './PlayerChipsReport.scss';
import TableReport from '@/components/table-report/TableReport';
import { FilterInputType, FilterItem } from '@/components/shared/filter/Filter';
import { useAppDispatch } from '@/store/hooks';
import { TableColumnType } from '@/components/shared/table/Table';
import { countDataInPlayerHandHistory, listDataInPlayerHandHistory, sendHandHistoryToMail } from '../../store/action';
import { useBusyContext } from '@/components/shared/busy';
import { useConfirmationContext } from '@/components/shared/confirmation';
import { Button } from '@/components/shared/button/Button';
import FileSaver from 'file-saver';
import dayjs from "@/core/dayjs";

const Page = () => {
  const dispatch = useAppDispatch();
  const formRef = useRef<FormInstance>(null);
  const bs = useBusyContext();
  const cf = useConfirmationContext();

  const getData = async (values: any) => {
    const res = await dispatch(listDataInPlayerHandHistory({
      ...values,
    }));
    const dataWithNo = res.payload.map((item: any, index: number) => ({
      ...item,
      'NO.': index + 1,
      'finishedAtFormated': finishedAtFormated(item.finishedAt),
      'playerInfoFormated': playerInfoFormated(item.playerInfo)
    }))
    return {
      // data: res.payload as any[],
      data: dataWithNo as any[]
    }
  }
  
  const finishedAtFormated = (finishedAt: any) => {
    return dayjs(finishedAt).format('DD-MMM-YYYY HH:mm:ss')
  }

  const playerInfoFormated = (playerInfo: any) => {
    return playerInfo.map((x: any) => (`${x.playerName} - ${x.ip}`));
  }

  const getTotal = (values: any) => {
    return dispatch(countDataInPlayerHandHistory(values)).then((res: any) => res.payload)
  }

  const exportHistory = (item: any) => {
    FileSaver.saveAs(new Blob([item.historyLog], {type: 'text/plain;charset=utf-8'}), 'hand_history_report.txt')
  }

  const FilterFields: FilterItem[] = useMemo(() => ([
    {
      name: 'startDate',
      type: FilterInputType.Date,
      inputProps: {
        placeholder: 'Start date'
      }
    },
    {
      name: 'endDate',
      type: FilterInputType.Date,
      inputProps: {
        placeholder: 'End date'
      }
    },
    {
      name: 'userName',
      type: FilterInputType.Input,
      inputProps: {
        placeholder: 'User Name'
      }
    },
    {
      name: 'handId',
      type: FilterInputType.Input,
      inputProps: {
        placeholder: 'Hand ID'
      }
    },
  ]), [formRef.current])

  const columns: TableColumnType[] = useMemo(() => ([
    {
      title: 'S No.',
      dataIndex: 'NO.'
    },
    {
      title: 'Hand Id',
      dataIndex: 'handId',
    },
    {
      title: 'Time',
      dataIndex: 'finishedAtFormated'
    },
    {
      title: 'Player Info',
      dataIndex: 'playerInfoFormated',
      customRender: ({value}) => (
        <div>
          {value?.map((x: string) => (<div>{x}</div>))}
        </div>
      )
    },
    {
      title: 'Stakes',
      dataIndex: 'stakes'
    },
    {
      title: 'Table Name',
      dataIndex: 'tableName',
    },
    {
      title: 'Actions',
      dataIndex: '',
      customRender: ({ row }) => (
        <span>
          <Button
            onClick={() => exportHistory(row)}
          >
            Export history
          </Button>
        </span>
      )
    },
  ]), [])

  const onExportAll = (items: any[]) => {
    const content = 'Hand History\n\n' + items.map(x => x.historyLog).join('\n\n');
    FileSaver.saveAs(new Blob([content], {type: 'text/plain;charset=utf-8'}), 'all_hand_history_report.txt')
  }

  const onSendFileToMail = async (args: any, items: any[]) => {
    const content = 'Hand History\n\n' + items.map(x => x.historyLog).join('\n\n');
    await dispatch(sendHandHistoryToMail({
      emailId: args.email,
      finalStringFile: content
    }));
  }

  return (
    <TableReport
      title='Player Hand History'
      formRef={formRef}
      columns={columns}
      filterFields={FilterFields}
      getData={getData}
      getTotal={getTotal}
      firstLoad={false}
      formProps={{
        onExportAll,
        onSendFileToMail
      }}
      tableProps={{

      }}
    />
  )
};
export default Page;