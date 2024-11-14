import { Base } from "@/core/models/Base";
import dayjs from "dayjs";

export class DirectLeaderboardEntryHistory extends Base<DirectLeaderboardEntryHistory>(){
    bonus: any[];
    get name(){
        return this.bonus?.[0]?.name;
    }
    get createdAt(){
        return dayjs(this.bonus?.[0]?.createdAt).format('MMM d, y, h:mm:ss a');
    }
    get fromBackend(){
        return this.bonus?.[0]?.fromBackend ? 'Backend' : 'Online';
    }
}