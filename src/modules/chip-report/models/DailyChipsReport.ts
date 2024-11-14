import { Base } from "@/core/models/Base";
import dayjs from "@/core/dayjs";

export class DailyChipsReport extends Base<DailyChipsReport>() {
  transferMode: string;
  names: string;
  Name: string;
  loginId: string;
  loginType: string;
  userLevel: any;
  scratchCardType: string;
  date: number;
  approvedBy: string;
  
  get username() {
    return this.transferMode === 'FUND TRANSFER' ? this.loginType : this.loginId;
  }

  get displayName() {
    return this.transferMode === 'FUND TRANSFER' ? this.names : this.Name;
  }


  get displayScratchCardType() {
    return this.scratchCardType && !this.userLevel ? this.scratchCardType : null;
  }

  get displayUserLevel() {
    return this.scratchCardType && this.userLevel ? this.userLevel : null;
  }

  get displayDate() {
    return dayjs(this.date).format('DD-MM-YYYY HH:mm:ss')
  }

  get approvedby () {
    return this.approvedBy ? this.approvedBy : 'N/A'
  }
}