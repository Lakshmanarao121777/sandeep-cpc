import { IAchOnlyModel } from '../ach-only-model';
import { ICardOnlyModel } from '../card-only-model';
import { IPersonalInfoModel } from '../personal-info-model';
import { IChannelData } from '../view.model';

export interface IViewModel{    
    personalInfo:IPersonalInfoModel;
    cardInfo:ICardOnlyModel;
    accountInfo:IAchOnlyModel;
    cpcPageType:string; 
    templateContent:any;
    isAutoPay:boolean;
    isTermsAndCondition:boolean;
    formSubmitChannelData: IChannelData;
    defaultInstrument:boolean;
    walletId:string;
}