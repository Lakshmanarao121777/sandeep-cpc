import { AddressDetails, CPCContentType, ErrorType, IConfig, IInputReference, IKeyValuePair, MessageType, PaymentType } from '../model/view.model';
import { ErrorHandling } from '../utils/error-handling';
import { CommonService } from './common.service';
import { ACH, ACH_ONLY, ACH_ONLY_WITH_EDIT, BANK_OR_CARD, CARD_ONLY, CARD_ONLY_WITH_EDIT, CARD_OR_BANK, CARD_OR_EXISTING, CC, CPC_BANK_CARD_OR_EXISTING, CPC_BANK_EDIT_API_SUBMIT, CPC_CARD_BANK_OR_EXISTING, CPC_CARD_EDIT_API_SUBMIT, CPC_DEFAULT_ERROR_MESSAGE, CURRENT_CHANNEL_DOMAIN, CUSTOMER_CLASS_BUSINESS, EVN_CPC_ERROR, EVN_CPC_FORM_SUBMIT_RESPONSE, IGUARD_CAPTURED_FIELDS_ACH, IGUARD_CAPTURED_FIELDS_CC, JUMP_IGUARD_ACH_METHOD, JUMP_IGUARD_CC_METHOD, JUMP_IGUARD_SERVICE, USER_ROLE_ERROR_MAP } from '../constant/app.constant';
import { FormValidationService } from './form-validation-service';
import { Validation } from '../utils/validation';
import { DataLayerService } from './data-layer.service';
import { IViewModel } from './../model/viewModel/view-model';
import { BaseAccountTypeService } from './base-account-type-service';
import { ChannelService } from './channel-service';
import { SERVICE_CHECKING_VALUE, SERVICE_CORPORATE_CHECKING_VALUE, SERVICE_SAVINGS_VALUE } from '../constant/bank-account-type';
import { isSetAsDefaultPaymentCheckboxChecked } from './viewModel/util/set-as-default-instrument-util';
import { getUserRoleUtil, isStoredPaymentComponentChecked  } from './viewModel/util/userrole-util';
import { IAddressModel } from '../model/address-model';
import { waitForElementToLoad } from '../../src/utils/elementLoader';
declare const smartcti: any;
export class CareService extends BaseAccountTypeService {
    public inputReference: IInputReference = Object.assign({});
    public viewModel: IViewModel = Object.assign({});
    public config: IConfig = Object.assign({});
    public validations = new Validation();
    public commonService = new CommonService(Object.assign({}));
    public formFieldStatusMap: Map<string, boolean>;
    public formValidationService: FormValidationService;
    public existingFormData: Map<string, string>;
    public dataLayerService: DataLayerService;
    public isIGuardCapturedData = false;
    public paymentToken = '';
    public keyName = '';
    public iguardEnvironment = '';
    public iguardChannel = '';
    public careFor = '';
    public userrole = '';
    public isIguardUtilized = false;
    constructor(config: IConfig, channel: ChannelService, type: string, errorMessageResponse: any, commonService: CommonService, errorHandling: ErrorHandling, careFor: string) {
        super(config, channel, type, errorMessageResponse, errorHandling);
        this.commonService = commonService;
        this.formValidationService = new FormValidationService();
        this.formFieldStatusMap = new Map<string, boolean>();
        this.existingFormData = new Map<string, string>();
        this.dataLayerService = new DataLayerService();
        this.existingFormData = new Map<string, string>();
        this.config = config;
        this.careFor = careFor;
        console.log('care-service construtor');
    }
    removeErrorFeedback(reference: string) {
        const parentId = this.inputReference[reference as keyof IInputReference]?.parentElement;
        const errFeedback = this.inputReference[reference as keyof IInputReference]?.name;
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
    appendErrorUserroleFeedback(reference:any, feedbackMsg: string): any {
        const nameField =  reference;
        const div = document.createElement('div');
        div.setAttribute('name', nameField + '-feedback');
        div.classList.add('jump-userrole-invalid-feedback');
        div.innerHTML = feedbackMsg;
        return div;
    } 
    removeErrorUserroleFeedback(reference:any, errFeedback:string): any {
        const parentId = reference?.parentElement;
        if(parentId){
            const selector = `[name='${errFeedback}-feedback']`;
            if(selector && parentId.querySelector(selector)) {
                parentId.querySelector(selector).remove();
            }
        }
        if(reference){
            reference?.classList?.remove('is-invalid');
        }
    } 
    removeErrorNodes() {
        this.removeErrorFeedback('firstName');
        this.removeErrorFeedback('lastName');
        if(this.inputReference.newAddressOption && this.inputReference.newAddressOption.checked === true){
            this.removeErrorFeedback('address');
            this.removeErrorFeedback('addressLine2');
            this.removeErrorFeedback('city');
            this.removeErrorFeedback('state');
            this.removeErrorFeedback('zipCode');
        }
        if (this.careFor === CC) {
            this.removeErrorFeedback('cc');
            this.removeErrorFeedback('expMM');
            this.removeErrorFeedback('expYY');
            this.removeErrorFeedback('cvv');

            this.inputReference.cc.classList.remove('is-invalid');
            this.inputReference.expMM.classList.remove('is-invalid');
            this.inputReference.expYY.classList.remove('is-invalid');
            this.inputReference.cvv.classList.remove('is-invalid');
        } else if (this.careFor === ACH) { 
            this.removeErrorFeedback('accountNo');
            this.removeErrorFeedback('routingNo');

            this.inputReference.accountNo.classList.remove('is-invalid');
            this.inputReference.routingNo.classList.remove('is-invalid');
        }
    }
    private removeErrorNode() {
        const errorElement = document.getElementById('jump-error-template');
        if (errorElement) {
            errorElement.remove();
        }
    }
    getEnv(): string {
        return this.config.envConfig.cpcEnv?.toLowerCase();
    }
    isIguardAllowed(): boolean {
        const iGuardChannel = this.channel.channelData?.config?.iguard?.channelName?.toLowerCase();
        const mappedChannelEnvironmentKeynameMapping = this.config?.channelEnvironmentKeynameMapping?.filter((ct: any) => { return ct.channel?.toLowerCase() === iGuardChannel; });
        if (Array.isArray(mappedChannelEnvironmentKeynameMapping) && mappedChannelEnvironmentKeynameMapping.length > 0) {
            this.keyName = mappedChannelEnvironmentKeynameMapping[0]?.keyName;
            this.iguardEnvironment = mappedChannelEnvironmentKeynameMapping[0]?.iguardEnvironment;
            this.iguardChannel = mappedChannelEnvironmentKeynameMapping[0]?.channel;
            if (this.keyName) {
                return true;
            }
        }
        return false;
    }

    async displayCareActions(): Promise<any> {
        const cpcPageType:string = this.global.appState.get('config').cpcPageType.toLowerCase();
        if (this.isIguardAllowed()) {
            let cache = Object.assign({});

            if(cpcPageType === CARD_ONLY.toLowerCase() || cpcPageType === CARD_ONLY_WITH_EDIT.toLowerCase() || cpcPageType === CARD_OR_EXISTING.toLowerCase()) {
                cache = await this.iGuardEntryCc();
            }
            if(cpcPageType === ACH_ONLY.toLowerCase() || cpcPageType === ACH_ONLY_WITH_EDIT.toLowerCase()) {
                cache = await this.iGuardEntryAch();
            }
            if(cpcPageType === CARD_OR_BANK.toLowerCase() || cpcPageType === BANK_OR_CARD.toLowerCase() || cpcPageType === CPC_CARD_BANK_OR_EXISTING.toLowerCase() || cpcPageType === CPC_BANK_CARD_OR_EXISTING.toLowerCase()) {
                const cacheCc = await this.iGuardEntryCc();
                cache = await this.iGuardEntryAch();
                cache.iguardEntryOrManualEntryCc = cacheCc.iguardEntryOrManualEntryCc;
                cache.agentEntryCc = cacheCc.agentEntryCc;
                cache.customerEntryCc = cacheCc.customerEntryCc;
            }
            // this.formActions(cache, true);
            if (cache?.iguardEntryOrManualEntryCc) {
                cache?.iguardEntryOrManualEntryCc?.classList.remove('d-none');
                cache?.iguardEntryOrManualEntryCc?.classList.add('show');
                cache.customerEntryCc?.addEventListener('click', (e: any) => {
                    e.preventDefault();
                    this.removeErrorNode();
                    this.bindIguardBtnEvents(cache, true, CC);
                });
                if (this.channel.channelData.config?.enableManualEntry) {
                    cache.agentEntryCc?.addEventListener('click', (e: any) => {
                        e.preventDefault();
                        this.removeErrorNode();
                        this.bindIguardBtnEvents(cache, false, CC);
                    });
                } else {
                    cache.agentEntryCc.classList.add('disabled');
                    cache.agentEntryCc.setAttribute('disabled', true);
                }
            }
            if (cache?.iguardEntryOrManualEntryAch) {
                cache?.iguardEntryOrManualEntryAch?.classList.remove('d-none');
                cache?.iguardEntryOrManualEntryAch?.classList.add('show');
                cache.customerEntryAch?.addEventListener('click', (e: any) => {
                    e.preventDefault();
                    this.removeErrorNode();
                    this.bindIguardBtnEvents(cache, true, ACH);
                });
                if (this.channel.channelData.config?.enableManualEntry) {
                    cache.agentEntryAch?.addEventListener('click', (e: any) => {
                        e.preventDefault();
                        this.removeErrorNode();
                        this.bindIguardBtnEvents(cache, false, ACH);
                    });
                } else {
                    cache.agentEntryAch.classList.add('disabled');
                    cache.agentEntryAch.setAttribute('disabled', true);
                }
            }
        } else {
            const err = 'Channel '.concat(this.channel.channelData?.config?.iguard?.channelName).concat(' is not configured for iGuard');
            const cpcMessage = this.errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.config, MessageType.error, CPC_DEFAULT_ERROR_MESSAGE);
            this.errorHandling.showError(cpcMessage, err);
        }
    }
    async iGuardEntryAch():Promise <any> {
        const cache = Object.assign({});
        cache.iguardEntryOrManualEntryAch = document.querySelectorAll('#jump-ach-web-component [name="jump-iguard-entry-selection"]')[0];
        if(!cache.iguardEntryOrManualEntryAch) {
            const iguardEntryOrManualEntryAchId = '#jump-ach-web-component [name="jump-iguard-entry-selection"]';
            cache.iguardEntryOrManualEntryAch = await waitForElementToLoad(iguardEntryOrManualEntryAchId).then((element:any) => {
                return element;
            });
            const agentEntryAchId = '#jump-ach-web-component [name="jump-agent-entry"]';
            cache.agentEntryAch = await waitForElementToLoad(agentEntryAchId).then((element:any) => {
                return element;
            });
            const customerEntryAchId = '#jump-ach-web-component [name="jump-customer-entry"]';
            cache.customerEntryAch = await waitForElementToLoad(customerEntryAchId).then((element:any) => {
                return element;
            });
        } else {
            cache.agentEntryAch = document.querySelector('#jump-ach-web-component [name="jump-agent-entry"]');
            cache.customerEntryAch = document.querySelector('#jump-ach-web-component [name="jump-customer-entry"]');
        }
        return cache;
    }
    async iGuardEntryCc():Promise <any> {
        const cache = Object.assign({});
        cache.iguardEntryOrManualEntryCc = document.querySelectorAll('#jump-cc-web-component [name="jump-iguard-entry-selection"]')[0];
        if(!cache.iguardEntryOrManualEntryCc) {
            const iguardEntryOrManualEntryCcId = '#jump-cc-web-component [name="jump-iguard-entry-selection"]';
            cache.iguardEntryOrManualEntryCc = await waitForElementToLoad(iguardEntryOrManualEntryCcId).then((element:any) => {
                return element;
            });
            const agentEntryCcId = '#jump-cc-web-component [name="jump-agent-entry"]';
            cache.agentEntryCc = await waitForElementToLoad(agentEntryCcId).then((element:any) => {
                return element;
            });
            const customerEntryCcId = '#jump-cc-web-component [name="jump-customer-entry"]';
            cache.customerEntryCc = await waitForElementToLoad(customerEntryCcId).then((element:any) => {
                return element;
            });
        } else {
            cache.agentEntryCc = document.querySelector('#jump-cc-web-component [name="jump-agent-entry"]');
            cache.customerEntryCc = document.querySelector('#jump-cc-web-component [name="jump-customer-entry"]');
        }
        return cache;
    }
    bindIguardBtnEvents(cache:any, status:boolean, formType:string):void{
        this.isIguardUtilized = status;
        this.formActions(cache, status);
        if(status){
            this.loadIGuardConfigurations(formType);
        }
    }
    formActions(cache: any, status: boolean) {
        // this.clearForm();
        this.removeErrorNodes();
        this.blockunBlockFromFields(status);
    }
    clearForm(): any {
        if (this.careFor === CC) {
            this.inputReference.cc.value = this.viewModel.cardInfo.ccNo = '';
            this.inputReference.cvv.value = this.viewModel.cardInfo.cvv = '';
            this.inputReference.expMM.value = this.viewModel.cardInfo.expMonth = '';
            this.inputReference.expYY.value = this.viewModel.cardInfo.expYear = '';
            this.formValidationService.bindCCValuesEdit(this.inputReference.cc.value, '');
        } else if (this.careFor === ACH) { 
            this.inputReference.accountNo.value = this.viewModel.accountInfo.accountNo = '';
            this.inputReference.routingNo.value = this.viewModel.accountInfo.routingNo = '';
        }
        this.inputReference.address.value = this.viewModel.personalInfo.addressInfo.address = '';
        this.inputReference.addressLine2.value = this.viewModel.personalInfo.addressInfo.addressLine2 = '';
        this.inputReference.city.value = this.viewModel.personalInfo.addressInfo.city = '';
        this.inputReference.state.value = this.viewModel.personalInfo.addressInfo.state = '';
        this.inputReference.zipCode.value = this.viewModel.personalInfo.addressInfo.zipCode = '';
    }
    blockunBlockFromFields(value: boolean) {
        if (this.careFor === CC) {
            this.inputReference.cc.disabled = value;
            this.inputReference.expMM.disabled = value;
            this.inputReference.expYY.disabled = value;
        } else if (this.careFor === ACH) { 
            this.inputReference.accountNo.disabled = value;
            this.inputReference.routingNo.disabled = value;
        }
    }
    loadIGuardConfigurations(formType:string) {
        this.removeErrorNodes();
        this.initializeSmartCTI(formType);
    }

