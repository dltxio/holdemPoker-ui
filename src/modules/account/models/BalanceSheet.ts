import { Base } from "@/core/models/Base";

export class BalanceSheet extends Base<BalanceSheet>() {
  profit: number;

  // get profitFormated() {
  //   return this.profit.toFixed(2)
  // }
}