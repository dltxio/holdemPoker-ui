import { Base } from "@/core/models/Base";
import dayjs from "dayjs";
export class PlayerPassbook extends Base<PlayerPassbook>(){
    time: number;
    prevAmt: number;
    amount: number;
    newAmt: number;
    tableName: string;

    get timeDisplay(){
        return dayjs(this.time).format('DD-MM-YYYY hh:mm:ss');
    }
    get prevAmtDisplay(){
        return this.prevAmt.toFixed(2);
    }
    get amountDisplay(){
        return this.amount.toFixed(2);
    }
    get newAmtDisplay(){
        return this.newAmt.toFixed(2);
    }
    get tableNameDisplay(){
        return this.tableName || 'N/A';
    }
}