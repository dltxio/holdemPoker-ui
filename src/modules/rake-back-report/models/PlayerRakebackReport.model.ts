import { Base } from '@/core/models/Base';
import { formatTime } from '@/helpers/common';
export class PlayerRakebackReport extends Base<PlayerRakebackReport>() {
  public rakeByUsername: string;
  public debitToAffiliatename: string;
  public channelName: string;
  public amount: number;
  public playerRakeBackPercent: number;
  public playerRakeBack: number;
  public addeddate: number;
  public debitToSubaffiliatename: string;
  
  get parentUsername() {
    if (this.debitToSubaffiliatename) {
      return this.debitToSubaffiliatename;
    }
    if (!this.debitToSubaffiliatename && this.debitToAffiliatename) {
      return this.debitToAffiliatename;
    }

    return 'N/A';
  }

  get parentProfile() {
    if (this.debitToSubaffiliatename) {
      return 'SUB-AFFILIATE';
    }
    if (!this.debitToSubaffiliatename && this.debitToAffiliatename) {
      return 'AFFILIATE';
    }

    return 'N/A';
  }

  get dateAndTime() {
    return formatTime(this.addeddate);
  }

  get amountFormat() {
    return this.amount.toFixed(1);
  }
}