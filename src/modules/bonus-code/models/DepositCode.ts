import { Base } from "@/core/models/Base";
import dayjs from "dayjs";
import { string } from "yup";
export interface ITypeName {
    type: string;
    name: string
}
export enum BonusCodeStatusEnum {
    EXPIRED = 'EXPIRED',
    Live = 'Live'
}
export class DepositCode extends Base<DepositCode>() {
    bonusCodeType: ITypeName;
    bonusCodeCategory: ITypeName;
    loyalityLevel: any;
    get typeName(){
        return this.bonusCodeType?.name || 'N/A';
    }
    get categoryName(){
        return this.bonusCodeCategory.name || 'N/A';
    }
    get loyalityLevelName(){
        return this.loyalityLevel?.name || 'N/A';
    }

}