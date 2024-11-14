import { Base } from "@/core/models/Base";
import dayjs from "@/core/dayjs";

export const States = [
  {
    label: 'Expired',
    value: 1
  },
  {
    label: 'Released',
    value: 2
  },
  {
    label: 'Active',
    value: 0
  }
]

export class PlayerLockedBonusInfo extends Base<PlayerLockedBonusInfo>() {
  expireAt: number;
  expireStatus: number;
  releasedTime: number;
  createdAt: string;
  remainingPoints?: number;

  get createdAtFormated() {
    return dayjs(this.createdAt).format('MMM DD, YYYY HH:mm:ss A')
  }
  get expireAtFormated() {
    return dayjs(this.expireAt).format('MMM DD, YYYY HH:mm:ss A')
  }

  get statusLabel() {
    return States.find(x => x.value === this.expireStatus)?.label
  }

  get releasedTimeFormated() {
    return dayjs(this.releasedTime).format('MMM DD, YYYY HH:mm:ss A')
  }

  get remainingPointsFormated() {
    return this.remainingPoints || 0;
  }

  get isAvailableToClaim() {
    return this.remainingPointsFormated > 0;
  }
}