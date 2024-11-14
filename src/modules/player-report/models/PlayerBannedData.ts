import { Base } from "@/core/models/Base";
import dayjs from "@/core/dayjs";

export class PlayerBannedData extends Base<PlayerBannedData>() {
  createdAt: number;
  playerJoinedAt: any;
  reasonForBan: any;
  
  get createdAtFormated() {
    return dayjs(this.createdAt).format('DD-MMM-YYYY HH:mm:ss')
  }

  get playerJoinedAtFormated() {
    // return dayjs(this.createdAt).format('DD-MMM-YYYY HH:mm:ss')
    return this.dateFormat(this.playerJoinedAt);
  }
  get ReasonForBan () {
    return this.reasonForBan ? this.reasonForBan : "N/A"
  }

  dateFormat (dateString: string) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const day = date.getDate().toString().padStart(2, '0');
    const hours: any = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert hours to 12-hour format
    const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
    
    const formattedDate = `${year}-${month}-${day} ${formattedHours}:${minutes}:${seconds} ${ampm}`;

    return formattedDate;
  }
}