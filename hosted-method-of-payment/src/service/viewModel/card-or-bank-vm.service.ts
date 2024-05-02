import { Validation } from '../../utils/validation';
import { ErrorType, IInputReference, PaymentType } from '../../model/view.model';
import { CPC_PAYMENT_METHOD_CARD_SELECT, CPC_PAYMENT_METHOD_BANK_SELECT, JUMP_CC_COMPONENT_RESET, JUMP_CC_ADDRESS_COMPONENT_RESET, JUMP_ACH_COMPONENT_RESET, JUMP_ACH_ADDRESS_COMPONENT_RESET, JUMP_ACCOUNT_TYPE_COMPONENT_RESET, JUMP_AUTO_PAY_COMPONENT_RESET , JUMP_TC_COMPONENT_RESET, NEW_PAYMENT_OPTION_BUTTON, CPC_CARD_OR_BANK_PAYMENT_TYPE_NOT_SELECTED, CPC_BANK_OR_CARD_PAYMENT_TYPE_NOT_SELECTED, CARD_OR_BANK, BANK_OR_CARD, ACH, CC} from '../../constant/app.constant';
import { FormValidationService } from '../form-validation-service';

import { BaseViewModelService } from './base-vm.service';
import { IViewModel } from '../../model/viewModel/view-model';

import { Globals } from '../../utils/globals';
import { CardOrBankService } from '../card-or-bank.service';
import { DataLayerService } from '../data-layer.service';
/*
 * 1- All the service dependencies should be pass to the constructor of this service.
 * 2- Globals, utils, models, view modles, constants can be imported directly.
 * 3- All DOM manipulation should be done in CardOnlyViewModelService service.
 */
