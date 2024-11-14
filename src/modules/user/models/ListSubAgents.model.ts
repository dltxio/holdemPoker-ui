import { Base } from '@/core/models/Base';

export class ListSubAgents extends Base<ListSubAgents>() {
  public name: string;
  public userName: string;
  public parentName: string;
  public parentUser: string;

  get displayName() {
    return `${this.name} / ${this.userName}`;
  }

  get displayParentName() {
    return `${this.parentName} / ${this.parentUser}`;
  }
}