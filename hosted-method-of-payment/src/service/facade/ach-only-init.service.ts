import { IConfig, PaymentType } from '../../model/view.model';
import {IChannelData } from '../../model/channel-data';
import { BaseInitService } from './base-init.service';
import { AddressOnlyService } from '../address-only.service';
import { AchOnlyService } from '../ach-only.service';
import { AchOnlyViewModelService } from '../viewModel/ach-only-vm-service';
import { AccountTypeService } from '../account-type.service';
import { AccountTypeViewModelService } from '../viewModel/account-type-vm.service';
import { AchOnlyEditService } from '../ach-only-edit.service';
import { AutoPayService } from '../auto-pay.service';
import { TermsAndConditionService } from '../terms-and-condition.service';
import { TermsAndConditionViewModelService } from '../viewModel/terms-and-condition-vm-service';
import { AutoPayViewModelService } from '../viewModel/auto-pay-vm-service';
import { DefaultPaymentService } from '../default-payment.service';
import { DefaultPaymentViewModelService } from '../viewModel/default-payment-vm-service';
import { WalletMgmtNoAutopayService } from '../wallet-mgmt-no-autopay.service';
import { CareService } from '../care.service';
import { ACH, JUMP_BANK_BLOCKED } from '../../constant/app.constant';

export class AchOnlyInitService extends BaseInitService {
    constructor(config:IConfig, channelData:IChannelData){
        super(config, channelData);
    }
    runChild(): void {
        let url ='';
        const rootUrl = this.config.envConfig.cpcEnv.split('/');        
        url = this.config.envConfig.cpcEnv.replace(rootUrl[rootUrl.length - 1], '') + 'template/ach-only-template.html';
        this.global.appState.set('currentPaymentType', (this.config.cpcPageType.toString() === this.paymentTypeAchOnly ? PaymentType.AchOnly : PaymentType.AchOnlyWithEdit).toString().toLowerCase());
        this.render(url,'AchOnlyTemplate',['jump-ach-web-component']);
    }
    renderChild(componentIds:Array<string>){
        this.achComponent = document.getElementById(componentIds[0]);
        this.achComponent.actionObserverService = this.actionObserverService;
    }
    loadChild(){  
        if (!(this.global.appState.get(JUMP_BANK_BLOCKED) 
            && (this.global.appState.get('config')?.cpcPageType !== PaymentType[PaymentType.AchOnly].toLowerCase() 
            || this.global.appState.get('config')?.cpcPageType !== PaymentType[PaymentType.AchOnlyWithEdit].toLowerCase()))) {
            
            this.achOnlyEditService = new AchOnlyEditService(this.config,this.channel,this.currentPaymentType,this.errorMessageResponse,this.commonService,this.errorHandling);
            this.walletMgmtNoAutopayService = new WalletMgmtNoAutopayService(this.config,this.channel,this.currentPaymentType,this.cardListViewModelService,this.errorMessageResponse,this.commonService,this.errorHandling);

            this.careServiceACH = new CareService(this.config,this.channel,this.currentPaymentType,this.errorMessageResponse,this.commonService,this.errorHandling, ACH);

            this.achOnlyService = new AchOnlyService(this.config,this.channel,this.currentPaymentType,this.achOnlyEditService,this.achComponent,this.errorMessageResponse,this.commonService,this.errorHandling, this.careServiceACH);
            this.achOnlyViewModelService = new AchOnlyViewModelService(this.achComponent,this.achOnlyService,this.achOnlyEditService,this.formValidationServiceAch,this.validationService,this.walletMgmtNoAutopayService, this.careServiceACH);
            this.channel.channelData.selectedPaymentType = 'achonly';        
            this.accTypeService = new AccountTypeService(this.config,this.channel,this.currentPaymentType,this.errorMessageResponse,this.errorHandling);
            this.accountTypeViewModelService  = new AccountTypeViewModelService(this.accTypeComponent,this.accTypeService,this.formValidationServiceAch,this.validationService);

            this.defaultPaymentService = new DefaultPaymentService(this.config,this.channel,this.currentPaymentType,'ACH', this.errorMessageResponse,this.errorHandling);
            this.defaultPaymentViewModelServiceAch  = new DefaultPaymentViewModelService(this.accTypeComponent,this.defaultPaymentService,this.formValidationServiceAch,this.validationService);

            this.addressOnlyService = new AddressOnlyService(this.config,this.channel,this.currentPaymentType,this.addressComponentAch,this.errorMessageResponse,this.errorHandling);
            
            this.autoPayServiceAch  = new AutoPayService(this.config,this.channel,this.currentPaymentType,'ACH',this.errorMessageResponse,this.errorHandling);
            this.autoPayViewModelServiceAch = new AutoPayViewModelService(this.autoPayComponentAch,this.autoPayServiceAch,this.formValidationServiceAch,this.validationService);
            
            this.termsAndConditionServiceAch = new TermsAndConditionService(this.config,this.channel,this.currentPaymentType,'ACH',this.errorMessageResponse,this.errorHandling);
            this.tcViewModelServiceAch = new TermsAndConditionViewModelService(this.termsComponentAch, this.termsAndConditionServiceAch, this.formValidationServiceAch, this.validationService);
            
            this.achOnlyService.runLoadFlow();       
        }
    }
}