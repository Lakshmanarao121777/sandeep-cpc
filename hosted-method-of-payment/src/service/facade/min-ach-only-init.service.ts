import { IConfig, PaymentType } from '../../model/view.model';
import {IChannelData } from '../../model/channel-data';
import { BaseInitService } from './base-init.service';
import { AccountTypeService } from '../account-type.service';
import { AccountTypeViewModelService } from '../viewModel/account-type-vm.service';
import { MinAchOnlyService } from '../min-ach-only.service';
import { MinAchOnlyViewModelService } from '../viewModel/min-ach-only-vm-service';
import { JUMP_BANK_BLOCKED } from '../../constant/app.constant';

export class MinAchOnlyInitService extends BaseInitService {
    constructor(config:IConfig, channelData:IChannelData){
        super(config, channelData);
    }
    runChild(): void {
        let url ='';
        const rootUrl = this.config.envConfig.cpcEnv.split('/');        
        url = this.config.envConfig.cpcEnv.replace(rootUrl[rootUrl.length - 1], '') + 'template/min-ach-only-template.html';
        this.global.appState.set('currentPaymentType', (this.config.cpcPageType.toString() === this.paymentTypeAchOnly ? PaymentType.AchOnly : PaymentType.AchOnlyWithEdit).toString().toLowerCase());
        this.render(url,'MinAchOnlyTemplate',['jump-min-ach-only-web-component']);
    }
    renderChild(componentIds:Array<string>){
        this.achComponent = document.getElementById(componentIds[0]);
        this.achComponent.actionObserverService = this.actionObserverService;
    }
    loadChild(){  
        if (!this.global.appState.get(JUMP_BANK_BLOCKED)) {
            this.minAchOnlyService = new MinAchOnlyService(this.config,this.channel,this.currentPaymentType,this.achComponent,this.errorMessageResponse,this.commonService,this.errorHandling);
            this.minAchOnlyViewModelService = new MinAchOnlyViewModelService(this.achComponent,this.minAchOnlyService,this.formValidationServiceAch,this.validationService);
            this.channel.channelData.selectedPaymentType = 'minachonly';                            
            this.accTypeService = new AccountTypeService(this.config,this.channel,this.currentPaymentType,this.errorMessageResponse,this.errorHandling);
            this.accountTypeViewModelService  = new AccountTypeViewModelService(this.accTypeComponent,this.accTypeService,this.formValidationServiceAch,this.validationService);        
            this.minAchOnlyService.runLoadFlow();       
        }
    }
}