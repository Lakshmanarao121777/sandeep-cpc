import {    
    CURRENT_CHANNEL_DOMAIN,
    EVN_CPC_ERROR,
    EVN_CPC_FORM_SUBMIT_RESPONSE,
    JUMP_EXISTING_PAYMENT_NO_TOKEN_RECEIVED,
    JUMP_EXISTING_PAYMENT_RESPONSE_RECEIVED,
    JUMP_UPDATE_VIEW_MODEL,
    CPC_WALLET_MGMT_NO_AUTOPAY_EDIT_API_SUBMIT,
    CPC_WALLET_MGMT_NO_AUTOPAY_UPDATE,
    WALLET_MGMT_NO_AUTOPAY,
    CARD_EXPIRATION_EDIT
} from '../constant/app.constant';
import {
    ErrorType,
    IConfig,
    IInputReference,
    IUpdateInstrumentResponse,
    MessageType,
    PaymentType
} from '../model/view.model';
import {IViewModel} from '../model/viewModel/view-model';
import { Validation } from '../utils/validation';
import { CommonService } from './common.service';
import { ErrorHandling } from '../utils/error-handling';
import { ChannelService } from './channel-service';
import { CardListViewModelService } from './viewModel/card-list-vm.service';
import { BaseAccountTypeService } from './base-account-type-service';
import { DataLayerService } from './data-layer.service';
import { FetchData } from '../api/fetch-data';
import { WalletMgmtNoAutopayService } from './wallet-mgmt-no-autopay.service';
import { FormValidationService } from './form-validation-service';
import { LABEL_SAVINGS, SERVICE_SAVINGS_VALUE, LABEL_CHECKING, SERVICE_CHECKING_VALUE, LABEL_CORPORATE_CHECKING, SERVICE_CORPORATE_CHECKING_VALUE } from '../constant/bank-account-type';
import { isSetAsDefaultPaymentCheckboxChecked } from './viewModel/util/set-as-default-instrument-util';
import { isWalletIdDWallet } from '../utils/wallet';

