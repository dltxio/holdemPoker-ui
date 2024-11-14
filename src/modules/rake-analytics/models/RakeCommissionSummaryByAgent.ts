import { Base } from "@/core/models/Base";
import dayjs from "@/core/dayjs";

export class RakeCommissionSummaryByAgent extends Base<RakeCommissionSummaryByAgent>() {
  userName: string;
  date: number;

  get displayDate() {
    return this.date && dayjs(this.date).format('DD-MM-YYYY HH:mm:ss') || 'IST';
  }
}