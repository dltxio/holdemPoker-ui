import { Base } from "@/core/models/Base";
import dayjs from "@/core/dayjs";

export const TransferTypes = [
  {
    label: 'Sign up Bonus',
    value: 'signUp'
  },
  {
    label: 'Leaderboard Winnings',
    value: 'leaderboardWinnings'
  },
  {
    label: 'Promotion Bonus',
    value: 'promotion'
  }
];

export const BonusChipsTypes = [
  {
    label: 'Instant',
    value: 'instant'
  },
  // {
  //   label: 'Locked',
  //   value: 'locked'
  // },
  // {
  //   label: 'Instant And Locked',
  //   value: 'instantAndLocked'
  // }
]

export class InstantBonusHistory extends Base<InstantBonusHistory>() {
  time: number;
  get timeFormated() {
    return dayjs(this.time).format('DD-MMM-YYYY HH:mm:ss')
  }
}