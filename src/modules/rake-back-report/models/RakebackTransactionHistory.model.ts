import { Base } from '@/core/models/Base';
import { formatTime } from '@/helpers/common';
export class RakebackTransactionHistory extends Base<RakebackTransactionHistory>() {
  public rakeByUsername: string;
  public parentUser: string;
  public referenceNumber: number;
  public handsPlayed: number;
  public amount: number;
  public playerRakeBack: number;
  public prevBalance: number;
  public newBalance: string;
  public addedDate: number;

  get dateAndTime() {
    return formatTime(this.addedDate);
  }

  get prevBalanceDisplay() {
    if (this.prevBalance) {
      return this.prevBalance;
    }
    return '-';
  }

  get prevNewBalanceDisplay() {
    if (this.newBalance) {
      return this.newBalance;
    }
    return '-';
  }
}