import dayjs from "@/core/dayjs";
import { Base } from "@/core/models/Base";
export enum LeaderboardTypesEnum {
    openVip = 'openVip',
    closedVip = 'closedVip',
    openHand = 'openHand',
    closedHand = 'closedHand'
}
export const LeaderboardTypes = [
    { label: 'Open VIP Race', value: LeaderboardTypesEnum.openVip },
    { label: 'Closed VIP Race', value: LeaderboardTypesEnum.closedVip },
    { label: 'Open Hand Race', value: LeaderboardTypesEnum.openHand },
    { label: 'Closed Hand Race', value: LeaderboardTypesEnum.closedHand },
];
export enum LeaderboardStatusEnum {
    Running = 'Running',
    Waiting = 'Waiting',
    Expired = 'Expired'
}
export const LeaderboardStatus = [
    {
        label:'All',
        value:''
    },
    {
        label: 'Running',
        value: LeaderboardStatusEnum.Running
    },
    {
        label: 'Waiting',
        value: LeaderboardStatusEnum.Waiting
    },
    {
        label: 'Expired',
        value: LeaderboardStatusEnum.Expired
    },
]
export interface ITable {
    _id: string;
    channelName: string;
    smallBlind: number;
    bigBlind: number;
}
export enum LeaderBoardActionEnum {
    create = 'create',
    view = 'view',
    duplicate = 'duplicate',
    edit = 'edit'
}
export class Leaderboard extends Base<Leaderboard>() {
    startTime: any;
    endTime: any;
    leaderboardType: string;
    tables: ITable[];
    minRake: number;
    minHands: number;

    get startTimeDisplay() {
        return dayjs(this.startTime).format('DD-MM-YYYY hh:mm a')
    }

    get endTimeDisplay() {
        return dayjs(this.endTime).format('DD-MM-YYYY hh:mm a')
    }

    get leaderboardTypeDisPlay() {
        return LeaderboardTypes.find(x => x.value === this.leaderboardType)?.label;
    }

    get table() {
        let str = '';
        for (const item of this.tables) {
            str += `${item.channelName}(${item.smallBlind}/${item.bigBlind})</br>`
        }
        return str;
    }

    get minRakeDisplay() {
        return this.minRake || 0;
    }
    get minHandsDisplay() {
        return this.minHands || 0;
    }
}