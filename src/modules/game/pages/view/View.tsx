import { Fragment } from 'react';
import clsx from 'clsx';

// Components
import { Breadcrumb } from '@/components/shared/breadcrumb/Breadcrumb';
import { Heading } from '@/components/shared/heading/Heading';
import { Button } from '@/components/shared/button/Button';

import './View.scss';
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
import FormTable from '../form-table-game/FormTable';
import { useParams } from 'react-router';
import { getListTable, updateTable } from '../../store/action';
import dayjs from '@/core/dayjs';

const Page = () => {
  const d = useAppDispatch();
  const params = useParams();
  const bs = useBusyContext();
  const [table, setTable] = useState({});
  const nav = useNavigate();

  const getDetail = async (id: any) => {
    console.log("getDetailId: ", id);
    bs.showBusy();
    try {
      const res = await d(getListTable({
        channelType: 'NORMAL',
        _id: id
      }));
      console.log("res== ", res);
      if (res.payload && res.payload.length > 0) {
        const _table = res.payload[0];
        setTable({
          ..._table,
          createdAt: dayjs(_table.createdAt).format('DD-MM-YYYY hh:mm A'),
          updatedAt: dayjs(_table.updatedAt).format('DD-MM-YYYY hh:mm A'),
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
    <FormTable
      title='View Table'
      table={table}
      onSubmit={handleSubmit}
      viewOnly
    />
  )
};

export default Page;