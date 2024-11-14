import { Base } from "@/core/models/Base";
import dayjs from "@/core/dayjs";
import { format } from 'date-fns';

export const TurnTimeOptions = [
  {
    label: 'Standard (30s)',
    value: 30
  },
  {
    label: 'Medium (20s)',
    value: 20
  },
  {
    label: 'Turbo (15s)',
    value: 15
  },
  {
    label: 'Hyper-Turbo (10s)',
    value: 10
  },
]

export const GameVariations = [
  {
    label: 'Texas Hold’em',
    value: 'Texas Hold’em'
  },
  {
    label: 'Omaha',
    value: 'Omaha'
  },
  {
    label: 'Omaha Hi-Lo',
    value: 'Omaha Hi-Lo'
  }
]

export const TableChipsTypes = [
  {
    label: 'Real Money',
    value: true
  },
  {
    label: 'Play Money',
    value: false
  },
]

export const PrivateTableOptions = [
  {
    label: 'true',
    value: true
  },
  {
    label: 'false',
    value: false
  },
]

export const TableStates = [
  {
    label: 'Active',
    value: true
  },
  {
    label: 'Inactive',
    value: false
  },
]

export const StakesOptions = [
  {
    label: 'Pot Limit',
    value: true
  },
  {
    label: 'No Limit',
    value: false
  },
]

export class Table extends Base<Table>() {
  gameInfo: any;
  smallBlind: number;
  bigBlind: number;
  isActive: boolean;
  minBuyIn: number;
  maxBuyIn: number;
  updateTableData: any;
  updatedBy: any;
  updatedByRole: any;
  createdAt: any;
  updatedFromIp: any;
  updateFieldsString: any;
  lastPlayed: any

  get gameInfoTableName() {
    return this.gameInfo.TableName;
  }

  get gameInfoChipsType() {
    return this.gameInfo.ChipsType;
  }

  get gameInfoGameVariation() {
    return this.gameInfo.GameVariation;
  }

  get smallOrBigBlind() {
    return `${this.smallBlind}/${this.bigBlind}`;
  }

  get minMaxBuyIn() {
    return `${this.minBuyIn}/${this.maxBuyIn}`;
  }

  get activeText() {
    return this.isActive ? 'Yes' : 'No';
  }

  get tableName() {
    return this.updateTableData.channelName
  }

  get displayDate() {
    return `${this.updatedBy}/${this.updatedByRole.name}`
  }

  get amount() {
    return this.createdAt;
  }

  get transferMode() {
    return this.updatedFromIp
  }

  get updateFields() {
    return this.updateFieldsString
  }

  get CreatedAt () {
    const date = new Date(this.createdAt);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    // Function to get the day suffix (st, nd, rd, th)
    function getDaySuffix(day: any) {
      if (day >= 11 && day <= 13) {
        return 'th';
      }
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    }
    
    // Function to format hours into 12-hour format
    function formatHours(hours: any) {
      const formattedHours = hours % 12 || 12;
      return formattedHours;
    }
    
    // Function to get AM or PM
    function getAmPm(hours: any) {
      return hours >= 12 ? 'PM' : 'AM';
    }
    
    const daySuffix = getDaySuffix(day);
    const formattedHours = formatHours(hours);
    const amPm = getAmPm(hours);
    
    return `${day}${daySuffix} ${month} ${formattedHours}:${minutes.toString().padStart(2, '0')} ${amPm}`;
  }

  get LastPlayed () {
    if (!isNaN(this.lastPlayed)) {
      const dateDifference = formatDateDifferenceISO(this.lastPlayed);
      return dateDifference;
    } else {
      const dateDifference = formatDateDifferenceString(this.lastPlayed);
      return dateDifference;
    }

    function formatDateDifferenceISO (dateString: any) {
      const date: any = new Date(dateString);

      const currentDate: any = new Date();

      const timeDifference = currentDate - date;

      const minutesDifference = timeDifference / (1000 * 60);
      const secondsDifference = timeDifference / 1000;

      if (secondsDifference < 60) {
          return `${Math.floor(secondsDifference)} seconds ago`;
      } else if (minutesDifference < 60) {
          return `${Math.floor(minutesDifference)} minute ago`;
      } else if (minutesDifference < 1440) { // 1 ngày = 24 * 60 phút
          const hoursDifference = Math.floor(minutesDifference / 60);
          return `${hoursDifference} ours ago`;
      } else if (minutesDifference < 10080) { // 7 ngày = 7 * 24 * 60 phút
          const daysDifference = Math.floor(minutesDifference / (24 * 60));
          return `${daysDifference} days ago`;
      } else if (minutesDifference === 10080) {
          const daysDifference = Math.floor(minutesDifference / (24 * 60));
          return `${daysDifference} days ago`;
      } else {
          return "More than a week ago";
      }
    }

    function formatDateDifferenceString(dateString: any) {
      const date: any = new Date(dateString);
      const currentDate: any = new Date();
      
      const timeDifference = currentDate - date;

      const minutesDifference = timeDifference / (1000 * 60);
      const secondsDifference = timeDifference / 1000;

      if (secondsDifference < 60) {
          return `${Math.floor(secondsDifference)} seconds ago`;
      } else if (minutesDifference < 60) {
          return `${Math.floor(minutesDifference)} minute ago`;
      } else if (minutesDifference < 1440) {
          const hoursDifference = Math.floor(minutesDifference / 60);
          return `${hoursDifference} ours ago`;
      } else if (minutesDifference < 10080) {
          const daysDifference = Math.floor(minutesDifference / (24 * 60));
          return `${daysDifference} days ago`;
      } else if (minutesDifference === 10080) {
          const daysDifference = Math.floor(minutesDifference / (24 * 60));
          return `${daysDifference} days ago`;
      } else {
          return "More than a week ago";
      }
  }
  }

}

export class TableUpdateRecord extends Base<Table>() {
  gameInfo: any;
  smallBlind: number;
  bigBlind: number;
  isActive: boolean;
  minBuyIn: number;
  maxBuyIn: number;
  updateTableData: any;
  updatedBy: any;
  updatedByRole: any;
  createdAt: any;
  updatedFromIp: any;
  updateFieldsString: any;
  existingTableData: any;

  get gameInfoTableName() {
    return this.gameInfo.TableName;
  }

  get gameInfoChipsType() {
    return this.gameInfo.ChipsType;
  }

  get gameInfoGameVariation() {
    return this.gameInfo.GameVariation;
  }

  get smallOrBigBlind() {
    return `${this.smallBlind}/${this.bigBlind}`;
  }

  get minMaxBuyIn() {
    return `${this.minBuyIn}/${this.maxBuyIn}`;
  }

  get activeText() {
    return this.isActive ? 'Yes' : 'No';
  }

  get tableName() {
    return this.updateTableData.channelName
  }

  get displayDate() {
    return `${this.updatedBy}/${this.updatedByRole.name}`
  }

  get amount() {
    return this.createdAt;
  }

  get transferMode() {
    return this.updatedFromIp
  }

  get updateFields() {
    return this.updateFieldsString
  }

  get channelName () {
    return this.existingTableData.channelName
  }
}