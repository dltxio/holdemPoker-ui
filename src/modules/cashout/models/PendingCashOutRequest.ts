import { Base } from "@/core/models/Base";
import dayjs from "dayjs";
export class PendingCashOutRequest extends Base<PendingCashOutRequest>() {
  userName: string;
  realName: string;
  affiliateMobile: string;
  mobile: string;
  profile: string;
  affiliateId: string;
  requestedAt: number;

  get displayName() {
    return `${this.userName} (${this.realName})`;
  }

  get mobileNumber() {
    if (this.profile == 'Sub-Affiliate' || this.profile == 'AFFILIATE') {
      return this.affiliateMobile;
    }
    if (this.profile != 'Sub-Affiliate' && this.profile != 'AFFILIATE' && this.mobile) {
      return this.mobile;
    }
    return 'N/A'
  }

  get parentDetail() {
    return `${this.affiliateId}${(this.affiliateId && this.affiliateMobile && this.profile != 'Sub-Affiliate') ? `/${this.affiliateMobile}` : ''}`
  }

  get requestedAtText() {
    return dayjs(this.requestedAt).format('MMM DD, YYYY HH:mm:ss A');
  }
}