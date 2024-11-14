import { Base } from '@/core/models/Base';

export class ListSubAffiliate extends Base<ListSubAffiliate>() {
  public name: string;
  public userName: string;
  public parentName: string;
  public parentUser: string;

  get displayName() {
    return `${this.name} / ${this.userName}`;
  }

  get displayParent() {
    return `${this.parentName} / ${this.parentUser}`;
  }
}
