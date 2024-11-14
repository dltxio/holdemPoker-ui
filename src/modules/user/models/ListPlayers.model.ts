import { Base } from '@/core/models/Base';
import { formatTime } from '@/helpers/common';

export class ListPlayers extends Base<ListPlayers>() {
  public firstName: string;
  public lastName: string;
  public isParentUserName?: string;
  public parentType: string;
  public realChips: number;
  public instantBonusAmount: number;
  public createdAt: number;
  public noOfDays: any;
  public hours: any;
  public promoBonusAwarded: any;
  public panNumberVerified: any;
  public sponserId: any;
  public sponser: any;

  get displayName() {
    return `${this.firstName} ${this.lastName}`;
  }

  get displayParent() {
    // return this.isParentUserName ? `${this.isParentUserName} (${this.parentType})` : '';
    return this.isParentUserName ? (this.isParentUserName + "(" + this.parentType + ")") : (this.sponserId ? this.sponserId: "admin");
  }

  get displayGrandParent () {
    let sponserId = this.sponserId && this.sponserId.length>0 ? this.sponserId : "";
    return this.sponser && this.sponser[0] ? this.sponser[0].sponserId : ""
  }

  get displayChips() {
    return (this.realChips + this.instantBonusAmount).toFixed(2);
  }

  get displayCreatedAt() {
    return formatTime(this.createdAt);
  }

  get displayInstantBonusAmount() {
    return this.instantBonusAmount?.toFixed(2);
  }

  get displayLastActive() {
    return `${this.noOfDays}days ${this.hours} hours`;
  }

  get displayPromoBonusAwarded() {
    return this.promoBonusAwarded ? 'Yes' : 'No';
  }

  get displayPanVerified() {
    return this.panNumberVerified === true ? 'Yes' : 'No';
  }

  get displayRealChips() {
    return this.realChips?.toFixed(2);
  }
}