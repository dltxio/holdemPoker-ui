import { Base } from "@/core/models/Base";
import dayjs from "@/core/dayjs";

export class FundRake extends Base<FundRake>() {
  createdAt: string;
  minBuyIn: number;
  maxBuyIn: number;
  isRealMoney: boolean;
  isActive: boolean;
  isPrivateTabel: boolean;
  bigBlind: number;
  smallBlind: number;

  get createdAtText() {
    return this.createdAt && dayjs(this.createdAt).format('DD-MM-YYYY HH:mm:ss') || 'IST';
  }

  get buyInMinMax() {
    return `${this.minBuyIn}/${this.maxBuyIn}`;
  }

  get tableType() {
    return this.isRealMoney ? 'Real Money' : '';
  }

  get blindSmallOrBig() {
    return `${this.smallBlind}/${this.bigBlind}`;
  }

  get status() {
    return this.isActive ? 'Active' : 'Inactive';
  }

  get privateOrPublic() {
    return this.isPrivateTabel ? 'Private' : 'Public';
  }
}