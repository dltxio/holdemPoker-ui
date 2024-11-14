import { Base } from "@/core/models/Base";
import dayjs from "dayjs";

export const PlayerStatus = [
    {
      label: 'All Players',
      value: ''
    },
    {
      label: 'Active',
      value: 'Active'
    },
    {
      label: 'Blocked',
      value: 'Block'
    }
  ];
export class PlayerInfoReport extends Base<PlayerInfoReport>(){
    isParentUserName: string;
    parentType: string;
    noOfDays: number;
    hours: number;
    createdAt: any;
    lastName: string;
    firstName: string;
    mobileNumber: string;
    get parentNameType(){
        return this.isParentUserName ? `${this.isParentUserName} / ${this.parentType}` : 'N/A'
    }
    get lastActiveSince(){
        return `${this.noOfDays} Days ${this.hours} Hours`;
    }
    get registeredAt(){
        return dayjs(this.createdAt).format('dd-MM-yyyy HH:mm:ss');
    }
    get fullName(){
        return `${this.firstName} ${this.lastName}`;
    }
    get mobileNo(){
      return this.mobileNumber || 'N/A'
    }
}