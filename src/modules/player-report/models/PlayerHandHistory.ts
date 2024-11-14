import { Base } from "@/core/models/Base";
import dayjs from "@/core/dayjs";

export class PlayerHandHistory extends Base<PlayerHandHistory>() {
  finishedAt: number;
  playerInfo: any[];
  
  get finishedAtFormated() {
    return dayjs(this.finishedAt).format('DD-MMM-YYYY HH:mm:ss')
  }

  get playerInfoFormated() {
    return this.playerInfo.map(x => (`${x.playerName} - ${x.ip}`));
  }
}