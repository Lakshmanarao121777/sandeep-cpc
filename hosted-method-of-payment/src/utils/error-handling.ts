import { CURRENT_CHANNEL_DOMAIN, ERR_PS_NO_WALLET_ENTRY_CODE_LIST } from '../constant/app.constant';
import { IFormError, PaymentType } from '../model/view.model';
import { ChannelService } from '../service/channel-service';
import { Globals } from './globals';

export class ErrorHandling {   
    public channel:ChannelService = Object.assign({});
    private ERROR_CODE_SEPARATOR = '|';

    constructor(channel?:ChannelService){
        if(channel){
            this.channel = channel;
        }        
    }
    private appendError(errorMessage:string): void {
        const jumpErrorTemplate = document.createElement('div');
        jumpErrorTemplate.setAttribute('id','jump-error-template');        
        jumpErrorTemplate.innerHTML = `
            <div class="alert alert-danger d-flex alert-dismissible fade show jump-error-style" role="alert">
            ${errorMessage}
            </div>`;
                        
        const selector = this.getErrorSelector();
        if(selector){
            selector.appendChild(jumpErrorTemplate);
            selector.scrollIntoView();
        } else {
            const containerRef = document.getElementById('jump-hosted-container');
            if(containerRef){                
                containerRef.appendChild(jumpErrorTemplate);
                containerRef?.scrollIntoView();
            }
        }
    }
    private getErrorSelector(): Element|null{
        let selector:Element|null = null;
        const global:Globals = Globals.getInstance();
        const currentPaymentType:string =  global.appState.get('currentPaymentType');
        //const vm  = <IViewModel>global.appState.get('viewModel');
        
        let displayLocation = '';
        if(this.channel.channelData && this.channel.channelData.channelDetails){
            displayLocation = this.channel.channelData.channelDetails.cpcMessageDisplayLocation;
        }
        if(!displayLocation) {
            displayLocation = 'top';
        }
        let errorNode = '';
        switch(currentPaymentType){
        case PaymentType.CardOnly.toString().toLowerCase():
        case PaymentType.CardOnlyWithEdit.toString().toLowerCase():
            errorNode = `[name='jump-error-message-cc-${displayLocation}']`;
            selector = document.querySelector(errorNode);
            break;
        case PaymentType.AchOnly.toString().toLowerCase():
        case PaymentType.AchOnlyWithEdit.toString().toLowerCase():
            errorNode = `[name='jump-error-message-ach-${displayLocation}']`;
            selector = document.querySelector(errorNode);
            break;
        case PaymentType.CardOrBank.toString().toLowerCase():
        case PaymentType.BankOrCard.toString().toLowerCase():
            errorNode = `[name='jump-error-message-cob-${displayLocation}']`;            
            selector = document.querySelector(errorNode);
            break;
        case PaymentType.MinCardOnly.toString().toLowerCase():
        case PaymentType.MinCardOnlyWithEdit.toString().toLowerCase():
            errorNode = `[name='jump-error-message-${displayLocation}']`;            
            selector = document.querySelector(errorNode);            
            break;
        case PaymentType.CardOrExisting.toString().toLowerCase():
            errorNode = `[name='jump-error-message-${displayLocation}']`;            
            selector = document.querySelector(errorNode);            
            break;
        case PaymentType.CardBankOrExisting.toString().toLowerCase():
        case PaymentType.BankCardOrExisting.toString().toLowerCase():
            errorNode = `[name='jump-error-message-${displayLocation}']`;            
            selector = document.querySelector(errorNode);            
            break;            
        case PaymentType.MinAchOnly.toString().toLowerCase():
            this.removeErrorNode();
            errorNode = `[name='jump-error-message-min-ach-only-${displayLocation}']`;
            selector = document.querySelector(errorNode);
            break;
        case PaymentType.WalletMgmtNoAutopay.toString().toLowerCase():
        case PaymentType.CardExpirationEdit.toString().toLowerCase():
            this.removeErrorNode();
            errorNode = `[name='jump-error-message-${displayLocation}']`;            
            selector = document.querySelector(errorNode);
            break;                      
        default:
            break;
        }
        return selector;
    }
    private removeErrorNode(){
        const errorElement = document.getElementById('jump-error-template');
        if(errorElement){
            errorElement.remove();
        }
    }
    public showError(cpcFormError:any, detailErrorMessage:string): void {
        this.removeErrorNode();
        this.appendError(cpcFormError.message);
        if(detailErrorMessage){
            if(typeof(detailErrorMessage) === 'string'){
                cpcFormError.messageDetail = detailErrorMessage?.toString().trim();
            }else{
                cpcFormError.messageDetail = detailErrorMessage;
            }
        }else{
            cpcFormError.messageDetail = detailErrorMessage;
        }
        parent.postMessage(JSON.stringify(cpcFormError), CURRENT_CHANNEL_DOMAIN.URI);
    }  
   
    public getErrorInstance(cpcAction:string, type:string, errorType:string, messageDetails:any):IFormError {
        const cpcMessage = Object.assign({});
        cpcMessage.action= cpcAction;
        cpcMessage.type= type;
        cpcMessage.level= errorType;
        cpcMessage.message= messageDetails;
        return cpcMessage;
    }

    public isPsErrorCodeInNoWalletEntryList(psErrorCode:string):boolean {
        let isNotInList = false;

        if(psErrorCode && psErrorCode.includes(this.ERROR_CODE_SEPARATOR)) {
            const psErrorCodeList = psErrorCode.split(this.ERROR_CODE_SEPARATOR);
            psErrorCodeList.forEach((errorCode)=> {
                const result = this.isSinglePsErrorCodeInNoWalletEntryList(errorCode);
                if (!result) {
                    isNotInList = true;
                }  
            });
        } else {
            return !this.isSinglePsErrorCodeInNoWalletEntryList(psErrorCode);
        }
        return isNotInList;
    }

    private isSinglePsErrorCodeInNoWalletEntryList(psErrorCode:string):boolean {
        const paymentErrorCodeList = ERR_PS_NO_WALLET_ENTRY_CODE_LIST;
        let isInList = false;
        paymentErrorCodeList.forEach((errorCode)=>{
            if(errorCode === psErrorCode) {
                isInList = true;
                return isInList;
            }
        });
        return isInList;
    }
}

