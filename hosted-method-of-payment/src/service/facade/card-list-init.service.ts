import { ErrorType, IConfig, MessageType, PaymentType } from '../../model/view.model';
import {IChannelData } from '../../model/channel-data';
import { BaseInitService } from './base-init.service';
import { CardOnlyService } from '../card-only.service';
import { CardOnlyViewModelService } from '../viewModel/card-only-vm-service';
import { AddressOnlyService } from '../address-only.service';
import { CardOnlyEditService } from '../card-only-edit.service';
import { CareService } from '../care.service';
import { CardListService } from '../card-list.service';
import { CardListViewModelService } from '../viewModel/card-list-vm.service';
import { CPC_SORT_ATOZ, CPC_SORT_ZTOA, EVN_CPC_ERROR, JUMP_EXISTING_PAYMENT_RESPONSE_RECEIVED, JUMP_NEW_CARD_OPTION, JUMP_NEW_BANK_OPTION, JUMP_ACCOUNT_TYPE_COMPONENT_RESET, JUMP_ACH_ADDRESS_COMPONENT_RESET, JUMP_ACH_COMPONENT_RESET, JUMP_CC_ADDRESS_COMPONENT_RESET, JUMP_CC_COMPONENT_RESET, JUMP_EXISTING_PAYMENT_NO_TOKEN_RECEIVED, JUMP_NEW_PAYMENT_OPTION, JUMP_AUTO_PAY_COMPONENT_RESET, JUMP_TC_COMPONENT_RESET, ACH, CC, RESET, NEW_PAYMENT_OPTION_RADIO, CPC_NEW_CARD_OPTION_SELECTED, CPC_NEW_BANK_OPTION_SELECTED, BANK, CARD, JUMP_ERROR_MESSAGE_LOADED } from '../../constant/app.constant';
import { ErrorHandling } from '../../utils/error-handling';
import { AccountTypeService } from '../account-type.service';
import { AchOnlyEditService } from '../ach-only-edit.service';
import { AchOnlyService } from '../ach-only.service';
import { AccountTypeViewModelService } from '../viewModel/account-type-vm.service';
import { AchOnlyViewModelService } from '../viewModel/ach-only-vm-service';
import { AutoPayService } from '../auto-pay.service';
import { TermsAndConditionService } from '../terms-and-condition.service';
import { TermsAndConditionViewModelService } from '../viewModel/terms-and-condition-vm-service';
import { AutoPayViewModelService } from '../viewModel/auto-pay-vm-service';
import { setIcon } from '../../utils/card-type';
import { translatePsTypeToNiceType } from '../../utils/card-type';
import { WalletMgmtNoAutopayService } from '../wallet-mgmt-no-autopay.service';
import { translatePaymentServiceBankAccountTypeToLabel } from '../../constant/bank-account-type';
import { waitForElementToLoad } from '../../utils/elementLoader';

