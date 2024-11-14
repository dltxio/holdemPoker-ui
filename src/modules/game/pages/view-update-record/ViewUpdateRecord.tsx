import { Fragment } from 'react';
import clsx from 'clsx';

// Components
import { Breadcrumb } from '@/components/shared/breadcrumb/Breadcrumb';
import { Heading } from '@/components/shared/heading/Heading';
import { Button } from '@/components/shared/button/Button';

import './ViewUpdateRecord.scss';
import { useAppDispatch } from '@/store/hooks';
import { useEffect } from 'react';
// import { getUsersAndCalculateBonus, saveInstantBonusTransfer } from '../../store/action';
import { Checkbox, Form, Input, Select } from 'antd';
import { useState } from 'react';
import { showAlert } from '@/store/global/action';
import { fixedDecimal } from '@/helpers/number';
import TextArea from 'antd/lib/input/TextArea';
import { sleep } from '@/core/sleep';
import { useMatch, useNavigate } from 'react-router';
import { unwrapResult } from '@reduxjs/toolkit';
// import { BonusChipsTypes, TransferTypes } from '../../models/instantBonusHistory';
import { useBusyContext } from '@/components/shared/busy';
import { GameVariations, StakesOptions, TableChipsTypes, TurnTimeOptions } from '../../models/Table';
import FormTableUpdateRecord from '../form-table-update-record/FormTableUpdateRecord';
import { useParams } from 'react-router';
import { getTableRecords, updateTable } from '../../store/action';
import dayjs from '@/core/dayjs';

const ViewUpdateRecord = () => {
    const d = useAppDispatch();
    const params = useParams();
    const bs = useBusyContext();
    const [table, setTable] = useState({});
    const nav = useNavigate();
  
    const getDetail = async (id: any) => {
      console.log("getDetailId: ", id);
      bs.showBusy();
      try {
        const res = await d(getTableRecords({
            channelType: 'NORMAL',
            _id: id
        }));
        console.log("res===== ", res);
        if (res.payload && res.payload.length > 0) {
          const _table = res.payload[0];
          setTable({
            ..._table,
            createdAt: dayjs(_table.createdAt).format('DD-MM-YYYY hh:mm A'),
            updatedAt: dayjs(_table.updatedAt).format('DD-MM-YYYY hh:mm A'),
            channelName: res.payload[0].existingTableData.channelName,
            channelVariation: res.payload[0].existingTableData.channelVariation,
            isRealMoney: res.payload[0].existingTableData.gameInfo.ChipsType,
            isPotLimit: res.payload[0].existingTableData.isPotLimit === true ? 'Pot Limit' : '',
            smallBlind: res.payload[0].existingTableData.smallBlind,
            bigBlind: res.payload[0].existingTableData.bigBlind,
            rakePercentTwo: res.payload[0].existingTableData.rake.rakePercentTwo,
            rakePercentThreeFour: res.payload[0].existingTableData.rake.rakePercentThreeFour,
            rakePercentMoreThanFive: res.payload[0].existingTableData.rake.rakePercentMoreThanFive,
            capTwo: res.payload[0].existingTableData.rake.capTwo,
            capThreeFour: res.payload[0].existingTableData.rake.capThreeFour,
            capMoreThanFive: res.payload[0].existingTableData.rake.capMoreThanFive,
            maxPlayers: res.payload[0].existingTableData.maxPlayers,
            minBuyIn: res.payload[0].existingTableData.minBuyIn,
            maxBuyIn: res.payload[0].existingTableData.maxBuyIn,
            isStraddleEnable: res.payload[0].existingTableData.isStraddleEnable === true ? "Straddle Mandatory" : "Straddle Optional",
            turnTime: res.payload[0].existingTableData.turnTime,
            isPrivateTabel: res.payload[0].existingTableData.isPrivateTabel,
            isRunItTwice: res.payload[0].existingTableData.isRunItTwice,
            gameInfoString: res.payload[0].existingTableData.gameInfoString,
            createdBy: res.payload[0].existingTableData.createdBy,
          });
        }
      } finally {
        bs.hideBusy();
      }
    }
    useEffect(() => {
      getDetail(params.id);
    }, [params.id]);
  
    const handleSubmit = (values: any) => d(updateTable({...table, ...values}))
      .then(() => d(showAlert({ title: 'Table updated successfully.' })))
      .then(() => sleep(1000))
      .then(() => nav('/listTable'))
    return (
        <FormTableUpdateRecord
            title='View Table'
            table={table}
            onSubmit={handleSubmit}
            viewOnly
        />
    )
}

export default ViewUpdateRecord