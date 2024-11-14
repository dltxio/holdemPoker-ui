import { Base } from "@/core/models/Base";
import dayjs from "@/core/dayjs";

export class MonthlyChipsReport extends Base<MonthlyChipsReport>() {
  date: number;
  get displayDate() {
    return dayjs(this.date).format('MMM-YYYY');
  }
}