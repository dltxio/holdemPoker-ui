import React, { useMemo } from 'react';
import { FormInstance } from 'antd';
import './PlayerBannedReport.scss';
import TableReport from '@/components/table-report/TableReport';
import { useAppDispatch } from '@/store/hooks';
import { FilterInputType, FilterItem } from '@/components/shared/filter/Filter';
import { TableColumnType } from '@/components/shared/table/Table';
import { listPlayerBannedData } from '../../store/action';
import { useRef } from 'react';
import { LoyalityLevel } from '../../models/DataInPlayerLoyalityPointsReport';
import dayjs from "@/core/dayjs";

const columns: TableColumnType[] = [
  {
    title: 'S No.',
    dataIndex: 'NO.'
  },
  {
    title: 'UserName',
    dataIndex: 'userName'
  },
  {
    title: 'Agent/SubAgents',
    dataIndex: 'parent'
  },
  {
    title: 'Date of status change',
    dataIndex: 'createdAtFormated'
  },
  {
    title: 'Current Status',
    dataIndex: 'status'
  },
  {
    title: 'Reason for Ban',
    dataIndex: 'ReasonForBan'
  },
  {
    title: 'Chips Balance	',
    dataIndex: 'realChipsBalance'
  },
  {
    title: 'MegaPoints',
    dataIndex: 'megaPoints'
  },
  {
    title: 'MegaCircle',
    dataIndex: 'megaCircle'
  },
  {
    title: 'Hands Played',
    dataIndex: 'handsPlayed'
  },
  {
    title: 'Total Earnings',
    dataIndex: 'totalWinnings'
  },
  {
    title: 'Total Rake Generated',
    dataIndex: 'totalRake'
  },
  {
    title: 'Joined On',
    dataIndex: 'playerJoinedAtFormated'
  }
]

const Page = () => {
  const dispatch = useAppDispatch();
  const formRef = useRef<FormInstance>(null);
  const getData = async (values: any) => {
    const res = await dispatch(listPlayerBannedData({
      ...values,
    }));
    const dataWithNo = res.payload.map((item: any, index: number) => ({
      ...item,
      'NO.': index + 1,
      'createdAtFormated': createdAtFormated(item.createdAt),
      'playerJoinedAtFormated': playerJoinedAtFormated(item.playerJoinedAt),
      'ReasonForBan': ReasonForBan(item.reasonForBan)
    }))
    return {
      // data: res.payload as any[],
      data: dataWithNo as any[]
    }
  }

  const createdAtFormated = (createdAt: any) => {
    return dayjs(createdAt).format('DD-MMM-YYYY HH:mm:ss')
  }

  const playerJoinedAtFormated = (playerJoinedAt: any) => {
    // return dayjs(this.createdAt).format('DD-MMM-YYYY HH:mm:ss')
    return dateFormat(playerJoinedAt);
  }
  const ReasonForBan = (reasonForBan: any) => {
    return reasonForBan ? reasonForBan : "N/A"
  }
  const dateFormat = (dateString: string) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const day = date.getDate().toString().padStart(2, '0');
    const hours: any = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert hours to 12-hour format
    const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
    
    const formattedDate = `${year}-${month}-${day} ${formattedHours}:${minutes}:${seconds} ${ampm}`;

    return formattedDate;
  }

  const FilterFields: FilterItem[] = useMemo(() => ([
    {
      name: 'startDate',
      type: FilterInputType.Date,
      rules: [
        {required: true, message: 'Start date is required'}
      ],
      inputProps: {
        placeholder: 'Start date',
      }
    },
    {
      name: 'endDate',
      type: FilterInputType.Date,
      rules: [
        {required: true, message: 'End date is required'}
      ],
      inputProps: {
        placeholder: 'End date',
      }
    },
    {
      name: 'filter',
      type: FilterInputType.Select,
      inputProps: {
        options: [
          {
            label: 'Player',
            value: 'players'
          },
          {
            label: 'Agent/Sub-Agent',
            value: 'affiliates'
          }
        ]
      }
    },
    {
      name: 'playerOrAffiliateId',
      type: FilterInputType.Input,
      rules: [
        {
          message: 'Player ID is required',
          validator: (_, value) => {
            const filterValue = formRef.current?.getFieldValue('filter');
            if (filterValue && !value) {
              return Promise.reject('Player ID is required')
            }
            return Promise.resolve();
          }
        }
      ],
      inputProps: {
        placeholder: 'Player ID / Agent ID'
  
      }
    },
    {
      name: 'reasonForBan',
      type: FilterInputType.Input,
      inputProps: {
        placeholder: 'Reason For Ban'
      }
    },
    {
      name: 'minRake',
      type: FilterInputType.Input,
      inputProps: {
        type: 'number',
        placeholder: 'Min. Rake Generated'
      }
    },
    {
      name: 'maxRake',
      type: FilterInputType.Input,
      inputProps: {
        type: 'number',
        placeholder: 'Max. Rake Generated'
      }
    },
    {
      name: 'megaCircle',
      type: FilterInputType.Select,
      inputProps: {
        placeholder: 'Select Loyality Level',
        options: LoyalityLevel
      }
    },
    {
      name: 'startDateJoin',
      type: FilterInputType.Date,
      inputProps: {
        placeholder: 'Start Date of Joining'
      }
    },
    {
      name: 'endDateJoin',
      type: FilterInputType.Date,
      inputProps: {
        placeholder: 'End Date of Joining'
      }
    },
  ]), [formRef.current])

  return (
    <TableReport
      title='Player Banned Report'
      formRef={formRef}
      columns={columns}
      filterFields={FilterFields}
      getData={getData}
      firstLoad={false}
    />
  )
};

export default Page;