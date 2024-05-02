import { FetchData } from '../api/fetch-data';
import { ACH, CC, CURRENT_CHANNEL_DOMAIN, EVN_CPC_ERROR, CARD, EVN_CPC_FORM_SUBMIT_RESPONSE, JUMP_ADD_TO_WALLET_SUCCESS, TC_COMPONENT_CHECKED } from '../constant/app.constant';
import { IPersonalInfoModel } from '../model/personal-info-model';
import { ErrorType, IConfig, IViewModelEncrypted, IViewModelExternal, MessageType } from '../model/view.model';
import { IViewModel } from '../model/viewModel/view-model';
import { ErrorHandling } from '../utils/error-handling';
import { Globals } from '../utils/globals';
import { ChannelService } from './channel-service';
import { derivePreAuthorization, deriveAutopayEnroll } from '../utils/wallet';
import { SERVICE_SAVINGS_VALUE, SERVICE_CHECKING_VALUE, SERVICE_CORPORATE_CHECKING_VALUE } from '../constant/bank-account-type';
import { isStoredPaymentTermsCheckboxChecked } from './../service/viewModel/util/stored-payment-terms-util';
import { isSetAsDefaultPaymentCheckboxChecked } from './../service/viewModel/util/set-as-default-instrument-util';
import { getUserRoleUtil  } from './viewModel/util/userrole-util';


