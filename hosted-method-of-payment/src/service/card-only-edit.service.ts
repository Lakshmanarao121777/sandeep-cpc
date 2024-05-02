import { ErrorType, IConfig, IInputReference, IUpdateInstrumentResponse, IViewModelEncrypted, MessageType, PaymentType } from '../model/view.model';
import { ErrorHandling } from '../utils/error-handling';
import { CommonService } from './common.service';
import { CC, CPC_CARD_EDIT_API_SUBMIT, CURRENT_CHANNEL_DOMAIN, CUSTOMER_CLASS_BUSINESS, EVN_CPC_ERROR, EVN_CPC_FORM_SUBMIT_RESPONSE, WALLET_MGMT_NO_AUTOPAY } from '../constant/app.constant';
import { FormValidationService } from './form-validation-service';
import { Validation } from '../utils/validation';
import { DataLayerService } from './data-layer.service';
import {IViewModel} from './../model/viewModel/view-model';
import { BaseAccountTypeService } from './base-account-type-service';
import { ChannelService } from './channel-service';
import { CardOnlyViewModelService } from './viewModel/card-only-vm-service';
import { IKeyValuePair } from '../model/view.model';
import { isSetAsDefaultPaymentCheckboxChecked } from './viewModel/util/set-as-default-instrument-util';
import { getPersonalInfo } from '../utils/wallet';
import { waitForElementToLoad } from '../utils/elementLoader';
export class CardOnlyEditService extends BaseAccountTypeService{
    public cardOnlyVmService:CardOnlyViewModelService = Object.assign({});  
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
        console.log('card-only-edit-service construtor');
    }
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
    isFormFieldsModified(): boolean {
        let flag = false;

        if (this.existingFormData.get('cpcStatus') === 'error') {
            return true;
        }
        const cc = this.inputReference?.cc?.value.replace(/ /g, '');
        const cvv = this.inputReference?.cvv?.value.replace(/ /g, '');
        const expiration = this.inputReference?.expMM?.value.replace(/ /g, '') + this.inputReference?.expYY?.value.replace(/ /g, '').substr(2, 4);
        const firstName = this.inputReference?.firstName?.value.replace(/ /g, '');
        const lastName = this.inputReference?.lastName?.value.replace(/ /g, '');

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
        if (this.existingFormData.get('cc') === cc
            && this.existingFormData.get('cvv') === cvv
            && this.existingFormData.get('expiration') === expiration
            && this.existingFormData.get('firstName') === firstName
            && this.existingFormData.get('lastName') === lastName
            && !isEnrollInAutoPayChanged
            && !isStoredPaymentChanged
        ) {

            this.existingFormData.set('isCcChanged', 'false');
            this.existingFormData.set('isCvvChanged', 'false');
            this.existingFormData.set('isExpirationChanged', 'false');
            this.existingFormData.set('isFirstNameChanged', 'false');
            this.existingFormData.set('isLastNameChanged', 'false');
            this.existingFormData.set('isAddressChanged', 'false');
            this.existingFormData.set('isAddressLine2Changed', 'false');
            this.existingFormData.set('isCityChanged', 'false');
            this.existingFormData.set('isStateChanged', 'false');
            this.existingFormData.set('isZipCodeChanged', 'false');
            this.existingFormData.set('isEnrollInAutoPayChanged', 'false');
            this.existingFormData.set('isStoredPaymentChanged', 'false');
            flag = false;
            return flag;
        }
        if (this.existingFormData.get('cc') !== cc.replace(/ /g, '')) {
            this.existingFormData.set('isCcChanged', 'true');
            flag = true;
        }
        if (this.existingFormData.get('cvv') !== cvv) {
            this.existingFormData.set('isCvvChanged', 'true');
            flag = true;
        }
        if (this.existingFormData.get('expiration') !== expiration) {
            this.existingFormData.set('isExpirationChanged', 'true');
            flag = true;
        }
        if (this.existingFormData.get('firstName') !== firstName) {
            this.existingFormData.set('isFirstNameChanged', 'true');
            flag = true;
        }
        if (this.existingFormData.get('lastName') !== lastName) {
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
    async getExistingPaymentInstrument(formType?:string) {
        const header = this.commonService.apiHeader();
        const requestData = this.getExistingPaymentInstrumentRequest();
        const url = this.config.envConfig.methodOfPaymentServiceUrl.url + this.config.envConfig.methodOfPaymentServiceUrl.getExistingPaymentInstrument;
        const response = await this.fetchData.post(url, header, requestData).catch((e)=>{
            console.log('Something went wrong:( ', e);
        });
        this.onExistingPaymentInstrumentCompletedHandler(response, formType);
        return response;
    }
    async onExistingPaymentInstrumentCompletedHandler(apiData: any, formType?:string) {
        const response = apiData;
        const personalInfo = getPersonalInfo(response, this.channel.channelData, CC);
        if (response) {
            if (response?.cpcStatus?.toLowerCase() === 'success' && response?.walletCardDetails !== null) {
                if(!formType) {
                    this.inputReference.cc.value = this.viewModel.cardInfo.ccNo = response?.walletCardDetails?.maskedCardNumber;
                    this.inputReference.cvv.value = this.viewModel.cardInfo.cvv = response?.walletCardDetails?.maskedCvv;
                    this.inputReference.expMM.value = this.viewModel.cardInfo.expMonth = response?.walletCardDetails?.expirationDate.substr(0, 2);
                    this.inputReference.expYY.value = this.viewModel.cardInfo.expYear = 20 + response?.walletCardDetails?.expirationDate.substr(2, 4);
                    this.inputReference.firstName.value = this.viewModel.personalInfo.firstName = personalInfo.firstName;
                    this.inputReference.lastName.value = this.viewModel.personalInfo.lastName = personalInfo.lastName;
                }
                const setElementReferenceCompleted = await this.setElementReference();
                if(setElementReferenceCompleted){
                    this.setInputReferenceValue(response);
                }
               
                // this.inputReference.state.setAttribute('fillState', response?.walletCardDetails?.billTo?.address?.state);
                //hold existing form data
                this.existingFormData.set('cpcStatus', response?.cpcStatus?.toLowerCase());
                this.existingFormData.set('cc', response?.walletCardDetails?.maskedCardNumber);
                this.existingFormData.set('cvv', response?.walletCardDetails?.maskedCvv);
                this.existingFormData.set('firstName', response?.walletCardDetails?.billTo?.name?.firstName);
                this.existingFormData.set('lastName', response?.walletCardDetails?.billTo?.name?.lastName);
                this.existingFormData.set('address', response?.walletCardDetails?.billTo?.address?.line1);
                this.existingFormData.set('addressLine2', response?.walletCardDetails?.billTo?.address?.line2);
                this.existingFormData.set('city', response?.walletCardDetails?.billTo?.address?.city);
                this.existingFormData.set('state', response?.walletCardDetails?.billTo?.address?.state);
                this.existingFormData.set('zipCode', response?.walletCardDetails?.billTo?.address?.zip);
                const cardType = response?.walletCardDetails?.cardType;
                this.existingFormData.set('cardType', cardType);
                this.existingFormData.set('expiration', response.walletCardDetails?.expirationDate);
                const enrollInAutoPay = document.querySelector('#jump-ach-web-component [name="jump-auto-pay-checkbox"]') as HTMLInputElement;
                const storedPayment = document.querySelector('#jump-ach-web-component [name="jump-tc-checkbox"]') as HTMLInputElement;
                this.existingFormData.set('enrollInAutoPay', enrollInAutoPay?.checked?.toString() || 'false');
                this.existingFormData.set('storedPayment', storedPayment?.checked?.toString() || 'false');
                this.formValidationService.bindCCValuesEdit(this.inputReference.cc.value, cardType);

                this.formValidationService.setErrorMap('cc', true);
                this.formValidationService.setErrorMap('cvv', true);
                this.formValidationService.setErrorMap('expMM', true);
                this.formValidationService.setErrorMap('firstName', true);
                this.formValidationService.setErrorMap('lastName', true);
                this.formValidationService.setErrorMap('address', true);
                this.formValidationService.setErrorMap('addressLine2', true);
                this.formValidationService.setErrorMap('city', true);
                this.formValidationService.setErrorMap('state', true);
                this.formValidationService.setErrorMap('zipCode', true);
            } else if (response?.cpcStatus?.toLowerCase() === 'error') {
                this.existingFormData.set('cpcStatus', response?.cpcStatus?.toLowerCase());
                
                if (this.errorHandling.isPsErrorCodeInNoWalletEntryList(response?.psErrorCode?.toString().toUpperCase())) {
                    const error = this.getErrorMessage(ErrorType.service, response?.psErrorCode);
                    const cpcErrorMessage = this.errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.form, MessageType.error, error);
                    this.errorHandling.showError(cpcErrorMessage, response?.psErrorMessage);
                }
            } else{
                console.log('getExistingPaymentInstrument - no data found!');
            } 
        } else {
            console.log('getExistingPaymentInstrument - no data found!');
        }
        //document.removeEventListener('jump-api-response-completed', this.onExistingPaymentInstrumentCompletedHandler); 
    }
    async setInputReferenceValue(response:any): Promise<void> {
        if(!this.inputReference?.address) {
            const addressId = '#jump-cc-web-component [name="jump-address"]';  
            const address = await waitForElementToLoad(addressId).then((addressElement:any) => {
                this.inputReference.address = addressElement;
                this.inputReference.address.value = response?.walletCardDetails?.billTo?.address?.line1;
            });
            console.log('!setInputReferenceValue: ',this.inputReference.address);
        } else {
            console.log('setInputReferenceValue');
            this.inputReference.address.value = response?.walletCardDetails?.billTo?.address?.line1;
        }
        if(!this.inputReference?.addressLine2) {
            const addressLine2Id = '#jump-cc-web-component [name="jump-line2"]';  
            const addressLine2 = await waitForElementToLoad(addressLine2Id).then((addressLine2Element:any) => {
                this.inputReference.addressLine2 = addressLine2Element;
                this.inputReference.addressLine2.value = response?.walletCardDetails?.billTo?.address?.line2;
            });
        } else {
            this.inputReference.addressLine2.value = response?.walletCardDetails?.billTo?.address?.line2;
        }
        if(!this.inputReference?.city) {
            const cityId = '#jump-cc-web-component [name="jump-city"]';  
            const city = await waitForElementToLoad(cityId).then((cityElement:any) => {
                this.inputReference.city = cityElement;
                this.inputReference.city.value = response?.walletCardDetails?.billTo?.address?.city;
            });
        } else {
            this.inputReference.city.value = response?.walletCardDetails?.billTo?.address?.city;
        }
        if(!this.inputReference?.state) {
            const stateId = '#jump-cc-web-component [name="jump-state"]';  
            const state = await waitForElementToLoad(stateId).then((stateElement:any) => {
                this.inputReference.state = stateElement;
                this.inputReference.state?.setAttribute('fillState', response?.walletCardDetails?.billTo?.address?.state);
                this.inputReference.state.value = response?.walletCardDetails?.billTo?.address?.state;
            });
        } else {
            this.inputReference.state?.setAttribute('fillState', response?.walletCardDetails?.billTo?.address?.state);
            this.inputReference.state.value = response?.walletCardDetails?.billTo?.address?.state;
        }
        if(!this.inputReference?.zipCode) {
            const zipCodeId = '#jump-cc-web-component [name="jump-zip-code"]';  
            const zipdeCode = await waitForElementToLoad(zipCodeId).then((zipCodeIdElement:any) => {
                this.inputReference.zipCode = zipCodeIdElement;
                this.inputReference.zipCode.value = response?.walletCardDetails?.billTo?.address?.zip;
            });
        } else {
            this.inputReference.zipCode.value = response?.walletCardDetails?.billTo?.address?.zip;
        }
    }
    async setElementReference():Promise<boolean> {  
        console.log('setElementReference cc address WithEdit');
        const inputRefPair:Array<IKeyValuePair> = new Array<IKeyValuePair>();

        inputRefPair.push({key: 'address', value:'#jump-cc-web-component [name="jump-address"]'});
        inputRefPair.push({key: 'addressLine2', value:'#jump-cc-web-component [name="jump-line2"]'});
        inputRefPair.push({key: 'city', value:'#jump-cc-web-component [name="jump-city"]'});
        inputRefPair.push({key: 'state', value:'#jump-cc-web-component [name="jump-state"]'});
        inputRefPair.push({key: 'zipCode', value:'#jump-cc-web-component [name="jump-zip-code"]'});
       
        const completeSetElement =  await this.formValidationService.setElementReference(inputRefPair);
        if(completeSetElement) {
            console.log('SetElementReferenceValid');
            return true;
        } else {
            console.log('SetElementReferenceError');
            return false;
        }
    }
    getExistingPaymentInstrumentRequest() {
        const request = JSON.stringify({
            'billingArrangementId': this.channel.channelData?.customerDetails.billingArrangementId,
            'channel': this.channel.channelData.channelDetails?.channelName,
            'customerId': this.channel.channelData.customerDetails?.walletId,
            'paymentToken': this.channel.channelData.customerDetails?.paymentToken
        });
        return request;
    }
    async updateExistingPaymentInstrument(cpcPageType: string) {
        this.channel.channelData.customerDetails.firstName = this.inputReference.firstName.value;
        this.channel.channelData.customerDetails.lastName = this.inputReference.lastName.value;        
        const header = this.commonService.apiHeader();
        const requestData = this.updateExistingPaymentInstrumentRequest();
        const url = this.config.envConfig.methodOfPaymentServiceUrl.url + this.config.envConfig.methodOfPaymentServiceUrl.updateExistingPaymentInstrument;
        const response = await this.fetchData.post(url,header,requestData).catch((e)=>{
            console.log('Something went wrong:( ', e);
        });
        this.onUpdateExistingPaymentInstrumentCompletedHandler(response,cpcPageType);
        
    }
    updateExistingPaymentInstrumentRequest() {
        const request = JSON.stringify({
            'enrollInAutopay':this.validations.isCheckBoxSelected('#jump-cc-web-component [name="jump-auto-pay-checkbox"]'),
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
                },
            },
            'customerDefinedName': this.channel.channelData.customerDetails.firstName + '-' + this.channel.channelData.customerDetails.lastName,
            'customerId': this.viewModel.walletId, // this.channel.channelData.customerDetails?.walletId,
            'bankDetails': {
                'defaultInstrument': null,
                'bankAccountType': null,
                'bankAccountLast4Digits': null,
                'maskedAccountNumber': null,
                'token': null,
            },
            'cardDetails': {
                'defaultInstrument': isSetAsDefaultPaymentCheckboxChecked(),
                'cardLast4Digits': this.viewModel.cardInfo.ccNo.slice(-4),
                'cardType': this.existingFormData.get('cardType'),
                'expirationDate': this.inputReference.expMM.value.substr(0, 2) + this.inputReference.expYY.value.substr(2, 4),
                'maskedCardNumber': this.existingFormData.get('cc'),
                'token': this.channel.channelData.customerDetails?.paymentToken,
            },
        });    
        return request;
    }
    removeErrorNodes() {
        this.removeErrorFeedback('firstName');
        this.removeErrorFeedback('lastName');
        this.removeErrorFeedback('cc');
        this.removeErrorFeedback('expMM');
        this.removeErrorFeedback('expYY');
        this.removeErrorFeedback('cvv');
    }
    validate(): boolean {
        let flag = true;
        this.formFieldStatusMap.set('default', flag);
        this.removeErrorNodes();
        if (this.isFormFieldsModified()) {
            if (this.existingFormData.get('isFirstNameChanged') === 'true') {
                if (this.inputReference?.firstName?.value) {
                    const isValid = flag = this.validations.validateFirstName(
                        this.inputReference.firstName.value,
                        this.channel?.channelData?.channelDetails?.customerClass
                    ).isValid;
                    if (isValid) {
                        this.viewModel.personalInfo.firstName = this.inputReference.firstName.value;
                        this.inputReference.firstName.classList.remove('is-invalid');
                    } else {
                        this.inputReference.firstName?.parentElement.append(this.appendErrorFeedback('firstName', this.getErrorMessage(ErrorType.first_name, ErrorType.invalid)));
                    }
                } else {
                    flag = false;
                    this.inputReference.firstName.classList.add('is-invalid');
                    //this.inputReference.firstName?.parentElement.append(this.appendErrorFeedback('firstName', this.getErrorMessage(ErrorType.first_name,ErrorType.no_value)));
                    this.inputReference.firstName?.parentElement.append(this.appendErrorFeedback('firstName', this.getErrorMessage(ErrorType.first_name, ErrorType.no_value)));
                    console.log(this.getErrorMessage(ErrorType.first_name, ErrorType.no_value));
                }
                this.formFieldStatusMap.set('firstName', flag);
            } else {
                this.formFieldStatusMap.set('firstName', true);
            }
            if (this.existingFormData.get('isLastNameChanged') === 'true') {
                if (this.inputReference?.lastName?.value) {
                    const isValid = flag = this.validations.validateLastName(
                        this.inputReference.lastName.value,
                        this.channel?.channelData?.channelDetails?.customerClass, PaymentType[PaymentType.CardOnly].toLowerCase()
                    ).isValid;
                    if (isValid) {
                        this.viewModel.personalInfo.lastName = this.inputReference.lastName.value;
                        this.inputReference.lastName.classList.remove('is-invalid');
                    } else {
                        this.inputReference.lastName?.parentElement.append(this.appendErrorFeedback('lastName', this.getErrorMessage(ErrorType.last_name, ErrorType.no_value)));
                    }
                } else if(this.channel?.channelData?.channelDetails?.customerClass === CUSTOMER_CLASS_BUSINESS 
                && !this.inputReference.lastName.value){
                    flag = flag ? true : flag;
                }  else {
                    flag = false;
                    this.inputReference.lastName.classList.add('is-invalid');
                    this.inputReference.lastName?.parentElement.append(this.appendErrorFeedback('lastName', this.getErrorMessage(ErrorType.last_name, ErrorType.no_value)));
                    console.log(this.getErrorMessage(ErrorType.last_name, ErrorType.no_value));
                }
                this.formFieldStatusMap.set('lastName', flag);
            } else {
                this.formFieldStatusMap.set('lastName', true);
            }
            if (this.existingFormData.get('isCcChanged') === 'true') {
                if (this.inputReference?.cc?.value) {
                    const result = this.validations.validateCC(this.inputReference.cc.value);
                    flag = result.isValid;
                    if (!result.isValid) {
                        this.inputReference.cvv.disabled = true;
                        this.inputReference.cc?.parentElement.append(this.appendErrorFeedback('cc', this.getErrorMessage(ErrorType.card_number, result.errorType)));
                    } else {
                        this.viewModel.cardInfo.ccNo = this.inputReference.cc.value;
                        this.inputReference.cc.classList.remove('is-invalid');
                        this.inputReference.cvv.disabled = false;
                    }
                } else {
                    flag = false;
                    this.inputReference.cc.classList.add('is-invalid');
                    this.inputReference.cc?.parentElement.append(this.appendErrorFeedback('cc', this.getErrorMessage(ErrorType.card_number, ErrorType.no_value)));
                    console.log(this.getErrorMessage(ErrorType.card_number, ErrorType.no_value));
                }
                this.formFieldStatusMap.set('cc', flag);
            } else {
                this.formFieldStatusMap.set('cc', true);
            }
            if (this.existingFormData.get('isExpirationChanged') === 'true') {
                if (this.inputReference?.expMM?.value) {
                    const isValid = flag = this.validations.validateExpMM(this.inputReference.expMM.value, this.inputReference.expYY.value);
                    if (isValid) {
                        this.viewModel.cardInfo.expMonth = this.inputReference.expMM.value;
                        this.inputReference.expMM.classList.remove('is-invalid');
                    } else {
                        this.inputReference.expMM?.parentElement.append(this.appendErrorFeedback('expMM', this.getErrorMessage(ErrorType.expiration_month_year, ErrorType.date_in_past)));
                    }
                } else {
                    flag = false;
                    this.inputReference.expMM.classList.add('is-invalid');
                    if (this.inputReference.expYY.value === '') {
                        this.inputReference.expMM?.parentElement.append(this.appendErrorFeedback('expMM', this.getErrorMessage(ErrorType.expiration_month_year, ErrorType.no_value)));
                    } else {
                        this.inputReference.expMM?.parentElement.append(this.appendErrorFeedback('expMM', this.getErrorMessage(ErrorType.expiration_month_year, ErrorType.no_value)));
                    }
                    console.log(this.getErrorMessage(ErrorType.expiration_month_year, ErrorType.date_in_past));
                }
                this.formFieldStatusMap.set('expMM', flag);
            } else {
                this.formFieldStatusMap.set('expMM', true);
            }
            if (this.existingFormData.get('isExpirationChanged') === 'true') {
                if (this.inputReference?.expYY?.value) {
                    const isValid = flag = this.validations.validateExpYY(this.inputReference.expYY.value, this.inputReference.expMM.value);
                    if (isValid) {
                        this.viewModel.cardInfo.expYear = this.inputReference.expYY.value;
                        this.inputReference.expYY.classList.remove('is-invalid');
                    }
                } else {
                    flag = false;
                    this.inputReference.expYY.classList.add('is-invalid');
                }
                this.formFieldStatusMap.set('expYY', flag);
            } else {
                this.formFieldStatusMap.set('expYY', true);
            }
            if (this.existingFormData.get('isCvvChanged') === 'true') {
                if (this.inputReference?.cvv?.value) {
                    const result = this.validations.validateExpCvv(this.inputReference.cvv.value, this.inputReference.cc.value);
                    flag = result.isValid;
                    if (result.isValid) {
                        this.viewModel.cardInfo.cvv = this.inputReference.cvv.value;
                        this.inputReference.cvv.classList.remove('is-invalid');
                    } else {
                        this.inputReference.cvv?.parentElement.append(this.appendErrorFeedback('cvv', this.getErrorMessage(ErrorType.security_code, result.errorType)));
                    }
                } else {
                    flag = false;
                    this.inputReference.cvv.classList.add('is-invalid');
                    this.inputReference.cvv?.parentElement.append(this.appendErrorFeedback('cvv', this.getErrorMessage(ErrorType.security_code, ErrorType.no_value)));
                    console.log(this.getErrorMessage(ErrorType.security_code, ErrorType.no_value));
                }
                this.formFieldStatusMap.set('cvv', flag);
            } else {
                this.formFieldStatusMap.set('cvv', true);
            }
            if(this.validations.isSetStoredPayment()) {
                if (this.existingFormData.get('isEnrollInAutoPayChanged') === 'true') {
                    if(!this.inputReference?.storedPayment) {
                        const storedPaymentCCElement = document.querySelector('#jump-cc-web-component [name="jump-tc-checkbox"]') as HTMLInputElement;
                        this.inputReference.storedPayment = storedPaymentCCElement;
                    }
                    if (this.inputReference?.storedPayment) {
                        flag = this.validations.validateAutoPayAndStoredPaymentCC();
                        if(!flag) {
                            flag = false;
                            const errorFeedBack = document.querySelector('#jump-cc-web-component [name="jump-tc-checkbox-feedback"]');
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
                    }                 
                    this.formFieldStatusMap.set('storedPayment', flag);
                } 
            }
            flag = this.formValidationService.isFormValid(this.formFieldStatusMap);
            if (flag === false) {
                const element: any = document.getElementsByClassName('invalid-feedback');
                element[0]?.parentElement?.scrollIntoView();
            }
            return flag;
        } else {
            return flag;
        }
    }
    onUpdateExistingPaymentInstrumentCompletedHandler(apiData: any, cpcPageType: string) {
        const response = apiData;
        const data = Object.assign({});
        data.channelData = this.channel.channelData;
        data.action = EVN_CPC_FORM_SUBMIT_RESPONSE;
        if (response) {
            console.log('updateExistingPaymentInstrument response! ', response);
            data.cpcData = response;
            data.channelData.paymentType = cpcPageType;
            parent.postMessage(JSON.stringify(data), CURRENT_CHANNEL_DOMAIN.URI);
            if (response?.submissionDetails?.cpcStatus?.toLowerCase() === 'success') {
                this.dataLayerService.dispatchInfoEvent(CPC_CARD_EDIT_API_SUBMIT, data?.cpcData?.submissionDetails);
            } else if (response?.submissionDetails?.cpcStatus?.toLowerCase() === 'error') {
                const error = this.getErrorMessage(ErrorType.service, response?.submissionDetails?.psErrorCode);
                const cpcErrorMessage = this.errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.form, MessageType.error, error);
                this.errorHandling.showError(cpcErrorMessage,'');
            }
        } else {
            console.log('updateExistingPaymentInstrument - no data found!');
        }
    }
    sendDummyResponse(cpcPageType: string) {
        const response: IUpdateInstrumentResponse = Object.assign({});
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

        if (response) {
            console.log('updateExistingPaymentInstrument dummy response! ', response);
            data.cpcData = response;
            data.channelData.paymentType = cpcPageType;
            parent.postMessage(JSON.stringify(data), CURRENT_CHANNEL_DOMAIN.URI);
        } else {
            console.log('updateExistingPaymentInstrument - no data found!');
        }
    }
    removeErrorFeedback(reference: string) {
        const parentId = this.inputReference[reference as keyof IInputReference].parentElement;
        const errFeedback = this.inputReference[reference as keyof IInputReference].name;
        if (parentId) {
            const selector = `[name='${errFeedback}-feedback']`;
            if (selector && parentId.querySelector(selector)) {
                parentId.querySelector(selector).remove();
            }
        }
    }
    appendErrorFeedback(reference: string, feedbackMsg: string): any {
        const nameField = this.inputReference[reference as keyof IInputReference].name;
        const div = document.createElement('div');
        div.setAttribute('name', nameField + '-feedback');
        div.classList.add('invalid-feedback');
        div.innerHTML = feedbackMsg;
        return div;
    }
    getErrorMessage(key: string, subKey?: string): string {
        let errorMessage = '';
        switch (key) {
        case ErrorType.service:
            errorMessage = this.global.getErrorMessage(ErrorType.service, subKey);
            break;
        case ErrorType.security_code:
            if (subKey === ErrorType.american_express || subKey === ErrorType.discover || subKey === ErrorType.mastercard || subKey === ErrorType.visa) {
                errorMessage = this.global.getErrorMessage(ErrorType.form, ErrorType.card, ErrorType.security_code, ErrorType.not_enough_digits, subKey);
            } else if (subKey === ErrorType.alpha_characters) {
                errorMessage = this.global.getErrorMessage(ErrorType.form, ErrorType.card, ErrorType.security_code, subKey);
            } else {
                errorMessage = this.global.getErrorMessage(ErrorType.form, ErrorType.card, ErrorType.security_code, ErrorType.invalid);
            }
            break;
        case ErrorType.stored_payment:  
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.stored_payment,ErrorType.invalid);
            break; 
        default:
            errorMessage = this.global.getErrorMessage(ErrorType.form, ErrorType.card, key, subKey);
            break;
        }
        return errorMessage;
    }
}