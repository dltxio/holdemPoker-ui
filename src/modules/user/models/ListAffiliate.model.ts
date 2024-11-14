import { Base } from '@/core/models/Base';

export class ListAffiliate extends Base<ListAffiliate>() {
  public name: string;
  public userName: string;

  get displayName() {
    return `${this.name} / ${this.userName}`;
  }
}