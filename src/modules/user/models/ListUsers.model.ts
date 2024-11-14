import { Base } from '@/core/models/Base';
import { formatTime } from '@/helpers/common';

export class ListUsers extends Base<ListUsers>() {
  public name: string;
  public userName: string;
  public role: any;
  public createdAt: number;

  get displayName() {
    return `${this.name} (${this.userName})`;
  }

  get displayRoleName() {
    return this.role.name;
  }

  get displayCreatedOn() {
    return formatTime(this.createdAt);
  }
}