export class CardListInitService extends BaseInitService {
    counter = 0;
    activePaymentType='';
    constructor(config:IConfig, channelData:IChannelData){
        super(config, channelData);
        this.loadExistingPayment();

    }
    runChild(): void {
        let url ='';
        const rootUrl = this.config.envConfig.cpcEnv.split('/');
        const displayNewPaymentOption = this.global.appState.get('channelData')?.config?.newPaymentDisplayType;
        if(this.currentPaymentType === PaymentType[PaymentType.CardBankOrExisting].toLowerCase() || this.currentPaymentType === PaymentType[PaymentType.WalletMgmtNoAutopay].toLowerCase() 
        || this.currentPaymentType === PaymentType[PaymentType.BankCardOrExisting].toLowerCase() || this.currentPaymentType === PaymentType[PaymentType.CardExpirationEdit].toLowerCase()) {
            if(displayNewPaymentOption === NEW_PAYMENT_OPTION_RADIO && this.currentPaymentType === PaymentType[PaymentType.CardBankOrExisting].toLowerCase()) {
                url = this.config.envConfig.cpcEnv.replace(rootUrl[rootUrl.length - 1], '') + 'template/card-bank-or-existing-radio-template.html';
                this.render(url,'CardBankOrExistingRadioTemplate',['jump-card-list-component']);
            } else if(displayNewPaymentOption === NEW_PAYMENT_OPTION_RADIO && this.currentPaymentType === PaymentType[PaymentType.BankCardOrExisting].toLowerCase()) {
                url = this.config.envConfig.cpcEnv.replace(rootUrl[rootUrl.length - 1], '') + 'template/bank-card-or-existing-radio-template.html';
                this.render(url,'BankCardOrExistingRadioTemplate',['jump-card-list-component']);
            } else if(this.currentPaymentType === PaymentType[PaymentType.BankCardOrExisting].toLowerCase() && displayNewPaymentOption !== NEW_PAYMENT_OPTION_RADIO) {
                url = this.config.envConfig.cpcEnv.replace(rootUrl[rootUrl.length - 1], '') + 'template/bank-card-or-existing-template.html';
                this.render(url,'BankCardOrExistingTemplate',['jump-card-list-component']);
                this.global.appState.set('currentPaymentType', PaymentType.BankCardOrExisting.toString().toLowerCase());
            } else if(this.currentPaymentType === PaymentType[PaymentType.WalletMgmtNoAutopay].toLowerCase() && displayNewPaymentOption !== NEW_PAYMENT_OPTION_RADIO && this.currentPaymentType){
                url = this.config.envConfig.cpcEnv.replace(rootUrl[rootUrl.length - 1], '') + 'template/wallet-mgmt-no-autopay-template.html';
                this.render(url,'WalletMgmtNoAutopayTemplate',['jump-card-list-component']);
                this.global.appState.set('currentPaymentType', PaymentType.WalletMgmtNoAutopay.toString().toLowerCase());
            } else if(this.currentPaymentType === PaymentType[PaymentType.CardExpirationEdit].toLowerCase() && displayNewPaymentOption !== NEW_PAYMENT_OPTION_RADIO && this.currentPaymentType){
                url = this.config.envConfig.cpcEnv.replace(rootUrl[rootUrl.length - 1], '') + 'template/wallet-mgmt-no-autopay-template.html';
                this.render(url,'WalletMgmtNoAutopayTemplate',['jump-card-list-component']);
                this.global.appState.set('currentPaymentType', PaymentType.CardExpirationEdit.toString().toLowerCase());
            } else {
                url = this.config.envConfig.cpcEnv.replace(rootUrl[rootUrl.length - 1], '') + 'template/card-bank-or-existing-template.html';
                this.render(url,'CardBankOrExistingTemplate',['jump-card-list-component']);
                this.global.appState.set('currentPaymentType', PaymentType.CardBankOrExisting.toString().toLowerCase());
            }
        } 
        else if(this.currentPaymentType === PaymentType[PaymentType.WalletMgmtNoAutopay].toLowerCase()) {
            url = this.config.envConfig.cpcEnv.replace(rootUrl[rootUrl.length - 1], '') + 'template/wallet-mgmt-no-autopay-template.html';
            this.render(url,'WalletMgmtNoAutopayTemplate',['jump-card-list-component']);
            this.global.appState.set('currentPaymentType', PaymentType.WalletMgmtNoAutopay.toString().toLowerCase());
        } 
        else {
            if(displayNewPaymentOption === NEW_PAYMENT_OPTION_RADIO) {
                url = this.config.envConfig.cpcEnv.replace(rootUrl[rootUrl.length - 1], '') + 'template/card-bank-or-existing-radio-template.html';
                this.render(url,'CardBankOrExistingRadioTemplate',['jump-card-list-component']);
            } else {
                url = this.config.envConfig.cpcEnv.replace(rootUrl[rootUrl.length - 1], '') + 'template/card-or-existing-template.html';
                this.global.appState.set('currentPaymentType', PaymentType.CardOrExisting.toString().toLowerCase());
                //this.render(url,'CardOrExistingTemplate',['jump-card-list-component','jump-cc-web-component']);
                this.render(url,'CardOrExistingTemplate',['jump-card-list-component']);
            }
        }        
    }
    renderChild(componentIds:Array<string>){
        console.log('rendeer child card-or-existing');
    }
    loadChild(){ 
        this.currentPaymentType = this.config.cpcPageType.toString().toLowerCase();
        this.cardListService = new CardListService(this.config,this.channel,this.currentPaymentType,this.cardListComponent,this.errorMessageResponse,this.commonService, this.errorHandling,this.walletMgmtNoAutopayService);
        this.cardListViewModelService = new CardListViewModelService(this.cardListComponent,this.cardListService,this.formValidationServiceCcList,this.validationService,this.walletMgmtNoAutopayService);

        this.cardListService.getExistingPaymentInstrument();
        this.walletMgmtNoAutopayService = new WalletMgmtNoAutopayService(this.config, this.channel, this.currentPaymentType, this.ccComponent, this.errorMessageResponse, this.commonService, this.errorHandling);
        this.addressOnlyService = new AddressOnlyService(this.config,this.channel,this.currentPaymentType,this.addressComponentCc,this.errorMessageResponse,this.errorHandling);
        
        this.autoPayServiceCc  = new AutoPayService(this.config,this.channel,this.currentPaymentType,'CC',this.errorMessageResponse,this.errorHandling);
        this.autoPayViewModelServiceCc = new AutoPayViewModelService(this.autoPayComponentCc,this.autoPayServiceCc,this.formValidationServiceAch,this.validationService);
        
        this.termsAndConditionServiceCC = new TermsAndConditionService(this.config,this.channel,this.currentPaymentType,'CC',this.errorMessageResponse,this.errorHandling);
        this.tcViewModelServiceCc = new TermsAndConditionViewModelService(this.termsComponentCc, this.termsAndConditionServiceCC, this.formValidationServiceAch, this.validationService);

        this.cardListService.runLoadFlow();        

        this.cardOnlyEditService = new CardOnlyEditService(this.config,this.channel,this.currentPaymentType,this.errorMessageResponse,this.commonService,this.errorHandling);

        this.careServiceCC = new CareService(this.config,this.channel,this.currentPaymentType,this.errorMessageResponse,this.commonService,this.errorHandling, CC);
        this.cardOnlyService = new CardOnlyService(this.config,this.channel,this.currentPaymentType,this.cardOnlyEditService,this.careServiceCC,this.cardListComponent,this.errorMessageResponse,this.commonService, this.errorHandling);
        this.cardOnlyViewModelService = new CardOnlyViewModelService(this.cardListComponent,this.cardOnlyService,this.cardOnlyEditService,this.careServiceCC,this.formValidationServiceCc,this.validationService,this.walletMgmtNoAutopayService);

        this.cardOnlyService.runLoadFlow();
        if(this.currentPaymentType === PaymentType[PaymentType.CardBankOrExisting].toLowerCase() || this.currentPaymentType === PaymentType[PaymentType.WalletMgmtNoAutopay].toLowerCase() 
        || this.currentPaymentType === PaymentType[PaymentType.BankCardOrExisting].toLowerCase() || this.currentPaymentType === PaymentType[PaymentType.CardExpirationEdit].toLowerCase()) {
            this.achOnlyEditService = new AchOnlyEditService(this.config,this.channel,this.currentPaymentType,this.errorMessageResponse,this.commonService,this.errorHandling);
            this.careServiceACH = new CareService(this.config,this.channel,this.currentPaymentType,this.errorMessageResponse,this.commonService,this.errorHandling, ACH);
            this.achOnlyService = new AchOnlyService(this.config,this.channel,this.currentPaymentType,this.achOnlyEditService,this.achComponent,this.errorMessageResponse,this.commonService,this.errorHandling, this.careServiceACH);
            this.achOnlyViewModelService  = new AchOnlyViewModelService(this.achComponent,this.achOnlyService,this.achOnlyEditService,this.formValidationServiceAch,this.validationService,this.walletMgmtNoAutopayService, this.careServiceACH);
    
            this.accTypeService = new AccountTypeService(this.config,this.channel,this.currentPaymentType,this.errorMessageResponse,this.errorHandling);
            this.accountTypeViewModelService  = new AccountTypeViewModelService(this.accTypeComponent,this.accTypeService,this.formValidationServiceAch,this.validationService);
    
            //this.achOnlyService.viewModel.templateContent = templateContent;
            this.addressOnlyService = new AddressOnlyService(this.config,this.channel,this.currentPaymentType,this.addressComponentAch,this.errorMessageResponse,this.errorHandling);
            
            this.autoPayServiceAch  = new AutoPayService(this.config,this.channel,this.currentPaymentType,'ACH',this.errorMessageResponse,this.errorHandling);
            this.autoPayViewModelServiceAch = new AutoPayViewModelService(this.autoPayComponentAch,this.autoPayServiceAch,this.formValidationServiceAch,this.validationService);

            this.termsAndConditionServiceAch = new TermsAndConditionService(this.config,this.channel,this.currentPaymentType,'ACH',this.errorMessageResponse,this.errorHandling);
            this.tcViewModelServiceAch = new TermsAndConditionViewModelService(this.termsComponentAch, this.termsAndConditionServiceAch, this.formValidationServiceAch, this.validationService);

            this.achOnlyService.runLoadFlow();
        }

    }
    loadExistingPayment(){
        this.global.actionObserverService.subscribe((sender:any,response:any) => {
            switch(response.detail.action){
            case JUMP_EXISTING_PAYMENT_RESPONSE_RECEIVED:
                console.log('jump-existing-payment-response-received ', response.detail.data);
                this.displayList(response.detail.data);
                break;
            case JUMP_EXISTING_PAYMENT_NO_TOKEN_RECEIVED:
                const displayNewPaymentOption = this.global.appState.get('channelData')?.config?.newPaymentDisplayType;
                if (displayNewPaymentOption === NEW_PAYMENT_OPTION_RADIO && this.currentPaymentType === PaymentType[PaymentType.CardOrExisting].toLowerCase()) {
                    this.newCard('Add a new credit/debit card');
                } else if(displayNewPaymentOption === NEW_PAYMENT_OPTION_RADIO || this.currentPaymentType === PaymentType[PaymentType.WalletMgmtNoAutopay].toLowerCase() || this.currentPaymentType === PaymentType[PaymentType.CardExpirationEdit].toLowerCase()) {
                    this.newCard('Add a new credit/debit card');
                    this.newBank('Add a new bank account');
                } else {
                    this.setNewOptionProps();
                    this.displayAddress(true,'jump-new-container');
                }
                break;
            }
        });
    }    
    async displayCards(paymentCards:any): Promise<any> {
        const paymentCardArray = [];
        if(this.currentPaymentType !== PaymentType[PaymentType.CardExpirationEdit].toLowerCase()) {
            paymentCards = this.sortPaymentInstruments(paymentCards);
        } else {
            paymentCardArray.push(paymentCards);
            paymentCards = paymentCardArray;
        }
        const elementId = '[name="cardListPlaceholder"]';
        const cardListPlaceholder:any = await waitForElementToLoad(elementId).then((element:any) => {
            return element;
        }); 
        if(!cardListPlaceholder) {
            console.log('card cardListPlaceholder is null' );
        }        
        let cardListComponent:any = Object.assign({});
        let expiration = '';
        paymentCards.forEach((eachCard:any) =>{
            this.counter++;
            cardListComponent = document.createElement('jump-card-list-web-component');
            if(eachCard.expirationDate) {
                expiration = eachCard.expirationDate.substring(0,2) + '/' + eachCard.expirationDate.substring(2,4);
            }
            cardListComponent.PaymentListFor = CC;
            cardListComponent.id = 'jump-card-' + this.counter;
            cardListComponent.PaymentToken = eachCard.token;
            cardListComponent.cardNo = eachCard.maskedCardNumber;
            cardListComponent.routerNo = '';
            cardListComponent.cardType = eachCard.cardType;
            eachCard.cardType = translatePsTypeToNiceType(eachCard.cardType);
            cardListComponent.cardDescription = `${eachCard.cardType} **** ${eachCard.cardLast4Digits}`;
            cardListComponent.cardExpiry = expiration;
            cardListComponent.defaultInstrument = eachCard.defaultInstrument ? 'true':'false';
            cardListComponent.walletId = eachCard.customerId;
            if(eachCard.paymentMode === 'RecurringPayment' ) {
                cardListComponent.autoPayLabel = 'autopay';
            }else{
                cardListComponent.autoPayLabel = 'onetime';
            }
            cardListComponent.actionObserverService = this.actionObserverService;
            this.resetOnCardList(cardListComponent);
            cardListPlaceholder?.appendChild(cardListComponent);
        });
    }
    async displayBanks(banks:any): Promise<any> {
        const channelType = this.global.appState.get('config').channelTemplateMapping;
        const channelName = this.global.appState.get('channelData')?.channelDetails.channelName;
        const elementId = '[name="cardListPlaceholder"]';
        const cardListPlaceholder:any = await waitForElementToLoad(elementId).then((element:any) => {
            return element;
        });
        if(!cardListPlaceholder) {
            console.log('bank cardListPlaceholder is null' );
        }        
        let cardListComponent:any = Object.assign({});
        let accountType:any = '';
        banks.forEach((eachCard:any) =>{
            this.counter++;
            cardListComponent = document.createElement('jump-card-list-web-component');
            accountType = translatePaymentServiceBankAccountTypeToLabel(eachCard.accountType, channelType, channelName);
            cardListComponent.PaymentListFor = 'bank';
            cardListComponent.id = 'jump-card-' + this.counter;
            cardListComponent.PaymentToken = eachCard.token;
            cardListComponent.cardNo = eachCard.maskedAccountNumber;
            cardListComponent.routerNo = eachCard.routingNumber;
            cardListComponent.cardType = 'bank';
            cardListComponent.cardDescription = `Bank ${eachCard.maskedAccountNumber}`;
            cardListComponent.cardExpiry = accountType;
            cardListComponent.defaultInstrument = eachCard.defaultInstrument ? 'true':'false';
            cardListComponent.walletId = eachCard.customerId;
            if(eachCard.paymentMode === 'RecurringPayment' ) {
                cardListComponent.autoPayLabel = 'autopay';
            }else{
                cardListComponent.autoPayLabel = 'onetime';
            }
            cardListComponent.actionObserverService = this.actionObserverService;
            this.resetOnCardList(cardListComponent);
            cardListPlaceholder?.appendChild(cardListComponent);
        });
    }
    resetOnCardList(cardListComponent:any):void {
        cardListComponent.addEventListener('click',()=>{
            this.resetAch();
            this.resetCC();
            this.isButtonActive(RESET);
        });
    }
    async setNewOptionProps(): Promise<any> {
        let ccOption =  document.querySelector('[id="jump-cc-type"]');
        let achOption =  document.querySelector('[id="jump-ach-type"]');
        
        const defaultSelectedPaymentType = this.global.appState.get('channelData')?.config?.defaultSelectedPaymentType?.toLowerCase();
        if(defaultSelectedPaymentType === CARD) {this.displayTemplate(CC);}
        if(defaultSelectedPaymentType === BANK) {this.displayTemplate(ACH);}
        if(!ccOption) {
            const ccOptionId:any = '[id="jump-cc-type"]';
            ccOption = await waitForElementToLoad(ccOptionId).then((element:any) => {
                ccOption = element;
                ccOption?.addEventListener('click',()=>{this.displayTemplate(CC);});
                return element;
            }); 
        } else {
            ccOption?.addEventListener('click',()=>{this.displayTemplate(CC);});
        }
        if(!achOption) {
            const achOptionId:any = '[id="jump-ach-type"]';
            achOption = await waitForElementToLoad(achOptionId).then((element:any) => {
                achOption = element;
                achOption?.addEventListener('click',()=>{this.displayTemplate(ACH);});
                return element;
            }); 
        } else {
            achOption?.addEventListener('click',()=>{this.displayTemplate(ACH);});
        }
    }
    displayTemplate(template:string):void {
        if(template === CC) {
            if(this.activePaymentType !== CC) {
                this.resetCC();
            }
            this.isButtonActive(CC);
            this.displayAchOrCC(CC);
            this.activePaymentType=CC;
        } else {
            if(this.activePaymentType !== ACH) {
                this.resetAch();
            }
            this.isButtonActive(ACH);
            this.displayAchOrCC(ACH);
            this.activePaymentType=ACH;
        }
    }
    async displayAchOrCC(type:string): Promise<any> {
        const ccElementId:any = '[id="jump-new-cc-template"]';
        const ccTemplate = await waitForElementToLoad(ccElementId).then((element:any) => {
            return element;
        }); 
        const achElementId:any = '[id="jump-new-bank-template"]';
        const achTemplate = await waitForElementToLoad(achElementId).then((element:any) => {
            return element;
        }); 
        const cardComponentId = '[id="jump-cc-web-component"]';
        const cardComponent = await waitForElementToLoad(cardComponentId).then((element:any) => {
            return element;
        });
        const bankComponentId = '[id="jump-ach-web-component"]';
        const bankComponent = await waitForElementToLoad(bankComponentId).then((element:any) => {
            return element;
        });
        if(type === CC) {
            bankComponent?.classList?.remove('show');
            bankComponent?.classList?.add('d-none');
            cardComponent?.classList?.remove('d-none');
            cardComponent?.classList?.add('show');

            ccTemplate?.classList.add('show');
            ccTemplate?.classList.remove('d-none');
            achTemplate?.classList.add('d-none');
            achTemplate?.classList.remove('show');
            this.global.appState.get('channelData').selectedPaymentType = 'cardonly';
            this.dataLayerService.dispatchInfoEvent(CPC_NEW_CARD_OPTION_SELECTED, 'cardonly');
        } 
        if(type === ACH) {
            cardComponent?.classList?.remove('show');
            cardComponent?.classList?.add('d-none');
            bankComponent?.classList?.remove('d-none');
            bankComponent?.classList?.add('show');

            achTemplate?.classList.add('show');
            achTemplate?.classList.remove('d-none');
            ccTemplate?.classList.add('d-none');
            ccTemplate?.classList.remove('show');
            this.global.appState.get('channelData').selectedPaymentType = 'achonly';
            this.dataLayerService.dispatchInfoEvent(CPC_NEW_BANK_OPTION_SELECTED, 'achonly');
        }
    }
    resetAch():void {
        this.global.actionObserverService.fire(this,{detail:{action:JUMP_ACH_COMPONENT_RESET}});
        this.global.actionObserverService.fire(this,{detail:{action:JUMP_ACCOUNT_TYPE_COMPONENT_RESET}});
        this.global.actionObserverService.fire(this,{detail:{action:JUMP_ACH_ADDRESS_COMPONENT_RESET}});
        this.global.actionObserverService.fire(this,{detail:{action:JUMP_AUTO_PAY_COMPONENT_RESET}}); 
        this.global.actionObserverService.fire(this,{detail:{action:JUMP_TC_COMPONENT_RESET}});
    }
    resetCC():void {
        this.global.actionObserverService.fire(this,{detail:{action:JUMP_CC_COMPONENT_RESET}});
        this.global.actionObserverService.fire(this,{detail:{action:JUMP_CC_ADDRESS_COMPONENT_RESET}});
        this.global.actionObserverService.fire(this,{detail:{action:JUMP_AUTO_PAY_COMPONENT_RESET}});
        this.global.actionObserverService.fire(this,{detail:{action:JUMP_TC_COMPONENT_RESET}});
    }
    isButtonActive(type:string):void {
        const ccTemplate =  document.querySelector('[id="jump-new-cc-template"]');
        const achTemplate =  document.querySelector('[id="jump-new-bank-template"]');
        const ccOption:any =  document.querySelector('[id="jump-cc-type"]');
        const achOption:any =  document.querySelector('[id="jump-ach-type"]');
        const cardCheckCircle = document.querySelector('#jump-cc-type [name="card-check-circle"]');
        const bankCheckCircle = document.querySelector('#jump-ach-type [name="bank-check-circle"]');
        if(type === RESET) {
            ccOption?.removeAttribute('aria-pressed');
            ccOption?.setAttribute('class', 'tab-width btn btn-primary');
            achOption?.setAttribute('class', 'tab-width btn btn-primary');
         
            ccTemplate?.classList?.remove('show');
            ccTemplate?.classList?.add('d-none');
            achOption?.removeAttribute('aria-pressed');
            achTemplate?.classList?.remove('show');
            achTemplate?.classList?.add('d-none');
            cardCheckCircle?.classList.remove('show');
            cardCheckCircle?.classList.add('d-none');
            bankCheckCircle?.classList.remove('show');
            bankCheckCircle?.classList.add('d-none');
            if(ccOption) {
                ccOption.checked = false;
            }
            if(achOption) {
                achOption.checked = false;
            }
        }
        if(type === ACH) {
            const newAchClassAtt = 'tab-width btn btn-primary active';
            ccOption?.setAttribute('class', 'tab-width btn btn-primary');
            achOption?.setAttribute('class', newAchClassAtt);
            achOption?.setAttribute('aria-pressed','true');
            ccOption?.removeAttribute('aria-pressed');
            setIcon(bankCheckCircle,'check-circle-fill', this);
            cardCheckCircle?.classList.add('d-none');
            cardCheckCircle?.classList.remove('show');
            bankCheckCircle?.classList.remove('d-none');
            bankCheckCircle?.classList.add('show');
            if(achOption) {
                console.log(' ach checked');
                achOption.setAttribute('achOptionSelected', true);
                const errorWebComponent = document.getElementById('jump-error-web-component-card-bank-or-existing');
                if(errorWebComponent) {
                    errorWebComponent?.remove();
                }
            }
            if(ccOption) {
                ccOption.setAttribute('ccOptionSelected', false);
            }
        }
        if(type === CC) {
            const newCardClassAtt = 'tab-width btn btn-primary active';
            achOption?.setAttribute('class', 'tab-width btn btn-primary');
        
            ccOption?.setAttribute('class', newCardClassAtt);
            ccOption?.setAttribute('aria-pressed','true');
            achOption?.removeAttribute('aria-pressed');
            setIcon(cardCheckCircle,'check-circle-fill', this);
            bankCheckCircle?.classList.add('d-none');
            bankCheckCircle?.classList.remove('show');
            cardCheckCircle?.classList.remove('d-none');
            cardCheckCircle?.classList.add('show');
            if(ccOption) {
                ccOption.setAttribute('ccOptionSelected',true);
                const errorWebComponent = document.getElementById('jump-error-web-component-card-bank-or-existing');
                if(errorWebComponent) {
                    errorWebComponent?.remove();
                }
            }
            if(achOption) {
                achOption.setAttribute('achOptionSelected',false);
            }  
        }
    }
    async displayList(response:any): Promise<any> {       
        const cpcPageType = this.currentPaymentType = this.config.cpcPageType.toString().toLowerCase();
        if (response.cpcStatus?.toLowerCase() === 'success') {
            let paymentCards = '';
            let paymentBanks = '';
            if(cpcPageType === PaymentType[PaymentType.CardExpirationEdit].toLowerCase()) {
                paymentCards = await response?.walletCardDetails;
                paymentBanks = response?.walletBankDetails;
            } else {
                paymentCards = await response.customerWalletDetails.paymentCards;
                paymentBanks = await response.customerWalletDetails.banks;
            }
            if(cpcPageType === PaymentType[PaymentType.CardBankOrExisting].toLowerCase() || cpcPageType === PaymentType[PaymentType.BankCardOrExisting].toLowerCase()) {
                //paymentBanks.length = 0;
                //paymentCards.length = 0;
                if(paymentCards) {
                    this.displayCards(paymentCards);
                }
                if(paymentBanks) {
                    this.displayBanks(paymentBanks);
                }
                if(this.isRadioOption(NEW_PAYMENT_OPTION_RADIO)) {
                    this.newCard('Add a new credit/debit card');
                    this.newBank('Add a new bank account');
                }
                this.setNewOptionProps();
                if(paymentCards|| paymentBanks){
                    if(!this.isRadioOption(NEW_PAYMENT_OPTION_RADIO)) {
                        this.newPaymentOption();                    
                    }
                } else {
                    this.displayAddress(true,'jump-new-container');
                }
            } else if(cpcPageType === PaymentType[PaymentType.CardOrExisting].toLowerCase())  {
                if(paymentCards) {
                    this.displayCards(paymentCards);
                }
                if(paymentCards){
                    if(this.isRadioOption(NEW_PAYMENT_OPTION_RADIO)) {
                        this.newCard('Add a new credit/debit card');
                    } else {
                        this.newCard('New Credit/Debit Card');
                    }
                }else{
                    this.global.appState.get('channelData').selectedPaymentType = 'cardonly';
                    this.displayAddress(true,'jump-card-container');
                }
            } else if(cpcPageType === PaymentType[PaymentType.WalletMgmtNoAutopay].toLowerCase()) {
                
                if(paymentCards) {
                    this.displayCards(paymentCards);
                }
                if(paymentBanks) {
                    this.displayBanks(paymentBanks);
                }
                this.setNewOptionProps();
                if(paymentBanks || paymentCards) {
                    this.newCard('Add a new credit/debit card');
                    this.newBank('Add a new bank account');
                } else {
                    this.displayAddress(true,'jump-new-container');
                }
            } else if(cpcPageType === PaymentType[PaymentType.CardExpirationEdit].toLowerCase()) {
                if(paymentCards) {
                    this.displayCards(paymentCards);
                }
            }
            
        } else if (response.cpcStatus.toLowerCase() === 'error') {
            const errorHandling = new ErrorHandling();
            const cpcMessage = errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.form, MessageType.error, this.getErrorMessage(ErrorType.service, response?.psErrorCode));
            errorHandling.showError(
                cpcMessage,
                response?.psErrorMessage
            );
        }                
    }
    async displayAddress(display:boolean,pageType:string): Promise<void> {
        const cardComponentId:any = '[name="'+pageType+'"]';
        const cardComponent:any = await waitForElementToLoad(cardComponentId).then((element:any) => {
            return element;
        }); 
        if(!cardComponent) return;
        if(display) {
            cardComponent.classList.remove('d-none');
            cardComponent.classList.add('show');
        } else {
            cardComponent.classList.add('d-none');
            cardComponent.classList.remove('show');
        }
    }
    async newPaymentOption(): Promise<any> {
        const elementId:any = '[name="newPaymentOptionPlaceholder"]';
        const bankListPlaceholder:any = await waitForElementToLoad(elementId).then((element:any) => {
            return element;
        }); 
        const cardListComponent:any = document.createElement('jump-card-list-web-component');
        cardListComponent.PaymentListFor = 'newpayament';
        cardListComponent.id = JUMP_NEW_PAYMENT_OPTION;
        cardListComponent.cardType = 'newpayment';
        cardListComponent.cardDescription = 'New payment method';
        cardListComponent.cardExpiry = '';
        cardListComponent.actionObserverService = this.actionObserverService;
        bankListPlaceholder?.appendChild(cardListComponent);
    }
    async newCard(description:string): Promise<any>  {
        const elementId:any = '[name="cardListPlaceholder"]';
        let cardListPlaceholder:any = await waitForElementToLoad(elementId).then((element:any) => {
            return element;
        });
        const cardListComponent:any = document.createElement('jump-card-list-web-component');
        cardListComponent.PaymentListFor = CC;
        cardListComponent.id = JUMP_NEW_CARD_OPTION;
        cardListComponent.cardType = '';
        cardListComponent.cardDescription = description;
        cardListComponent.cardExpiry = '';
        cardListComponent.actionObserverService = this.actionObserverService;
        if(this.isRadioOption(NEW_PAYMENT_OPTION_RADIO) || this.currentPaymentType === PaymentType[PaymentType.WalletMgmtNoAutopay].toLowerCase() || this.currentPaymentType === PaymentType[PaymentType.CardExpirationEdit].toLowerCase()) {
            const elementId = '[name="cardListPlaceholderCard"]';
            cardListPlaceholder = await waitForElementToLoad(elementId).then((element:any) => {
                return element?.prepend(cardListComponent);
            }); 
        } else {
            cardListPlaceholder?.appendChild(cardListComponent); 
        }
    }

    async newBank(description:string): Promise<any> {
        const elementId:any = '[name="cardListPlaceholder"]';
        let cardListPlaceholder:any = await waitForElementToLoad(elementId).then((element:any) => {
            return element;
        });
        const cardListComponent:any = document.createElement('jump-card-list-web-component');
        cardListComponent.PaymentListFor = 'bank';
        cardListComponent.id = JUMP_NEW_BANK_OPTION;
        cardListComponent.cardType = '';
        cardListComponent.cardDescription = description;
        cardListComponent.cardExpiry = '';
        cardListComponent.cardNo = '';
        cardListComponent.routerNo = '';
        cardListComponent.actionObserverService = this.actionObserverService;
        if(this.isRadioOption(NEW_PAYMENT_OPTION_RADIO) || this.currentPaymentType === PaymentType[PaymentType.WalletMgmtNoAutopay].toLowerCase() || this.currentPaymentType === PaymentType[PaymentType.CardExpirationEdit].toLowerCase()) {
            const elementId = '[name="cardListPlaceholderBank"]';
            cardListPlaceholder = await waitForElementToLoad(elementId).then((element:any) => {
                return element?.prepend(cardListComponent);
            }); 
        } else {
            cardListPlaceholder?.appendChild(cardListComponent);
        }
    }
    isRadioOption(isRadio:string) :boolean {
        const displayNewPaymentOption = this.global.appState.get('channelData')?.config?.newPaymentDisplayType;
        let flag = false;
        if(displayNewPaymentOption === isRadio) {
            flag = true;
        }
        return flag;
    }
    sortPaymentInstruments(data:any) :any {
        if (
            this.channel.channelData.existingPaymentMethodSortOrder === CPC_SORT_ATOZ
        ) {
            data.sort((a: any, b: any) =>
                a.cardType.localeCompare(b.cardType)
            );
        }
        if (
            this.channel.channelData.existingPaymentMethodSortOrder === CPC_SORT_ZTOA
        ) {
            data.sort((a: any, b: any) =>
                b.cardType.localeCompare(a.cardType)
            );
        }
        data.sort((x: any) => (x.defaultInstrument ? -1 : 1));
        return data;
    }
    getErrorMessage(key:string, subKey?:string): string {        
        let errorMessage = '';
        switch(key){
        case ErrorType.service:            
            errorMessage = this.global.getErrorMessage(ErrorType.service, subKey);
            break;
        case ErrorType.payment_type:  
            errorMessage = this.global.getErrorMessage(ErrorType.form, ErrorType.payment_type, subKey);
            break;  
        default:
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.card,key,subKey);
            break;
        }
        return errorMessage;
    }
}