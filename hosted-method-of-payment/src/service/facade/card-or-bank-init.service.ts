import { IConfig, PaymentType } from '../../model/view.model';
import {IChannelData } from '../../model/channel-data';
import { BaseInitService } from './base-init.service';
import { CardOnlyService } from '../card-only.service';
import { CardOnlyViewModelService } from '../viewModel/card-only-vm-service';
import { AddressOnlyService } from '../address-only.service';
import { AchOnlyService } from '../ach-only.service';
import { AchOnlyViewModelService } from '../viewModel/ach-only-vm-service';
import { AccountTypeService } from '../account-type.service';
import { AccountTypeViewModelService } from '../viewModel/account-type-vm.service';
import { CardOnlyEditService } from '../card-only-edit.service';
import { CareService } from '../care.service';
import { WalletMgmtNoAutopayService } from '../wallet-mgmt-no-autopay.service';

import { AchOnlyEditService } from '../ach-only-edit.service';
import { CardOrBankViewModelService } from '../viewModel/card-or-bank-vm.service';
import { CardOrBankService } from '../card-or-bank.service';
import { AutoPayService } from '../auto-pay.service';
import { TermsAndConditionService } from '../terms-and-condition.service';
import { TermsAndConditionViewModelService } from '../viewModel/terms-and-condition-vm-service';
import { AutoPayViewModelService } from '../viewModel/auto-pay-vm-service';
import { NEW_PAYMENT_OPTION_BUTTON, BANK, CARD, CC, ACH } from '../../constant/app.constant';
export class CardOrBankInitService extends BaseInitService {
    constructor(config:IConfig, channelData:IChannelData){
        super(config, channelData);
    }
    runChild(): void {
        let url ='';
        const rootUrl = this.config.envConfig.cpcEnv.split('/');        
        url = this.config.envConfig.cpcEnv.replace(rootUrl[rootUrl.length - 1], '') + 'template/card-or-bank-template.html';
        this.global.appState.set('currentPaymentType', PaymentType.CardOrBank.toString().toLowerCase());
        const displayNewPaymentOption = this.global.appState.get('channelData')?.config?.newPaymentDisplayType;
        const cpcPageType:string = this.global.appState.get('config').cpcPageType.toLowerCase();

        if (PaymentType[PaymentType.CardOrBank].toLowerCase() === cpcPageType) {
            if (displayNewPaymentOption == NEW_PAYMENT_OPTION_BUTTON) {
                url = this.config.envConfig.cpcEnv.replace(rootUrl[rootUrl.length - 1], '') + 'template/card-or-bank-button-option-template.html';
                this.render(url,'CardOrBankOptionTemplate',['jump-cc-web-component','jump-ach-web-component']);
            } else {
                this.render(url,'CardOrBankTemplate',['jump-cc-web-component','jump-ach-web-component']);
            }
        } else if(PaymentType[PaymentType.BankOrCard].toLowerCase() === cpcPageType) { 
            if (displayNewPaymentOption == NEW_PAYMENT_OPTION_BUTTON) {
                url = this.config.envConfig.cpcEnv.replace(rootUrl[rootUrl.length - 1], '') + 'template/bank-or-card-button-option-template.html';
                this.render(url,'BankOrCardOptionTemplate',['jump-ach-web-component', 'jump-cc-web-component']);
            } else {
                url = this.config.envConfig.cpcEnv.replace(rootUrl[rootUrl.length - 1], '') + 'template/bank-or-card-template.html';
                this.render(url,'BankOrCardTemplate',['jump-ach-web-component', 'jump-cc-web-component']);
            }
        }
    }
    renderChild(componentIds:Array<string>){
        this.ccComponent = document.getElementById(componentIds[0]);
        this.ccComponent.actionObserverService = this.actionObserverService;
        this.achComponent = document.getElementById(componentIds[1]);
        this.achComponent.actionObserverService = this.actionObserverService;
        if(this.cardOrBankViewModelService){
            this.cardOrBankViewModelService.listenExternalEvent1();
        }
    }
    loadChild(){  
        this.cardOnlyEditService = new CardOnlyEditService(this.config,this.channel,this.currentPaymentType,this.errorMessageResponse,this.commonService,this.errorHandling);

        this.walletMgmtNoAutopayService = new WalletMgmtNoAutopayService(this.config,this.channel,this.currentPaymentType,this.cardListViewModelService,this.errorMessageResponse,this.commonService,this.errorHandling);
        this.careServiceCC = new CareService(this.config,this.channel,this.currentPaymentType,this.errorMessageResponse,this.commonService,this.errorHandling, CC);
        this.cardOnlyService = new CardOnlyService(this.config,this.channel,this.currentPaymentType,this.cardOnlyEditService,this.careServiceCC,this.ccComponent,this.errorMessageResponse,this.commonService, this.errorHandling);
        this.cardOnlyViewModelService = new CardOnlyViewModelService(this.ccComponent,this.cardOnlyService,this.cardOnlyEditService,this.careServiceCC,this.formValidationServiceCc,this.validationService, this.walletMgmtNoAutopayService);

        const cardOrBankService:CardOrBankService = new CardOrBankService(this.config,this.channel,this.currentPaymentType,this.errorMessageResponse,this.errorHandling);
        this.cardOrBankViewModelService = new CardOrBankViewModelService(cardOrBankService,this.validationService);
        
        this.autoPayServiceCc  = new AutoPayService(this.config,this.channel,this.currentPaymentType,'CC',this.errorMessageResponse,this.errorHandling);
        this.autoPayViewModelServiceCc = new AutoPayViewModelService(this.autoPayComponentCc,this.autoPayServiceCc,this.formValidationServiceAch,this.validationService);
        
        this.termsAndConditionServiceCC = new TermsAndConditionService(this.config,this.channel,this.currentPaymentType,'CC',this.errorMessageResponse,this.errorHandling);
        this.tcViewModelServiceCc = new TermsAndConditionViewModelService(this.termsComponentCc, this.termsAndConditionServiceCC, this.formValidationServiceAch, this.validationService);

        //this.cardOnlyService.viewModel.templateContent = templateContent;        
        this.addressOnlyService = new AddressOnlyService(this.config,this.channel,this.currentPaymentType,this.addressComponentCc,this.errorMessageResponse,this.errorHandling);
        this.cardOnlyService.runLoadFlow();

        this.achOnlyEditService = new AchOnlyEditService(this.config,this.channel,this.currentPaymentType,this.errorMessageResponse,this.commonService,this.errorHandling);

        this.careServiceACH = new CareService(this.config,this.channel,this.currentPaymentType,this.errorMessageResponse,this.commonService,this.errorHandling, ACH);

        this.achOnlyService = new AchOnlyService(this.config,this.channel,this.currentPaymentType,this.achOnlyEditService,this.achComponent,this.errorMessageResponse,this.commonService,this.errorHandling, this.careServiceACH);
        this.achOnlyViewModelService  = new AchOnlyViewModelService(this.achComponent,this.achOnlyService,this.achOnlyEditService,this.formValidationServiceAch,this.validationService,this.walletMgmtNoAutopayService, this.careServiceACH);
        
        this.autoPayServiceAch  = new AutoPayService(this.config,this.channel,this.currentPaymentType,'ACH',this.errorMessageResponse,this.errorHandling); 
        this.autoPayViewModelServiceAch = new AutoPayViewModelService(this.autoPayComponentAch,this.autoPayServiceAch,this.formValidationServiceAch,this.validationService);

        this.termsAndConditionServiceAch = new TermsAndConditionService(this.config,this.channel,this.currentPaymentType,'ACH',this.errorMessageResponse,this.errorHandling);
        this.tcViewModelServiceAch = new TermsAndConditionViewModelService(this.termsComponentAch, this.termsAndConditionServiceAch, this.formValidationServiceAch, this.validationService);
        
        this.accTypeService = new AccountTypeService(this.config,this.channel,this.currentPaymentType,this.errorMessageResponse,this.errorHandling);
        this.accountTypeViewModelService  = new AccountTypeViewModelService(this.accTypeComponent,this.accTypeService,this.formValidationServiceAch,this.validationService);

        //this.achOnlyService.viewModel.templateContent = templateContent;
        this.addressOnlyService = new AddressOnlyService(this.config,this.channel,this.currentPaymentType,this.addressComponentAch,this.errorMessageResponse,this.errorHandling);
        this.achOnlyService.runLoadFlow();
    }
}