import { Base } from "@/core/models/Base";
import dayjs from "@/core/dayjs";

export class RakeDataRakeReport extends Base<RakeDataRakeReport>() {
  rakeByName: string;
  rakeByUsername: string;
  megaCircle: number;
  debitToAffiliatename: string;
  addeddate: string;

  get displayName() {
    return `${this.rakeByName} (${this.rakeByUsername})`;
  }

  get displayMegaCircle() {
    if(this.megaCircle == 1){
      return 'Bronze';    
    }
    if(this.megaCircle == 2){
      return 'Chrome';    
    }
    if(this.megaCircle == 3){
      return 'Silver';    
    }
    if(this.megaCircle == 4){
      return 'Gold';    
    }
    if(this.megaCircle == 5){
      return 'Diamond';    
    }
    if(this.megaCircle == 6){
      return 'Platinum';    
    }
  }

  get displayDebitToAffiliatename() {
    return this.debitToAffiliatename || '-';
  }

  get displayAddDate() {
    return this.addeddate && dayjs(this.addeddate).format('DD-MM-YYYY HH:mm:ss') || 'IST';
  }
}