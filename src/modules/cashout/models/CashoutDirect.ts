
import { Base } from "@/core/models/Base";
import dayjs from "dayjs";
export class CashoutDirect extends Base<CashoutDirect>() {
  userName: string;
  amount: number;
  affiliateMobile: string;
  mobile: string;
  profile: string;
  affiliateId: string;
  createdAt: number;
  requestedAt: number;
  approveBy: string;
  supervisedby: string;
  transferBy: string;
  requestedAmount: number;

  get displayName() {
    return `${this.userName} / ${this.profile}`;
  }

  get userType() {
    if (this.profile == 'subAffiliate') {
      return 'Sub-Agent';
    }
    return this.profile?.toLocaleUpperCase();
  }

  get requestedAmountValue() {
    if (this.profile != 'PLAYER') return this.amount;
    return this.requestedAmount;
  }

  get typeValue() {
    if (this.profile != 'PLAYER') return this.profile;
    return 'Real Chips';
  }

  get requestedAtText() {
    return dayjs(this.requestedAt).format('MMM DD, YYYY HH:mm:ss A');
  }

  get createdAtText() {
    return dayjs(this.createdAt).format('MMM DD, YYYY HH:mm:ss A');
  }
}