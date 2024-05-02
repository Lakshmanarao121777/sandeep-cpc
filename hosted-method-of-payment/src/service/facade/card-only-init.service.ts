import { IConfig, PaymentType } from '../../model/view.model';
import {IChannelData } from '../../model/channel-data';
import { BaseInitService } from './base-init.service';
import { CardOnlyService } from '../card-only.service';
import { CardOnlyViewModelService } from '../viewModel/card-only-vm-service';
import { AddressOnlyService } from '../address-only.service';
import { CardOnlyEditService } from '../card-only-edit.service';
import { WalletMgmtNoAutopayService } from '../wallet-mgmt-no-autopay.service';
import { AutoPayService } from '../auto-pay.service';
import { TermsAndConditionService } from '../terms-and-condition.service';
import { TermsAndConditionViewModelService } from '../viewModel/terms-and-condition-vm-service';
import { AutoPayViewModelService } from '../viewModel/auto-pay-vm-service';
import { DefaultPaymentService } from '../default-payment.service';
import { DefaultPaymentViewModelService } from '../viewModel/default-payment-vm-service';
import { CareService } from '../care.service';
import { CC, JUMP_CARD_BLOCKED } from '../../constant/app.constant';

export class CardOnlyInitService extends BaseInitService {
    constructor(config:IConfig, channelData:IChannelData){
        super(config, channelData);
    }
    runChild(): void {
        //let rootUrl:Array<string>;
        let url ='';
        const rootUrl = this.config.envConfig.cpcEnv.split('/');        
        url = this.config.envConfig.cpcEnv.replace(rootUrl[rootUrl.length - 1], '') + 'template/card-only-template.html';
        this.global.appState.set('currentPaymentType', (this.config.cpcPageType.toString() === this.paymentTypeCardOnly ? PaymentType.CardOnly : PaymentType.CardOnlyWithEdit).toString().toLowerCase());
        this.render(url,'CardOnlyTemplate',['jump-cc-web-component']);
    }
    renderChild(componentIds:Array<string>){
        this.ccComponent = document.getElementById(componentIds[0]);
        this.ccComponent.actionObserverService = this.actionObserverService;
    }
    loadChild(){  
        if (!(this.global.appState.get(JUMP_CARD_BLOCKED)
            && (this.global.appState.get('config')?.cpcPageType !== PaymentType[PaymentType.CardOnly].toLowerCase() 
            || this.global.appState.get('config')?.cpcPageType !== PaymentType[PaymentType.CardOnlyWithEdit].toLowerCase()))) {
            
            this.cardOnlyEditService = new CardOnlyEditService(this.config,this.channel,this.currentPaymentType,this.errorMessageResponse,this.commonService,this.errorHandling);

            this.walletMgmtNoAutopayService = new WalletMgmtNoAutopayService(this.config,this.channel,this.currentPaymentType,this.cardListViewModelService,this.errorMessageResponse,this.commonService,this.errorHandling);
            this.careServiceCC = new CareService(this.config,this.channel,this.currentPaymentType,this.errorMessageResponse,this.commonService,this.errorHandling, CC);
            this.cardOnlyService = new CardOnlyService(this.config,this.channel,this.currentPaymentType,this.cardOnlyEditService, this.careServiceCC, this.ccComponent,this.errorMessageResponse,this.commonService,this.errorHandling);
            this.cardOnlyViewModelService = new CardOnlyViewModelService(this.ccComponent,this.cardOnlyService,this.cardOnlyEditService, this.careServiceCC, this.formValidationServiceCc,this.validationService, this.walletMgmtNoAutopayService);
            this.channel.channelData.selectedPaymentType = 'cardonly';            

            this.defaultPaymentService = new DefaultPaymentService(this.config,this.channel,this.currentPaymentType,'CC', this.errorMessageResponse,this.errorHandling);
            this.defaultPaymentViewModelServiceCc  = new DefaultPaymentViewModelService(this.accTypeComponent,this.defaultPaymentService,this.formValidationServiceAch,this.validationService);

            this.addressOnlyService = new AddressOnlyService(this.config,this.channel,this.currentPaymentType,this.addressComponentCc,this.errorMessageResponse,this.errorHandling);
            
            this.autoPayServiceCc  = new AutoPayService(this.config,this.channel,this.currentPaymentType,'CC',this.errorMessageResponse,this.errorHandling);
            this.autoPayViewModelServiceCc = new AutoPayViewModelService(this.autoPayComponentCc,this.autoPayServiceCc,this.formValidationServiceCc,this.validationService);

            this.termsAndConditionServiceCC = new TermsAndConditionService(this.config,this.channel,this.currentPaymentType,'CC',this.errorMessageResponse,this.errorHandling);
            this.tcViewModelServiceCc = new TermsAndConditionViewModelService(this.termsComponentCc, this.termsAndConditionServiceCC, this.formValidationServiceAch, this.validationService);

            this.cardOnlyService.runLoadFlow();
        }
    }
}