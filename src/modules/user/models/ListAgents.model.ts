import { Base } from '@/core/models/Base';

export class ListAgents extends Base<ListAgents>() {
  public name: string;
  public userName: string;

  get displayName() {
    return `${this.name} / ${this.userName}`;
  }
}