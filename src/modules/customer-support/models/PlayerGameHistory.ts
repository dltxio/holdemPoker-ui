import { Base } from "@/core/models/Base";
import dayjs from "dayjs";

export const ChipTypes = [
    {
      label: 'All',
      value: ''
    },
    {
      label: 'Real Money',
      value: 'true'
    },
    {
      label: 'Play Money',
      value: 'false'
    }
  ];
export const GameVariation = [
    {
      label: 'All',
      value: ''
    },
    {
      label: 'Texas Hold’em',
      value: 'Texas'
    },
    {
      label: 'Omaha',
      value: 'Omaha'
    },
    {
      label: 'Omaha Hi-Lo',
      value: 'OmahaHiLo'
    }
  ];
export class PlayerGameHistory extends Base<PlayerGameHistory>(){
    rawResponse: any;
    autoReBuy: boolean;
    runItTwice: boolean;
    straddle: boolean;
    autoMuck: boolean;
    get table(){
        return this.rawResponse?.params?.table;
    }
    get channelName(){
        return this.table?.channelName;
    }

    get gameStartTime(){
        const time = this.table?.gameStartTime || new Date();
        return dayjs(time).format('DD-MMM-YYYY HH:mm:ss');
    }
    get channelVariation(){
        return this.table?.channelVariation;
    }
    get stakes(){
        return `${this.table?.smallBlind}/${this.table?.bigBlind}`
    }
    get roundNumber(){
        return this.table?.roundNumber;
    }
    get autoBuy(){
        return this.autoReBuy.toString();
    }
    get runItTwiceStr(){
        return this.runItTwice.toString();
    }
    get straddleStr(){
        return this.straddle.toString();
    }
    get autoMuckStr(){
        return this.autoMuck.toString();
    }
}