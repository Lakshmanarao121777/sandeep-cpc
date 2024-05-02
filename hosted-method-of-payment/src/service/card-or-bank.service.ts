import {IConfig } from '../model/view.model';
import { ErrorHandling } from '../utils/error-handling';


import { BaseAccountTypeService } from './base-account-type-service';
import { ChannelService } from './channel-service';

export class CardOrBankService extends BaseAccountTypeService{
    constructor(config:IConfig, channel:ChannelService,type:string,errorMessageResponse:any,errorHandling:ErrorHandling){ 
        super(config,channel,type,errorMessageResponse,errorHandling);        
    }    
}