import { Base } from "@/core/models/Base";
import dayjs from "@/core/dayjs";

export const LoyalityLevel = [
  {
    label: 'Bronze',
    value: 1
  },
  {
    label: 'Chrome',
    value: 2
  },
  {
    label: 'Silver',
    value: 3
  },
  {
    label: 'Gold',
    value: 4
  },
  {
    label: 'Diamond',
    value: 5
  },
  {
    label: 'Platinum',
    value: 6
  }
]

export class DataInPlayerLoyalityPointsReport extends Base<DataInPlayerLoyalityPointsReport>() {
  date: number;
  megaPointLevel: number;
  get dateFormated() {
    return dayjs(this.date).format('MMM DD, YYYY HH:mm:ss A')
  }

  get megaPointLevelName() {
    let level = LoyalityLevel.find(x => x.value === this.megaPointLevel);
    return level?.label;
  }
}