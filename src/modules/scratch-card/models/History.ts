import { Base } from "@/core/models/Base";
import dayjs from "dayjs";

export const UserNameTypes = [
    {
        label: 'All',
        value: 'all'
    },
    {
        label: 'Requested By',
        value: 'createdBy'
    },
    {
        label: 'Issued By',
        value: 'issuedBy'
    },
    {
        label: 'Used By',
        value: 'usedBy'
    },
]

export enum ScratchCardStatusEnum {
    All = 'all',
    Used = 'USED',
    New = 'NEW',
    Expired = 'EXPIRED',
    Rejected = 'REJECTED'
}

export const ScratchCardStatus = [
    {
        label: 'All',
        value: ScratchCardStatusEnum.All
    },
    {
        label: 'Used',
        value: ScratchCardStatusEnum.Used
    },
    {
        label: 'New',
        value: ScratchCardStatusEnum.New
    },
    {
        label: 'Expired',
        value: ScratchCardStatusEnum.Expired
    },
    {
        label: 'Rejected',
        value: ScratchCardStatusEnum.Rejected
    },
]
export const TransactionTypes = [
    {
        label: 'All',
        value: ''
    },
    {
        label: 'Debit',
        value: 'Debit'
    },
    {
        label: 'Credit',
        value: 'Credit'
    }
]

export enum ScratchCardTypeEnum {
    Promotions = 'PROMOTION',
    Agent = 'AFFILIATE',
    Emergency = 'EMERGENCY',
    HightRoller = 'HIGH-ROLLERS'
}
export const ScratchCardTypes = [
    {
        label: 'All',
        value: 'all'
    },
    {
        label: 'Promotions',
        value: ScratchCardTypeEnum.Promotions
    },
    {
        label: 'Agent',
        value: ScratchCardTypeEnum.Agent
    },
    {
        label: 'Emergency',
        value: ScratchCardTypeEnum.Emergency
    },
    {
        label: 'High Roller Bonus',
        value: ScratchCardTypeEnum.HightRoller
    },
]

export class History extends Base<History>() {
    createdBy: any;
    issuedBy: any;
    scratchCardType: string;
    promoCode: string;
    affiliateId: string;
    playerId: string;
    createdAt: any;
    denomination: number;
    detailString: string;
    status: string;
    usedBy: any;
    updatedAt: any;
    expiresOn: any;
    info: any;
    get requestedBy() {
        return `${this.createdBy?.name} <br/> (${this.createdBy?.userName})`;
    }
    get profile() {
        return this.createdBy?.role?.name;
    }
    get issuedByName() {
        return this.issuedBy?.userName;
    }
    get type() {
        switch (this.scratchCardType) {
            case ScratchCardTypeEnum.Promotions:
                return `${this.scratchCardType} <br/> (${this.promoCode})`;
            case ScratchCardTypeEnum.Agent:
                return `AGENT <br/> (${this.affiliateId})`;
            case 'AGENT':
                return `AGENT <br/> (${this.affiliateId})`;
            case ScratchCardTypeEnum.Emergency:
                return `${this.scratchCardType} <br/> (${this.playerId})`;
            case ScratchCardTypeEnum.HightRoller:
                return `${this.scratchCardType} <br/> (${this.playerId})`;
            default:
                return 'N/A';
        }
    }
    get dateAndTime(){
        return dayjs(this.createdAt).format('DD-MMM-YYYY HH:mm:ss')
    }
    get amount(){
        if(this.status === ScratchCardStatusEnum.Rejected && this.detailString){
            return `${this.denomination} <br/> (${this.detailString})`
        }
        return `${this.denomination}(${this.info})`;
    }
    get usedByDate(){
        if(this.status === ScratchCardStatusEnum.Used){
            return `${this.usedBy?.userName} <br/> Used On: ${dayjs(this.updatedAt).format('DD-MM-YYYY')}`
        }
    }
    get statusExpiry(){
        switch(this.status){
            case ScratchCardStatusEnum.New:
                return `${this.status} <br/> Expires: ${dayjs(this.expiresOn).format('DD-MM-YYYY')}`;
            case ScratchCardStatusEnum.Used:
                return `${this.status} <br/> Used On: ${dayjs(this.updatedAt).format('DD-MM-YYYY')}`;
            case ScratchCardStatusEnum.Rejected:
                return `${this.status} <br/> Rejected: ${dayjs(this.updatedAt).format('DD-MM-YYYY')}`;
            case ScratchCardStatusEnum.Expired:
                return this.status;
        }
    }
}