    isIguardInitilized() {
        if (Object.keys(smartcti).length > 0) {
            return true;
        }
        return false;
    }
    getDontClearFlag(): boolean {
        if (this.channel.channelData?.config?.iguard?.dontClearTags) {
            return this.channel.channelData?.config?.iguard?.dontClearTags;
        }
        return false;
    }
    getHeaders(): any {
        return {
            sourceServerId: this.channel.channelData?.channelDetails?.sourceServerId,
            sourceSystemId: this.channel.channelData?.channelDetails?.sourceSystemId,
            //present Iguard is availbe in test env in XFINITY_MOBILEIG only
            channel: this.iguardChannel,
            trackingId: this.channel.channelData?.channelDetails?.trackingId,
            timestamp: this.channel.channelData?.channelDetails?.timestamp,
            sessionId: this.channel.channelData?.channelDetails?.sessionId,
            Accept: 'application/json'
        };
    }
    getBillInfo(): any {
        const address = {
            address : this.existingFormData.get('address'),
            addressLine2 :  this.existingFormData.get('addressLine2'),
            city :  this.existingFormData.get('city'),
            state :  this.existingFormData.get('state'),
            zip : this.existingFormData.get('zipCode') ,
        };

        return {
            address: {
                city: address?.city,
                country: 'US',
                line1: address?.address,
                line2: address?.addressLine2,
                state: address?.state,
                zip: address?.zip
            },
            contact: {
                emailAddress: this.channel.channelData?.config?.iguard?.email,
                phone: this.channel.channelData?.config?.iguard?.phoneNumber
            },
            name: {
                firstName :  this.viewModel.personalInfo?.firstName,
                lastName: this.viewModel.personalInfo.lastName
            }
        };
    }

