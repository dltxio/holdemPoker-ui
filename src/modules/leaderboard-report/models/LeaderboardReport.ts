import dayjs from "@/core/dayjs";
import { Base } from "@/core/models/Base";
import { ITable, LeaderboardTypes } from "@/modules/leaderboard/models/Leaderboard";


export class LeaderboardReport extends Base<LeaderboardReport>(){
    startTime: any;
    endTime: any;
    leaderboardType: string;
    tables: any[];
    
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
}