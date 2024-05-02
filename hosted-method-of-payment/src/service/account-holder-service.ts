import { IPersonalInfoModel } from '../model/personal-info-model';
import { BaseAccountTypeService } from './base-account-type-service';
import { CardOnlyService } from './card-only.service';

export class AccountHolderService {
    private personalInfo:IPersonalInfoModel;
    private accountTypes:Array<BaseAccountTypeService>;
    constructor(personalInfo:IPersonalInfoModel,accountTypes:Array<BaseAccountTypeService>){
        this.personalInfo = personalInfo;        
        this.accountTypes = accountTypes;
    }
    validate(){
        //apply validation
    }
    addToWalet(){
        //sucess and failure scenarios
    }
    openInEditMode(){
        //every account type should be able to open in edit mode
    }
    reset(){
        //
    }
    toString(){
        console.log('Personal info: ', this.personalInfo);
        this.accountTypes.forEach((acc:any) =>{
            if(acc instanceof CardOnlyService){
                //console.log(`Channel: ${acc.channel.channelData.channelDetails.channelName}, Account Types: ${acc.type}, Crdit Card: ${acc.cardOnlyModel.ccNo}, expiration: ${acc.cardOnlyModel.expMonth}/${acc.cardOnlyModel.expYear}, Cvv: ${acc.cardOnlyModel.cvv}`);
            }            
        });
        
    }
}