    prepareIguardInitData(formType:string, userrole:string): any {
        return {
            captureFields: formType === CC ? IGUARD_CAPTURED_FIELDS_CC : IGUARD_CAPTURED_FIELDS_ACH,
            bypass: {
                enabled: this.channel.channelData?.config?.iguard?.bypass?.enabled,
                keypad: this.channel.channelData?.config?.iguard?.bypass?.keypad,
                nocall: this.channel.channelData?.config?.iguard?.bypass?.nocall
            },
            auditData: {
                accountNumber: this.channel.channelData?.customerDetails?.billingArrangementId, //'12345',
                amount: this.channel.channelData.paymentAmount
            },
            dataProcessor: {
                service: JUMP_IGUARD_SERVICE,
                method: formType === CC ? JUMP_IGUARD_CC_METHOD : JUMP_IGUARD_ACH_METHOD,
                environment: this.iguardEnvironment,
                timeout: 30,
                parameters: {
                    dontClearTags: this.getDontClearFlag(),
                    headers: this.getHeaders(),
                    payload: {
                        billingInfo: {
                            billingArrangementId: this.channel.channelData?.customerDetails?.billingArrangementId,
                            market: null,
                            region: null
                        },
                        customerId: userrole ,
                        enableDecisionManager: this.channel.channelData?.channelDetails?.enableFraudManager,
                        keyName: this.keyName,
                        orderInfo: {
                            channelCustomData: this.channel.channelData?.channelCustomData
                        },
                        ...this.getPayload(formType),
                        secure: true
                    }
                }
            },
            ...this.getPosition(),
            complete: (data: any) => {
                this.processIGuardCaturedData(data, formType);
            },
            error: (data: any) => {
                const cpcMessage = this.errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.config, MessageType.error, CPC_DEFAULT_ERROR_MESSAGE);
                this.errorHandling.showError(cpcMessage, CPC_DEFAULT_ERROR_MESSAGE);  
                return data;
            }
        };
    }
    getPosition():any{
        if(this.channel.channelData.config?.iguard?.enableIguardIntegration){
            if(this.channel.channelData.config?.iguard?.position){
                return {
                    position : this.channel.channelData.config?.iguard?.position
                };
            }
        }
    }

    initializeSmartCTI(formType:string) {
        this.removeErrorNode();

        if (this.isIguardInitilized()) {
            this.setPersonalInfo(['firstname', 'lastname']);
            this.setAddressInfo(formType);
            const userrole = this.getUserrole(formType);
            if(this.validate(true, formType)){
                smartcti.initialize({
                    agent: this.channel.channelData?.config?.iguard?.agentDetails,
                });
                const iguardConfig = this.prepareIguardInitData(formType,userrole);
                smartcti?.collect(iguardConfig);
            }
        } else {
            const err = 'Iguard Not Initialized';
            const cpcMessage = this.errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.config, MessageType.error, err);
            this.errorHandling.showError(cpcMessage, err);
        }
    }

    getPayload(formType:string): any {
        if (formType === CC) {
            return {
                paymentCard: {
                    billTo: this.getBillInfo(),
                    cardNumber: null,
                    cardType: null,
                    customerDefinedName: this.viewModel.personalInfo?.firstName + '-' + this.viewModel.personalInfo.lastName,
                    defaultInstrument: this.getDefaultPaymentInstrument(),
                    expirationDate: null,
                    cvv: null,
                    maskedInstrumentNumber: null
                }
            };
        } else if (formType === ACH) { 
            return {
                bank: {
                    billTo: this.getBillInfo(),
                    customerDefinedName: this.viewModel.personalInfo?.firstName + '-' + this.viewModel.personalInfo.lastName,
                    accountNumber: null,
                    routingNumber: null,
                    accountType: this.getAccountType(),
                    defaultInstrument: this.getDefaultPaymentInstrument(),
                    maskedInstrumentNumber: null
                }
            };
        }
    }
    setPersonalInfo(fields: string[]): void {
        fields.forEach(field => {
            if (field === 'firstname') {
                if (this.inputReference.firstName.value !== '') {
                    this.viewModel.personalInfo.firstName = this.inputReference.firstName.value;
                } else {
                    this.viewModel.personalInfo.firstName = this.channel.channelData?.customerDetails?.firstName;
                }
                this.existingFormData.set('firstName', this.viewModel.personalInfo.firstName);
            } else {
                if (field === 'lastname') {
                    if (this.inputReference.lastName.value !== '') {
                        this.viewModel.personalInfo.lastName = this.inputReference.lastName.value;
                    } else {
                        this.viewModel.personalInfo.lastName = this.channel.channelData?.customerDetails?.lastName;
                    }
                }
                this.existingFormData.set('lastName', this.viewModel.personalInfo.lastName);
            }
        });
    }
    setAddressInfo(formType:string){
        this.inputReference.address = document.querySelector(`#jump-${formType}-web-component [name="jump-address"]`);
        this.inputReference.addressLine2 = document.querySelector(`#jump-${formType}-web-component [name="jump-line2"]`);
        this.inputReference.city = document.querySelector(`#jump-${formType}-web-component [name="jump-city"]`);
        this.inputReference.state = document.querySelector(`#jump-${formType}-web-component [name="jump-state"]`);
        this.inputReference.zipCode = document.querySelector(`#jump-${formType}-web-component [name="jump-zip-code"]`);
        if(formType === CC){
            this.inputReference.newAddressOption =  document.querySelector('#newAddressOptionCc [name="jump-address-option"]');
        }else if(formType === ACH){
            this.inputReference.newAddressOption =  document.querySelector('#newAddressOptionAch [name="jump-address-option"]');
        }
        const addressInfo:IAddressModel = {
            address:'',
            addressLine2:'',
            city:'',
            zipCode:'',
            state:''
        };
        this.viewModel.personalInfo = {
            ...this.viewModel.personalInfo,
            ...{
                addressInfo: addressInfo
            }
        };

        const defaultAddress = this.channel.channelData?.customerDetails?.addressList?.filter((address) => { return address.defaultAddress; });
        const address:AddressDetails = defaultAddress && defaultAddress[0];
        const isNewAddressSelected = (this.inputReference.newAddressOption && this.inputReference.newAddressOption.checked === true);
        if (this.inputReference.address?.value !== '' &&  isNewAddressSelected) {
            this.viewModel.personalInfo.addressInfo.address = this.inputReference.address?.value;
        } else {
            if(address){
                this.viewModel.personalInfo.addressInfo.address = address.address;
            }else{
                this.viewModel.personalInfo.addressInfo.address = this.channel.channelData?.customerDetails?.address;
            }
        }
        this.existingFormData.set('address',  this.viewModel.personalInfo.addressInfo.address);

        if (this.inputReference.addressLine2?.value !== '' &&  this.inputReference.addressLine2?.value && isNewAddressSelected) {
            this.viewModel.personalInfo.addressInfo.addressLine2 = this.inputReference.addressLine2?.value;
        } else {
            if(address){
                this.viewModel.personalInfo.addressInfo.addressLine2 =address.addressLine2;
            }else{
                this.viewModel.personalInfo.addressInfo.addressLine2 = this.channel.channelData?.customerDetails?.addressLine2;
            }
        }
        this.existingFormData.set('addressLine2',  this.viewModel.personalInfo.addressInfo.addressLine2);

        if (this.inputReference.city?.value !== '' &&  this.inputReference.city?.value &&  isNewAddressSelected) {
            this.viewModel.personalInfo.addressInfo.city = this.inputReference.city?.value;
        } else {
            if(address){
                this.viewModel.personalInfo.addressInfo.city =address.city;
            }else{
                this.viewModel.personalInfo.addressInfo.city = this.channel.channelData?.customerDetails?.city;
            }
        }
        this.existingFormData.set('city',  this.viewModel.personalInfo.addressInfo.city);

        if (this.inputReference.state?.value !== '' &&  this.inputReference.state?.value &&  isNewAddressSelected) {
            this.viewModel.personalInfo.addressInfo.state = this.inputReference.state?.value;
        } else {
            if(address){
                this.viewModel.personalInfo.addressInfo.state =address.state;
            }else{
                this.viewModel.personalInfo.addressInfo.state = this.channel.channelData?.customerDetails?.state;
            }
        }
        this.existingFormData.set('state',  this.viewModel.personalInfo.addressInfo.state);

        if (this.inputReference.zipCode?.value !== '' &&  this.inputReference.zipCode?.value &&  isNewAddressSelected) {
            this.viewModel.personalInfo.addressInfo.zipCode = this.inputReference.zipCode?.value;
        } else {
            if(address){
                this.viewModel.personalInfo.addressInfo.zipCode =address.zip;
            }else{
                this.viewModel.personalInfo.addressInfo.zipCode = this.channel.channelData?.customerDetails?.zip;
            }
        }
        this.existingFormData.set('zipCode',  this.viewModel.personalInfo.addressInfo.zipCode);
    }
    setAccountInfo(): any {
        this.viewModel.accountInfo.accountTypeChecking = this.inputReference.accountTypeChecking?.checked;
        this.existingFormData.set('accountTypeChecking', this.viewModel.accountInfo.accountTypeChecking?.toString());
        this.viewModel.accountInfo.accountTypeCorporateChecking = this.inputReference.accountTypeCorporateChecking?.checked;
        this.existingFormData.set('accountTypeCorporateChecking', this.viewModel.accountInfo.accountTypeCorporateChecking?.toString());
        this.viewModel.accountInfo.accountTypeSaving = this.inputReference.accountTypeSaving?.checked;
        this.existingFormData.set('accountTypeSaving', this.viewModel.accountInfo.accountTypeSaving?.toString());
    }

    processIGuardCaturedData(iguardResponse: any, formType:string) {
        const response = iguardResponse;
        const flag = false;
        if (response.error) {
            const cpcMessage = this.errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.backend, MessageType.error, response.error);
            this.errorHandling.showError(cpcMessage, response.error);
            return false;
        }
        if (response?.additionalData?.statusCode === 200) {
            if (response?.additionalData?.payload.token) {
                this.paymentToken = response?.additionalData?.payload.token;
                this.channel.channelData.customerDetails.paymentToken = response?.additionalData?.payload.token;
                if (formType === CC) {
                    this.processCcData(response);
                } else if (formType === ACH) { 
                    this.processAchData(response);
                }
                this.inputReference.firstName.value = this.viewModel.personalInfo?.firstName;
                this.inputReference.lastName.value = this.viewModel.personalInfo?.lastName;
                this.formValidationService.setErrorMap('firstName', true);
                this.formValidationService.setErrorMap('lastName', true);

            } else {
                const cpcMessage = this.errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.backend, MessageType.error, CPC_DEFAULT_ERROR_MESSAGE);
                this.errorHandling.showError(cpcMessage, response.additionalData?.error);
            }
        } else {
            const errorMessages = Object.keys(response.additionalData?.error?.payload?.messages);
            const err = {
                statusCode : response.additionalData?.statusCode,
                message : JSON.stringify(response.additionalData?.error?.payload?.messages)
            };
            const cpcMessage = this.errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.backend, MessageType.error, CPC_DEFAULT_ERROR_MESSAGE);
            this.errorHandling.showError(cpcMessage, err.message);
            return false;
        }
    }
    
    processCcData(response: any) {
        let cvv = Object.assign({});
        response?.captureFields?.map((captureField: any) => {
            if (captureField.name?.toLowerCase() === 'cvv') {
                cvv = captureField.maskedValue;
            }
        });

        this.inputReference.cc.value = this.viewModel.cardInfo.ccNo = response?.additionalData?.payload.maskedAccountNumber;
        this.inputReference.cvv.value = this.viewModel.cardInfo.cvv = cvv;
        this.inputReference.expMM.value = this.viewModel.cardInfo.expMonth = response?.additionalData?.payload?.expirationDate.substr(0, 2);
        this.inputReference.expYY.value = this.viewModel.cardInfo.expYear = 20 + response?.additionalData?.payload?.expirationDate.substr(2, 4);

        this.existingFormData.set('cpcStatus', response?.additionalData.statusCode);
        this.existingFormData.set(CC, response?.additionalData?.payload.maskedAccountNumber);
        this.existingFormData.set('cvv', cvv);
        const cardType = response?.additionalData?.payload?.cardType;
        this.existingFormData.set('cardType', cardType?.toLowerCase());
        this.existingFormData.set('expiration', response.additionalData.payload.expirationDate);

        this.formValidationService.bindCCValuesEdit(this.inputReference.cc.value, cardType);

        this.formValidationService.setErrorMap(CC, true);
        this.formValidationService.setErrorMap('cvv', true);
        this.formValidationService.setErrorMap('expMM', true);

        this.isIGuardCapturedData = true;
    }
    processAchData(response: any) {
        let routingnumber = Object.assign({});
        response?.captureFields?.map((captureField: any) => {
            if (captureField.name?.toLowerCase() === 'ROUTINGNUMBER'.toLowerCase()) {
                routingnumber = captureField.maskedValue;
            }
        });

        this.inputReference.accountNo.value = this.viewModel.accountInfo.accountNo = response?.additionalData?.payload.bankAccountLast4Digits;
        this.inputReference.routingNo.value = this.viewModel.accountInfo.routingNo = routingnumber;
        this.viewModel.accountInfo.accountTypeCorporateChecking = this.inputReference.accountTypeCorporateChecking?.checked;
        this.viewModel.accountInfo.accountTypeChecking = this.inputReference.accountTypeChecking?.checked;
        this.viewModel.accountInfo.accountTypeSaving = this.inputReference.accountTypeSaving?.checked;

        this.existingFormData.set('cpcStatus', response?.additionalData.statusCode);
        this.existingFormData.set('bankAccountType', response?.additionalData?.payload.bankAccountType);
        this.existingFormData.set('bankAccountLast4Digits', response?.additionalData?.payload.bankAccountLast4Digits);  
        this.existingFormData.set('maskedAccountNumber', response?.additionalData?.payload.maskedAccountNumber);
        this.existingFormData.set('routingNo', response?.additionalData?.payload.routingnumber);

        this.formValidationService.bindAccountNoValuesEdit(response?.additionalData?.payload.maskedAccountNumber);

        this.formValidationService.setErrorMap('accountNo', true);
        this.formValidationService.setErrorMap('routingNo', true);

        this.isIGuardCapturedData = true;
    }
    validate(isPreLoad =true, formType:string): boolean {
        let flag = true;
        this.formFieldStatusMap.set('default', flag);
        this.removeErrorNodes();
        /** Validate First Name */
        if (this.inputReference?.firstName?.value) {
            const isValid = flag = this.validations.validateFirstName(
                this.inputReference.firstName.value,
                this.channel?.channelData?.channelDetails?.customerClass
            ).isValid;
            if (isValid) {
                this.inputReference.firstName?.classList.remove('is-invalid');
            } else {
                this.inputReference.firstName?.parentElement.append(this.appendErrorFeedback('firstName', this.getErrorMessage(ErrorType.first_name, ErrorType.invalid)));
            }
        } else {
            flag = false;
            this.inputReference.firstName?.classList.add('is-invalid');
            //this.inputReference.firstName?.parentElement.append(this.appendErrorFeedback('firstName', this.getErrorMessage(ErrorType.first_name,ErrorType.no_value)));
            this.inputReference.firstName?.parentElement.append(this.appendErrorFeedback('firstName', this.getErrorMessage(ErrorType.first_name, ErrorType.no_value)));
        }
        this.formFieldStatusMap.set('firstName', flag);

        /** Validate Lastname */
        if (this.inputReference?.lastName?.value) {
            const isValid = flag = this.validations.validateLastName(
                this.inputReference.lastName.value,
                this.channel?.channelData?.channelDetails?.customerClass, PaymentType[PaymentType.CardOnly].toLowerCase()
            ).isValid;
            if (isValid) {
                this.inputReference.lastName?.classList.remove('is-invalid');
            } else {
                this.inputReference.lastName?.parentElement.append(this.appendErrorFeedback('lastName', this.getErrorMessage(ErrorType.last_name, ErrorType.no_value)));
            }
        } else if (this.channel?.channelData?.channelDetails?.customerClass === CUSTOMER_CLASS_BUSINESS
            && !this.inputReference.lastName?.value) {
            flag = flag ? true : flag;
        } else {
            flag = false;
            this.inputReference.lastName.classList.add('is-invalid');
            this.inputReference.lastName?.parentElement.append(this.appendErrorFeedback('lastName', this.getErrorMessage(ErrorType.last_name, ErrorType.no_value)));
        }
        this.formFieldStatusMap.set('lastName', flag);
        
        if(!isPreLoad){
            if (formType === CC) {
                if (this.isIGuardCapturedData) {
                    flag = true;
                    this.formFieldStatusMap.set('CC', true);
                    this.formFieldStatusMap.set('expMM', true);
                    this.formFieldStatusMap.set('expYY', true);
                    this.formFieldStatusMap.set('cvv', true);

                } else {
                    this.formFieldStatusMap.set('cvv', false);

                    flag = false;
                    this.inputReference.cc.classList.add('is-invalid');
                    this.inputReference.cc?.parentElement.append(this.appendErrorFeedback(CC, this.getErrorMessage(ErrorType.card_number, ErrorType.no_value)));

                    this.formFieldStatusMap.set(CC, flag);


                    flag = false;
                    this.inputReference.expMM.classList.add('is-invalid');
                    if (this.inputReference.expYY.value === '') {
                        this.inputReference.expMM?.parentElement.append(this.appendErrorFeedback('expMM', this.getErrorMessage(ErrorType.expiration_month_year, ErrorType.no_value)));
                    } else {
                        this.inputReference.expMM?.parentElement.append(this.appendErrorFeedback('expMM', this.getErrorMessage(ErrorType.expiration_month_year, ErrorType.no_value)));
                    }

                    this.formFieldStatusMap.set('expMM', flag);


                    flag = false;
                    this.inputReference.expYY.classList.add('is-invalid');

                    this.formFieldStatusMap.set('expYY', flag);

                    flag = false;
                    this.inputReference.cvv.classList.add('is-invalid');
                    this.inputReference.cvv?.parentElement.append(this.appendErrorFeedback('cvv', this.getErrorMessage(ErrorType.security_code, ErrorType.no_value)));

                    this.formFieldStatusMap.set('cvv', flag);

                }
            }  else if (formType === ACH) { 
                if (this.isIGuardCapturedData) {
                    flag = true;
                    this.formFieldStatusMap.set('accountNo', true);
                    this.formFieldStatusMap.set('routingNo', true);
                } else {
                    flag = false;
                    this.inputReference.routingNo.classList.add('is-invalid');
                    this.inputReference.routingNo.parentElement.append(
                        this.appendErrorFeedback('routingNo', this.getErrorMessage(ErrorType.routing_number, ErrorType.no_value))
                    );

                    this.formFieldStatusMap.set('routingNo', flag);
                    flag = false;
                    this.inputReference.accountNo.classList.add('is-invalid');
                    this.inputReference.accountNo.parentElement.append(
                        this.appendErrorFeedback('accountNo', this.getErrorMessage(ErrorType.bank_account_number, ErrorType.no_value))
                    );

                    this.formFieldStatusMap.set('accountNo', flag);
                }
            }
        }
        if (this.inputReference.newAddressOption && this.inputReference.newAddressOption.checked === true) {
            if (this.inputReference?.address?.value) {
                const isValid = flag = this.validations.validateAddress(
                    this.inputReference.address.value
                ).isValid;
                if (isValid) {
                    this.inputReference.address?.classList.remove('is-invalid');
                } else {
                    this.inputReference.address?.parentElement.append(this.appendErrorFeedback('address', this.getErrorMessage(ErrorType.address_line_1, ErrorType.invalid)));
                }
            } else {
                flag = false;
                this.inputReference.address?.classList.add('is-invalid');
                this.inputReference.address?.parentElement.append(this.appendErrorFeedback('address', this.getErrorMessage(ErrorType.address_line_1, ErrorType.no_value)));
            }
            this.formFieldStatusMap.set('address', flag);
            
            if (this.inputReference?.addressLine2?.value) {
                const isValid = flag = this.validations.validateAddressLine2(this.inputReference.addressLine2.value);
                if (isValid) {
                    this.inputReference.addressLine2?.classList.remove('is-invalid');
                } else {
                    this.inputReference.addressLine2?.parentElement.append(this.appendErrorFeedback('addressLine2', this.getErrorMessage(ErrorType.address_line_2, ErrorType.invalid)));
                }
            } else {
                flag = false;
                this.inputReference.addressLine2?.classList.add('is-invalid');
                this.inputReference.addressLine2?.parentElement.append(this.appendErrorFeedback('addressLine2', this.getErrorMessage(ErrorType.address_line_2, ErrorType.no_value)));
            }
            this.formFieldStatusMap.set('addressLine2', flag);
            
            if (this.inputReference?.city?.value) {
                const isValid = flag = this.validations.validateCity(
                    this.inputReference.city.value
                ).isValid;
                if (isValid) {
                    this.inputReference.city?.classList.remove('is-invalid');
                } else {
                    this.inputReference.city?.parentElement.append(this.appendErrorFeedback('city', this.getErrorMessage(ErrorType.city, ErrorType.invalid)));
                }
            } else {
                flag = false;
                this.inputReference.city?.classList.add('is-invalid');
                this.inputReference.city?.parentElement.append(this.appendErrorFeedback('city', this.getErrorMessage(ErrorType.city, ErrorType.no_value)));
            }
            this.formFieldStatusMap.set('city', flag);
            
            if (this.inputReference?.state?.value) {
                const isValid = flag = this.validations.validateState(
                    this.inputReference.state.value
                );
                if (isValid) {
                    this.inputReference.state?.classList.remove('is-invalid');
                } else {
                    this.inputReference.state?.parentElement.append(this.appendErrorFeedback('state', this.getErrorMessage(ErrorType.state, ErrorType.invalid)));
                }
            } else {
                flag = false;
                this.inputReference.state?.classList.add('is-invalid');
                this.inputReference.state?.parentElement.append(this.appendErrorFeedback('state', this.getErrorMessage(ErrorType.state, ErrorType.no_value)));
            }
            this.formFieldStatusMap.set('state', flag);
            
            if (this.inputReference?.zipCode?.value) {
                const isValid = flag = this.validations.validateZipcode(
                    this.inputReference.zipCode.value
                ).isValid;
                if (isValid) {
                    this.inputReference.zipCode?.classList.remove('is-invalid');
                } else {
                    this.inputReference.zipCode?.parentElement.append(this.appendErrorFeedback('zipCode', this.getErrorMessage(ErrorType.zip, ErrorType.invalid)));
                }
            } else {
                flag = false;
                this.inputReference.zipCode?.classList.add('is-invalid');
                this.inputReference.zipCode?.parentElement.append(this.appendErrorFeedback('zipCode', this.getErrorMessage(ErrorType.zip, ErrorType.no_value)));
            }
            this.formFieldStatusMap.set('zipCode', flag);
        } else{
            const defaultAddress = this.channel.channelData?.customerDetails?.addressList?.filter((address) => { return address.defaultAddress; });
            const address:AddressDetails = defaultAddress&&defaultAddress[0];
            if(address){
                this.formFieldStatusMap.set('address', true);
                this.formFieldStatusMap.set('addressLine2', true);
                this.formFieldStatusMap.set('city', true);
                this.formFieldStatusMap.set('state', true);
                this.formFieldStatusMap.set('zipCode', true);
            }
        }
        if(isStoredPaymentComponentChecked(formType.toLowerCase())){
            const userrole:string = this.getUserrole(formType.toLowerCase());
            const componnetId = '#jump-'+formType.toLowerCase()+'-web-component [id="jump-userrole-list"]';
            const element = document.querySelector(componnetId);
            this.removeErrorUserroleFeedback(element, 'jump-userrole-list-'+formType.toLowerCase());
            if(this.validations.isUserRoleValid(userrole, formType.toLowerCase())){
                flag = true;
                element?.parentElement?.classList.remove('jump-userrole-invalid-feedback');
            }else{
                flag = false;
                element?.parentElement?.classList.add('jump-userrole-invalid-feedback');
                element?.parentElement?.append(this.appendErrorUserroleFeedback('jump-userrole-list-'+formType.toLowerCase(), this.getErrorMessage(ErrorType.userrole,ErrorType.no_value)));
            }
            this.formFieldStatusMap.set(USER_ROLE_ERROR_MAP, flag);
        }
        if(!isPreLoad){
            flag = this.formValidationService.isFormValid(this.formFieldStatusMap);
        }else{
            flag = this.isFormValid(this.formFieldStatusMap);
        }
        if (flag === false) {
            const element: any = document.getElementsByClassName('invalid-feedback');
            element[0]?.parentElement.scrollIntoView();
        }
        return flag;
    }
    isFormValid(isAllFormFieldValidMap: Map<string, boolean>): boolean {
        let flag = true;
        for(const value of isAllFormFieldValidMap.values()){
            if(!value){
                flag = false;
                break;
            }
        }
        return flag; 
    }

    getAccountType() {

        this.inputReference.accountTypeCorporateChecking = document.querySelector('[id="jump-acc-type-corporate-checking"]');
        this.inputReference.accountTypeSaving = document.querySelector('[id="jump-acc-type-saving"]');
        this.inputReference.accountTypeChecking = document.querySelector('[id="jump-acc-type-checking"]');
        this.setAccountInfo();

        return this.inputReference.accountTypeCorporateChecking?.checked ? SERVICE_CORPORATE_CHECKING_VALUE : this.inputReference.accountTypeChecking?.checked ? SERVICE_CHECKING_VALUE : SERVICE_SAVINGS_VALUE;
    }
    getAutoPayEnroll() {
        const flag = false;
        let component = '';
        if (this.careFor.toLowerCase() === CC) {
            component = 'jump-cc-web-component';
        } else if (this.careFor === ACH) { 
            component = 'jump-ach-web-component';
        }
        const enrollInAutoPay = document.querySelector('#' + component + ' [name="jump-auto-pay-checkbox"]') as HTMLInputElement;
        if (enrollInAutoPay?.checked) {
            return true;
        } else if (!enrollInAutoPay?.checked) {
            return false;
        }
    }
    
    getDefaultPaymentInstrument() {
        const flag = isSetAsDefaultPaymentCheckboxChecked();
        this.existingFormData.set('defaultInstrument', flag.toString());
        return flag;
    }

    getUserrole(formType:string):string{
        const walletId = getUserRoleUtil(this.channel, formType, ''); 
        this.existingFormData.set('walletId', walletId.toString());
        this.userrole = walletId.toString();
        return walletId;
    }

    onUpdateExistingPaymentInstrumentCompletedHandler(apiData: any, cpcPageType: string) {
        const response = apiData;
        const data = Object.assign({});
        data.channelData = this.channel.channelData;
        data.action = EVN_CPC_FORM_SUBMIT_RESPONSE;
        if (response) {
            console.log('updateExistingPaymentInstrument response! ', response);
            if (response?.submissionDetails?.cpcStatus?.toLowerCase() === 'success') {
                data.cpcData = response;
                data.channelData.paymentType = cpcPageType;
                if (this.careFor === CC) {
                    this.dataLayerService.dispatchInfoEvent(CPC_CARD_EDIT_API_SUBMIT, data?.cpcData?.submissionDetails);
                } else if (this.careFor === ACH) { 
                    this.dataLayerService.dispatchInfoEvent(CPC_BANK_EDIT_API_SUBMIT, data?.cpcData?.submissionDetails);
                }
                parent.postMessage(JSON.stringify(data), CURRENT_CHANNEL_DOMAIN.URI);
            } else if (response?.submissionDetails?.cpcStatus?.toLowerCase() === 'error') {
                const error = this.getErrorMessage(ErrorType.service, response?.submissionDetails?.psErrorCode);
                const cpcErrorMessage = this.errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.backend, MessageType.error, error);
                this.errorHandling.showError(cpcErrorMessage, '');
            }
        } else {
            console.log('updateExistingPaymentInstrument - no data found!');
        }
    }
    async updateExistingPaymentInstrument(cpcPageType: string, vm: IViewModel, formType:string) {
        this.channel.channelData.customerDetails.firstName = vm.personalInfo.firstName;
        this.channel.channelData.customerDetails.lastName = vm.personalInfo.lastName;
        const header = this.commonService.apiHeader();
        const requestData = this.updateExistingPaymentInstrumentRequest(vm, formType);
        const url = this.config.envConfig.methodOfPaymentServiceUrl.url + this.config.envConfig.methodOfPaymentServiceUrl.updateExistingPaymentInstrument;
        const response = await this.fetchData.post(url, header, requestData).catch((e) => {
            console.log('Something went wrong:( ', e);
        });
        this.onUpdateExistingPaymentInstrumentCompletedHandler(response, cpcPageType);

    }
    updateExistingPaymentInstrumentRequest(vm: IViewModel, formType:string) {
        const request = JSON.stringify({
            'enrollInAutopay': this.getAutoPayEnroll(),
            'channel': this.channel.channelData?.channelDetails?.channelName,
            'paymentToken': this.paymentToken,
            'billTo': {
                'address': {
                    'city': vm.personalInfo.addressInfo.city,
                    'country': 'US',
                    'line1': vm.personalInfo.addressInfo.address,
                    'line2': vm.personalInfo.addressInfo.addressLine2,
                    'state': vm.personalInfo.addressInfo.state,
                    'zip': vm.personalInfo.addressInfo.zipCode,
                },
                'contact': {
                    'emailAddress': this.channel.channelData.customerDetails?.emailAddress,
                    'phone': this.channel.channelData.customerDetails?.phone
                },
                'name': {
                    'firstName': vm.personalInfo.firstName,
                    'lastName': vm.personalInfo.lastName,
                },
            },
            'customerDefinedName': vm.personalInfo.firstName + '-' + vm.personalInfo.lastName,
            'customerId': this.userrole, // this.channel.channelData?.customerDetails?.walletId,
            'bankDetails': this.prepareACHRequestData(formType),
            'cardDetails': this.prepareCCRequestData(formType),
        });
        return request;
    }
    prepareCCRequestData(formType:string): any {
        const isCard = formType === CC;
        return {
            'defaultInstrument': isCard ? this.getDefaultPaymentInstrument() : null,
            'cardLast4Digits': isCard ? this.viewModel.cardInfo.ccNo.slice(-4) : null,
            'cardType': isCard ? this.existingFormData.get('cardType') : null,
            'expirationDate': isCard ? this.inputReference.expMM.value.substr(0, 2) + this.inputReference.expYY.value.substr(2, 4) : null,
            'maskedCardNumber': isCard ? this.existingFormData.get(CC) : null,
            'token': isCard ? this.paymentToken : null,
        };
    }
    prepareACHRequestData(formType:string): any {
        const isCard = formType === CC;
        return {
            'defaultInstrument': isCard ? null : this.getDefaultPaymentInstrument(),
            'bankAccountType': isCard ? null : this.getAccountType(),
            'bankAccountLast4Digits': isCard ? null : this.existingFormData.get('bankAccountLast4Digits'),
            'maskedAccountNumber': isCard ? null : this.existingFormData.get('maskedAccountNumber'),
            'token': isCard ? null : this.paymentToken,
        };
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
    isPersonalnfoModified(vm: IViewModel): boolean {
        let flag = false;
        if (this.existingFormData.get('firstName') !== vm.personalInfo?.firstName) {
            this.existingFormData.set('isFirstNameChanged', 'true');
            flag = true;
        }
        if (this.existingFormData.get('lastName') !== vm.personalInfo?.lastName) {
            this.existingFormData.set('isLastNameChanged', 'true');
            flag = true;
        }
        return flag;
    }
    defaultPaymentUpdated(vm: IViewModel): boolean {
        let flag = false;
        if (this.existingFormData.get('defaultInstrument') !== isSetAsDefaultPaymentCheckboxChecked().toString()) {
            this.existingFormData.set('isDefaultInstrumentChanged', 'true');
            flag = true;
        }
        return flag;
    }
    isAccountTypeModified(vm: IViewModel): boolean {
        let flag = false;
        if (this.existingFormData.get('accountTypeChecking') !== vm.accountInfo?.accountTypeChecking && vm.accountInfo?.accountTypeChecking) {
            this.existingFormData.set('isAccountTypeChange', 'true');
            flag = true;
        }
        if (this.existingFormData.get('accountTypeSaving') !== vm.accountInfo?.accountTypeSaving && vm.accountInfo?.accountTypeSaving) {
            this.existingFormData.set('isAccountTypeChange', 'true');
            flag = true;
        }
        if (this.existingFormData.get('accountTypeCorporateChecking') !== vm.accountInfo?.accountTypeCorporateChecking && vm.accountInfo?.accountTypeCorporateChecking) {
            this.existingFormData.set('isAccountTypeChange', 'true');
            flag = true;
        }
        return flag;
    }
    isFormDataUpdated(vm: IViewModel): boolean {
        let flag = false;
        if (this.isAddressModified(vm)) {
            flag = true;
        }
        if (this.isPersonalnfoModified(vm)) {
            flag = true;
        }
        if (this.defaultPaymentUpdated(vm)) {
            flag = true;
        }
        if (this.careFor === ACH) {
            if (this.isAccountTypeModified(vm)) {
                flag = true;
            }
        }
        return flag;
    }
    
    getExistingPaymentInstrumentRequest() {
        const request = JSON.stringify({
            'billingArrangementId': this.channel.channelData?.customerDetails.billingArrangementId,
            'channel': this.channel.channelData.channelDetails?.channelName,
            'customerId':  this.existingFormData.get('walletId'),
            'paymentToken': this.paymentToken
        });
        return request;
    }
    
    async getExistingPaymentInstrument() {
        const header = this.commonService.apiHeader();
        const requestData = this.getExistingPaymentInstrumentRequest();
        const url = this.config.envConfig.methodOfPaymentServiceUrl.url + this.config.envConfig.methodOfPaymentServiceUrl.getExistingPaymentInstrument;
        const response = await this.fetchData.post(url, header, requestData).catch((e)=>{
            console.log('Something went wrong:( ', e);
        });
        return response;
    }
    
    async sendDummyResponse(cpcPageType: string, formType:string) {
        const response: any = Object.assign({});
        const responseData:any =await this.getExistingPaymentInstrument();
        response.submissionDetails = Object.assign({});
        response.submissionDetails.cpcStatus = 'SUCCESS';
        response.submissionDetails.cpcMessage = 'No change in the existing information found, no api call has been made.';
        response.submissionDetails.psErrorCode = '';
        response.submissionDetails.psErrorMessage = '';
        response.submissionDetails.trackingId = this.viewModel.formSubmitChannelData.channelDetails.trackingId;
        response.submissionDetails.actionTaken = 'no_change';
        response.submissionDetails.methodOfPaymentType = '';
        response.autopayDetails= null;
        response.bankDetails= {
            bankAccountLast4Digits: formType === ACH ? responseData?.walletBankDetails?.bankAccountLast4Digits : null,
            bankAccountType:formType === ACH ? responseData?.walletBankDetails?.accountType :  null,
            defaultInstrument: formType === ACH ? responseData?.walletBankDetails?.defaultInstrument : false,
            maskedAccountNumber:formType === ACH ? responseData?.walletBankDetails?.maskedAccountNumber :  null,
            routingNumber: formType === ACH ? responseData?.walletBankDetails?.routingNumber : null,
            token:formType === ACH ? responseData?.walletBankDetails?.token :  null
        },
        response.cardDetails= {
            avsCode:formType === CC ? responseData?.walletCardDetails?.avsCode : null,
            cardLast4Digits: formType === CC ?  responseData?.walletCardDetails?.cardLast4Digits : null,
            cardType: formType === CC ?  responseData?.walletCardDetails?.cardType :null,
            defaultInstrument: formType === CC ? this.existingFormData.get('defaultInstrument'):false,
            expirationDate: formType === CC ?  responseData?.walletCardDetails?.expirationDate :null,
            maskedCardNumber:formType === CC ? responseData?.walletCardDetails?.maskedCardNumber : null,
            token: formType === CC ?  responseData?.walletCardDetails?.token : null
        },
        response.contractDetails= null,
        response.customerDetails= {
            firstName: this.existingFormData.get('firstName'),
            lastName: this.existingFormData.get('lastName')
        };
        response.customerId=this.existingFormData.get('walletId');

        const data = Object.assign({});
        data.channelData = this.channel.channelData;
        data.action = EVN_CPC_FORM_SUBMIT_RESPONSE;

        if (response) {
            console.log('updateExistingPaymentInstrument dummy response! ', response);
            data.cpcData = response;
            data.channelData.paymentType = cpcPageType;
            data.paymentInfo=  {
                address:formType === CC ?  responseData?.walletCardDetails?.billTo.address.address: responseData?.walletBankDetails?.billTo.address.address,
                addressLine2:formType === CC ? responseData?.walletCardDetails?.billTo.address.addressLine2: responseData?.walletBankDetails?.billTo.address.addressLine2,
                city:formType === CC ? responseData?.walletCardDetails?.billTo.address.city: responseData?.walletBankDetails?.billTo.address.city,
                state:formType === CC ?  responseData?.walletCardDetails?.billTo.address.state: responseData?.walletBankDetails?.billTo.address.state,
                zipCode:formType === CC ? responseData?.walletCardDetails?.billTo.address.zip: responseData?.walletBankDetails?.billTo.address.zip,
                ...response.customerDetails
            };
            parent.postMessage(JSON.stringify(data), CURRENT_CHANNEL_DOMAIN.URI);
        } else {
            console.log('updateExistingPaymentInstrument - no data found!');
        }
    }
    getErrorMessage(key:string, subKey?:string): string { 
        const currentTemplate = this.global.appState.get('currentPaymentSubType');
        let validationType:ErrorType = ErrorType.card;
        if(currentTemplate){
            if(currentTemplate.toLowerCase() === PaymentType.CardOnly.toString().toLowerCase()){
                validationType = ErrorType.card;
            } else if(currentTemplate.toLowerCase() === PaymentType.AchOnly.toString().toLowerCase()){
                validationType = ErrorType.bank;
            }
        }        
        let errorMessage = '';
        switch(key){
             
        case ErrorType.userrole:  
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.userrole,ErrorType.no_value);
            break; 
        default:
            errorMessage = this.global.getErrorMessage(ErrorType.form,validationType, key,subKey);
            break;
        }

        return errorMessage;
    } 
}
