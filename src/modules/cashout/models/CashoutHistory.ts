
import { Base } from "@/core/models/Base";
import dayjs from "dayjs";
export class CashoutHistory extends Base<CashoutHistory>() {
  userName: string;
  realName: string;
  affiliateMobile: string;
  mobile: string;
  profile: string;
  affiliateId: string;
  createdAt: number;
  requestedAt: number;
  approveBy: string;
  supervisedby: string;
  transferBy: string;

  // get displayName() {
  //   return `${this.userName} / ${this.profile}`;
  // }

  // get mobileNumber() {
  //   if (this.profile == 'Sub-Affiliate' || this.profile == 'AFFILIATE') {
  //     return this.affiliateMobile;
  //   }
  //   if (this.profile != 'Sub-Affiliate' && this.profile != 'AFFILIATE' && this.mobile) {
  //     return this.mobile;
  //   }
  //   return 'N/A'
  // }

  // get changeDetail() {
  //   return `${this.approveBy}, ${this.supervisedby}, ${this.transferBy}`;
  // }

  // get parentDetail() {
  //   return `${this.affiliateId}${(this.affiliateId && this.affiliateMobile && this.profile != 'Sub-Affiliate') ? `/${this.affiliateMobile}` : ''}`
  // }

  // get requestedAtText() {
  //   return dayjs(this.requestedAt).format('MMM DD, YYYY HH:mm:ss A');
  // }

  // get createdAtText() {
  //   return dayjs(this.createdAt).format('MMM DD, YYYY HH:mm:ss A');
  // }
}