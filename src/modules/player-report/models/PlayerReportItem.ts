import { Base } from "@/core/models/Base";

export class PlayerReportItem extends Base<PlayerReportItem>() {
  statistics: any;
  firstName: string;
  lastName: string;

  get statisticsMegaPoints() {
    return this.statistics?.megaPoints || 0;
  }

  get statisticsHandsPlayedRM() {
    return this.statistics?.handsPlayedRM || 0;
  }

  get statisticsHandsWonRM() {
    return this.statistics?.handsWonRM || 0;
  }

  get statisticsMegaPointLevel() {
    return this.statistics?.megaPointLevel || 0;
  }

  get name () {
    return `${this.firstName} + ${this.lastName}`
  }

  

  // get percentageHandsWon() {
  //   return ((this.statisticsHandsWonRM / this.statisticsHandsPlayedRM) * 100).toFixed(2)
  // }
}