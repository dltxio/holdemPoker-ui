import { Base } from "@/core/models/Base";
import dayjs from "dayjs";
export class ChatHistoy extends Base<ChatHistoy>(){
    time: number;
    get timeDisplay(){
        return dayjs(this.time).format('DD-MM-YYYY hh:mm:ss');
    };
}