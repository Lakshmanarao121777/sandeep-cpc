import { ErrorType, IConfig, IInputReference, IUpdateInstrumentResponse, MessageType, PaymentType } from '../model/view.model';
import { ErrorHandling } from '../utils/error-handling';
import { CommonService } from './common.service';

import { CPC_BANK_EDIT_API_SUBMIT, CURRENT_CHANNEL_DOMAIN, EVN_CPC_FORM_SUBMIT_RESPONSE, EVN_CPC_ERROR, ACH, CUSTOMER_CLASS_BUSINESS } from '../constant/app.constant';
import { FormValidationService } from './form-validation-service';
import { Validation } from '../utils/validation';
import { DataLayerService } from './data-layer.service';
import { FetchData } from '../api/fetch-data';
import { BaseAccountTypeService } from './base-account-type-service';
import { ChannelService } from './channel-service';
import {IViewModel} from './../model/viewModel/view-model';
import { IKeyValuePair } from '../model/view.model';
import { isSetAsDefaultPaymentCheckboxChecked } from './viewModel/util/set-as-default-instrument-util';
import { getPersonalInfo } from '../utils/wallet';
import { waitForElementToLoad } from '../utils/elementLoader';
export class AchOnlyEditService extends BaseAccountTypeService {
    public inputReference: IInputReference = Object.assign({});
    public viewModel: IViewModel = Object.assign({});
    public config: IConfig = Object.assign({});
    public validations = new Validation();
    public commonService = new CommonService(Object.assign({}));
    public formFieldStatusMap: Map<string, boolean>;
    public formValidationService: FormValidationService;
    public existingFormData: Map<string, string>;
    public dataLayerService: DataLayerService;

