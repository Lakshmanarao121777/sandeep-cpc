import { IChannelData, IConfig, IInputReference, IViewModel, AddressDetails } from './../model/view.model';
import { CardOrBankService } from '../service/card-or-bank.service';
import { CardOnlyWebComponent } from './card-only-web.component';
import { CareWebComponent } from './care-web.component';
import { AchOnlyWebComponent } from './ach-only-web.component';
import { CommonService } from '../service/common.service';
import {AddressOnlyService} from '../service/address-only.service';
import {AddressWebComponent} from './address-web.component';
import {AccountTypeService} from '../service/account-type.service';
import {AccountTypeWebComponent} from './account-type-web.component';
import { MinCardOnlyWebComponent } from './min-card-only-web.component';
import { MinAchOnlyWebComponent } from './min-ach-only-web.component';
import { Globals } from '../utils/globals';
import { ActionObserverService } from '../service/action-observer-service';
import { ChannelService } from '../service/channel-service';
import { CardListWebComponent } from './card-list-web.component';
import { CardListService } from '../service/card-list.service';

import {UserroleListService} from '../service/userrole-list.service';
import {UserroleListWebComponent} from './userrole-list-web.component';
import {UserroleWebComponent} from './userrole-web.component';


export class HostedComponent{
    public viewModel:IViewModel =Object.assign({});
    public inputReference:IInputReference = Object.assign({});
    public config:IConfig = Object.assign({});
    public addressDetail: AddressDetails = Object.assign({});
    public cardOnlyWebComponentCc:CardOnlyWebComponent = Object.assign({});
    public achWebComponent:AchOnlyWebComponent = Object.assign({});
    public cardOrBankService:CardOrBankService = Object.assign({});
    public minCardOnlyWebComponent:MinCardOnlyWebComponent = Object.assign({});
    public minAchOnlyWebComponent:MinAchOnlyWebComponent = Object.assign({});
    public global:Globals;
    
    public careWebComponentCc:CareWebComponent = Object.assign({});
    public careWebComponentAch:CareWebComponent = Object.assign({});
    public addressComponentCc:AddressOnlyService = Object.assign({});
    public addressComponentAch:AddressOnlyService = Object.assign({});
    public accountTypeComponentAch:AccountTypeService = Object.assign({});
    public addressWebComponent:AddressWebComponent = Object.assign({});
    public cardListService:CardListService = Object.assign({});
    public ccListComponent:CardListWebComponent = Object.assign({});
    public addressWebComponentCc:AddressWebComponent = Object.assign({});
    public addressWebComponentAch:AddressWebComponent = Object.assign({});
    public accountTypeWebComponent:AccountTypeWebComponent = Object.assign({});
    public accountTypeWebComponentAch:AccountTypeWebComponent = Object.assign({});
    public accountTypeComponentMinAchOnly:AccountTypeService = Object.assign({});
    public accountTypeWebComponentMinAchOnly:AccountTypeWebComponent = Object.assign({});

    public userroleListWebComponentCc:UserroleListWebComponent = Object.assign({});
    public userroleListWebComponentAch:UserroleListWebComponent = Object.assign({});
    public userroleListComponentCcOnly:UserroleListService = Object.assign({});
    public userroleListComponentAchOnly:UserroleListService = Object.assign({});
    
    public userroleWebComponent:UserroleWebComponent = Object.assign({});
    
    public commonService:CommonService = Object.assign({});         
    public channel:ChannelService = Object.assign({});    
    private actionObserverService:ActionObserverService;


    constructor(config: IConfig, channelData: IChannelData, channel:ChannelService, actionObserverService:ActionObserverService,commonService:CommonService){        
        this.viewModel.template = Object.assign({});  
        this.config = config;
        this.viewModel.channelData = channelData;
        this.actionObserverService = actionObserverService;
        this.commonService = commonService;
        this.channel = channel;
        this.global = Globals.getInstance();
        
        console.log('hc constructor'); 
    }               
    getPublicKey(){
        this.commonService.getPublicKey();
    }
    async getPaymentConfiguration(){
        await this.commonService.getPaymentConfiguration(this.viewModel, this.config);
    }
    removeChildren(parent: any) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }
    cyberSourceConfiguration() {
        if(this.viewModel.channelData.channelDetails.enableFraudManager && this.viewModel.channelData.channelDetails.deviceFingerprintId){
            this.commonService.cyberSourceConfiguration(this.viewModel, this.config);
        }
    }
    loadIguardScript():void{
        if(this.viewModel.channelData.config?.iguard?.enableIguardIntegration){
            this.commonService.loadIguardScript(this.viewModel, this.config);
        }  
    }
    async getErrorMessage(){
        await this.commonService.getErrorMessage(this.config,this.viewModel.channelData.channelDetails.channelName);
        await this.getPaymentConfiguration();
    }
    public parseErrorMessageResponse(){
        this.commonService.parseErrorMessageResponse(this.viewModel.channelData.channelDetails.channelName);
    }
    async getGlobalContent(){
        await this.commonService.getGlobalContent(this.config,this.viewModel.channelData.channelDetails.channelName);
    }
    public parseGlobalContentResponse(){
        this.commonService.parseGlobalContentResponse(this.viewModel.channelData.channelDetails.channelName);
    }
}