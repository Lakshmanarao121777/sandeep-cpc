import { ErrorType, IConfig, IInputReference, IUpdateInstrumentResponse, IViewModelEncrypted, MessageType } from '../model/view.model';
import { ErrorHandling } from '../utils/error-handling';
import { CommonService } from './common.service';
import { CURRENT_CHANNEL_DOMAIN, CPC_MIN_CARD_EDIT_API_SUBMIT, EVN_CPC_FORM_SUBMIT_RESPONSE, EVN_CPC_ERROR, CPC_DEFAULT_ERROR_MESSAGE } from '../constant/app.constant';
import { FormValidationService } from './form-validation-service';
import { Validation } from '../utils/validation';
import { DataLayerService } from './data-layer.service';
import { BaseAccountTypeService } from './base-account-type-service';
import { ChannelService } from './channel-service';
import { MinCardOnlyViewModelService } from './viewModel/min-card-only-vm-service';
import {IViewModel} from './../model/viewModel/view-model';
export class MinCardEditService extends BaseAccountTypeService {
    public minCardOnlyVmService:MinCardOnlyViewModelService = Object.assign({});  
    public inputReference: IInputReference = Object.assign({});
    public viewModel: IViewModel = Object.assign({});
    public config: IConfig = Object.assign({});
    public validations = new Validation();
    public commonService = new CommonService(Object.assign({})); 
    public formFieldStatusMap:Map<string, boolean>;
    public formValidationService: FormValidationService;
    public existingFormData:Map<string, string>;
    public dataLayerService:DataLayerService;
    public errorHandling:ErrorHandling=new ErrorHandling();
    constructor(config:IConfig, channel:ChannelService,type:string,minCardOnlyVmService:MinCardOnlyViewModelService,errorMessageResponse:any,commonService:CommonService,errorHandling:ErrorHandling) {
        super(config,channel,type,errorMessageResponse,errorHandling);
        //this.global = Globals.getInstance();
        this.minCardOnlyVmService = minCardOnlyVmService;
        this.commonService = commonService;
        this.formValidationService = new FormValidationService();
        this.formFieldStatusMap = new Map<string,boolean>();
        this.existingFormData = new Map<string,string>();
        this.dataLayerService = new DataLayerService();
        console.log('min-card-edit construtor');
    }
    validate() : boolean {
        let flag =true;
        const existingInstrumentCpcStatus = this.existingFormData.get('cpcStatus');
        const isCcNotChanged = this.existingFormData.get('cc') === this.inputReference?.cc?.value.replace(/ /g,'');
        if(!this.isFormFieldsModified()) {
            //form not modified, just return true from validate()
            return flag;
        }
        this.formFieldStatusMap.set('default', flag);
        if(existingInstrumentCpcStatus === 'success' && isCcNotChanged) {
            flag = true;
        } 
        else {
            if(this.inputReference?.cc?.value) {                
                const result = this.validations.validateCC(this.inputReference.cc.value);
                flag = result.isValid;
                if(result.isValid){
                    this.viewModel.cardInfo.ccNo = this.inputReference.cc.value;
                    this.inputReference.cc.classList.remove('is-invalid');
                    this.removeErrorFeedback('cc');
                }
            } else {
                flag = false;
                this.removeErrorFeedback('cc');
                this.inputReference.cc.classList.add('is-invalid');
            }
        }        
        this.formFieldStatusMap.set('cc', flag);        
        if(isCcNotChanged){
            flag = true;
        }                    
        else{
            if(this.inputReference?.cvv?.value) {
                const result  = this.validations.validateExpCvv(this.inputReference.cvv.value, this.inputReference.cc.value);
                flag = result.isValid;
                if(result.isValid){                   
                    this.viewModel.cardInfo.cvv = this.inputReference.cvv.value;
                    this.inputReference.cvv.classList.remove('is-invalid');
                    this.removeErrorFeedback('cvv');
                }
            } else {
                flag = false;
                this.removeErrorFeedback('cvv');
                this.inputReference.cvv.classList.add('is-invalid');
            }   
        }        
        this.formFieldStatusMap.set('cvv', flag);

        if(this.inputReference?.expiration?.value && this.inputReference?.expiration.value.length >= 5) {
            const isValid = flag = this.validations.validExpirationCheck(this.inputReference.expiration.value);
            if(!isValid){
                this.removeErrorFeedback('expiration');
                this.inputReference.expiration.classList.add('is-invalid');
            }else{
                const expirationArr = this.inputReference.expiration.value.split('/');
                this.viewModel.cardInfo.expMonth = expirationArr[0];
                this.viewModel.cardInfo.expYear = expirationArr[1];
                this.inputReference.expiration.classList.remove('is-invalid');
                this.removeErrorFeedback('expiration');
            }
        } else {
            flag = false;
            this.removeErrorFeedback('expiration');
            this.inputReference.expiration.classList.add('is-invalid');
        }
        this.formFieldStatusMap.set('expiration', flag);


        flag = this.formValidationService.isFormValid(this.formFieldStatusMap);
        if(flag === false) {
            const element:any = document.getElementsByClassName('invalid-feedback');
            element[0]?.parentElement?.scrollIntoView();
        } 
        return flag;
        
    }
    isFormFieldsModified(): boolean{
        let flag = false;
        let expMonth = '';
        let expYear = '';
        if(this.inputReference?.expiration?.value){
            expMonth = this.inputReference.expiration?.value?.split('/')[0];
            expYear = this.inputReference?.expiration?.value?.split('/')[1];
        }
        
        if(this.existingFormData.get('cpcStatus') === 'error'){
            return true;
        }
        const plainCC = this.inputReference?.cc?.value.replace(/ /g,'');
        if(this.existingFormData.get('cc') === plainCC 
        && this.existingFormData.get('expMM') === expMonth
        && this.existingFormData.get('expYY') === expYear){
            this.existingFormData.set('isCCChanged', 'false');
            this.existingFormData.set('isExpiryChanged', 'false');
            flag = false;
        } else if(this.existingFormData.get('cc') !== plainCC){
            this.existingFormData.set('isCCChanged', 'true');
            flag = true;
        } else if(this.existingFormData.get('expMM') !== expMonth || this.existingFormData.get('expYY') !== expYear){
            this.existingFormData.set('isExpiryChanged', 'true');
            flag = true;
        }
        return flag;
    }
    async getExistingPaymentInstrument(){
        const header = this.commonService.apiHeader();
        const requestData = this.getExistingPaymentInstrumentRequest();
        const url = this.config.envConfig.methodOfPaymentServiceUrl.url + this.config.envConfig.methodOfPaymentServiceUrl.getExistingPaymentInstrument;                
        const response = await this.fetchData.post(url,header,requestData).catch((e)=>{
            console.log('Something went wrong:( ', e);
        });
        this.onExistingPaymentInstrumentCompletedHandler(response);
    }
    onExistingPaymentInstrumentCompletedHandler(apiData:any){        
        const response = apiData;
        if(response) {
            console.log('getExistingPaymentInstrument response! ', response);
            if(response?.cpcStatus?.toLowerCase() ==='success'){                    
                this.inputReference.cc.value = this.viewModel.cardInfo.ccNo = response?.walletCardDetails?.maskedCardNumber;               
                this.viewModel.cardInfo.expMonth = response?.walletCardDetails?.expirationDate?.substring(0,2);
                this.viewModel.cardInfo.expYear = response?.walletCardDetails?.expirationDate?.substring(2,4);
                this.inputReference.expiration.value = this.viewModel.cardInfo.expMonth + '/' + this.viewModel.cardInfo.expYear;                
                this.inputReference.cvv.value = this.viewModel.cardInfo.cvv = response?.walletCardDetails?.maskedCvv;

                //hold existing form data
                const cardType = response?.walletCardDetails?.cardType;
                this.existingFormData.set('cpcStatus',response?.cpcStatus?.toLowerCase());
                this.existingFormData.set('cc',response?.walletCardDetails?.maskedCardNumber?.replace(/\*/g,'#'));
                this.existingFormData.set('expMM',response?.walletCardDetails?.expirationDate.substring(0,2));
                this.existingFormData.set('expYY',response?.walletCardDetails?.expirationDate.substring(2,4));
                this.existingFormData.set('cvv',response?.walletCardDetails?.maskedCvv);
                this.existingFormData.set('cardType',cardType);
                
                this.formValidationService.bindCCValuesEdit(this.inputReference.cc.value,cardType);
                this.formValidationService.setErrorMap('cc',true);
                this.formValidationService.setErrorMap('expiration',true);
                //this.formValidationService.setErrorMap('expMM',true);
                //this.formValidationService.setErrorMap('expYY',true);
                this.formValidationService.setErrorMap('cvv',true);
            }                
            else if(response?.cpcStatus?.toLowerCase() === 'error'){
                this.existingFormData.set('cpcStatus',response?.cpcStatus?.toLowerCase());
                if(this.errorHandling.isPsErrorCodeInNoWalletEntryList(response?.psErrorCode?.toString().toUpperCase())){
                    const error = this.getErrorMessage(ErrorType.service, response?.psErrorCode);
                    const cpcMessage = this.errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.form, MessageType.error, error);
                    this.errorHandling.showError(cpcMessage, response?.psErrorMessage);
                }              
            }                   
            
                
        } else {
            console.log('getExistingPaymentInstrument - no data found!');
        }    
    }
    getExistingPaymentInstrumentRequest(){
        const request =JSON.stringify({
            'billingArrangementId': this.channel.channelData?.customerDetails.billingArrangementId,
            'channel': this.channel.channelData.channelDetails?.channelName,
            'customerId': this.channel.channelData.customerDetails?.walletId,
            'paymentToken': this.channel.channelData.customerDetails?.paymentToken
        });
        return request;
    }
    async updateExistingPaymentInstrument(viewModel:IViewModel){
        const header = this.commonService.apiHeader();
        const requestData = this.updateExistingPaymentInstrumentRequest(viewModel);
        const url = this.config.envConfig.methodOfPaymentServiceUrl.url + this.config.envConfig.methodOfPaymentServiceUrl.updateExistingPaymentInstrument;
        const response = await this.fetchData.post(url,header,requestData).catch((e)=>{
            console.log('Something went wrong:( ', e);
        });
        this.onUpdateExistingPaymentInstrumentCompletedHandler(response,viewModel.cpcPageType.toLowerCase());
    }
    updateExistingPaymentInstrumentRequest(viewModel:IViewModel){
        const request = JSON.stringify({
            'channel':this.channel.channelData.channelDetails?.channelName,
            'paymentToken': this.channel.channelData.customerDetails?.paymentToken,
            'billTo': {
                'address': {
                    'city': viewModel.personalInfo?.addressInfo?.city,
                    'country': 'US',
                    'line1': viewModel.personalInfo?.addressInfo?.address,
                    'line2': viewModel.personalInfo?.addressInfo?.addressLine2,
                    'state': viewModel.personalInfo?.addressInfo?.state,
                    'zip': viewModel.personalInfo?.addressInfo?.zipCode,
                },
                'contact': {
                    'emailAddress': this.channel.channelData.customerDetails?.emailAddress,
                    'phone': this.channel.channelData.customerDetails?.phone
                },
                'name': {
                    'firstName': viewModel.personalInfo?.firstName,
                    'lastName': viewModel.personalInfo?.lastName,
                }
            },
            'customerDefinedName': viewModel.personalInfo?.firstName + '-' + viewModel.personalInfo?.lastName,
            'customerId': viewModel.walletId, // this.channel.channelData.customerDetails?.walletId,
            'bankDetails': {
                'defaultInstrument': null,
                'bankAccountType': null,
                'bankAccountLast4Digits': null,
                'maskedAccountNumber': null,
                'token': null,
            },
            'cardDetails': {
                'defaultInstrument': this.channel.channelData.customerDetails.setDefaultPaymentInstrument === false ? false: true,
                'cardLast4Digits': this.viewModel.cardInfo.ccNo.slice(-4),
                'cardType': this.existingFormData.get('cardType'),
                'expirationDate': this.viewModel.cardInfo.expMonth + this.viewModel.cardInfo.expYear,
                'maskedCardNumber': this.existingFormData.get('cc'),
                'token': this.channel.channelData.customerDetails?.paymentToken,
            },
        }); 
        return request;
    }
    
    onUpdateExistingPaymentInstrumentCompletedHandler(apiData:any,cpcPageType:string){
        const response = apiData;
        const data = Object.assign({});
        data.channelData = this.channel.channelData;
        data.action = EVN_CPC_FORM_SUBMIT_RESPONSE;
        
        if(response) {
            console.log('updateExistingPaymentInstrument response! ', response); 
            data.cpcData = response;
            data.channelData.paymentType = cpcPageType;      
            parent.postMessage(JSON.stringify(data), CURRENT_CHANNEL_DOMAIN.URI);
            if(response?.submissionDetails?.cpcStatus?.toLowerCase() ==='success'){
                this.dataLayerService.dispatchInfoEvent(CPC_MIN_CARD_EDIT_API_SUBMIT, data?.cpcData?.submissionDetails);
            } else if(response?.submissionDetails?.cpcStatus?.toLowerCase() === 'error'){
                const error = this.getErrorMessage(ErrorType.service, response?.submissionDetails?.psErrorCode);
                const cpcMessage = this.errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.form, MessageType.error, error);
                this.errorHandling.showError(cpcMessage,response?.submissionDetails?.psErrorMessage);
            }            
        } else {
            console.log('updateExistingPaymentInstrument - no data found!');
        }
    }
    sendDummyResponse(cpcPageType:string) {
        const response:IUpdateInstrumentResponse = Object.assign({});        
        response.submissionDetails = Object.assign({});
        response.submissionDetails.cpcStatus = 'SUCCESS';
        response.submissionDetails.cpcMessage = 'No change in the existing information found, no api call has been made.';
        response.submissionDetails.psErrorCode = '';
        response.submissionDetails.psErrorMessage = '';
        response.submissionDetails.trackingId = '3';
        response.submissionDetails.actionTaken = 'no_change';
        response.submissionDetails.methodOfPaymentType = '';

        const data = Object.assign({});
        data.channelData = this.channel.channelData;
        data.action = EVN_CPC_FORM_SUBMIT_RESPONSE;

        if(response) {
            console.log('updateExistingPaymentInstrument dummy response! ', response);            
            data.cpcData = response;
            data.channelData.paymentType = cpcPageType;
            parent.postMessage(JSON.stringify(data), CURRENT_CHANNEL_DOMAIN.URI);
        } else {
            console.log('updateExistingPaymentInstrument - no data found!');
        }
    }
    removeErrorFeedback(reference:string) {
        const parentId = this.inputReference[reference  as keyof IInputReference].parentElement; 
        const errFeedback =  this.inputReference[reference  as keyof IInputReference].name;
        if(parentId){
            const selector = `[name='${errFeedback}-feedback']`;
            if(selector && parentId.querySelector(selector)) {
                parentId.querySelector(selector).remove();
            }
        }
    }
    appendErrorFeedback(reference:string, feedbackMsg: string) :any {
        const nameField = this.inputReference[reference as keyof IInputReference].name;
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
        default:
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.card,key,subKey);
            break;
        }
        return errorMessage;
    }
}