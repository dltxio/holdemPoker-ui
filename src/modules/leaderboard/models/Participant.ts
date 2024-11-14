import { Base } from "@/core/models/Base";

export class Participant extends Base<Participant>() {
    _id: any;

    get userName() {
        return this._id?.userName || 'N/A';
    }
    get pId() {
        return this._id?.pId || 'N/A';
    }
    static initRank(participantsArray: any[] = []) {
        for (let i = 0; i < participantsArray.length; i++) {
            participantsArray[i].rank = i+1;
        }
        return participantsArray;
    }
}