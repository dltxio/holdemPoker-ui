import { Base } from "@/core/models/Base";
import dayjs from "@/core/dayjs";

export class LeaderboardSet extends Base<LeaderboardSet>() {
  createdAt: number;
  get createdAtFormated() {
    return dayjs(this.createdAt).format('DD-MMM-YYYY HH:mm:ss')
  }
}