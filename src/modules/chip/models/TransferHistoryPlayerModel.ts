import { Base } from "@/core/models/Base";
import dayjs from "@/core/dayjs";

export class TransferHistoryPlayerModel extends Base<TransferHistoryPlayerModel>() {
  date: number;
  transferBy: string;
  transferTo: string;
  userType: string;
  role: {
    name: string,
    level: number
  }
  get dateFormated() {
    return this.date && dayjs(this.date).format('MMM DD, YYYY HH:mm:ss A')
  }

  get transferByText() {
    return `${this.transferBy}(${this.role?.name})`
  }

  get transferToText() {
    return `${this.transferTo} (${this.userTypeLabel})`
  }

  get userTypeLabel() {
    if (this.userType === 'affiliate') return 'Agent';
    if (this.userType === 'subAffiliate') return 'Sub-Agent';
    return this.userType;
  }
}