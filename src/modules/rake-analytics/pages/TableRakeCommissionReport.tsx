import { useEffect, useMemo, useRef, useState } from 'react';
import { FormInstance } from 'antd';

// import './PlayerChipsReport.scss';
import TableReport from '@/components/table-report/TableReport';
import { FilterInputType, FilterItem } from '@/components/shared/filter/Filter';
import { useAppDispatch } from '@/store/hooks';
import { TableColumnType } from '@/components/shared/table/Table';
import { listEachCashTableRakeData, listRakeDataByGameVariant } from '../store/action';
import { Note } from '@/components/shared/note/Note';
import { formatNumber } from '@/helpers/number';
import { GameVariations } from '@/modules/game/models/Table';
// import { countDataInPlayerBonusReport, countDataInPlayerLoyalityPointsReport, listDataInPlayerBonusReport, listDataInPlayerLoyalityPointsReport } from '../../store/action';


const columns: TableColumnType[] = [
  {
    title: 'S No.',
    dataIndex: 'NO.'
  },
  {
    title: 'Table Name',
    dataIndex: 'channelName',
    sortable: true
  },
  {
    title: 'Created By',
    dataIndex: 'createdBy'
  },
  {
    title: 'Created On',
    dataIndex: 'createdAtText'
  },
  {
    title: 'Table Type',
    dataIndex: 'tableType'
  },
  {
    title: 'Private/Public',
    dataIndex: 'privateOrPublic'
  },
  {
    title: 'Blind (Small/Big)',
    dataIndex: 'blindSmallOrBig'
  },
  {
    title: 'Buy-in (Min./Max.)',
    dataIndex: 'buyInMinMax'
  },
  {
    title: 'Turn Time (in seconds)',
    dataIndex: 'turnTime'
  },
  {
    title: 'Max. Players',
    dataIndex: 'maxPlayers'
  },
  {
    title: 'Rake Generated',
    dataIndex: 'rakeGenerated',
    sortable: true
  },
  {
    title: 'Current Status',
    dataIndex: 'status'
  },
]

const Page = () => {
  const dispatch = useAppDispatch();
  const formRef = useRef<FormInstance>(null);
  const [result, setResult] = useState<any>({});

  const defaultValue = {}

  const getData = async ({ ...values }: any) => {
    const res = await dispatch(listEachCashTableRakeData({
      ...defaultValue,
      ...values,
      limit: undefined,
      skip: undefined,
    }));
    setResult({
      ...res.payload,
      result: undefined
    });
    return {
      data: (res.payload.result as any[]),
    }
  }

  const getTotal = async ({tableId, ...values}: any) => {
    return 0;
  }

  const FilterFields: FilterItem[] = useMemo(() => ([
    // {
    //   name: 'startDate',
    //   type: FilterInputType.Date,
    //   inputProps: {
    //     placeholder: 'Start date',
    //   },
    // },
    // {
    //   name: 'endDate',
    //   type: FilterInputType.Date,
    //   inputProps: {
    //     placeholder: 'End date',
    //   },
    // },
    // {
    //   name: 'rakeRefVariation',
    //   type: FilterInputType.Select,
    //   rules: [{required: true, message: 'Cash table is required'}],
    //   inputProps: {
    //     placeholder: 'Select cash table',
    //     options: GameVariations,
    //   }
    // },
  ]), [formRef.current])

  return (
    <TableReport
      title='Table Rake Commission Report'
      formRef={formRef}
      columns={columns}
      filterFields={FilterFields}
      getData={getData}
      getTotal={getTotal}
      firstLoad={true}
      pageSize={20}
      description={
        <div className="bonus-transfer-history-content__note">
          <Note
            content={`Total Rake Generated: ${formatNumber(result.totalRake || 0) || 0}`}
            type="info"
          />
        </div>
      }
    />
  )
};
export default Page;