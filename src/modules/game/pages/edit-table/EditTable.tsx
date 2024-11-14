import { Fragment } from 'react';
import clsx from 'clsx';

// Components
import { Breadcrumb } from '@/components/shared/breadcrumb/Breadcrumb';
import { Heading } from '@/components/shared/heading/Heading';
import { Button } from '@/components/shared/button/Button';

import './EditTable.scss';
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

const Page = () => {
  const d = useAppDispatch();
  const params = useParams();
  const bs = useBusyContext();
  const [table, setTable] = useState({});
  const nav = useNavigate();

  const getDetail = async (id: any) => {
    bs.showBusy();
    try {
      const res = await d(getListTable({
        channelType: 'NORMAL',
        _id: id
      }));
      if (res.payload && res.payload.length > 0) {
        setTable(res.payload[0]);
      }
    } finally {
      bs.hideBusy();
    }
  }
  useEffect(() => {
    getDetail(params.id);
  }, [params.id]);

  const antiBankingTime = 900;

  const handleSubmit = (data: any) => {
    data.rake.minStake = data.smallBlind;
    data.rake.maxStake = data.bigBlind;
    data.rake.rakePercentTwo = Number(data.rake.rakePercentTwo);
    data.rake.rakePercentThreeFour = Number(data.rake.rakePercentThreeFour);
    data.rake.rakePercentMoreThanFive = Number(data.rake.rakePercentMoreThanFive)
    
    data.turnTime = JSON.parse(data.turnTime);
    data.isPotLimit = JSON.stringify(JSON.parse(data.isPotLimit));
    data.isStraddleEnable = JSON.stringify(JSON.parse(data.isStraddleEnable));
    data.isRealMoney = JSON.stringify(JSON.parse(data.isRealMoney));
    var potLimitInfo = (data.isPotLimit == "true") ? ("Pot Limit") : ("No Limit");
    // data.gameInfo = data.channelName +'\n'+ data.channelVariation +'\n'+ potLimitInfo +'('+data.smallBlind+'/'+data.bigBlind+')\nRake(%) 5+ Players: '+ data.rake.rakePercentMoreThanFive +'\n'+ ((data.isStraddleEnable == true)?("Straddle Mandatory"):("Straddle Optional"))+'\nTurn Time: '+ data.turnTime;    
    console.log("submit fucntion called ", data);
    let rakeStr1 = "",
    rakeStr2 = "",
    rakeStr3 = "";
    var rakeToDisplay = "";
    if (data.maxPlayers > 2 && data.maxPlayers < 5) {
      rakeStr1 = "Rake                      : " + data.rake.rakePercentThreeFour + '%';
        rakeToDisplay = data.rake.rakePercentThreeFour;
      }
      if (data.maxPlayers >= 5) {
        rakeStr1 = "Rake                      : " + data.rake.rakePercentMoreThanFive + '%';
        rakeStr3 = "\nRake (3-4 Players)        : " + data.rake.rakePercentThreeFour + '%';
        rakeToDisplay = data.rake.rakePercentMoreThanFive;
    }
    
    rakeStr2 = "Rake(Heads Up)   : " + data.rake.rakePercentTwo;
    var buyInStr = "\nBuy In : (" + data.minBuyIn + "/" + data.maxBuyIn + ")";
    // data.gameInfo = "Table Name : " + data.channelName +'\nGame Variation : ' + data.channelVariation + '\nChips Type : ' + ((data.isRealMoney == true)?("Real Money"):("Play Money")) + buyInStr + '\nStakes : ' + potLimitInfo +'('+data.smallBlind+'/'+data.bigBlind+')\n' + rakeStr + '\nMax. Players : ' + data.maxPlayers + '\nStraddle : ' + ((data.isStraddleEnable == true)?("Straddle Mandatory"):("Straddle Optional"))+'\nTurn Time : '+ data.turnTime; 
    data.gameInfoString = "Table Name : " + data.channelName + '\nGame Variation : ' + data.channelVariation + '\nChips Type : ' + ((data.isRealMoney == "true") ? ("Real Money") : ("Play Money")) + buyInStr + '\nStakes : ' + potLimitInfo + '(' + data.smallBlind + '/' + data.bigBlind + ')\n' + rakeStr1 + '\n' + rakeStr2 + rakeStr3 + '\nMax. Players : ' + data.maxPlayers + '\nStraddle : ' + ((data.isStraddleEnable == "true") ? ("Straddle Mandatory") : ("Straddle Optional")) + '\nTurn Time : ' + data.turnTime;
    // data.rakeRule = data.rakeRule._id;
    data.gameInfo = {};
    data.gameInfo['TableName'] = data.channelName;
    data.gameInfo['GameVariation'] = data.channelVariation;
    data.gameInfo['ChipsType'] = ((data.isRealMoney == "true") ? ("Real Money") : ("Play Money"));
    data.gameInfo['BuyIn'] = data.minBuyIn + "/" + data.maxBuyIn;
    data.gameInfo['Stakes'] = ((data.isPotLimit == "true") ? ("Pot Limit") : ("No Limit")) + '(' + data.smallBlind + '/' + data.bigBlind + ')';
    if (rakeToDisplay) {
      data.gameInfo['Rake'] = rakeToDisplay + '%';
    }
    if (data.maxPlayers >= 5) {
      data.gameInfo['Rake(3-4Players)'] = data.rake.rakePercentThreeFour + '%';
    }
    data.gameInfo['Rake(HeadsUp)'] = data.rake.rakePercentTwo + '%';
    data.gameInfo['CapAmount'] = Math.max(data.rake.capTwo, data.rake.capThreeFour, data.rake.capMoreThanFive);
    data.gameInfo['MaxPlayers'] = data.maxPlayers;
    data.gameInfo['Straddle'] = ((data.isStraddleEnable == "true") ? ("Straddle Mandatory") : ("Straddle Optional"));
    data.gameInfo['TurnTime'] = data.turnTime + ' sec.';
    data.gameInfo['Anti-Banking'] = antiBankingTime / 60 + ' min.';
    // data.authToken = token;
    // data.createdBy = $cookies.get('poker_userName');
    // data.createdBy = $rootScope.poker_userName;
    data.turnTime = JSON.parse(data.turnTime);
    // data.rakeRule = data.rakeRule._id;
    data.numberOfRebuyAllowed = 1;
    data.rebuyHourFactor = 1;
    data.hourLimitForRebuy = 1;
    data.gameInterval = 1;
    data.minPlayers = 2;
    data.favourite = false;
    // values.gameInfo['Anti-Banking'] = antiBankingTime / 60 + ' min.';
    // return
    return d(updateTable({ ...table, ...data }))
      .then(() => d(showAlert({ title: 'Table updated successfully.' })))
      .then(() => sleep(1000))
      .then(() => nav('/listTable'))
  }
  return (
    <FormTable
      title='Edit Table'
      table={table}
      onSubmit={handleSubmit}
    />
  )
};

export default Page;