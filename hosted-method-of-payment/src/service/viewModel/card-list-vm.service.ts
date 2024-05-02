import {EVN_CPC_ERROR, JUMP_NEW_CARD_OPTION, JUMP_NEW_BANK_OPTION, JUMP_NEW_PAYMENT_OPTION, JUMP_UPDATE_VIEW_MODEL, BANK, NEWPAYMENT, CPC_CARD_BANK_OR_EXISTING_PAYMENT_TYPE_NOT_SELECTED, CPC_BANK_CARD_OR_EXISTING_PAYMENT_TYPE_NOT_SELECTED, CPC_CARD_BANK_OR_EXISTING, CPC_BANK_CARD_OR_EXISTING, CARD_OR_EXISTING, CPC_CARD_OR_EXISTING_PAYMENT_TYPE_NOT_SELECTED } from '../../constant/app.constant';
import { CardListWebComponent } from '../../index';
import { ErrorType, IInputReference, MessageType, PaymentType } from '../../model/view.model';
import { IViewModel } from '../../model/viewModel/view-model';
import { Validation } from '../../utils/validation';
import { FormValidationService } from '../form-validation-service';
import { BaseViewModelService } from './base-vm.service';
import { CardListService } from '../card-list.service';
import { ErrorHandling } from '../../utils/error-handling';
import { Globals } from '../../utils/globals';
import { WalletMgmtNoAutopayService } from '../wallet-mgmt-no-autopay.service';
import { DataLayerService } from '../data-layer.service';
import { translateLabelBankAccountTypeToPaymentService } from '../../constant/bank-account-type';

export class CardListViewModelService extends BaseViewModelService{
    public cardListWebComponent:CardListWebComponent;
    public cardListService:CardListService;     
    public formValidationService:FormValidationService;
    public inputReference: IInputReference = Object.assign({});
    public viewModel:IViewModel = Object.assign({});
    public walletMgmtNoAutopayService: WalletMgmtNoAutopayService = Object.assign({});
    public currentPaymentType = '';
    public dataLayerService:DataLayerService;
    constructor(cardListWebComponent:CardListWebComponent,cardListService:CardListService, formValidationService:FormValidationService, validationService:Validation, walletMgmtNoAutoPayService:WalletMgmtNoAutopayService){
        super(validationService,cardListService.config);
        this.formValidationService = new FormValidationService();
        this.cardListWebComponent = cardListWebComponent;
        this.cardListService = cardListService;
        this.walletMgmtNoAutopayService = walletMgmtNoAutoPayService;
        this.dataLayerService = new DataLayerService();
    }
    handleComponentLoaded(){
        this.checkToRunBindEvent();
    }
    handleErrMessageLoaded(pageType:string){
        this.executeBindEvent('handleErrMessageLoaded - card-list-vm.service.ts' + ' ' + pageType);
    }    
    handleReset(){
        this.reset();
    }  
    setElementReference(): void {
        this.inputReference.accountTypeCorporateChecking = this.getElementRef('[id="jump-acc-type-corporate-checking"]');
        this.inputReference.accountTypeChecking = this.getElementRef('[id="jump-acc-type-checking"]');
        this.inputReference.accountTypeSaving = this.getElementRef('[id="jump-acc-type-saving"]');
    }  
    bindEvents(){
        //
    }
    
