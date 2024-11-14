import { Base } from "@/core/models/Base";
import dayjs from "@/core/dayjs";

export class InstantChipsPullHistory extends Base<InstantChipsPullHistory>() {
  pulledAt: number;

  get pulledAtText() {
    return dayjs(this.pulledAt).format('DD-MMM-YYYY HH:mm:ss')
  }
}