export class CardOrBankViewModelService extends BaseViewModelService{
    //public view:AchOnlyWebComponent;
    public model:CardOrBankService;
    public formValidationService:FormValidationService;
    public inputReference: IInputReference = Object.assign({});
    public viewModel:IViewModel = Object.assign({});
    public dataLayerService:DataLayerService;
    public global: Globals;
    public isComponentLoaded = false;
    public isBindEventExecuted = false;
    public isResetAch = false;
    public isResetCC = false;
    constructor(model:CardOrBankService, validationService:Validation){
        super(validationService);
        this.formValidationService = new FormValidationService();
        this.formValidationService.paymentType = PaymentType.CardOrBank;
        //this.view = view;
        this.model = model;
        this.global = Globals.getInstance();
        this.dataLayerService = new DataLayerService();
        //this.listenExternalEvent1();
        
    }
    //IMP: call from the base
    listenExternalEvent1(): void {
        //const selector = viewModel.template.ccContent;
        const ccOption =  document.querySelector('[id="jump-cc-type"]');
        const achOption =  document.querySelector('[id="jump-ach-type"]');
        const ccTemplate =  document.querySelector('[id="jump-credit-card-template"]');
        const achTemplate =  document.querySelector('[id="jump-ach-template"]');
        const displayNewPaymentOption = this.global.appState.get('channelData')?.config?.newPaymentDisplayType;
        const cpcPageType = this.model.config.cpcPageType.toString().toLowerCase();
        const cardComponent = document.getElementById('jump-cc-web-component');
        const bankComponent = document.getElementById('jump-ach-web-component');

        ccOption?.addEventListener('click', (e:any) => {
            if(e.target?.checked || e.target.name === 'jump-button-option-cc') {
                if(displayNewPaymentOption === NEW_PAYMENT_OPTION_BUTTON) {
                    this.isButtonActive('cc', achOption, ccOption);                
                }
                this.removeMessage('jump-error-web-component-card-or-bank');
                if(cpcPageType === PaymentType[PaymentType.CardOrBank].toLowerCase() || cpcPageType === PaymentType[PaymentType.BankOrCard].toLowerCase()) {
                    console.log('cc option clicked');
                    this.isResetAch = true;
                    if(this.isResetCC) {
                        this.global.actionObserverService.fire(this,{detail:{action:JUMP_CC_COMPONENT_RESET}});
                        this.global.actionObserverService.fire(this,{detail:{action:JUMP_CC_ADDRESS_COMPONENT_RESET}});
                        this.global.actionObserverService.fire(this,{detail:{action:JUMP_AUTO_PAY_COMPONENT_RESET}});
                        this.global.actionObserverService.fire(this,{detail:{action:JUMP_TC_COMPONENT_RESET}});
                    }
                }

                this.model.channel.channelData.selectedPaymentType = e.target?.value?.toLowerCase();
                if(e.target.name === 'jump-button-option-cc') {
                    this.model.channel.channelData.selectedPaymentType= 'cardonly';
                }
                bankComponent?.classList?.remove('show');
                bankComponent?.classList?.add('d-none');  
                cardComponent?.classList?.add('show');
                cardComponent?.classList?.remove('d-none');             
                ccTemplate?.classList?.add('show');
                ccTemplate?.classList?.remove('d-none');
                achTemplate?.classList?.add('d-none');
                achTemplate?.classList?.remove('show');
                this.dataLayerService.dispatchInfoEvent(CPC_PAYMENT_METHOD_CARD_SELECT);
            } else {
                this.model.channel.channelData.selectedPaymentType = '';
            }
            Globals.getInstance().appState.set('currentPaymentSubType', this.model.channel.channelData.selectedPaymentType);
            this.removeErrorNode();
        });
        
        achOption?.addEventListener('click', (e:any) => {
            if(e.target?.checked || e.target.name === 'jump-button-option-ach') {
                if(displayNewPaymentOption === NEW_PAYMENT_OPTION_BUTTON) {
                    this.isButtonActive('ach', achOption, ccOption);
                }
                this.removeMessage('jump-error-web-component-card-or-bank');
                if(cpcPageType === PaymentType[PaymentType.CardOrBank].toLowerCase() || cpcPageType === PaymentType[PaymentType.BankOrCard].toLowerCase()) {
                    console.log('ach option clicked');
                    this.isResetCC = true;
                    if(this.isResetAch) {
                        this.global.actionObserverService.fire(this,{detail:{action:JUMP_ACH_COMPONENT_RESET}});
                        this.global.actionObserverService.fire(this,{detail:{action:JUMP_ACCOUNT_TYPE_COMPONENT_RESET}});
                        this.global.actionObserverService.fire(this,{detail:{action:JUMP_ACH_ADDRESS_COMPONENT_RESET}});
                        this.global.actionObserverService.fire(this,{detail:{action:JUMP_AUTO_PAY_COMPONENT_RESET}});
                        this.global.actionObserverService.fire(this,{detail:{action:JUMP_TC_COMPONENT_RESET}});
                    }
                }
                this.model.channel.channelData.selectedPaymentType = e.target?.value?.toLowerCase();
                if(e.target.name === 'jump-button-option-ach') {
                    this.model.channel.channelData.selectedPaymentType= 'achonly';
                }
                cardComponent?.classList?.remove('show');
                cardComponent?.classList?.add('d-none');
                bankComponent?.classList?.remove('d-none');
                bankComponent?.classList?.add('show');
                achTemplate?.classList?.add('show');
                achTemplate?.classList?.remove('d-none');
                ccTemplate?.classList?.add('d-none');
                ccTemplate?.classList?.remove('show');
                e.stopPropagation(); 

                this.dataLayerService.dispatchInfoEvent(CPC_PAYMENT_METHOD_BANK_SELECT);
            } else {
                this.model.channel.channelData.selectedPaymentType = '';
            }
            Globals.getInstance().appState.set('currentPaymentSubType', this.model.channel.channelData.selectedPaymentType);
            this.removeErrorNode();
        });
        //return viewModel;
    }    
    isButtonActive(type:string, achOption:any, ccOption:any) {
        const cardClassAtt = ccOption.getAttribute('class');
        const bankClassAtt = achOption.getAttribute('class');
      
        if(type.toLowerCase() === ACH) {
            const newClassAtt = bankClassAtt + ' active';
            achOption.setAttribute('class', newClassAtt);
            achOption.setAttribute('aria-pressed','true');
            ccOption.setAttribute('class', 'tab-width btn btn-primary');
            ccOption?.removeAttribute('aria-pressed');
        }
        if(type.toLowerCase() === CC) {
            const newClassAtt = cardClassAtt + ' active';
            ccOption.setAttribute('class', newClassAtt);
            ccOption.setAttribute('aria-pressed','true');
            achOption.setAttribute('class', 'tab-width btn btn-primary');
            achOption?.removeAttribute('aria-pressed');
        }
    
    }
    submit(){
        if(!this.model.channel.channelData.channelDetails.hasOwnProperty('requirePaymentMethodSelection')){
            this.model.channel.channelData.channelDetails.requirePaymentMethodSelection = true;
        }
        if (typeof this.model.channel.channelData.selectedPaymentType === 'undefined' && this.model.channel.channelData.channelDetails.requirePaymentMethodSelection === true) {
            this.displayMessage(this.getCPCErrorMessage(ErrorType.payment_type,ErrorType.no_value),PaymentType.CardOrBank, this.model.channel.channelData.channelDetails?.cpcMessageDisplayLocation);
        }
    }
    displayMessage(message:string, cpcPageType: PaymentType, cpcMessageLocation: string) {
        const ach:any = document.getElementById('jump-ach-type');
        const card:any = document.getElementById('jump-cc-type');
        const pageType:any = this.global.appState.get('config').cpcPageType.toLowerCase();    
        if( cpcPageType === PaymentType.CardOrBank && (ach?.checked || card?.checked) ) {
            this.removeMessage('jump-error-web-component-card-or-bank');
        } else {
            if(pageType === CARD_OR_BANK?.toLowerCase()) {
                this.appendPaymentMessage(message, cpcMessageLocation, cpcPageType.toString().toLowerCase());
                this.dataLayerService.dispatchInfoEvent(CPC_CARD_OR_BANK_PAYMENT_TYPE_NOT_SELECTED, true);             
            }
            if(pageType === BANK_OR_CARD.toLowerCase()) {
                this.appendPaymentMessage(message, cpcMessageLocation, cpcPageType.toString().toLowerCase());
                this.dataLayerService.dispatchInfoEvent(CPC_BANK_OR_CARD_PAYMENT_TYPE_NOT_SELECTED, true);             
            }
        }
    }
    