    constructor(config:IConfig, channel:ChannelService,type:string,errorMessageResponse:any,commonService:CommonService,errorHandling:ErrorHandling) {
        super(config,channel,type,errorMessageResponse,errorHandling);
        this.commonService = commonService;
        this.formValidationService = new FormValidationService();
        this.formFieldStatusMap = new Map<string, boolean>();
        this.existingFormData = new Map<string, string>();
        this.dataLayerService = new DataLayerService();
        console.log('ach-only-edit-service construtor');
    }
    bind(){
        const routingNo = this.getElementRef('[name="jump-routing-no"]');
        routingNo.addEventListener('blur',(e:any)=>{
            if(this.channel.channelData.customerDetails.paymentToken){
                if(this.existingFormData.get('routingNo')  !== this.inputReference.routingNo.value ){
                    const accNo = this.inputReference.accountNo.value.replace(/[^0-9]/g, '');
                    if(!(this.validations.validateAccountNo(accNo).isValid)){
                        this.viewModel.accountInfo.accountNo = this.inputReference.accountNo.value = '';
                    }
                }
            }
        });
        const accountNo = this.getElementRef('[name="jump-account-no"]');
        accountNo.addEventListener('blur',(e:any)=>{
            if(this.channel.channelData.customerDetails.paymentToken){
                if(this.existingFormData.get('accountNo')  !== this.inputReference.accountNo.value ){
                    this.formValidationService.bindAccountNoValuesEdit(this.inputReference.accountNo.value);
                }
            }
        });
        accountNo.addEventListener('keyup',(e:any)=>{
            if(this.channel.channelData.customerDetails.paymentToken){
                if(this.existingFormData.get('accountNo')  !== this.inputReference.accountNo.value ){
                    this.formValidationService.bindAccountNoValuesEdit(this.inputReference.accountNo.value);
                }
            }
        });
    }
    getElementRef = (selector: string): any => {
        return document.querySelector(selector);
    };
    isAddressModified(vm: IViewModel): boolean {
        let flag = false;
        if (this.existingFormData.get('address')?.replace(/ /g, '') !== vm.personalInfo?.addressInfo?.address?.replace(/ /g, '')) {
            this.existingFormData.set('isAddressChanged', 'true');
            flag = true;
        }
        if (this.existingFormData.get('addressLine2') !== vm.personalInfo?.addressInfo?.addressLine2) {
            this.existingFormData.set('isAddressLine2Changed', 'true');
            flag = true;
        }
        if (this.existingFormData.get('city') !== vm.personalInfo?.addressInfo?.city) {
            this.existingFormData.set('isCityChanged', 'true');
            flag = true;
        }
        if (this.existingFormData.get('state') !== vm.personalInfo?.addressInfo?.state) {
            this.existingFormData.set('isStateChanged', 'true');
            flag = true;
        }
        if (this.existingFormData.get('zipCode') !== vm.personalInfo?.addressInfo?.zipCode) {
            this.existingFormData.set('isZipCodeChanged', 'true');
            flag = true;
        }
        return flag;
    }
    isFormFieldsModified(): boolean{
        let flag = false;
      
        if(this.existingFormData.get('cpcStatus') === 'error'){
            return true;
        }
        const accountNo = this.inputReference?.accountNo?.value.replace(/ /g,'');
        const routingNum = this.inputReference?.routingNo?.value.replace(/ /g,'');
        const firstName = this.inputReference?.firstName?.value.replace(/ /g,'');
        const lastName = this.inputReference?.lastName?.value.replace(/ /g,'');
        let isEnrollInAutoPayChanged = false;
        let isStoredPaymentChanged = false;
        const enrollInAutoPay = document.querySelector('#jump-ach-web-component [name="jump-auto-pay-checkbox"]') as HTMLInputElement;
        const storedPayment = document.querySelector('#jump-ach-web-component [name="jump-tc-checkbox"]') as HTMLInputElement;

        if(enrollInAutoPay){
            if(!!this.existingFormData.get('enrollInAutoPay') ===  enrollInAutoPay?.checked){
                isEnrollInAutoPayChanged = false;
            }else{
                isEnrollInAutoPayChanged = true;
            }
        }
        if(storedPayment){
            if(!!this.existingFormData.get('storedPayment') ===  storedPayment?.checked){
                isStoredPaymentChanged = false;
            }else{
                isStoredPaymentChanged = true;
            }
        }
       
        if(this.existingFormData.get('accountNo') === accountNo 
        && this.existingFormData.get('routingNo') === routingNum
        && this.existingFormData.get('firstName') === firstName
        && this.existingFormData.get('lastName') === lastName
        && !isEnrollInAutoPayChanged
        && !isStoredPaymentChanged
        ){
            this.existingFormData.set('isAcctNoChanged', 'false');
            this.existingFormData.set('isRoutNoChanged', 'false');
            this.existingFormData.set('isFirstNameChanged', 'false');
            this.existingFormData.set('isLastNameChanged', 'false');
            this.existingFormData.set('isAddressChanged', 'false');
            this.existingFormData.set('isAddressLine2Changed', 'false');
            this.existingFormData.set('isCityChanged', 'false');
            this.existingFormData.set('isStateChanged', 'false');
            this.existingFormData.set('isZipCodeChanged', 'false');
            this.existingFormData.set('isAccountType', 'false');
            this.existingFormData.set('isEnrollInAutoPayChanged', 'false');
            this.existingFormData.set('isStoredPaymentChanged', 'false');
            flag = false;
            return flag;
        }  
        if(this.existingFormData.get('accountNo') !== accountNo){
            this.existingFormData.set('isAcctNoChanged', 'true');
            document.getElementById('jump-acc-type-saving')?.removeAttribute('disabled');
            document.getElementById('jump-acc-type-checking')?.removeAttribute('disabled');
            flag = true;
        } 
        if(this.existingFormData.get('routingNo') !== routingNum){
            this.existingFormData.set('isRoutNoChanged', 'true');
            document.getElementById('jump-acc-type-saving')?.removeAttribute('disabled');
            document.getElementById('jump-acc-type-checking')?.removeAttribute('disabled');
            flag = true;
        } 
        if(this.existingFormData.get('firstName') !== firstName){
            this.existingFormData.set('isFirstNameChanged', 'true');
            flag = true;
        } 
        if(this.existingFormData.get('lastName') !== lastName){
            this.existingFormData.set('isLastNameChanged', 'true');
            flag = true;
        }
        if (enrollInAutoPay?.checked) {
            this.existingFormData.set('isEnrollInAutoPayChanged', 'true');
            flag = true;
        }
        if (storedPayment?.checked) {
            this.existingFormData.set('isStoredPaymentChanged', 'true');
            flag = true;
        }
        return flag;
    }
    async getExistingPaymentInstrument(formType?:string){
        const header = this.commonService.apiHeader();
        const requestData = this.getExistingPaymentInstrumentRequest();
        const url = this.config.envConfig.methodOfPaymentServiceUrl.url + this.config.envConfig.methodOfPaymentServiceUrl.getExistingPaymentInstrument;                
        const fetchData = new FetchData();
        const response = await fetchData.post(url,header,requestData);
        this.getAccountType(response);
        this.onExistingPaymentInstrumentCompletedHandler(response, formType);
        return response;
    }
    getAccountType(response:any) {
        if(response.walletBankDetails?.accountType.toLowerCase() === 'saving') {
            document.getElementById('jump-acc-type-saving')?.setAttribute('checked','checked');
            document.getElementById('jump-acc-type-checking')?.setAttribute('disabled','true');
            this.inputReference.accountTypeSaving = Object.assign({checked: true});
            this.inputReference.accountTypeChecking = Object.assign({checked: false});
            this.inputReference.accountTypeCorporateChecking = Object.assign({checked: false});

        } else if(response.walletBankDetails?.accountType.toLowerCase() === 'checking') {
            document.getElementById('jump-acc-type-checking')?.setAttribute('checked','checked');
            document.getElementById('jump-acc-type-saving')?.setAttribute('disabled','true');
            this.inputReference.accountTypeSaving = Object.assign({checked: false});
            this.inputReference.accountTypeChecking = Object.assign({checked: true});
            this.inputReference.accountTypeCorporateChecking = Object.assign({checked: false});

        } else if(response.walletBankDetails?.accountType.toLowerCase() === 'corporatechecking') {
            document.getElementById('jump-acc-type-corporate-checking')?.setAttribute('checked','checked');
            this.inputReference.accountTypeSaving = Object.assign({checked: false});
            this.inputReference.accountTypeChecking = Object.assign({checked: false});
            this.inputReference.accountTypeCorporateChecking = Object.assign({checked: true});
        }
    }
    async onExistingPaymentInstrumentCompletedHandler(apiData:any, formType?:string){        
        const response = apiData;
        const personalInfo = getPersonalInfo(response, this.channel.channelData, ACH);
        if(response) {
            if(response?.cpcStatus?.toLowerCase() ==='success' && response?.walletBankDetails !== null){                
                if(!formType) {
                    this.inputReference.accountNo.value = this.viewModel.accountInfo.accountNo = response?.walletBankDetails?.maskedAccountNumber;              
                    this.inputReference.routingNo.value = this.viewModel.accountInfo.routingNo = response?.walletBankDetails?.routingNumber;       
                    this.inputReference.firstName.value = this.viewModel.personalInfo.firstName = personalInfo.firstName;
                    this.inputReference.lastName.value = this.viewModel.personalInfo.lastName = personalInfo.lastName;  
                }  
                this.setElementReference();
                const setElementReferenceCompleted = await this.setElementReference();
                if(setElementReferenceCompleted){
                    this.setInputReferenceValue(response);
                }
                // this.inputReference.state.setAttribute('fillState', response?.walletBankDetails?.billTo?.address?.state);
                //hold existing form data
                this.existingFormData.set('cpcStatus',response?.cpcStatus?.toLowerCase());
                this.existingFormData.set('accountNo',response?.walletBankDetails?.maskedAccountNumber);
                this.existingFormData.set('routingNo',response?.walletBankDetails?.routingNumber);
                this.existingFormData.set('firstName', response?.walletBankDetails?.billTo?.name?.firstName);
                this.existingFormData.set('lastName', response?.walletBankDetails?.billTo?.name?.lastName);
                this.existingFormData.set('address', response?.walletBankDetails?.billTo?.address?.line1);
                this.existingFormData.set('addressLine2', response?.walletBankDetails?.billTo?.address?.line2);
                this.existingFormData.set('city', response?.walletBankDetails?.billTo?.address?.city);
                this.existingFormData.set('state', response?.walletBankDetails?.billTo?.address?.state);
                this.existingFormData.set('zipCode', response?.walletBankDetails?.billTo?.address?.zip);
                this.existingFormData.set('accountType',response.walletBankDetails?.accountType);
                const enrollInAutoPay = document.querySelector('#jump-ach-web-component [name="jump-auto-pay-checkbox"]') as HTMLInputElement;
                const storedPayment = document.querySelector('#jump-ach-web-component [name="jump-tc-checkbox"]') as HTMLInputElement;
                this.existingFormData.set('enrollInAutoPay', enrollInAutoPay?.checked?.toString() || 'false');
                this.existingFormData.set('storedPayment', storedPayment?.checked?.toString() || 'false');

                this.formValidationService.setErrorMap('accountNo',true);
                this.formValidationService.setErrorMap('routingNo',true);
                this.formValidationService.setErrorMap('firstName',true);
                this.formValidationService.setErrorMap('lastName',true);
                this.formValidationService.setErrorMap('address', true);
                this.formValidationService.setErrorMap('addressLine2', true);
                this.formValidationService.setErrorMap('city', true);
                this.formValidationService.setErrorMap('state', true);
                this.formValidationService.setErrorMap('zipCode', true); 
            }                
            else if(response?.cpcStatus?.toLowerCase() === 'error'){
                this.existingFormData.set('cpcStatus',response?.cpcStatus?.toLowerCase());
                if(this.errorHandling.isPsErrorCodeInNoWalletEntryList(response?.psErrorCode?.toString().toUpperCase())){
                    // errorHandling.showError(response?.cpcMessage);
                    const error = this.getErrorMessage(ErrorType.service, response?.psErrorCode);
                    const cpcErrorMessage = this.errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.form, MessageType.error, error);
                    this.errorHandling.showError(cpcErrorMessage, response?.psErrorMessage);
                }                  
            }  else{
                console.log('getExistingPaymentInstrument - no data found!');
            }                         
        } else {
            console.log('getExistingPaymentInstrument - no data found!');
        }
        //document.removeEventListener('jump-api-response-completed', this.onExistingPaymentInstrumentCompletedHandler); 
    }
    async setInputReferenceValue(response:any):Promise<void> {
        if(!this.inputReference?.address) {
            const addressId = '#jump-ach-web-component [name="jump-address"]';  
            const address = await waitForElementToLoad(addressId).then((addressElement:any) => {
                this.inputReference.address = addressElement;
                this.inputReference.address.value = response?.walletBankDetails?.billTo?.address?.line1;
            });
            console.log('!setInputReferenceValue',this.inputReference.address);
        } else {
            this.inputReference.address.value = response?.walletBankDetails?.billTo?.address?.line1;
        }
        if(!this.inputReference?.addressLine2) {
            const addressLine2Id = '#jump-ach-web-component [name="jump-line2"]';  
            const addressLine2 = await waitForElementToLoad(addressLine2Id).then((addressLine2Element:any) => {
                this.inputReference.addressLine2 = addressLine2Element;
                this.inputReference.addressLine2.value = response?.walletBankDetails?.billTo?.address?.line2;
            });
        } else {
            this.inputReference.addressLine2.value = response?.walletBankDetails?.billTo?.address?.line2;
        }
        if(!this.inputReference?.city) {
            const cityId = '#jump-ach-web-component [name="jump-city"]';  
            const city = await waitForElementToLoad(cityId).then((cityElement:any) => {
                this.inputReference.city = cityElement;
                this.inputReference.city.value = response?.walletBankDetails?.billTo?.address?.city;
            });
        } else {
            this.inputReference.city.value = response?.walletBankDetails?.billTo?.address?.city;
        }
        if(!this.inputReference?.state) {
            const stateId = '#jump-ach-web-component [name="jump-state"]';  
            const state = await waitForElementToLoad(stateId).then((stateElement:any) => {
                this.inputReference.state = stateElement;
                this.inputReference.state?.setAttribute('fillState', response?.walletBankDetails?.billTo?.address?.state);
                this.inputReference.state.value = response?.walletBankDetails?.billTo?.address?.state;
            });
        } else {
            this.inputReference.state?.setAttribute('fillState', response?.walletBankDetails?.billTo?.address?.state);
            this.inputReference.state.value = response?.walletBankDetails?.billTo?.address?.state;
        }
        if(!this.inputReference?.zipCode) {
            const zipCodeId = '#jump-ach-web-component [name="jump-zip-code"]';  
            const zipdeCode = await waitForElementToLoad(zipCodeId).then((zipCodeIdElement:any) => {
                this.inputReference.zipCode = zipCodeIdElement;
                this.inputReference.zipCode.value = response?.walletBankDetails?.billTo?.address?.zip;
            });
        } else {
            this.inputReference.zipCode.value = response?.walletBankDetails?.billTo?.address?.zip;
        }
    }
    async setElementReference():Promise<boolean> {  
        console.log('setElementReference ach address WithEdit');
        const inputRefPair:Array<IKeyValuePair> = new Array<IKeyValuePair>();

        inputRefPair.push({key: 'address', value:'#jump-ach-web-component [name="jump-address"]'});
        inputRefPair.push({key: 'addressLine2', value:'#jump-ach-web-component [name="jump-line2"]'});
        inputRefPair.push({key: 'city', value:'#jump-ach-web-component [name="jump-city"]'});
        inputRefPair.push({key: 'state', value:'#jump-ach-web-component [name="jump-state"]'});
        inputRefPair.push({key: 'zipCode', value:'#jump-ach-web-component [name="jump-zip-code"]'});
       
        const completeSetElement =  await this.formValidationService.setElementReference(inputRefPair);
        if(completeSetElement) {
            console.log('SetElementReferenceValid');
            return true;
        } else {
            console.log('SetElementReferenceError');
            return false;
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
    async updateExistingPaymentInstrument(cpcPageType: string){
        this.channel.channelData.customerDetails.firstName = this.inputReference.firstName.value;
        this.channel.channelData.customerDetails.lastName = this.inputReference.lastName.value;
        const header = this.commonService.apiHeader();
        const requestData = this.updateExistingPaymentInstrumentRequest();
        const url = this.config.envConfig.methodOfPaymentServiceUrl.url + this.config.envConfig.methodOfPaymentServiceUrl.updateExistingPaymentInstrument;
        const fetchData = new FetchData();
        const response = await fetchData.post(url,header,requestData);
        this.onUpdateExistingPaymentInstrumentCompletedHandler(response,cpcPageType);        
    }
    updateExistingPaymentInstrumentRequest(){        
        const request = JSON.stringify({
            'enrollInAutopay':this.validations.isCheckBoxSelected('#jump-ach-web-component [name="jump-auto-pay-checkbox"]'),
            'channel':this.channel.channelData.channelDetails?.channelName,
            'paymentToken': this.channel.channelData.customerDetails?.paymentToken,
            'billTo': {
                'address': {
                    'city': this.channel.channelData.customerDetails.city,
                    'country': 'US',
                    'line1': this.channel.channelData.customerDetails.address,
                    'line2': this.channel.channelData.customerDetails.addressLine2,
                    'state': this.channel.channelData.customerDetails.state,
                    'zip': this.channel.channelData.customerDetails.zip,
                },
                'contact': {
                    'emailAddress': this.channel.channelData.customerDetails?.emailAddress,
                    'phone': this.channel.channelData.customerDetails?.phone
                },
                'name': {
                    'firstName': this.channel.channelData.customerDetails.firstName,
                    'lastName': this.channel.channelData.customerDetails.lastName,
                }
            },
            'customerDefinedName': this.channel.channelData.customerDetails.firstName + '-' + this.channel.channelData.customerDetails.lastName,
            'customerId': this.viewModel.walletId,
            'bankDetails': {
                'defaultInstrument': isSetAsDefaultPaymentCheckboxChecked(),
                'bankAccountType': this.getAccountTypeByViewModal(this.viewModel),
                'bankAccountLast4Digits': this.viewModel.accountInfo.accountNo.slice(-4),
                'maskedAccountNumber': this.existingFormData.get('accountNo'),
                'token': this.channel.channelData.customerDetails?.paymentToken,
            },
            'cardDetails': {
                'defaultInstrument': null,
                'cardLast4Digits': null,
                'cardType': null,
                'expirationDate': null,
                'maskedCardNumber': null,
                'token': null,
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
            parent.postMessage(JSON.stringify(data),CURRENT_CHANNEL_DOMAIN.URI);             
            if(response?.submissionDetails?.cpcStatus?.toLowerCase() ==='success'){
                this.dataLayerService.dispatchInfoEvent(CPC_BANK_EDIT_API_SUBMIT, data?.cpcData?.submissionDetails);
            } else if(response?.submissionDetails?.cpcStatus?.toLowerCase() === 'error'){
                const error = this.getErrorMessage(ErrorType.service, response?.submissionDetails?.psErrorCode);
                const cpcFormError = this.errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.form, MessageType.error, error);
                this.errorHandling.showError(cpcFormError, response?.submissionDetails);
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
            parent.postMessage(JSON.stringify(data),CURRENT_CHANNEL_DOMAIN.URI);
        } else {
            console.log('updateExistingPaymentInstrument - no data found!');
        }
    }
    validate(): boolean {
        let flag = true;
        this.formFieldStatusMap.set('default', flag);
        this.removeErrorNodes();
        if (this.isFormFieldsModified()) {
            if (this.existingFormData.get('isFirstNameChanged') === 'true') {
                if (this.inputReference?.firstName?.value) {
                    const isValid = this.validations.validateFirstName(
                        this.inputReference.firstName.value,
                        this.channel?.channelData?.channelDetails?.customerClass
                    );
                    if (!isValid.isValid) {
                        flag = false;
                        this.inputReference.firstName?.parentElement.append(
                            this.appendErrorFeedback('firstName', this.getErrorMessage(ErrorType.first_name,ErrorType.invalid))
                        );
                    } else {
                        this.viewModel.personalInfo.firstName = this.inputReference.firstName.value;
                        this.inputReference.firstName.classList.remove('is-invalid');
                    }
                } else {
                    flag = false;
                    this.inputReference.firstName.classList.add('is-invalid');
                    this.inputReference.firstName?.parentElement.append(
                        this.appendErrorFeedback('firstName', this.getErrorMessage(ErrorType.first_name,ErrorType.no_value))
                    );
                    console.log(this.getErrorMessage(ErrorType.first_name,ErrorType.no_value));
                }
                this.formFieldStatusMap.set('firstName', flag);
            }else{
                this.formFieldStatusMap.set('firstName', true);
            }
    
            if (this.existingFormData.get('isLastNameChanged') === 'true') {
                if (this.inputReference?.lastName?.value) {
                    const isValid = this.validations.validateLastName(
                        this.inputReference.lastName.value,
                        this.channel?.channelData?.channelDetails?.customerClass,PaymentType[PaymentType.AchOnly].toLowerCase()
                    ).isValid;
                    if (!isValid) {
                        flag = false;
                        this.inputReference.lastName?.parentElement.append(
                            this.appendErrorFeedback('lastName', this.getErrorMessage(ErrorType.last_name,ErrorType.invalid))
                        );
                    } else {
                        this.viewModel.personalInfo.lastName = this.inputReference.lastName.value;
                        this.inputReference.lastName.classList.remove('is-invalid');
                    }
    
                } 
                // else if(this.channel?.channelData?.channelDetails?.customerClass === CUSTOMER_CLASS_BUSINESS && !this.inputReference.lastName.value){
                //     flag = flag ? true : flag;
                // }
                else {
                    flag = false;
                    this.inputReference.lastName.classList.add('is-invalid');
                    this.inputReference.lastName?.parentElement.append(
                        this.appendErrorFeedback('lastName', this.getErrorMessage(ErrorType.last_name,ErrorType.no_value))
                    );
                    console.log(this.getErrorMessage(ErrorType.last_name,ErrorType.no_value));
                }
                this.formFieldStatusMap.set('lastName', flag);
            }else{
                this.formFieldStatusMap.set('lastName', true);
            }
    
            if (this.existingFormData.get('isAcctNoChanged') === 'true') {
                if (this.inputReference?.accountNo?.value) {
                    const result = this.validations.validateAccountNo(
                        this.inputReference.accountNo.value
                    );
                    if (!result.isValid) {
                        flag = false;
                        this.inputReference.accountNo.parentElement.append(
                            this.appendErrorFeedback('accountNo', this.getErrorMessage(ErrorType.bank_account_number,result.errorType))
                        );
                    } else {
                        this.viewModel.accountInfo.accountNo = this.inputReference.accountNo.value;
                        this.inputReference.accountNo.classList.remove('is-invalid');
                    }
                } else {
                    flag = false;
                    this.inputReference.accountNo.classList.add('is-invalid');
                    this.inputReference.accountNo.parentElement.append(
                        this.appendErrorFeedback('accountNo', this.getErrorMessage(ErrorType.bank_account_number,ErrorType.no_value))
                    );
                    console.log(this.getErrorMessage(ErrorType.bank_account_number,ErrorType.no_value));
                }
                this.formFieldStatusMap.set('accountNo', flag);
            }else{
                this.formFieldStatusMap.set('accountNo', true);
            }
    
            if (this.existingFormData.get('isRoutNoChanged') === 'true') {
                if (this.inputReference?.routingNo?.value) {
                    const result = this.validations.validateRoutingNo(
                        this.inputReference.routingNo.value
                    );
                    if (!result.isValid) {
                        flag = false;
                        this.inputReference.routingNo.parentElement.append(
                            this.appendErrorFeedback('routingNo', this.getErrorMessage(ErrorType.routing_number,result.errorType))
                        );
                    } else {
                        this.viewModel.accountInfo.routingNo = this.inputReference.routingNo.value;
                        this.inputReference.routingNo.classList.remove('is-invalid');
                    }
                } else {
                    flag = false;
                    this.inputReference.routingNo.classList.add('is-invalid');
                    this.inputReference.routingNo.parentElement.append(
                        this.appendErrorFeedback('routingNo', this.getErrorMessage(ErrorType.routing_number,ErrorType.no_value))
                    );
                    console.log(this.getErrorMessage(ErrorType.routing_number,ErrorType.no_value));
                }
                this.formFieldStatusMap.set('routingNo', flag);
            }else{
                this.formFieldStatusMap.set('routingNo', true);
            }
            if(this.validations.isSetStoredPayment()) {
                if (this.existingFormData.get('isEnrollInAutoPayChanged') === 'true') {
                    if(!this.inputReference?.storedPayment) {
                        const storedPaymentAchElement = document.querySelector('#jump-ach-web-component [name="jump-tc-checkbox"]') as HTMLInputElement;
                        this.inputReference.storedPayment = storedPaymentAchElement;
                    }
                    if (this.inputReference?.storedPayment) {
                        flag = this.validations.validateAutoPayAndStoredPaymentACH();
                        if(!flag) {
                            flag = false;
                            const errorFeedBack = document.querySelector('#jump-ach-web-component [name="jump-tc-checkbox-feedback"]');
                            if(!errorFeedBack) {
                                this.inputReference?.storedPayment?.classList.add('is-invalid');
                                this.inputReference?.storedPayment?.parentElement.append(this.appendErrorFeedback('storedPayment', this.getErrorMessage(ErrorType.stored_payment,ErrorType.invalid)));
                            }  
                        } else {
                            this.inputReference?.storedPayment?.classList.remove('is-invalid');
                        }
                    } else {
                        flag = false;
                        this.inputReference?.storedPayment?.classList.add('is-invalid');
                        this.inputReference?.storedPayment?.parentElement.append(this.appendErrorFeedback('storedPayment', this.getErrorMessage(ErrorType.stored_payment,ErrorType.invalid)));
                        console.log(this.getErrorMessage(ErrorType.form, ErrorType.stored_payment));
                    }                    
                    this.formFieldStatusMap.set('storedPayment', flag);
                } 
            }
    
            flag = this.formValidationService.isFormValid(this.formFieldStatusMap); 
            if(flag === false) {
                const element:any = document.getElementsByClassName('invalid-feedback');
                element[0]?.parentElement?.scrollIntoView();
            } 
            return flag;
        } else {
            return flag;
        }

        
    }
    removeErrorNodes(){
        this.removeErrorFeedback('firstName');
        this.removeErrorFeedback('lastName');
        this.removeErrorFeedback('accountNo');
        this.removeErrorFeedback('routingNo');
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
        case ErrorType.stored_payment:  
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.stored_payment,ErrorType.invalid);
            break; 
        default:
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.bank,key,subKey);
            break;
        }
        return errorMessage;
    }
}