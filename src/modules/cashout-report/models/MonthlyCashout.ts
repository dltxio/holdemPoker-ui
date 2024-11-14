import dayjs from "@/core/dayjs";
import { Base } from "@/core/models/Base";

export enum Status {
    Success = 'Success',
    Approved = 'Approved'
}
export class MonthlyCashout extends Base<MonthlyCashout>() {
    successAmount: number;
    rejectedAmount: number;
    date: any;
    get totalAmount(){
        return this.successAmount + this.rejectedAmount;
    }
    get displayDate(){
        return dayjs(this.date).format('MMM-YYYY');
    }
}