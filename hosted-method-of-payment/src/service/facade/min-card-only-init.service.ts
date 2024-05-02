import { IConfig, PaymentType } from '../../model/view.model';
import {IChannelData } from '../../model/channel-data';
import { BaseInitService } from './base-init.service';
import { AddressOnlyService } from '../address-only.service';
import { MinCardOnlyService } from '../min-card-only.service';
import { MinCardOnlyViewModelService } from '../viewModel/min-card-only-vm-service';
import { MinCardEditService } from '../min-card-edit.service';
import { JUMP_CARD_BLOCKED } from '../../constant/app.constant';

export class MinCardOnlyInitService extends BaseInitService {
    constructor(config:IConfig, channelData:IChannelData){
        super(config, channelData);
    }
    runChild(): void {
        let url ='';
        const rootUrl = this.config.envConfig.cpcEnv.split('/');        
        url = this.config.envConfig.cpcEnv.replace(rootUrl[rootUrl.length - 1], '') + 'template/min-card-only-template.html';
        this.global.appState.set('currentPaymentType', PaymentType.MinCardOnly.toString().toLowerCase());
        this.render(url,'MinCardOnlyTemplate',['jump-min-card-web-component']);
    }
    renderChild(componentIds:Array<string>){
        this.ccComponent = document.getElementById(componentIds[0]);
        this.ccComponent.actionObserverService = this.actionObserverService;
    }
    loadChild(){        
        if (!this.global.appState.get(JUMP_CARD_BLOCKED)) {  
            this.minCardEditService = new MinCardEditService(this.config,this.channel,this.currentPaymentType,this.ccComponent,this.errorMessageResponse,this.commonService,this.errorHandling);
            this.minCardOnlyService = new MinCardOnlyService(this.config,this.channel,this.currentPaymentType,this.minCardEditService,this.ccComponent,this.errorMessageResponse,this.commonService,this.errorHandling);
            
            this.minCardOnlyViewModelService = new MinCardOnlyViewModelService(this.ccComponent,this.minCardOnlyService,this.minCardEditService,this.formValidationServiceCc,this.validationService);
            this.channel.channelData.selectedPaymentType = this.currentPaymentType==='mincardonly' ? 'mincardonly':'mincardonlywithedit';
            this.addressOnlyService = new AddressOnlyService(this.config,this.channel,this.currentPaymentType,this.addressComponentCc,this.errorMessageResponse,this.errorHandling);        
            this.minCardOnlyService.runLoadFlow();
        }
    }
}