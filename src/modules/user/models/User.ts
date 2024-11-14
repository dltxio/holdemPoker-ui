import { Base } from '@/core/models/Base';

export class User extends Base<User>() {
  public lastLogin?: number;
  public firstName: string;
  public lastName: string;

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}