export class BaseAccountTypeService {
    //type - CardOnly,AchOnly etc..
    public channel:ChannelService; 
    public config:IConfig;
    public type:string;
    public errorMap: Map<string,string>;
    public errorMessageResponse:any;    
    public global:Globals;
    public errorHandling:ErrorHandling;
    public localData:any = Object.assign({});
    private postRequest:any;
    public fetchData:FetchData;
    constructor(config:IConfig,channel:ChannelService, type:string,errorMessageResponse:any,errorHandling:ErrorHandling){
        this.config = config;
        this.channel = channel;
        this.type = type;
        this.errorMessageResponse = errorMessageResponse;
        this.fetchData = new FetchData();
        this.errorMap = Object.assign({});        
        this.global = Globals.getInstance();
        this.errorHandling = errorHandling;
    }
    subscribe(){
        //let isCcFormValid = false;        
        this.global.actionObserverService.subscribe((sender:any,externalData:any)=>{
            const detail = externalData.detail;
            this.subscribeChild(detail);
        });
    }
    prepareRequest(vm:IViewModelEncrypted, personalInfo:IPersonalInfoModel): any {
        const data = Object.assign({});
        const paymentInfo:IViewModelExternal = Object.assign({});
        
        paymentInfo.firstName = personalInfo.firstName; 
        paymentInfo.lastName = personalInfo.lastName; 
        if(personalInfo.addressInfo){
            paymentInfo.address = personalInfo.addressInfo.address;
            if(personalInfo.addressInfo?.addressLine2 && personalInfo.addressInfo?.addressLine2 !== 'undefined') {
                paymentInfo.addressLine2 = personalInfo.addressInfo?.addressLine2;
            } else {
                paymentInfo.addressLine2 = '';
            }
            paymentInfo.city = personalInfo.addressInfo.city; 
            paymentInfo.state = personalInfo.addressInfo.state;
            paymentInfo.zipCode = personalInfo.addressInfo.zipCode;
        }
        data.channelData = this.channel.channelData;
        data.paymentInfo = paymentInfo;
        data.action = EVN_CPC_FORM_SUBMIT_RESPONSE;
        //data.paymentMessage = message;
        
        //console.log('data.channelData.isSubmitPayment ', data.channelData.isSubmitPayment);
                
        //this.viewModel.cardInfo.encryptedCardNumber = vm?.paytmentDetail?.cardNumber;
        return data;        
    }
    getTCcheckedValue() : any {
        return derivePreAuthorization(this.channel.channelData, isStoredPaymentTermsCheckboxChecked());
    } 
    getSetDefaultCheckedValue():any {
        let tcValue:any = false;
        if(this.channel.channelData.customerDetails.setDefaultPaymentInstrument) {
            tcValue = this.channel.channelData.customerDetails.setDefaultPaymentInstrument;
        }
        if(this.channel.channelData?.config?.displaySetDefault || this.channel.channelData?.config?.displaySetDefault) {
            tcValue = isSetAsDefaultPaymentCheckboxChecked();
        } 
        return tcValue;
    }
    getAccountTypeByViewModal(viewModel:IViewModel) : string {
        let acccount_type = '';

        if(viewModel.accountInfo.accountTypeCorporateChecking) {
            acccount_type = SERVICE_CORPORATE_CHECKING_VALUE;
        } else if(viewModel.accountInfo.accountTypeSaving) {
            acccount_type = SERVICE_SAVINGS_VALUE;
        } else if (viewModel.accountInfo.accountTypeChecking){
            acccount_type = SERVICE_CHECKING_VALUE;
        }
        return acccount_type;
    }
    getPostRequest(viewModel:IViewModel,type:string): any {     
        const payload: any = {  
            'enrollInAutopay': this.isAutoPaySelected(),            
            'customerId': getUserRoleUtil(this.channel, type ==='card' ? CC : ACH, viewModel.formSubmitChannelData.customerDetails.walletId),
            'channel': viewModel.formSubmitChannelData.channelDetails.channelName,
            'storePaymentInstrumentLongTerm': this.getTCcheckedValue(),
            'billingInfo': {
                'billingArrangementId': viewModel.formSubmitChannelData.customerDetails.billingArrangementId,
                'market': null,
                'region': null
            },            
            'billTo': {
                'address': {
                    'city': viewModel.personalInfo.addressInfo.city,
                    'country': 'US',
                    'line1':viewModel.personalInfo.addressInfo.address,
                    'line2': this.formatAddressLine2(viewModel.personalInfo.addressInfo.addressLine2),
                    'state': viewModel.personalInfo.addressInfo.state,
                    'zip': viewModel.personalInfo.addressInfo.zipCode
                },
                'contact': {
                    'emailAddress': viewModel.formSubmitChannelData.customerDetails?.emailAddress,
                    'phone': viewModel.formSubmitChannelData.customerDetails?.phone
                },
                'name': {
                    'firstName': viewModel.personalInfo.firstName,
                    'lastName': viewModel.personalInfo.lastName
                }
            }
        };
        if(viewModel.formSubmitChannelData.customerDetails?.ipAddress) {
            payload.ipAddress = viewModel.formSubmitChannelData.customerDetails?.ipAddress;
        } else {
            payload.ipAddress = viewModel.formSubmitChannelData.channelDetails?.ipAddress;
        }
        if(viewModel.formSubmitChannelData.channelDetails.enableFraudManager){
            payload.deviceFingerprintId = viewModel.formSubmitChannelData.channelDetails.deviceFingerprintId;
            payload.enableDecisionManager = viewModel.formSubmitChannelData.channelDetails.enableFraudManager;
        }
        if(type ==='card'){
            const expYear = viewModel.cardInfo.expYear.length === 2 ? viewModel.cardInfo.expYear: viewModel.cardInfo.expYear.toString().substr(2,2);
            payload.addInstrumentToWallet = {
                'customerDefinedName': viewModel.cardInfo.cardType + '-' + viewModel.personalInfo.firstName, // 'Common-Payment',
                'defaultInstrument': this.getSetDefaultCheckedValue(),
            };
            payload.cardDetails = {
                'defaultInstrument': isSetAsDefaultPaymentCheckboxChecked(),
                'encryptedCardNumber': viewModel.cardInfo.encryptedCardNumber,
                'cardType': viewModel.cardInfo.cardType,
                'cvv': viewModel.cardInfo.cvv,
                'expirationDate': viewModel.cardInfo.expMonth + expYear ,//.toString().substr(2,2)
                'niceCardType': this.global.appState.get('cardNiceType'),
                'cardLogoUrl': this.global.appState.get('cardImgUrl')
            };
        }else if(type ==='bank'){
            this.global.appState.set('routingNumber',viewModel.accountInfo.routingNo);
            payload.addInstrumentToWallet = {
                'customerDefinedName': viewModel.formSubmitChannelData.channelDetails.channelName, // 'Common-Payment',
                'defaultInstrument': this.getSetDefaultCheckedValue(),
            };
            payload.bankDetails = {
                defaultInstrument: isSetAsDefaultPaymentCheckboxChecked(),
                encryptedAccountNumber: viewModel.accountInfo.encryptedAccountNumber, 
                accountType: this.getAccountTypeByViewModal(viewModel),
                routingNumber: viewModel.accountInfo.routingNo,
            };
        }        
        
        if(viewModel.formSubmitChannelData?.channelCustomData || viewModel.formSubmitChannelData?.orderInfo)   {
            payload.orderInfo = {};

            if(viewModel.formSubmitChannelData?.channelCustomData) {
                payload.orderInfo.channelCustomData = viewModel.formSubmitChannelData.channelCustomData;
            }

            if (viewModel.formSubmitChannelData?.orderInfo) {
                payload.orderInfo.orderItems = viewModel.formSubmitChannelData.orderInfo.orderItems;
            }
        }

        if(viewModel.formSubmitChannelData?.orderInfo?.shipTo) {
            payload.orderInfo.shipTo = {};

            if(viewModel.formSubmitChannelData?.orderInfo?.shipTo?.shippingMethod) {
                payload.orderInfo.shipTo = {
                    'shippingMethod': viewModel.formSubmitChannelData.orderInfo.shipTo?.shippingMethod,
                }; 
            }

            if(viewModel.formSubmitChannelData?.orderInfo?.shipTo?.address) {
                payload.orderInfo.shipTo.address = {
                    'city': viewModel.formSubmitChannelData.orderInfo.shipTo?.address?.city,
                    'line1': viewModel.formSubmitChannelData.orderInfo.shipTo?.address?.address,
                    'line2': viewModel.formSubmitChannelData.orderInfo.shipTo?.address?.addressLine2,
                    'state': viewModel.formSubmitChannelData.orderInfo.shipTo?.address?.state,
                    'zip': viewModel.formSubmitChannelData.orderInfo.shipTo?.address?.zip,
                    'country': 'US',
                }; 
            }
            
            if(viewModel.formSubmitChannelData?.orderInfo?.shipTo?.contact) {
                payload.orderInfo.shipTo.contact = {
                    'emailAddress': viewModel.formSubmitChannelData.orderInfo.shipTo?.contact?.emailAddress,
                    'phone': viewModel.formSubmitChannelData.orderInfo.shipTo?.contact?.phone,
                };
            }

            if(viewModel.formSubmitChannelData?.orderInfo?.shipTo?.name) {
                payload.orderInfo.shipTo.name = {
                    'firstName': viewModel.formSubmitChannelData.orderInfo.shipTo?.name?.firstName,
                    'lastName': viewModel.formSubmitChannelData.orderInfo.shipTo?.name?.lastName,
                };
            }
        }
        
        const data = JSON.stringify(payload);
        return data;
    }
    formatAddressLine2(addressLine2:string):any {
        if(addressLine2 && addressLine2 !== 'undefined') {
            return addressLine2;
        } else {
            return '';
        }
    }
    addToWallet(data: any, cpcPageType:string){
        // console.log('addToWallet data', JSON.stringify(data));
        console.log(cpcPageType,'cpcPageType');
        const header = this.apiHeader();
        this.postRequest = this.getPostRequestChild();
        const url = this.config.envConfig.methodOfPaymentServiceUrl.url + this.config.envConfig.methodOfPaymentServiceUrl.addToWallet;
        this.localData = data;
        (async ()=>{            
            const response = await this.fetchData.post(url,header,this.postRequest);
            this.addToWalletHandler(response);        
        })().catch((e:any)=>{
            console.log('something went wrong:( ', e);
        });
        
    }
    apiHeader() {
        const header:any = {
            sourceServerId: this.channel.channelData.channelDetails.sourceServerId,
            sourceSystemId: this.channel.channelData.channelDetails.sourceSystemId,
            timestamp: this.channel.channelData.channelDetails.timestamp,
            trackingId: this.channel.channelData.channelDetails.trackingId,
            partnerId: this.channel.channelData.channelDetails.partnerId,
            Channel: this.channel.channelData.channelDetails.channelName,
            'Content-Type': 'application/json',
            Accept: 'application/json',
        };
        if(this.channel?.channelData?.customerDetails?.cimaUserToken){
            header.Authorization = 'Bearer ' + this.channel.channelData.customerDetails.cimaUserToken;
        }else if(this.channel?.channelData?.agentDetails?.azureAdToken){
            header.Authorization = 'Bearer ' + this.channel.channelData.agentDetails.azureAdToken;
        }

        return header;
    }
    addToWalletHandler(apiData:any){
        const response = apiData;
        //const response = apiData?.detail;
        const cpcPageType = this.getPaymentType();
        if(response) {
            if(response?.submissionDetails?.cpcStatus?.toLowerCase() ==='success'){
                if(response?.submissionDetails?.methodOfPaymentType === CARD) {
                    response.cardDetails.niceCardType = this.global.appState.get('cardNiceType');
                    response.cardDetails.cardLogoUrl = this.global.appState.get('cardImgUrl');
                } else {
                    response.bankDetails.routingNumber = this.global.appState.get('routingNumber');
                }
                this.sendCPCFormRespose(cpcPageType,response);
                this.postAddToWallet();
            } else if(response?.submissionDetails?.cpcStatus?.toLowerCase() === 'error'){
                this.sendCPCFormRespose(cpcPageType,response);
                const cpcMessage = this.errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.backend, MessageType.error,this.getErrorMessage(ErrorType.service, response?.submissionDetails?.psErrorCode) );
                this.errorHandling.showError(cpcMessage, response?.submissionDetails?.psErrorMessage);  
            }
            
        } else {
            console.log('addToWalletHandler api response - no data');
        }
    }
    sendCPCFormRespose(cpcPageType:string , response:any) : void {
        this.global.actionObserverService.fire(this,{detail: {
            action:JUMP_ADD_TO_WALLET_SUCCESS, 
            cpcPageType:cpcPageType,
            header:this.apiHeader(),
            postData: this.postRequest,
            configURL: this.config.envConfig.methodOfPaymentServiceUrl.url,
            token: this.channel.channelData.customerDetails.paymentToken,
            localData:this.localData}});
        this.localData.cpcData = response;
        parent.postMessage(JSON.stringify(this.localData), CURRENT_CHANNEL_DOMAIN.URI);
    }
    subscribeChild(detail:any){
        //console.log('ddd');
    }
    getPostRequestChild():any{return null;}
    getPaymentType():string{ return ''; }
    getErrorMessage(key:string, subKey:string):string{return '';}
    dispatchDatalayerEvent(submissionDetails:any){
        //console.log('ddd');
    }
    /*
    two flows:
    1- Load Flow
    2- Clcik Flow        
    */
    runLoadFlow(){
    //1-load successfull
    //1.1-bind - set input referecnes
    //1.2-bind click handler
    //2-load fail
        //this.bindExternalEvent();
        this.load();
    }
    
    
    runClickFlow(){     
        // const validateFlag = true;
        // if(validateFlag){
        //     setTimeout(async() => {
        //         await this.addToWallet({},'');
        //         this.completed();
        //     }, 2000);
        // }else {

        // }
    }
    load(){
        console.log('load method');
    }
    bind(viewModel:IViewModel){
        console.log('bind method');
    }    
    // validate(): boolean{
    //     return true;
    // }
    
    updateWallet(){
        console.log('update wallet method');
    }
    completed(){
        console.log('completed method');
    }
    async makeAutoPaymentCall(detail:any) {
        console.log('makeAutoPaymentCall from base');
    }
    autoPayPostMessage(localData:any) {
        console.log('autoPayPostMessage from base');
    }
    isAutoPaySelected():boolean {
        const autoPayAchOnly = document.querySelector('#jump-ach-web-component [name="jump-auto-pay-checkbox"]') as HTMLInputElement;
        const autoPayCardOnly = document.querySelector('#jump-cc-web-component [name="jump-auto-pay-checkbox"]') as HTMLInputElement;
        let isAutopayChecked = false;
        if(autoPayAchOnly?.checked || autoPayCardOnly?.checked) {
            isAutopayChecked = true;
        }
        return deriveAutopayEnroll(this.channel.channelData, isAutopayChecked);
    }
    isDefaultPaymentSelected():boolean {
        let flag = false;
        const defaultPaymentAchOnly = document.querySelector('#jump-ach-web-component [name="jump-default-payment-checkbox"]') as HTMLInputElement;
        const defaultPaymentCardOnly = document.querySelector('#jump-cc-web-component [name="jump-default-payment-checkbox"]') as HTMLInputElement;
        if(defaultPaymentAchOnly?.checked || defaultPaymentCardOnly?.checked) {
            flag = true;
        }
        return flag;
    }
    postAddToWallet() {
        if(this.localData.paymentInfo) {
            this.localData.paymentInfo.paymentType = this.getPaymentType();
        }
        this.dispatchDatalayerEvent(this.localData?.cpcData?.submissionDetails);
    }
}

/*
    CLICK FLOW:
    1-bind
    2-encrypt
    3-prepareRequest
    4-getHeader
    5-addToWallet
    6-addToWalletHandler       
*/