export class CardListService extends BaseAccountTypeService{
    public cardListVmService:CardListViewModelService = Object.assign({});
    public dataLayerService = new DataLayerService();
    public inputReference: IInputReference = Object.assign({});
    public viewModel: IViewModel = Object.assign({});
    public validations = new Validation();
    public commonService = new CommonService(Object.assign({}));
    public cardOnlyservive = Object.assign({});
    public formFieldStatusMap: Map<string, boolean>;
    public paymentData: any;
    public errorHandling:ErrorHandling=new ErrorHandling();
    public walletMgmtNoAutopayService: WalletMgmtNoAutopayService = Object.assign({});
    private currentPaymentType:any = '';
    private updateExistingPayment = false;
    private removeExistingPayment = false;
    public channel: any;
    public formValidationService: FormValidationService;
    private accountType = '';
    constructor(config:IConfig, channel:ChannelService,type:string,cardListViewModelService:CardListViewModelService,errorMessageResponse:any,commonService:CommonService,errorHandling:ErrorHandling,walletMgmtNoAutopayService:WalletMgmtNoAutopayService){
        super(config,channel,type,errorMessageResponse,errorHandling);
        this.cardListVmService = cardListViewModelService;
        this.channel = channel;
        this.currentPaymentType = this.config.cpcPageType.toString();
        this.commonService = commonService;
        this.formFieldStatusMap = new Map<string,boolean>();
        this.walletMgmtNoAutopayService = walletMgmtNoAutopayService;
        this.formValidationService = new FormValidationService();
        this.subscribe();
    }
    subscribeChild(detail:any){
        switch(detail?.action){
        case JUMP_UPDATE_VIEW_MODEL:
            if(detail?.type === 'card-list'){
                console.log('type is card-list');                
                this.viewModel.cpcPageType = this.config.cpcPageType.toString();
                this.viewModel.cardInfo = detail.data.cardInfo;   
                this.viewModel.walletId = detail.data.walletId; 
                this.viewModel.formSubmitChannelData = detail.data.formSubmitChannelData;
                this.resolve(this.viewModel);
            }  
            if(detail?.type === 'ach-list'){
                console.log('type is ach-list');                
                this.viewModel.cpcPageType = this.config.cpcPageType.toString();
                this.viewModel.accountInfo = detail.data.accountInfo;  
                this.viewModel.walletId = detail.data.walletId;          
                this.viewModel.formSubmitChannelData = detail.data.formSubmitChannelData;
                this.resolve(this.viewModel);
            }
            if(detail?.type === 'wallet-edit-cc') {
                this.viewModel.cpcPageType = this.config.cpcPageType.toString();
                this.viewModel.cardInfo = detail.data.cardInfo; 
                const customerDetails = this.channel?.channelData?.customerDetails;
                this.setCurrentAddress(customerDetails);
                this.updateExistingPayment = true;   
                this.resolve(this.viewModel);
            }
            if(detail?.type === 'wallet-remove-cardtype') {
                console.log('type wallet mgmt no autopay delete cardtype');
                this.viewModel.cpcPageType = this.config.cpcPageType.toString();
                if(detail.data?.cardInfo) {
                    this.viewModel.cardInfo = detail.data.cardInfo;
                } else {
                    this.viewModel.accountInfo = detail.data.accountInfo;
                }
                const customerDetails = this.channel?.channelData?.customerDetails;                
                this.setCurrentAddress(customerDetails);
                this.removeExistingPayment = true;

                this.resolve(this.viewModel);    
            }             
            break;            
        }
    }
    setCurrentAddress(channel:any):any {
        const currentAddress = Object.assign({});
        if(channel?.address) {
            currentAddress.address = channel.address;
            currentAddress.addressLine2 = channel.addressLine2;
            if(channel.addressLine2 && channel.addressLine2 !== 'undefined') {
                currentAddress.addressLine2 = channel.addressLine2;
            } else {
                currentAddress.addressLine2 = '';
            }
            currentAddress.city = channel.city;
            currentAddress.state = channel.state;
            currentAddress.zipCode = channel.zip;
        } else if (channel?.addressList) {
            if(channel?.addressList[0]?.defaultAddress) {
                this.setAddressList(0, currentAddress, channel);
            }
            if(channel?.addressList[1]?.defaultAddress) {
                this.setAddressList(1, currentAddress, channel);
            }
        } 
        this.viewModel.personalInfo = Object.assign({'addressInfo':{}});
        this.viewModel.personalInfo.addressInfo.address = currentAddress?.address;
        if(currentAddress?.addressLine2 && currentAddress?.addressLine2 !== 'undefined') {
            this.viewModel.personalInfo.addressInfo.addressLine2 = currentAddress?.addressLine2;
        } else {
            this.viewModel.personalInfo.addressInfo.addressLine2 = '';
        }
        this.viewModel.personalInfo.addressInfo.city = currentAddress?.city;
        this.viewModel.personalInfo.addressInfo.state = currentAddress?.state;
        this.viewModel.personalInfo.addressInfo.zipCode = currentAddress?.zipCode;
    }
    setAddressList(i:any, currentAddress: any, channel:any): any {
        currentAddress.address = channel.addressList[i].address;
        currentAddress.addressLine2 = channel.addressList[i].addressLine2;
        currentAddress.city = channel.addressList[i].city;
        currentAddress.state = channel.addressList[i].state;
        currentAddress.zipCode = channel.addressList[i].zip;
        return currentAddress;
    }
    addOrUpdateCall(viewModel:IViewModel): void {  
        if(this.currentPaymentType === PaymentType[PaymentType.WalletMgmtNoAutopay].toLowerCase() || this.currentPaymentType === PaymentType[PaymentType.CardExpirationEdit].toLowerCase()) {
            if (this.updateExistingPayment) {
                if(this.validate(viewModel)) {
                    if(this.currentPaymentType === WALLET_MGMT_NO_AUTOPAY.toLowerCase) {
                        this.dataLayerService.dispatchInfoEvent(CPC_WALLET_MGMT_NO_AUTOPAY_UPDATE, true);
                    }
                    this.updateExistingPaymentInstrument(viewModel);
                } else {
                    if(this.currentPaymentType === WALLET_MGMT_NO_AUTOPAY.toLowerCase) {
                        this.dataLayerService.dispatchInfoEvent(CPC_WALLET_MGMT_NO_AUTOPAY_UPDATE, false);
                    }
                }  
            } else if(this.removeExistingPayment) {
                this.deleteExistingPaymentInstrument(this.viewModel);
                this.removeExistingPayment = true;
            } else {
                this.submit(viewModel);
            }
        } else {
            this.submit(viewModel);
        }
    }
    private resolve(data:IViewModel):any {
        this.addOrUpdateCall(data);
    }
    async deleteExistingPaymentInstrument(viewModel:IViewModel){
        const header = this.commonService.apiHeader();
        const requestData = this.updateExistingPaymentInstrumentRequest(viewModel);
        const channelName = this.channel?.channelData?.channelDetails?.channelName;
        const url = this.config.envConfig.methodOfPaymentServiceUrl.url + this.config.envConfig.methodOfPaymentServiceUrl.deleteExistingPaymentInstrument + '/' + channelName;
        const response = await this.fetchData.post(url,header,requestData)
            .then((res)=>{
                this.onUpdateExistingPaymentInstrumentCompletedHandler(res,viewModel.cpcPageType?.toLowerCase());
            }).catch((e)=>{
                console.log('Something went wrong:( ', e);
            });
    }
    async updateExistingPaymentInstrument(viewModel:IViewModel){
        const header = this.commonService.apiHeader();
        const requestData = this.updateExistingPaymentInstrumentRequest(viewModel);
        const url = this.config.envConfig.methodOfPaymentServiceUrl.url + this.config.envConfig.methodOfPaymentServiceUrl.updateExistingPaymentInstrument;
        const response = await this.fetchData.post(url,header,requestData).catch((e)=>{
            console.log('Something went wrong:( ', e);
        });
        this.onUpdateExistingPaymentInstrumentCompletedHandler(response,viewModel.cpcPageType?.toLowerCase());
    }
    onUpdateExistingPaymentInstrumentCompletedHandler(apiData:any,cpcPageType:string){
        const response = apiData;
        const data = Object.assign({});
        data.channelData = this.channel.channelData;
        data.action = EVN_CPC_FORM_SUBMIT_RESPONSE;
        
        if(response) {
            data.cpcData = response;
            data.channelData.paymentType = cpcPageType;
            parent.postMessage(JSON.stringify(data), CURRENT_CHANNEL_DOMAIN.URI);
            if(response?.submissionDetails?.cpcStatus?.toLowerCase() ==='success'){
                this.dataLayerService.dispatchInfoEvent(CPC_WALLET_MGMT_NO_AUTOPAY_EDIT_API_SUBMIT, data?.cpcData?.submissionDetails);
            } else if(response?.submissionDetails?.cpcStatus?.toLowerCase() === 'error'){
                const error = this.getErrorMessage(ErrorType.service, response?.submissionDetails?.psErrorCode);
                const cpcMessage = this.errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.form, MessageType.error, error);
                this.errorHandling.showError(cpcMessage,response?.submissionDetails?.psErrorMessage);
            }            
        } else {
            console.log('updateExistingPaymentInstrument - no data found!');
        }
    }
    updateExistingPaymentInstrumentRequest(viewModel:IViewModel){
        const accountType = this.viewModel?.accountInfo?.bankAccountType.toLowerCase();
        let accountTypeSavingOrChecking = '';
        let isBank = false;
        if(accountType === 'bank') {
            if(this.viewModel.accountInfo.accountTypeSaving ===  LABEL_SAVINGS || this.viewModel.accountInfo.accountTypeSaving === SERVICE_SAVINGS_VALUE) {
                accountTypeSavingOrChecking = SERVICE_SAVINGS_VALUE;
            }
            if(this.viewModel.accountInfo.accountTypeChecking === LABEL_CHECKING || this.viewModel.accountInfo.accountTypeChecking === SERVICE_CHECKING_VALUE) {
                accountTypeSavingOrChecking = SERVICE_CHECKING_VALUE;
            }
            if(this.viewModel.accountInfo.accountTypeCorporateChecking === LABEL_CORPORATE_CHECKING || this.viewModel.accountInfo.accountTypeCorporateChecking === SERVICE_CORPORATE_CHECKING_VALUE) {
                accountTypeSavingOrChecking = SERVICE_CORPORATE_CHECKING_VALUE;
            } 
            isBank = true;
        }

        const request:any = {
            'channel':this.channel.channelData.channelDetails?.channelName,
            'paymentToken': isBank === true ? this.viewModel.accountInfo.token : this.viewModel.cardInfo.token,
            'billTo': {
                'address': {
                    'city': this.viewModel.personalInfo.addressInfo?.city,
                    'country': 'US',
                    'line1': this.viewModel.personalInfo.addressInfo?.address,
                    'line2': this.viewModel.personalInfo.addressInfo?.addressLine2,
                    'state': this.viewModel.personalInfo.addressInfo?.state,
                    'zip': this.viewModel.personalInfo.addressInfo?.zipCode,
                },
                'name': {
                    'firstName': this.channel.channelData.customerDetails?.firstName,
                    'lastName': this.channel.channelData.customerDetails?.lastName,
                },
            },
            'customerId': this.channel.channelData.customerDetails?.walletId,
            'bankDetails': {
                'defaultInstrument': isBank === true ? isSetAsDefaultPaymentCheckboxChecked() === false ? false: true : null,
                'bankAccountType': isBank === true ? accountTypeSavingOrChecking : null,
                'bankAccountLast4Digits': isBank === true ? this.viewModel.accountInfo.bankAccountLast4Digits : null,
                'maskedAccountNumber': isBank === true ? this.viewModel.accountInfo.maskedAccountNumber : null,
                'token': isBank === true ? this.viewModel.accountInfo.token : null,
            },
            'cardDetails': {
                'defaultInstrument': isBank === false ? isSetAsDefaultPaymentCheckboxChecked() === false ? false: true : null,
                'cardLast4Digits': isBank === false ? this.viewModel.cardInfo.cardLast4Digits : null,
                'cardType': isBank === false ? this.viewModel.cardInfo.cardType : null,
                'expirationDate': isBank === false ? this.viewModel.cardInfo.expirationDate : null,
                'maskedCardNumber': isBank === false ? this.viewModel.cardInfo.maskedCardNumber : null,
                'token': isBank === false ? this.viewModel.cardInfo.token : null,
            },
        }; 
        if(!this.viewModel.personalInfo?.addressInfo?.address) {
            request.billTo.address = null;
        
        }
        return JSON.stringify(request);
    }

    submit(viewModel:IViewModel){
        this.getExistingPaymentInstrumentForCCAndBank();
    } 
    async getExistingPaymentInstrumentForCCAndBank() : Promise<void> {
        const header = this.commonService.apiHeader();
        const requestData = this.getExistingPaymentInstrumentRequest('existing');
        const url = this.config.envConfig.methodOfPaymentServiceUrl.url + this.config.envConfig.methodOfPaymentServiceUrl.getExistingPaymentInstrument;                
        const fetchData = new FetchData();
        const response = await fetchData.post(url,header,requestData);
        const cardType = PaymentType[PaymentType.CardOrExisting];
        const walletId = JSON.parse(requestData).customerId;
        this.sendDummyResponse(cardType , response, walletId);
    }
    async getExistingPaymentInstrument() {
        const header = this.commonService.apiHeader();
        let response:any = '';
        let cardExpirationResponse:any = '';
        if(this.currentPaymentType === PaymentType[PaymentType.CardExpirationEdit].toLowerCase()) {
            const cardExpirationEditRequestData = this.getExistingPaymentInstrumentRequest('individual');
            const url = this.config.envConfig.methodOfPaymentServiceUrl.url + this.config.envConfig.methodOfPaymentServiceUrl.getExistingPaymentInstrument;                
            cardExpirationResponse = await this.fetchData.post(url, header, cardExpirationEditRequestData).catch((e)=>{
                console.log('Something went wrong:( ', e);
            });
            this.onExistingPaymentInstrumentCompletedHandler(cardExpirationResponse);
        } else {
            const requestData = this.getExistingPaymentInstrumentRequest('all');
            const url =
                this.config.envConfig.methodOfPaymentServiceUrl.url +
                this.config.envConfig.methodOfPaymentServiceUrl.getAllPaymentInstruments;
            response = await this.fetchData.post(url, header, requestData).catch((e)=>{
                console.log('Something went wrong:( ', e);
            });
            this.onExistingPaymentInstrumentCompletedHandler(response);
        } 
    }
    sendDummyResponse(cpcPageType: string , existingResponse:any, walletId:string): void {
        const response: IUpdateInstrumentResponse = Object.assign({});
        response.submissionDetails = Object.assign({});
        response.submissionDetails.cpcStatus = 'SUCCESS';
        response.submissionDetails.cpcMessage =
            'No change in the existing information found, no api call has been made.';
        response.submissionDetails.psErrorCode = '';
        response.submissionDetails.psErrorMessage = '';
        response.submissionDetails.trackingId = '3';
        response.submissionDetails.actionTaken = 'no_change';
        response.submissionDetails.methodOfPaymentType = this.viewModel?.accountInfo ? 'bank' : 'card';
        if(this.viewModel.cardInfo) {
            response.cardDetails = this.viewModel.cardInfo;
        } else {
            response.bankDetails = this.viewModel.accountInfo;
        }

        const obj = Object.assign({});
        obj.channelData = this.channel.channelData;
        obj.action = EVN_CPC_FORM_SUBMIT_RESPONSE;
        if(existingResponse) {
            if(this.viewModel.cardInfo && existingResponse.walletCardDetails) {
                response.customerDetails = existingResponse.walletCardDetails.billTo.name;
            } else if(existingResponse?.walletBankDetails) {
                response.customerDetails = existingResponse.walletBankDetails.billTo.name;
            }
        }
        if (response) {
            console.log('updateExistingPaymentInstrument dummy response! ', response);
            obj.cpcData = response;
            if (walletId) {
                obj.channelData.customerDetails.walletId = walletId;
            }
            obj.channelData.paymentType = cpcPageType;
            parent.postMessage(JSON.stringify(obj), CURRENT_CHANNEL_DOMAIN.URI);
        } else {
            console.log('updateExistingPaymentInstrument - no data found!');
        }
    }    
    onExistingPaymentInstrumentCompletedHandler(response: any): void {
        console.log(response);
        if (response) {
            console.log('getExistingPaymentInstrument response! ', response);            
            if (response.cpcStatus?.toLowerCase() === 'success') {                
                this.global.actionObserverService.fire(this,{detail:{action:JUMP_EXISTING_PAYMENT_RESPONSE_RECEIVED, data:response}});                
            } else if (response.cpcStatus?.toLowerCase() === 'error') {
                if(!this.errorHandling.isPsErrorCodeInNoWalletEntryList(response?.psErrorCode?.toString().toUpperCase())) {
                    this.global.actionObserverService.fire(this,{detail:{action:JUMP_EXISTING_PAYMENT_NO_TOKEN_RECEIVED, data:response}});
                } else if (!this.commonService.getBankBlock() && !this.commonService.getCardBlock()) {
                    const error = this.getErrorMessage(ErrorType.service, response?.psErrorCode);
                    const cpcErrorMessage = this.errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.form, MessageType.error, error);
                    this.errorHandling.showError(cpcErrorMessage, response?.psErrorMessage);
                }
            }
        }
    }
    getExistingPaymentInstrumentRequest(type:string) : any {
        let request = '';
        if(type === 'all') {
            const userRoleList = this.channel.channelData?.customerDetails?.userRoleList;
            if (this.channel.channelData?.config?.enableMultipleUserSelection && userRoleList && userRoleList.length > 0) {
                const walletIdList: any = [];
                const baseWalletId = this.channel.channelData.customerDetails?.walletId;
                
                if (baseWalletId && !isWalletIdDWallet(baseWalletId)) {
                    walletIdList.push(baseWalletId);
                } 
                userRoleList.forEach ((userRole:any) =>{
                    const individualWalletId = userRole.walletId;
                    if (individualWalletId && !isWalletIdDWallet(individualWalletId)) {
                        walletIdList.push(individualWalletId);
                    }
                });
            
                request = JSON.stringify({
                    'billingArrangementId': this.channel.channelData?.customerDetails.billingArrangementId,
                    'channel': this.channel.channelData.channelDetails?.channelName,
                    'customerId': walletIdList.join(['|']),
                });
            } else {
                request = JSON.stringify({
                    'billingArrangementId': this.channel.channelData?.customerDetails.billingArrangementId,
                    'channel': this.channel.channelData.channelDetails?.channelName,
                    'customerId': this.channel.channelData.customerDetails?.walletId,
                });
            }
        } else if(type === 'individual') {
            request = JSON.stringify({
                'billingArrangementId': this.channel.channelData?.customerDetails.billingArrangementId,
                'channel': this.channel.channelData.channelDetails?.channelName,
                'customerId': this.channel.channelData.customerDetails?.walletId,
                'paymentToken': this.channel.channelData.customerDetails?.paymentToken
            });
        } else {
            let token = '';
            let walletId = '';
            if(this.viewModel.cardInfo) {
                token = this.viewModel.cardInfo.token;
                walletId = this.viewModel.walletId;
            } else {
                token = this.viewModel.accountInfo.token;
                walletId = this.viewModel.walletId;
            }
            request = JSON.stringify({
                'billingArrangementId': this.channel.channelData?.customerDetails.billingArrangementId,
                'channel': this.channel.channelData.channelDetails?.channelName,
                'customerId': walletId,
                'paymentToken': token
            });
        }
        return request;
    }
    validate(viewModel:any) {
        let flag = true;
        const expMM = viewModel.cardInfo.expirationDate.slice(0,2);
        const expYY = viewModel.cardInfo.expirationDate.slice(2,4);
        const id = this.viewModel.cardInfo.id;
        const expirdationInvalid = document.querySelector('#' + id + ' [id="jump-expiration-invalid"]');
        const expiration = document.querySelector('#' + id + ' [name="jump-expiration-date"]');

        if(expMM && expYY) {
            const expirationDate = expMM + '/' + expYY;
            const isValid = flag = this.validations.validExpirationCheck(expirationDate);
            const errorMessage = document.querySelector('#' + id + ' [name="jump-expiration-date"]');
            if(!isValid){
                this.removeErrorFeedback('jump-expiration-date');
                expiration?.classList.add('is-invalid');
                if(errorMessage && !expirdationInvalid) {
                    const div = document.createElement('div');
                    div.innerText = 'Invalid entry';
                    if(this.currentPaymentType === PaymentType[PaymentType.CardExpirationEdit].toLowerCase()) {
                        div.className = 'jump-invalid-feedback-cee';
                    } else {
                        div.className = 'jump-invalid-feedback';
                    }
                    
                    div.id = 'jump-expiration-invalid';
                    errorMessage.append(div);
                }
                
            }else{
                this.viewModel.cardInfo.expMonth = expMM;
                this.viewModel.cardInfo.expYear = expYY;
                expiration?.classList.remove('is-invalid');
                expirdationInvalid?.remove();
                this.removeErrorFeedback('jump-expiration-date');
            }
        } else {
            flag = false;
            this.removeErrorFeedback('jump-expiration-date');
            expiration?.classList.add('is-invalid');
        }
        if(flag === false) {
            const element:any = document.getElementsByClassName('invalid-feedback');
            element[0]?.parentElement?.scrollIntoView();
        } 
        return flag;
        
    }
    removeErrorFeedback(reference:string) {
        const id = this.viewModel.cardInfo.id;
        const expiration = document.querySelector('#' + id + ' [name="jump-expiration-date"]');
        const parentId = expiration?.parentElement;
        const errFeedback =  'jump-expiration-date';
        if(parentId){
            const selector = `[name='${errFeedback}-feedback']`;
            if(selector && parentId?.querySelector(selector)) {
                parentId.querySelector(selector)?.remove();
            }
        }
    }
    appendErrorFeedback(reference: string, feedbackMsg: string): any {
        const nameField = 'jump-expiration-date';
        const div = document.createElement('div');
        div.setAttribute('name', nameField + '-feedback');
        div.classList.add('invalid-feedback');
        div.innerHTML = feedbackMsg;
        return div;
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
