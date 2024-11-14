import dayjs from "@/core/dayjs";
import { Base } from "@/core/models/Base";

export enum Status {
    Success = 'Success',
    Approved = 'Approved'
}
export class DailyCashoutReport extends Base<DailyCashoutReport>() {
    createdAt: any;
    actionTakenAt: any;
    amount: number;
    requestedAmount: number;
    referenceNumber: string;
    referenceNo: string;
    status: string;
    affilateId: string;
    affiliateId: string;
    
    get displayDate() {

        if (this.createdAt && !this.actionTakenAt) {
            return dayjs(this.createdAt).format('DD-MM-YYYY HH:mm');
        } else if (this.actionTakenAt) {
            return dayjs(this.actionTakenAt).format('DD-MM-YYYY HH:mm');
        }
    }
    get displayAmount() {
        if (this.amount) {
            return this.amount;
        }
        if (this.requestedAmount) {
            return this.requestedAmount;
        }
        return 'N/A';
    }
    get referenceId() {
        if (this.referenceNumber) {
            return this.referenceNumber;
        }
        if (this.referenceNo) {
            return this.referenceNo
        }
        return 'N/A';
    }

    get statusDisplay() {
        if (this.status === Status.Success || this.status === Status.Approved){
            return 'Success'
        } else {
            return this.status;
        }
    }
    get agent(){
        if(this.affilateId && !this.affiliateId){
            return this.affilateId;
        };
        if(!this.affilateId && this.affiliateId){
            return this.affiliateId
        };
        return 'N/A'
    }

    get mode(){
        if(this.actionTakenAt){
            return 'Direct Cashout';
        } else {
            return 'Bank Transfer';
        }
    }
}