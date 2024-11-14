import { Base } from "@/core/models/Base";

export class Approve extends Base<Approve>() {
    createdBy: any;
    scratchCardType: string;
    promoCode: string;
    affiliateId: any;
    playerOrAffiliateId: any;
    playerId: any;
    userLevel: any;
    scratchCardDetails: any;
    get userName(){
        return this.createdBy?.userName;
    }
    get profileName(){
        return this.createdBy?.role?.name;
    }
    get name(){
        return this.createdBy?.name;
    }
    get requestedFor(){
        if(this.promoCode){
            return `${this.scratchCardType} / ${this.promoCode}`;
        }
        if(this.affiliateId){
            return `${this.userLevel} / ${this.affiliateId}`;
        }
        if(this.playerOrAffiliateId){
            return `${this.scratchCardType} / ${this.playerOrAffiliateId}`;
        }
        if(this.playerId){
            return `${this.scratchCardType} / ${this.playerId}`;
        }

    }
    get scratchCard(){
        let str = '';
        if(this.scratchCardDetails && Array.isArray(this.scratchCardDetails)){
            this.scratchCardDetails.forEach((card,index)=>{
                if(index === 0){
                    str = `<span>${card?.denomination} x ${card?.quantity}</span>`
                } else {
                    str = str + `<br/><span>${card?.denomination} x ${card?.quantity}</span>`
                }
            })
        }
        return str;
    }
}