import { Base } from "@/core/models/Base";
import dayjs from "dayjs";

export class TransactionHistory extends Base<TransactionHistory>() {
    date: any;
    createdAt: any;
    requestedAmount: number;
    amount: number;
    transferMode: string;
    netAmount: number;
    transactionId: string;
    referenceNumber: string;
    referenceNo: string;
    get dateAndTime() {
        return this.date ? dayjs(this.date).format('DD-MM-YYYY HH:mm:ss') : dayjs(this.createdAt).format('DD-MM-YYYY HH:mm:ss');
    }
    get AddChipsCashOut() {
        return this.createdAt ? 'Cashout' : 'AddChips';
    }
    get displayAmount() {
        if (this.requestedAmount || this.requestedAmount === 0) {
            return this.requestedAmount;
        }
        if (this.amount || this.amount === 0) {
            return this.amount;
        }
        return 0;
    }
    get transferModeDisplay() {
        return this.transferMode || 'ONLINE TRANSFER"'
    }
    get netAmountDispay() {
        if (this.netAmount || this.netAmount === 0) {
            return this.netAmount;
        }
        if (this.amount || this.amount === 0) {
            return this.amount;
        }
        return 0;
    }
    get transactionIdDisplay(){
        return this.referenceNo ? this.transactionId : this.referenceNumber;
    }
}