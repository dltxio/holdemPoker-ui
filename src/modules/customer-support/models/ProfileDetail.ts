import dayjs from "@/core/dayjs";
import { Base } from "@/core/models/Base";


export class ProfileDetail extends Base<ProfileDetail>() {
    noOfDays: number;
    hours: number;
    dateOfBirth: any;
    createdAt: any;
    address: any;
    bankDetails: any;
    realChips: number;
    instantBonusAmount: number;
    statistics: any;
    mobileNumber: string;
    isMobileNumberVerified: any;
    
    get lastPlayed() {
        return `${this.noOfDays}day${this.noOfDays > 1 ? 's' : ''} ${this.hours}hour${this.hours > 1 ? 's' : ''}`
    }
    get createdAtFormated() {
        return this.createdAt ? dayjs(this.createdAt).format('DD-MM-YYYY') : 'N/A';
    }
    get dateOfBirthFormated() {
        return this.dateOfBirth ? dayjs(this.dateOfBirth).format('DD-MM-YYYY') : 'N/A';
    }
    get address1(){
        return this.address?.address1;
    }
    get address2(){
        return this.address.address2;
    }
    get city(){
        return this.address.city;
    }
    get pincode(){
        return this.address.pincode;
    }
    get state(){
        return this.address.state;
    }
    get WithdrawAcName(){
        return this.bankDetails?.WithdrawAcName;
    }
    get WithdrawAcType(){
        return this.bankDetails?.WithdrawAcType;
    }
    get WithdrawAcNumber(){
        return this.bankDetails?.WithdrawAcNumber;
    };
    get WithdrawAcIfsc(){
        return this.bankDetails?.WithdrawAcIfsc;
    }
    get WithdrawAcBank(){
        return this.bankDetails?.WithdrawAcBank;
    }
    get WithdrawAcBranch(){
        return this.bankDetails?.WithdrawAcBranch;
    }
    get totalChips(){
        return (this.realChips + this.instantBonusAmount) ? (this.realChips + this.instantBonusAmount).toFixed(2) : 0;
    }
    get megaPoints(){
        return this.statistics.megaPoints ? this.statistics.megaPoints?.toFixed(4) : 'N/A';
    }
    
    get mobileNo(){
        if(!this.mobileNumber){
            return 'N/A';
        }
        if(this.isMobileNumberVerified){
            return `${this.mobileNumber} &nbsp;&nbsp;&nbsp;&nbsp; <font color = "green" size = "2"><b>verified</b></font>`;
        } else {
            return `${this.mobileNumber} &nbsp;&nbsp;&nbsp;&nbsp; <font color = "red" size = "2"><b>Not verified</b></font>`;
        }
    }
}