    removeMessage(idLocation:string) {
        document.getElementById(idLocation)?.remove();
    }
    appendPaymentMessage(cpcMessage:string, cpcMessageLocation: string, cpcPageType:string ) {
        const selectPaymentMessageComp: any = document.getElementById('jump-error-web-component-card-or-bank');
        selectPaymentMessageComp.innerHTML = '';
        selectPaymentMessageComp.displayMessageLocation = cpcMessageLocation;
        selectPaymentMessageComp.errorMessage = cpcMessage;
        selectPaymentMessageComp.paymentType = cpcPageType;
        let errorMessageContainer: any = document.querySelector(
            `[name="jump-error-message-cob-${cpcMessageLocation}"]`
        );
        if (errorMessageContainer) {
            errorMessageContainer.appendChild(selectPaymentMessageComp);
        } else {
            selectPaymentMessageComp.displayMessageLocation = 'top';
            errorMessageContainer = document.querySelector(
                '[name="jump-error-message-cob-top"]'
            );
            errorMessageContainer.appendChild(selectPaymentMessageComp);
        }
    }
    removeErrorNode(){
        const el = document.getElementById('jump-error-template');
        if(el){
            el.remove();
        }
    }       
    removeErrorNodes(arrInputRef:Array<string>){
        arrInputRef.forEach(item=>{
            this.removeErrorFeedback(this.inputReference[item as keyof IInputReference]);
        });     
    }
    getCPCErrorMessage(key:string, subKey?:string): string {        
        let errorMessage = '';
        switch(key){
        case ErrorType.payment_type:            
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.payment_type,subKey);
            break;     
        }
        return errorMessage;
    }
}