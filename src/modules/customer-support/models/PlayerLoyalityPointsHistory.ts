import { Base } from "@/core/models/Base";
import dayjs from "dayjs";

export class PlayerLoyalityPointsHistory extends Base<PlayerLoyalityPointsHistory>(){
    date: any;
    amount: number;
    get displayDate(){
        return dayjs(this.date).format('MMM-YYYY')
    }
    get displayAmount(){
        return this.amount.toFixed(4);
    }
}