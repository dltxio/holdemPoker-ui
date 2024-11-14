import { Base } from "@/core/models/Base";
import { formatTime } from "@/helpers/common";

export const TransactionTypes = [
  {
    label: 'Transaction type',
    value: null
  },
  {
    label: 'Credit',
    value: 'Credit'
  },
  {
    label: 'Debit',
    value: 'Debit'
  }
]

export const TransferModeTypes = [
  {
    label: 'All',
    value: null
  },
  {
    label: 'Fund Transfer',
    value: 'FUNDS TRANSFER'
  },
  {
    label: 'Online Transfer',
    value: 'ONLINE TRANSFER'
  },
  {
    label: 'Scratch Card',
    value: 'Scratch Card'
  },
]

export const SortTypes = [
  {
    label: 'Sort by Amount',
    value: 'amount'
  },
  {
    label: 'Sort by Date',
    value: 'date'
  }
]

export const UserTypes = [
  {
    label: 'All',
    value: null
  },
  {
    label: 'Player',
    value: 'PLAYER'
  },
  {
    label: 'Agent',
    value: 'AGENT'
  },
  {
    label: 'Sub Agent',
    value: 'SUB-AGENT'
  },
  {
    label: 'Affiliate',
    value: 'AFFILIATE'
  },
  {
    label: 'Sub Affiliate',
    value: 'SUBAFFILIATE'
  }
]

export const enum TransferModeEnum {
  funTransfer = 'FUND TRANSFER',
  onlineTransfer = 'ONLINE TRANSFER',
  scratchCard = 'Scratch Card',
}

export const enum TransactionTypeEnums {
  credit = 'Credit',
  debit = 'Debit'
}

export class TransactionHistory extends Base<TransactionHistory>() {
  public Name: string;
  public names : string;
  public date: number;
  public amount: number;
  public referenceNumber: number;
  public transferMode: string;
  public paymentId: string;
  public bonusCode: string;
  public lockedBonusAmount: string;
  public bonusAmount: string;
  public megaPoints: string;
  public approvedBy: string;
  public transactionType: string;
  public profileScratchCard: string;
  public loginType: string;
  public loginId: string;
  public scratchCardType: string;
  public userLevel: string;
  
  get dateAndTime() {
    return formatTime(this.date);
  }

  get name() {
    if (this.transferMode === TransferModeEnum.funTransfer) {
      return this.names;
    }

    if (this.transferMode !== TransferModeEnum.funTransfer) {
      return this.Name;
    }

    return '';
  }

  get userName() {
    let result = '';

    if (this.transferMode === TransferModeEnum.funTransfer) {
      return this.loginType;
    }

    if (this.transferMode !== TransferModeEnum.funTransfer && this.transferMode !== TransferModeEnum.scratchCard) {
      return this.loginType;
    }

    if (this.transferMode === TransferModeEnum.scratchCard) {
      result = `${this.loginId} ${this.profileScratchCard ? `/${this.profileScratchCard}` : ''}`;
    }
    return result;
  }

  get transferModeDisplay() {
    let result = '';
    if (this.scratchCardType && !this.userLevel) {
      result = `/(${this.scratchCardType})`;
    }

    if (this.scratchCardType && this.userLevel) {
      result += `/(${this.userLevel})`;
    }
    return `${this.transferMode}${result}`;
  }

  get getMegaPoints() {
    return Number(this.megaPoints).toFixed(4);
  }

  get lockedBonusAmountDisplay() {
    return this.lockedBonusAmount || 'N/A';
  }
}