    submit(e:any){    
        console.log('bind card-list-only-vm');                
        if(this.validate()){
            const selectedPayment:any = document.querySelector('input[name="jump-card-list-option"]:checked');
            const selectedPaymentComponent = this.getSelectedPaymentDetails(selectedPayment);
            const cardVm:IViewModel = Object.assign({});
            if(selectedPaymentComponent?.cardType === BANK) {
                cardVm.accountInfo = Object.assign({});
                cardVm.accountInfo.bankAccountLast4Digits = selectedPaymentComponent.cardNo.replaceAll('*','');
                cardVm.accountInfo.maskedAccountNumber = selectedPaymentComponent.cardNo;
                cardVm.accountInfo.bankAccountType = translateLabelBankAccountTypeToPaymentService(selectedPaymentComponent.cardExpiry);
                cardVm.accountInfo.token = selectedPaymentComponent.PaymentToken;
                if (selectedPaymentComponent.walletId) {
                    cardVm.walletId = selectedPaymentComponent.walletId;
                }
                Globals.getInstance().appState.set('currentPaymentSubType', this.cardListService.channel.channelData.selectedPaymentType);

            } else {
                if(selectedPaymentComponent){
                    cardVm.cardInfo = Object.assign({});
                    cardVm.cardInfo.token = selectedPaymentComponent.PaymentToken;
                    cardVm.cardInfo.maskedCardNumber = selectedPaymentComponent.cardNo;
                    cardVm.cardInfo.cardLast4Digits = selectedPaymentComponent.cardNo.replaceAll('*','');
                    cardVm.cardInfo.cardType = selectedPaymentComponent.cardType;
                    cardVm.cardInfo.expirationDate = selectedPaymentComponent.cardExpiry.substring(0,2) + selectedPaymentComponent.cardExpiry.substring(3,5) ;
                    if (selectedPaymentComponent.walletId) {
                        cardVm.walletId = selectedPaymentComponent.walletId;
                    }
                    Globals.getInstance().appState.set('currentPaymentSubType', this.cardListService.channel.channelData.selectedPaymentType);
                }
            }
            if(selectedPaymentComponent){
                if(selectedPaymentComponent.id !== JUMP_NEW_CARD_OPTION && selectedPaymentComponent.id !== JUMP_NEW_PAYMENT_OPTION && selectedPaymentComponent.id !== JUMP_NEW_BANK_OPTION){
                    if(selectedPaymentComponent.cardType === BANK) {
                        this.global.actionObserverService.fire(this,{detail: {action : JUMP_UPDATE_VIEW_MODEL, type:'ach-list', data:cardVm}});
                    } else {
                        this.global.actionObserverService.fire(this,{detail: {action : JUMP_UPDATE_VIEW_MODEL, type:'card-list', data:cardVm}});    
                    }
                } 
            }          
        }   
        if (typeof this.global.appState.get('channelData')?.selectedPaymentType === 'undefined' && this.global.appState.get('channelData')?.channelDetails.requirePaymentMethodSelection === true) {
            const cpcPageType:any = this.global.appState.get('config').cpcPageType.toLowerCase();    
            const ach:any = document.getElementById('jump-ach-type');
            const card:any = document.getElementById('jump-cc-type'); 
            const selectedPaymentOption:any = document.querySelector('input[name="jump-card-list-option"]:checked');
            this.removeMessage('jump-error-template');
            if( (cpcPageType === CPC_CARD_BANK_OR_EXISTING.toLowerCase() || CPC_BANK_CARD_OR_EXISTING.toLowerCase()) && (ach?.checked || card?.checked) ) {
                this.removeMessage('jump-error-web-component-card-bank-or-existing');
            } else {
                if(cpcPageType === CPC_CARD_BANK_OR_EXISTING.toLowerCase() && !selectedPaymentOption) {
                    this.dataLayerService.dispatchInfoEvent(CPC_CARD_BANK_OR_EXISTING_PAYMENT_TYPE_NOT_SELECTED, true);                
                    this.displayMessage(this.getErrorMessage(ErrorType.payment_type,ErrorType.no_value),PaymentType.CardBankOrExisting, this.global.appState.get('channelData')?.channelDetails?.cpcMessageDisplayLocation);
                }
                if(cpcPageType === CPC_BANK_CARD_OR_EXISTING.toLowerCase() && !selectedPaymentOption) {
                    this.dataLayerService.dispatchInfoEvent(CPC_BANK_CARD_OR_EXISTING_PAYMENT_TYPE_NOT_SELECTED, true);                
                    this.displayMessage(this.getErrorMessage(ErrorType.payment_type,ErrorType.no_value),PaymentType.BankCardOrExisting, this.global.appState.get('channelData')?.channelDetails?.cpcMessageDisplayLocation);
                }
                if(cpcPageType === CARD_OR_EXISTING.toLowerCase() && !selectedPaymentOption) {
                    this.dataLayerService.dispatchInfoEvent(CPC_CARD_OR_EXISTING_PAYMENT_TYPE_NOT_SELECTED, true);                
                    this.displayMessage(this.getErrorMessage(ErrorType.payment_type,ErrorType.no_value),PaymentType.BankCardOrExisting, this.global.appState.get('channelData')?.channelDetails?.cpcMessageDisplayLocation);
                }
            }
        }                         
    }
    displayMessage(message:string, cpcPageType: PaymentType, cpcMessageLocation: string) {
        this.appendPaymentMessage(message, cpcMessageLocation, cpcPageType.toString().toLowerCase());
    }
    removeMessage(idLocation:string) {
        document.getElementById(idLocation)?.remove();
    }
    appendPaymentMessage(cpcMessage:string, cpcMessageLocation: string, cpcPageType:string ) {
        const selectPaymentMessageComp: any = document.getElementById('jump-error-web-component-card-bank-or-existing');
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
    getSelectedPaymentDetails(selectedPaymentType:any):any {
        if(!selectedPaymentType) return;
        let selectedPaymentComponent = null;
        if(selectedPaymentType.id && selectedPaymentType.id.indexOf('jump-')>=0){
            selectedPaymentComponent = selectedPaymentType;
        }
        if(!selectedPaymentComponent){
            return this.getSelectedPaymentDetails(selectedPaymentType.parentElement);
        }
        return selectedPaymentComponent;
    }    
    validate(): boolean {
        let flag = true;
        const selectedPayment:any = document.querySelector('input[name="jump-card-list-option"]:checked');
        const selectedPaymentComponent = this.getSelectedPaymentDetails(selectedPayment);
        const isOptionSelected = document.querySelector('input[name="jump-card-list-option"]:checked');
        const cardListComponent = document.getElementsByTagName('jump-card-list-web-component')[0];
        const cpcPageType:PaymentType = this.global.appState.get('config').cpcPageType.toLowerCase();        

        if(cardListComponent || cpcPageType?.toString() === PaymentType[PaymentType.WalletMgmtNoAutopay].toString().toLowerCase() || cpcPageType?.toString() === PaymentType[PaymentType.CardExpirationEdit].toString().toLowerCase()){
            if (!isOptionSelected && cpcPageType?.toString() !== PaymentType[PaymentType.WalletMgmtNoAutopay].toString().toLowerCase() && cpcPageType?.toString() !== PaymentType[PaymentType.CardBankOrExisting].toString().toLowerCase()) {            
                flag = false;
                const errorHandling = new ErrorHandling();
                const cpcMessage = errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.form, MessageType.error, this.getErrorMessage(ErrorType.payment_type, ErrorType.no_value));
                errorHandling.showError(cpcMessage, '');           
            }
        } else {
            flag = false;
        } 
        if(selectedPaymentComponent?.cardType?.toString()?.toLowerCase() === NEWPAYMENT && cpcPageType?.toString()?.toLowerCase() !== PaymentType[PaymentType.WalletMgmtNoAutopay]?.toString()?.toLowerCase()) {
            if(typeof(this.global.appState.get('channelData').selectedPaymentType) === 'undefined') {
                flag = false;
                const errorHandling = new ErrorHandling();
                const cpcMessage = errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.form, MessageType.error, this.getErrorMessage(ErrorType.payment_type, ErrorType.no_value));
                errorHandling.showError(cpcMessage, '');           
            }
        }    
        return flag;
    }    
    reset() {
        //console.log('reset');
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
