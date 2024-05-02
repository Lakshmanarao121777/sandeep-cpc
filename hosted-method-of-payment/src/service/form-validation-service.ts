import { CPC_BANK_STATE_SELECT, CPC_CARD_EXP_MM_SELECT, CPC_CARD_EXP_YY_SELECT, CPC_CARD_STATE_SELECT, CURRENT_CHANNEL_DOMAIN, EVN_CPC_ERROR, EXPIRATION_YEAR, EXPIRATION_MONTH, STORED_PAYMENT, CARD_ONLY_WITH_EDIT, ACH_ONLY_WITH_EDIT, ITEM_KEY_FIRST_NAME, ITEM_KEY_LAST_NAME, ITEM_KEY_STATE, ITEM_KEY_ADDRESS_LINE_2, WALLET_MGMT_NO_AUTOPAY, CARD_ONLY, ACH_ONLY, MIN_ACH_ONLY, MIN_CARD_ONLY, MIN_CARD_ONLY_WITH_EDIT, CC, USER_ROLE_ERROR_MAP, ACH, MAX_LENGTH_VISA_AND_DISCOVER, MAX_LENGTH_AMEX, MAX_LENGTH_MASTERCARD, MAX_LENGTH_VISA_AND_DISCOVER_TRAILS, MAX_LENGTH_AMEX_TRAILS, CPC_AMERICAN_EXPRESS, CPC_VISA } from '../constant/app.constant';
import {  ErrorType, IError, IInputReference, IKeyValuePair, MessageType, PaymentType } from '../model/view.model';
import { IViewModel} from '../model/viewModel/view-model';
import { pasteEvent } from '../utils/event-handling';
import { Validation } from '../utils/validation';
import { getCardType, getCardTypes, getCardTypesEdit } from '../utils/card-type';
import { DataLayerService } from './data-layer.service';
import { Globals } from '../utils/globals';
import { ErrorHandling } from '../utils/error-handling';
import { ChannelService } from './channel-service';
import { IPersonalInfoModel } from '../model/personal-info-model';
import { IAddressModel } from '../model/address-model';
import { ICardOnlyModel } from '../model/card-only-model';
import { IAchOnlyModel } from '../model/ach-only-model';
import { getUserRoleUtil } from './viewModel/util/userrole-util';
/* eslint @typescript-eslint/no-var-requires: "off" */
const valid = require('card-validator');

export class FormValidationService { 
    private global:Globals;
    public inputReference: IInputReference = Object.assign({});
    public viewModel: IViewModel = Object.assign({});
    public paymentType:PaymentType = Object.assign({});
    private errorMap: Map<string, boolean>= new Map<string, boolean>();    
    private inputFieldErrPair:Array<IKeyValuePair> = new Array<IKeyValuePair>();
    private validations = new Validation();
    private dataLayerService:DataLayerService;
    public errorHandling = Object.assign({}); 
    private channelService:ChannelService = Object.assign({});
    constructor(channelService?:ChannelService) {
        this.global = Globals.getInstance();
        if(channelService){
            this.channelService = channelService;
        }    
        this.dataLayerService = new DataLayerService();
        this.errorHandling = new ErrorHandling(this.channelService); 
        // this.viewModel.personalInfo = Object.assign({});
        // this.viewModel.cardInfo = Object.assign({});
        // this.viewModel.accountInfo = Object.assign({});

    }
    initFormErrorMap(formElements:Array<IKeyValuePair>){
        if(formElements && formElements.length>0) {
            this.inputFieldErrPair = formElements;
            this.inputFieldErrPair.forEach(item => {
                this.errorMap.set(item.key, this.isErrorMapValid(item.key)); 
            });            
        }        
    }
    isErrorMapValid(itemKey:any):any {
        const cpcPageType = this.global.appState.get('config').cpcPageType.toLowerCase();
        const isAddressOverRide = this.global.appState.get('channelData')?.config?.displayAddressOverride;
        const channelData = this.global.appState.get('channelData');
        const addressKeys = ['address','city','state','zipCode'];
        if(cpcPageType === CARD_ONLY_WITH_EDIT.toLowerCase() || cpcPageType === ACH_ONLY_WITH_EDIT.toLowerCase()) {
            if(isAddressOverRide === false) {
                return true;
            } else {
                if(addressKeys.includes(itemKey) && itemKey !== 'storedPayment') {
                    return false;
                } else {
                    return true;
                }
            }
        }
        const newAddressCC:any = document.querySelector('#newAddressOptionCc [name="jump-address-option"]') as HTMLInputElement;
        const newAddressACH:any = document.querySelector('#newAddressOptionAch [name="jump-address-option"]') as HTMLInputElement;
        const termsAndConditionsCC:any = document.querySelector('#jump-cc-web-component [name="jump-tc-checkbox"]') as HTMLInputElement;
        const termsAndConditionsACH:any = document.querySelector('#jump-ach-web-component [name="jump-tc-checkbox"]') as HTMLInputElement;
        const newAddressCCTemplate:any = document.querySelector('#jump-cc-web-component [name="jump-address-template"]') as HTMLInputElement;
        const newAddressACHTemplate:any = document.querySelector('#jump-ach-web-component [name="jump-address-template"]') as HTMLInputElement;

        if(newAddressCCTemplate?.classList?.contains('show')) {
            this.errorMap.set('address', false);
            this.errorMap.set('city', false);
            this.errorMap.set('state', false);
            this.errorMap.set('zipCode', false);
        }
        if(newAddressACHTemplate?.classList?.contains('show')) {
            this.errorMap.set('address', false);
            this.errorMap.set('city', false);
            this.errorMap.set('state', false);
            this.errorMap.set('zipCode', false);
        }
      
        newAddressCC?.addEventListener('click',():void => {
            if(itemKey === 'addressLine2') {
                this.errorMap.set(itemKey, true);
            } else {
                if(cpcPageType === WALLET_MGMT_NO_AUTOPAY.toLowerCase()) {
                    const isCCTermsAndConditionsChecked = termsAndConditionsCC.checked;
                    this.errorMap.set('storedPayment', isCCTermsAndConditionsChecked);
                } else {
                    this.errorMap.set('storedPayment', true);
                }
                this.errorMap.set(itemKey, false);
            }
        });
        newAddressACH?.addEventListener('click',():void => {
            if(itemKey === 'addressLine2') {
                this.errorMap.set(itemKey, true);
            } else {
                if(cpcPageType === WALLET_MGMT_NO_AUTOPAY.toLowerCase()) {
                    const isACHTermsAndConditionsChecked = termsAndConditionsACH.checked;
                    this.errorMap.set('storedPayment', isACHTermsAndConditionsChecked);
                } else {
                    this.errorMap.set('storedPayment', true);
                }
                this.errorMap.set(itemKey, false);
            }
        });
        if(isAddressOverRide === false) {
            if(itemKey === 'addressLine2' || itemKey === 'storedPayment' && cpcPageType !== WALLET_MGMT_NO_AUTOPAY.toLowerCase()) {
                return true;
            } else {
                this.errorMap.set('address', false);
                this.errorMap.set('city', false);
                this.errorMap.set('state', false);
                this.errorMap.set('zipCode', false);
                if(cpcPageType === WALLET_MGMT_NO_AUTOPAY.toLowerCase()) {
                    this.errorMap.set('storedPayment', false);
                } else {
                    this.errorMap.set('storedPayment', true);
                }
                return false ;
            } 
        } 
        else {
            if(addressKeys.includes(itemKey) || itemKey === 'addressLine2' || itemKey === 'storedPayment') {
                return true;
            } else {
                if(itemKey === '') {
                    return true;
                }
                return false;
            }
        }
    }
    setErrorMap(key:string, value:any) {
        if(this.errorMap.has(key)) {
            this.errorMap.delete(key);
            this.errorMap.set(key,value);
        }
    }
    getErrorMap(key:string): boolean | undefined {                
        return this.errorMap.get(key);        
    }    
    bindOnBlur() {
        const data = Object.assign({});
        data.action = EVN_CPC_ERROR;   
        
        this.inputFieldErrPair.forEach(item => {
            this.inputReference[item.key as keyof IInputReference]?.addEventListener('blur', () => {
                const cpcPageType = this.global.appState.get('config').cpcPageType.toLowerCase();
                const customerClass = this.global.appState.get('channelData')?.channelDetails?.customerClass;
                const isAddressOverRide = this.global.appState.get('channelData')?.config?.displayAddressOverride;

                let isFormFieldValid:boolean | undefined = true;
                isFormFieldValid = this.errorMap.get(item.key);
                this.isAddressOverRideSetErrorMap(isAddressOverRide);
              
                if(item.key === STORED_PAYMENT && cpcPageType !== WALLET_MGMT_NO_AUTOPAY.toLowerCase()) {
                    this.errorMap.set(STORED_PAYMENT, true);
                } else {
                    const termsAndConditionsCC:any = document.querySelector('#jump-cc-web-component [name="jump-tc-checkbox"]') as HTMLInputElement;
                    const termsAndConditionsACH:any = document.querySelector('#jump-ach-web-component [name="jump-tc-checkbox"]') as HTMLInputElement;
                    const pageTypeCard = document.getElementById('card-style-box');
                    if(pageTypeCard?.classList.contains('show')) {
                        if(cpcPageType === WALLET_MGMT_NO_AUTOPAY.toLowerCase()) {
                            const isCCTermsAndConditionChecked = termsAndConditionsCC?.checked;
                            if(isCCTermsAndConditionChecked) {                                
                                this.errorMap.set(STORED_PAYMENT, isCCTermsAndConditionChecked);
                                const userorle = getUserRoleUtil(this.global.appState.get('channelData'), CC.toLowerCase(), '');
                                if(userorle){
                                    this.errorMap.set(USER_ROLE_ERROR_MAP, true);
                                }else{
                                    this.errorMap.set(USER_ROLE_ERROR_MAP, false);
                                }
                            } else {
                                this.errorMap.set(STORED_PAYMENT, false);
                                this.errorMap.set(USER_ROLE_ERROR_MAP, true);
                            }
                        } else {
                            this.errorMap.set(STORED_PAYMENT, true);
                            this.errorMap.set(USER_ROLE_ERROR_MAP, true);
                        }  
                    } else {
                        if(cpcPageType === WALLET_MGMT_NO_AUTOPAY.toLowerCase()) {
                            const isACHTermsAndConditionChecked = termsAndConditionsACH?.checked;
                            if(isACHTermsAndConditionChecked) {
                                this.errorMap.set(STORED_PAYMENT, isACHTermsAndConditionChecked);
                                const userorle = getUserRoleUtil(this.global.appState.get('channelData'), ACH.toLowerCase(), '');
                                if(userorle){
                                    this.errorMap.set(USER_ROLE_ERROR_MAP, true);
                                }else{
                                    this.errorMap.set(USER_ROLE_ERROR_MAP, false);
                                }
                            } else {
                                this.errorMap.set(STORED_PAYMENT, false);
                                this.errorMap.set(USER_ROLE_ERROR_MAP, true);
                            }
                        } else {
                            this.errorMap.set(STORED_PAYMENT, true);
                            this.errorMap.set(USER_ROLE_ERROR_MAP, true);
                        }
                    }
                }
                data.isFormValid = this.isValid();
                if(item.key === EXPIRATION_YEAR) {
                    this.checkExp(EXPIRATION_MONTH.toLowerCase());
                    this.checkExp(EXPIRATION_YEAR.toLowerCase());              
                }
                if(item.key === EXPIRATION_MONTH) {
                    this.checkExp(EXPIRATION_MONTH.toLowerCase());
                    // this.checkExp(EXPIRATION_YEAR.toLowerCase());
                }
            
                if(cpcPageType === CARD_ONLY_WITH_EDIT.toLowerCase() || cpcPageType === ACH_ONLY_WITH_EDIT.toLowerCase()) {
                    if(this.inputReference[item.key as keyof IInputReference]) {
                        if(item.key?.toLowerCase() === ITEM_KEY_FIRST_NAME.toLowerCase()) {
                            isFormFieldValid = this.validations.validateFirstName(this.inputReference[item.key as keyof IInputReference]?.value,customerClass).isValid;
                        }
                        if(item.key?.toLowerCase() === ITEM_KEY_LAST_NAME.toLowerCase() && cpcPageType === ACH_ONLY_WITH_EDIT?.toLowerCase()) {
                            isFormFieldValid = this.validations.validateLastName(this.inputReference[item.key as keyof IInputReference]?.value,customerClass, 'achonly').isValid;
                        }
                        if(item.key?.toLowerCase() === ITEM_KEY_LAST_NAME.toLowerCase() && cpcPageType === CARD_ONLY_WITH_EDIT?.toLowerCase()) {
                            isFormFieldValid = this.validations.validateLastName(this.inputReference[item.key as keyof IInputReference]?.value,customerClass, 'cardonly').isValid;
                        }
                        if(isFormFieldValid) {
                            this.inputReference[item.key as keyof IInputReference].classList.remove('is-invalid');
                            this.removeErrorFeedback(item.key);
                        } 
                    }
                }
                if(isFormFieldValid) {
                    this.inputReference[item.key as keyof IInputReference].classList.remove('is-invalid');
                    this.removeErrorFeedback(item.key);
                }
                if(item.key?.toLowerCase() === ITEM_KEY_ADDRESS_LINE_2.toLowerCase() && this.inputReference[item.key as keyof IInputReference]?.value === '') {
                    isFormFieldValid = true;
                    this.handleErrorClass(item.key,isFormFieldValid as boolean,item.key,item.value);
                }
                if(item.key?.toLowerCase() === ITEM_KEY_STATE.toLowerCase() && this.inputReference[item.key as keyof IInputReference].value) {
                    isFormFieldValid = true;                   
                }
                if(item.key?.toLowerCase() === EXPIRATION_YEAR.toLowerCase() && this.inputReference[item.key as keyof IInputReference].value) {
                    isFormFieldValid = true;                   
                }
                if(item.key?.toLowerCase() === ITEM_KEY_LAST_NAME.toLowerCase()) {
                    isFormFieldValid = this.validations.validateLastName(this.inputReference[item.key as keyof IInputReference]?.value,customerClass, PaymentType[this.paymentType]?.toLowerCase()).isValid;
                }
                console.log(`item-key: ${item.key}, item-value: ${item.value}, isFormFieldValid:${isFormFieldValid}, keyValid:${item.key}`);
                this.handleErrorClass(item.key,isFormFieldValid as boolean,item.key,item.value);
                if(data.isFormValid){
                    if(this.paymentType === PaymentType.MinCardOnly || this.paymentType === PaymentType.MinCardOnlyWithEdit){
                        this.errorHandling.removeErrorNode();
                    }
                }
                this.dispatchErrorMessage(data.isFormValid);
            });
        });                        
    } 
    dispatchErrorMessage(flag:any) {
        const message = flag ? 'All form field have valid data' : 'Invalid Form data';
        const cpcMessage = this.errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.form,MessageType.error, message);
        parent.postMessage(JSON.stringify({...cpcMessage,isFormValid:flag}), CURRENT_CHANNEL_DOMAIN.URI);
    }
    isAddressOverRideSetErrorMap(isAddressOverRide:any):void {
        const channelData = this.global.appState.get('channelData');
        const cpcPageType = this.global.appState.get('config').cpcPageType.toLowerCase();
        const pageTypeCard = document.getElementById('card-style-box');
        const pageTypeBank = document.getElementById('bank-style-box');
        const cardTemplate = document.getElementById('jump-credit-card-template');
        const achTemplate = document.getElementById('jump-ach-template');
        const cardNewTemplate = document.getElementById('jump-new-cc-template');
        const bankNewTemplate = document.getElementById('jump-new-bank-template');
        const cardContainer = document.querySelector('[name="jump-card-container"]');
        const bankContainer = document.querySelector('[name="jump-bank-container"]');
        const walletMgmtNoAutopayCC:any = document.querySelector('#jump-cc-web-component [name="jump-tc-checkbox"]') as HTMLInputElement;
        const walletMgmtNoAutopayACH:any = document.querySelector('#jump-ach-web-component [name="jump-tc-checkbox"]') as HTMLInputElement;
        let flag:any;
        let firstName:any;
        let lastName:any;
        let cardNumber:any;
        let expMonth:any;
        let expYear:any;
        let cvv:any;
        let accountNo:any;
        let routingNo:any;
      
        if(pageTypeCard?.classList.contains('show') || cpcPageType === CARD_ONLY.toLowerCase() || cpcPageType === CARD_ONLY_WITH_EDIT.toLowerCase() || cardTemplate?.classList?.contains('show') || cardNewTemplate?.classList?.contains('show') || cardContainer?.classList?.contains('show')) {
            firstName = document.querySelector('#jump-cc-web-component [name="jump-first-name"]') as HTMLInputElement;
            lastName = document.querySelector('#jump-cc-web-component [name="jump-last-name"]') as HTMLInputElement;
            cardNumber = document.querySelector('#jump-cc-web-component [name="jump-credit-card"]') as HTMLInputElement;
            expMonth = document.querySelector('#jump-cc-web-component [name="jump-expiry-mm"]') as HTMLInputElement;
            expYear = document.querySelector('#jump-cc-web-component [name="jump-expiry-yy"]') as HTMLInputElement;
            cvv = document.querySelector('#jump-cc-web-component [name="jump-cvv"]') as HTMLInputElement;
            if(cardNumber?.value) {
                flag = this.validations.validateCC(cardNumber?.value).isValid;
                if(cardNumber?.value?.includes('*')) {
                    this.errorMap.set('cc', true);
                } else {
                    this.errorMap.set('cc', flag);
                }
            } else {
                this.errorMap.set('cc', false);
            }
            if(cvv?.value) {
                flag = this.validations.validateExpCvv(cvv?.value, cardNumber?.value).isValid;
                if(cvv?.value?.includes('*')) {
                    this.errorMap.set('cvv', true);
                } else {
                    this.errorMap.set('cvv', flag);
                } 
            } else {
                this.errorMap.set('cvv', false);
            }
            if(expMonth?.value) {
                flag = this.validations.validateExpMM(expMonth?.value, expYear?.value);

                if(expMonth?.value?.includes('*')) {
                    this.errorMap.set('expMM', true);
                } else {
                    this.errorMap.set('expMM', flag);
                } 
            } else {
                this.errorMap.set('expMM', false);
            }
            if(expYear?.value) {
                flag = this.validations.validateExpYY(expYear.value, expMonth.value);
                if(expYear?.value?.includes('*')) {
                    this.errorMap.set('expYY', true);
                } else {
                    this.errorMap.set('expYY', flag);
                } 
            } else {
                this.errorMap.set('expYY', false);
            }
            if(lastName) {
                flag = this.validations.validateLastName(
                    lastName?.value,
                    channelData?.channelDetails?.customerClass, PaymentType[PaymentType.CardOnly].toLowerCase()
                ).isValid;
                this.errorMap.set('lastName', flag);
            }
         
        } else if(pageTypeBank?.classList.contains('show') || cpcPageType === ACH_ONLY.toLowerCase() || cpcPageType === ACH_ONLY_WITH_EDIT.toLowerCase() || achTemplate?.classList?.contains('show') || bankNewTemplate?.classList?.contains('show') || bankContainer?.classList?.contains('show')) {
            firstName = document.querySelector('#jump-ach-web-component [name="jump-first-name"]') as HTMLInputElement;
            lastName = document.querySelector('#jump-ach-web-component [name="jump-last-name"]') as HTMLInputElement;
            accountNo = document.querySelector('#jump-ach-web-component [name="jump-account-no"]') as HTMLInputElement;
            routingNo = document.querySelector('#jump-ach-web-component [name="jump-routing-no"]') as HTMLInputElement;
            if(accountNo?.value) {
                flag = this.validations.validateAccountNo(accountNo?.value).isValid;
                if(accountNo?.value?.includes('*')) {
                    this.errorMap.set('accountNo', true);
                } else {
                    this.errorMap.set('accountNo', flag);
                }
            } else {
                this.errorMap.set('accountNo', false);
            }
            if(routingNo?.value) {
                flag = this.validations.validateRoutingNo(routingNo?.value).isValid;
                if(routingNo?.value?.includes('*')) {
                    this.errorMap.set('routingNo', true);
                } else {
                    this.errorMap.set('routingNo', flag);
                }
            } else {
                this.errorMap.set('routingNo', false);
            }
            if(lastName) {
                flag = this.validations.validateLastName(
                    lastName?.value,
                    channelData?.channelDetails?.customerClass, PaymentType[PaymentType.AchOnly].toLowerCase()
                ).isValid;
                this.errorMap.set('lastName', flag);
            }
        }
        const displayedAddress = true;
        if(isAddressOverRide === false || displayedAddress) {
            let address:any;
            let addressLine2:any;
            let city:any;
            let state:any;
            let zipCode:any;
            let result;
            if(pageTypeCard?.classList.contains('show') || cpcPageType === CARD_ONLY.toLowerCase() || cpcPageType === CARD_ONLY_WITH_EDIT.toLowerCase() || cardTemplate?.classList?.contains('show') || cpcPageType === MIN_CARD_ONLY.toLowerCase() || cpcPageType === MIN_CARD_ONLY_WITH_EDIT.toLowerCase() || cardNewTemplate?.classList?.contains('show') || cardContainer?.classList?.contains('show')) {
                address = document.querySelector('#jump-cc-web-component [name="jump-address"]');
                addressLine2 = document.querySelector('#jump-cc-web-component [name="jump-line2"]');
                city = document.querySelector('#jump-cc-web-component [name="jump-city"]');
                state = document.querySelector('#jump-cc-web-component [name="jump-state"]');
                zipCode = document.querySelector('#jump-cc-web-component [name="jump-zip-code"]');
            } else if(pageTypeBank?.classList.contains('show') || cpcPageType === ACH_ONLY.toLowerCase() || cpcPageType === ACH_ONLY_WITH_EDIT.toLowerCase() || achTemplate?.classList?.contains('show') || cpcPageType === MIN_ACH_ONLY.toLowerCase() || bankNewTemplate?.classList?.contains('show') || bankContainer?.classList?.contains('show')){
                address = document.querySelector('#jump-ach-web-component [name="jump-address"]');
                addressLine2 = document.querySelector('#jump-ach-web-component [name="jump-line2"]');
                city = document.querySelector('#jump-ach-web-component [name="jump-city"]');
                state = document.querySelector('#jump-ach-web-component [name="jump-state"]');
                zipCode = document.querySelector('#jump-ach-web-component [name="jump-zip-code"]');
            }
            
            if(address?.value) {
                result= this.validations.validateAddress(address?.value);
                this.errorMap.set('address', result.isValid);
            } 
            if(addressLine2?.value) {
                result= this.validations.validateAddressLine2(addressLine2?.value);
                this.errorMap.set('addressLine2', result);
            } 
            if(city?.value) {
                result= this.validations.validateCity(city?.value);
                this.errorMap.set('city', result.isValid);
            } 
            if(state?.value) {
                result= this.validations.validateState(state?.value);
                this.errorMap.set('state', result);
            } 
            if(zipCode?.value) {
                result= this.validations.validateZipcode(zipCode?.value);
                this.errorMap.set('zipCode', result.isValid);
            } 
            if(cpcPageType === MIN_ACH_ONLY.toLowerCase() || cpcPageType === MIN_CARD_ONLY.toLowerCase() || cpcPageType === MIN_CARD_ONLY_WITH_EDIT.toLowerCase()) {
                this.errorMap.set('address', true);
                this.errorMap.set('addressLine2', true);
                this.errorMap.set('city', true);
                this.errorMap.set('state', true);
                this.errorMap.set('zipCode', true);
            }
        }
        if(firstName) {
            flag= this.validations.validateFirstName(
                firstName?.value,
                channelData?.channelDetails?.customerClass
            ).isValid;
            this.errorMap.set('firstName', flag);
        }
        if(cpcPageType === WALLET_MGMT_NO_AUTOPAY.toLowerCase()) {
            if(pageTypeCard?.classList?.contains('show')) {
                walletMgmtNoAutopayCC.addEventListener('click', () => {
                    walletMgmtNoAutopayCC.setAttribute('checked',true);
                    const isChecked:any = walletMgmtNoAutopayCC.getAttribute('checked');
                    if(isChecked) {
                        this.errorMap.set('storedPayment', true);
                        walletMgmtNoAutopayCC.setAttribute('checked',false);
                    } else {
                        this.errorMap.set('storedPayment', false);
                        walletMgmtNoAutopayCC.setAttribute('checked',true);
                    }
                });
            }
            if(pageTypeBank?.classList?.contains('show')) {
                walletMgmtNoAutopayACH.addEventListener('click', () => {
                    walletMgmtNoAutopayACH.setAttribute('checked',true);
                    const isChecked:any = walletMgmtNoAutopayACH.getAttribute('checked');
                    if(isChecked) {
                        this.errorMap.set('storedPayment', true);
                        walletMgmtNoAutopayACH.setAttribute('checked',false);
                    } else {
                        this.errorMap.set('storedPayment', false);
                        walletMgmtNoAutopayACH.setAttribute('checked',true);
                    }
                });
            } 
        }
    }
    bindKeyup(references:Array<string>): void{
        references.forEach(item =>{
            this.bindKeyupEvent(item);
        });
    }
    bindFocusOut(references:Array<string>): void{
        references.forEach(item =>{
            this.bindExpFocusOut(item);
        });
    }
    bindPaste(references:Array<string>) : void{
        references.forEach(item =>{
            this.bindPasteEvent(item);
        });
    }
    bindChange(references:Array<string>) {
        references.forEach(item => {
            this.bindChangeEvent(item);            
        });
    }
    
    private bindKeyupEvent(reference:string){
        let flag = false;
        let result:IError;
        this.inputReference[reference as keyof IInputReference].addEventListener('keyup', (e:any) =>{
            switch (reference.toLowerCase()) {
            case 'firstname':
                result = this.validations.validateFirstName(
                    this.inputReference[reference as keyof IInputReference].value, 
                    this.channelService.channelData?.channelDetails?.customerClass
                );
                this.viewModel.personalInfo.firstName = this.inputReference[reference as keyof IInputReference].value;
                this.setErrorMap(reference, result.isValid);

                if(result.errorType === ErrorType.invalid){
                    this.modifyErrorMessage(reference,'fn_' + ErrorType.invalid, result.errorType);
                } else {
                    this.modifyErrorMessage(reference,'fn_' + ErrorType.no_value, result.errorType);
                }

                break;
            case 'lastname' : 
                result = this.validations.validateLastName(
                    this.inputReference[reference as keyof IInputReference].value, 
                    this.channelService?.channelData?.channelDetails?.customerClass, PaymentType[this.paymentType]?.toLowerCase()
                );
                this.viewModel.personalInfo.lastName = this.inputReference[reference as keyof IInputReference].value;
                this.setErrorMap(reference, result.isValid);

                if(result.errorType === ErrorType.invalid){
                    this.modifyErrorMessage(reference,'ln_' + ErrorType.invalid, result.errorType);
                } else {
                    this.modifyErrorMessage(reference,'ln_' + ErrorType.no_value, result.errorType);
                }
                break;
            case 'cc':
                result = this.validateCc(e);
                this.viewModel.cardInfo.ccNo = this.inputReference[reference as keyof IInputReference].value;
                this.inputReference.cvv.value = '';
                this.setErrorMap('cvv', false);
                this.setErrorMap(reference, result.isValid);                
                this.modifyErrorMessage(reference,'card_number', result.errorType);
                break;
            case 'cvv':
                let cardType = getCardType(this.inputReference.cc.value);
                cardType = cardType.toLowerCase() ==='americanexpress' ? CPC_AMERICAN_EXPRESS : cardType;
                if((e.keyCode<= 47 || e.keyCode >= 58) &&  (!e.ctrlKey || !e.metaKey ) ){
                    this.handleErrorClass('cvv', false, 'cvv', this.getErrorMessage(ErrorType.security_code, ErrorType.alpha_characters));
                    result = {
                        isValid:false,
                        errorType :  ErrorType.alpha_characters,
                    };
                }else{
                    const cvvLength = valid.number(this.inputReference.cc.value).card?.code?.size;
                    if(e.target.value.length > cvvLength){
                        result = this.validations.validateExpCvv(this.inputReference[reference as keyof IInputReference].value, this.inputReference.cc.value);
                        result.isValid = false;
                        result.errorType = ErrorType.too_many_digits;
                        this.handleErrorClass('cvv', false, 'cvv', this.getErrorMessage(ErrorType.too_many_digits, cardType.toLowerCase()));
                        // this.modifyErrorMessage(reference,'sc_'+ErrorType.too_many_digits, result.errorType, cardType?.toLowerCase());
                    }else{
                        result = this.validations.validateExpCvv(this.inputReference[reference as keyof IInputReference].value, this.inputReference.cc.value);
                    }
                }
                this.viewModel.cardInfo.cvv = this.inputReference[reference as keyof IInputReference].value;
                this.inputReference.cvv.value = this.viewModel.cardInfo.cvv.replace(/\D/g, '');
                //this.handleErrorClass('cvv', flag, 'cvv', this.getErrorMessage(ErrorType.card_number,ErrorType.invalid));
                this.setErrorMap(reference, result.isValid);
                if(result.errorType === ErrorType.alpha_characters){
                    this.modifyErrorMessage(reference,'sc_' + ErrorType.alpha_characters,  result.errorType);
                } else if(result.errorType === ErrorType.no_value){
                    this.modifyErrorMessage(reference,'sc_' + ErrorType.no_value, result.errorType);
                } else if(result.errorType === ErrorType.too_many_digits){
                    this.modifyErrorMessage(reference, 'sc_'+ErrorType.too_many_digits, result.errorType, cardType?.toLowerCase());
                } else{
                    this.modifyErrorMessage(reference,'not_enough_digits', result.errorType);
                }
                
                break;
            case 'accountno':
                const acctNumVal = e.target.value.replace(/[^0-9]/g, '');                
                this.inputReference.accountNo.value = acctNumVal.slice(0,17);
                this.viewModel.accountInfo.accountNo = this.inputReference[reference as keyof IInputReference].value;  
                result = this.validations.validateAccountNo(this.inputReference.accountNo.value);
                this.setErrorMap(reference, result.isValid);
                if(result.errorType === ErrorType.no_value){
                    this.modifyErrorMessage(reference,'bank_' + ErrorType.no_value, result.errorType);
                }
                else if (result.errorType === ErrorType.alpha_characters){
                    this.modifyErrorMessage(reference,'bank_' + ErrorType.alpha_characters, result.errorType);
                }  
                else if (result.errorType === ErrorType.too_many_digits){
                    this.modifyErrorMessage(reference,'bank_' + ErrorType.too_many_digits, result.errorType);
                } 
                else {
                    this.modifyErrorMessage(reference,'bank_' + ErrorType.invalid, result.errorType);
                } 
                this.unDisableAcctType();
                break;
            case 'routingno':  
                const routNumVal = e.target.value.replace(/[^0-9]/g, '');                  
                this.inputReference.routingNo.value = routNumVal.slice(0,9);  
                this.viewModel.accountInfo.routingNo = this.inputReference[reference as keyof IInputReference].value;     
                result  = this.validations.validateRoutingNo(this.inputReference.routingNo.value); 
                this.setErrorMap(reference, result.isValid);
                if(result.errorType === ErrorType.no_value){
                    this.modifyErrorMessage(reference,'routing_' + ErrorType.no_value, result.errorType);
                }
                else if (result.errorType === ErrorType.not_enough_digits){
                    this.modifyErrorMessage(reference,'routing_' + ErrorType.not_enough_digits, result.errorType);
                }  
                else if (result.errorType === ErrorType.alpha_characters){
                    this.modifyErrorMessage(reference,'routing_' + ErrorType.alpha_characters, result.errorType);
                } 
                else {
                    this.modifyErrorMessage(reference,'routing_' + ErrorType.invalid, result.errorType);
                } 
                this.unDisableAcctType();
                break;
            case 'expiration':                
                this.formatString(e);
                break;    
            case 'address' :                
                result = this.validations.validateAddress(this.inputReference.address.value);
                this.setErrorMap(reference, result.isValid);     
                if(result.errorType === ErrorType.invalid){
                    this.modifyErrorMessage(reference,'add_' + ErrorType.invalid, result.errorType);
                } else {
                    this.modifyErrorMessage(reference,'add_' + ErrorType.no_value, result.errorType);
                }      
                break;
            case 'addressline2' :                                
                flag = this.validations.validateAddressLine2(this.inputReference.addressLine2.value);
                this.setErrorMap(reference, flag);                
                break;
            case 'city' : 
                result = this.validations.validateCity(this.inputReference.city.value);
                this.setErrorMap(reference, result.isValid);
                if(result.errorType === ErrorType.invalid){
                    this.modifyErrorMessage(reference,'ct_' + ErrorType.invalid, result.errorType);
                } else {
                    this.modifyErrorMessage(reference,'ct_' + ErrorType.no_value, result.errorType);
                } 
                break;            
            case 'zipcode' :                 
                result = this.validations.validateZipcode(this.inputReference.zipCode.value);
                this.setErrorMap(reference, result.isValid);  
                if(result.errorType === ErrorType.invalid){
                    console.log('TESTING-Invalid');
                    this.modifyErrorMessage(reference,'zip_' + ErrorType.invalid, result.errorType);
                } else {
                    console.log('TESTING-No Value');
                    this.modifyErrorMessage(reference,'zip_' + ErrorType.no_value, result.errorType);
                }               
                break;             
            default:
                break;
            }            
        });        
    }
    private bindExpFocusOut(reference:string) : void {
        this.inputReference[reference as keyof IInputReference].addEventListener('focusout', () =>{
            switch (reference.toLowerCase()) {
            case 'expmm':
                this.checkExp(reference.toLowerCase());
                break;
            case 'expyy':
                this.checkExp(reference.toLowerCase()); 
                break;
            case 'cvv':
                this.validateCvv();
            default:
                break;
            }            
        });    
    }
    private checkExp(elementKey: string) : void {
        if(elementKey === 'expyy') {
            if(this.inputReference['expYY']?.value === '' && this.inputReference['expMM']?.value !== ''){
                this.inputReference['expYY']?.classList.add('is-invalid');
                this.handleErrorClass('expMM', false, 'expMonth', this.getErrorMessage(ErrorType.expiration_month_year,ErrorType.date_in_past));
            }
        }
        if(elementKey === 'expmm') {
            if(this.inputReference['expMM']?.value === '' && this.inputReference['expYY']?.value !== ''){
                this.inputReference['expMM']?.classList.add('is-invalid');
                this.handleErrorClass('expMM', false, 'expMonth', this.getErrorMessage(ErrorType.expiration_month_year,ErrorType.date_in_past));
            }   
        }
    }
    private bindPasteEvent(reference:string) {
        let result:IError;
        this.inputReference[reference as keyof IInputReference].addEventListener('paste', (e:any) => {
            switch (reference.toLowerCase()){
            case 'cc':
                const cardType = getCardType(pasteEvent(e));
                let ccValue = pasteEvent(e).replace(/\D/g, '').toString();
                if(cardType.toLowerCase() === CPC_VISA ){
                    ccValue =  ccValue.slice(0, MAX_LENGTH_VISA_AND_DISCOVER-MAX_LENGTH_VISA_AND_DISCOVER_TRAILS);
                }
                if(cardType.toLowerCase() === 'americanexpress' ){
                    ccValue =  ccValue.slice(0,  MAX_LENGTH_AMEX-MAX_LENGTH_AMEX_TRAILS);
                }
                if(cardType.toLowerCase() === 'mastercard'){
                    ccValue =  ccValue.slice(0, MAX_LENGTH_MASTERCARD-MAX_LENGTH_VISA_AND_DISCOVER_TRAILS);
                }
                if(cardType.toLowerCase() === 'discover'){
                    ccValue =  ccValue.slice(0, MAX_LENGTH_VISA_AND_DISCOVER- MAX_LENGTH_VISA_AND_DISCOVER_TRAILS);
                }
                this.inputReference[reference as keyof IInputReference].value = ccValue;
                this.viewModel.cardInfo.ccNo = ccValue;            
                result = this.validateCc(e);            
                this.setErrorMap(reference, result.isValid);
                this.modifyErrorMessage(reference,'card_number', result.errorType);
                break;
            case 'cvv':
                this.inputReference.cvv.value = this.viewModel.cardInfo.cvv = pasteEvent(e);
                result = this.validateCvv();
                if(!result.isValid){
                    this.inputReference.cvv.value = result.value;
                    if(result.value){
                        this.viewModel.cardInfo.cvv = result.value;
                    }                    
                }
                this.setErrorMap(reference, result.isValid);
                this.modifyErrorMessage(reference,'security_code', result.errorType);
                break;
            case 'accountno':   
                this.inputReference.accountNo.value = pasteEvent(e);
                this.inputReference.accountNo.value = e.target.value.replace(/[^\d]/g, '').slice(0,17);
                this.viewModel.accountInfo.accountNo = pasteEvent(e);
                this.viewModel.accountInfo.accountNo = e.target.value.replace(/[^\d]/g, '').slice(0,17);  
                result  = this.validations.validateAccountNo(this.inputReference.accountNo.value);
                this.setErrorMap(reference, result.isValid);
                this.modifyErrorMessage(reference,'bank_account_number', result.errorType);
                break;
            case 'routingno':
                this.inputReference.routingNo.value = pasteEvent(e);
                this.inputReference.routingNo.value = e.target.value.replace(/[^\d]/g, '').slice(0,9);
                this.viewModel.accountInfo.routingNo = pasteEvent(e);
                this.viewModel.accountInfo.routingNo = e.target.value.replace(/[^\d]/g, '').slice(0,9);            
                result = this.validations.validateRoutingNo(this.inputReference.routingNo.value);
                this.setErrorMap(reference, result.isValid);
                this.modifyErrorMessage(reference,'routing_number', result.errorType);
                break;
            case 'expiration':                
                this.setErrorMap(reference,false);
                break;    
            default:
                break;
            }            
        }); 
    }
    handleKeyDownEvent(reference:string):void {
        const inputElement = this.inputReference[reference as keyof IInputReference];
        inputElement?.addEventListener('keydown', (event:any) => {
            if ((event?.metaKey || event?.ctrlKey) && event?.key === 'a') {
                event.preventDefault();
                inputElement.value = '';
                this.inputReference.expiration.value = '';
            }
        });
    }
    private formatString(e:any) {
        const expirationArr:any = this.inputFieldErrPair.find(x => x.key === 'expiration');
        const index = this.inputFieldErrPair.indexOf(expirationArr);
        const flagObj =  this.validations.formatExpDate(e);
        if (flagObj.flag === false && flagObj.message === 'empty') {
            if(this.paymentType !== PaymentType.MinCardOnly) {
                this.inputFieldErrPair[index].value = this.getErrorMessage(ErrorType.expiration_month_year,ErrorType.date_in_past);
            }
            this.setErrorMap('expiration',flagObj.flag); 
            return;
        } else if(flagObj.message === 'invalid') {
            if(this.paymentType !== PaymentType.MinCardOnly) {
                this.inputFieldErrPair[index].value = this.getErrorMessage(ErrorType.expiration_month_year,ErrorType.date_in_past);
                this.handleErrorClass('expiration', flagObj.flag, 'expMonth', this.getErrorMessage(ErrorType.expiration_month_year,ErrorType.date_in_past));
            }
            this.setErrorMap('expiration',flagObj.flag); 
        }
    }   
    private bindChangeEvent(reference:string) {        
        switch(reference.toLowerCase()){
        case 'expmm':
            this.bindExpMmChange(reference);
            break;
        case 'expyy':
            this.bindExpYyChange(reference);
            break;
        case 'state' :             
            this.bindStateChange(reference);
            break;
        default:
            break;
        }                    
    }
    public async autoPayChangeACH(autoPayCheckbox:any, storedPaymentCheckbox:any ){
        const flag = await this.validations?.validateAutoPayAndStoredPaymentACH();
        if(!storedPaymentCheckbox) {
            this.inputReference.storedPayment = document.querySelector('#jump-ach-web-component [name="jump-tc-checkbox"]') as HTMLInputElement;
        } else {
            this.inputReference.storedPayment = storedPaymentCheckbox;
        }
        if(!autoPayCheckbox) {
            autoPayCheckbox = document.querySelector('#jump-ach-web-component [name="jump-auto-pay-checkbox"]') as HTMLInputElement;
        }
        autoPayCheckbox?.addEventListener('click', (e:any) => {
            if(flag) {
                this.inputReference?.storedPayment?.classList.remove('is-invalid');
                if(this.inputReference?.storedPayment) {
                    this.removeErrorFeedback('storedPayment');
                }
            } 
        });
    }
    public async autoPayChangeCC(autoPayCheckbox:any, storedPaymentCheckbox:any){
        const flag = await this.validations?.validateAutoPayAndStoredPaymentCC();
        if(!storedPaymentCheckbox) {
            this.inputReference.storedPayment = document.querySelector('#jump-cc-web-component [name="jump-tc-checkbox"]') as HTMLInputElement;
        } else {
            this.inputReference.storedPayment = storedPaymentCheckbox;
        }
        if(!autoPayCheckbox) {
            autoPayCheckbox = document.querySelector('#jump-cc-web-component [name="jump-auto-pay-checkbox"]') as HTMLInputElement;
        } 
        autoPayCheckbox?.addEventListener('click', (e:any) => {
            if(flag) {
                this.inputReference?.storedPayment?.classList?.remove('is-invalid');
                if(this.inputReference?.storedPayment) {
                    this.removeErrorFeedback('storedPayment');
                }
            } 
        });
    }
    private bindStateChange(reference:string){
        this.inputReference[reference as keyof IInputReference].addEventListener('change', (e:any) => {
            const flag = this.validations.validateState(this.inputReference.state.value);
            this.setErrorMap('state', flag);
            if(this.paymentType === PaymentType.CardOnly || this.paymentType === PaymentType.CardOnlyWithEdit ){
                this.dataLayerService.dispatchInfoEvent(CPC_CARD_STATE_SELECT,e.target.options[e.target.selectedIndex].value);
            } else if(this.paymentType === PaymentType.AchOnly || this.paymentType === PaymentType.AchOnlyWithEdit ){
                this.dataLayerService.dispatchInfoEvent(CPC_BANK_STATE_SELECT,e.target.options[e.target.selectedIndex].value);
            }
        });
    }
    private bindExpMmChange(reference:string){
        this.inputReference[reference as keyof IInputReference].addEventListener('change', (e:any) => {
            let flag = true;
            console.log('this.paymentType :', this.paymentType);
            if(this.inputReference.expMM.value !== '' && this.inputReference.expYY.value !== '') {
                flag = this.validations['validateExpMM'](this.inputReference.expMM.value,this.inputReference.expYY.value);
                this.handleErrorClass('expMM', flag, 'expMonth', this.getErrorMessage(ErrorType.expiration_month_year,ErrorType.date_in_past));
                this.handleErrorClass('expYY', flag, 'expYear', this.getErrorMessage(ErrorType.expiration_month_year,ErrorType.date_in_past));
            }
            if(this.paymentType === PaymentType.CardOnly || this.paymentType === PaymentType.CardOnlyWithEdit){                
                this.dataLayerService.dispatchInfoEvent(CPC_CARD_EXP_MM_SELECT,e.target.options[e.target.selectedIndex].value);                                                
            } 
            // else if(this.paymentType === PaymentType.MinCardOnly){            
            //     this.dataLayerService.dispatchInfoEvent(CPC_MIN_CARD_EXP_MM_SELECT,e.target.options[e.target.selectedIndex].value);                            
            // }
            this.setErrorMap('expMM', flag);
            this.setErrorMap('expYY', flag);
        });        
    }
    private bindExpYyChange(reference:string){
        this.inputReference[reference as keyof IInputReference].addEventListener('change', (e:any) => {
            let flag = true;
            console.log('this.paymentType :', this.paymentType);
            if(this.inputReference.expMM.value !== '' && this.inputReference.expYY.value !== '') {
                flag = this.validations['validateExpYY'](this.inputReference.expYY.value,this.inputReference.expMM.value);
                this.handleErrorClass('expYY', flag, 'expYear', this.getErrorMessage(ErrorType.expiration_month_year,ErrorType.date_in_past));
                this.handleErrorClass('expMM', flag, 'expMonth', this.getErrorMessage(ErrorType.expiration_month_year,ErrorType.date_in_past));
            }
            if(this.paymentType === PaymentType.CardOnly || this.paymentType === PaymentType.CardOnlyWithEdit || this.paymentType === PaymentType.WalletMgmtNoAutopay || this.paymentType === PaymentType.CardExpirationEdit){
                this.dataLayerService.dispatchInfoEvent(CPC_CARD_EXP_YY_SELECT,e.target.options[e.target.selectedIndex].value);                
            } 
            // else if(this.paymentType === PaymentType.MinCardOnly){
            //     this.dataLayerService.dispatchInfoEvent(CPC_MIN_CARD_EXP_YY_SELECT,e.target.options[e.target.selectedIndex].value);                                
            // }
            this.setErrorMap('expYY', flag);
            this.setErrorMap('expMM', flag);
        });        
    }
    setElementReference(keyValuePair: Array<IKeyValuePair>){       
        let counter:any = 0;
        keyValuePair.forEach(item => {
            this.inputReference[item.key as keyof IInputReference] = this.getElementRef(item.value);
            counter++;
        });
        if(counter === keyValuePair.length) {
            return true;
        }
    }
    setViewModel(keyValuePair: Array<IKeyValuePair>){
        let fieldName = '';
        keyValuePair.forEach(item =>{
            fieldName = item.key.toLowerCase();
            if(fieldName === 'firstname' || fieldName === 'lastname'){
                this.viewModel.personalInfo[item.key as keyof IPersonalInfoModel] = this.inputReference[item.value as keyof IInputReference]?.value;
            } else if(fieldName === 'address' || fieldName === 'addressLine2' || fieldName === 'city' || fieldName === 'state' || fieldName === 'zipCode'){
                this.viewModel.personalInfo.addressInfo[item.key as keyof IAddressModel] = this.inputReference[item.value as keyof IInputReference]?.value;
            } else if(fieldName === 'ccno' || fieldName === 'cvv' || fieldName === 'expmonth' || fieldName === 'expyear' || fieldName === 'ccImg' || fieldName === 'jumpmodaltrigger' || fieldName === 'cctemplatetontainer' || fieldName === 'cardtype' ){
                this.viewModel.cardInfo[item.key as keyof ICardOnlyModel] = this.inputReference[item.value as keyof IInputReference]?.value;    
            } else if(fieldName === 'accountno' || fieldName === 'routingno' || fieldName === 'accounttypechecking' || fieldName === 'accounttypesaving' || fieldName === 'accounttypecorporatechecking' || fieldName === 'jumpmodaltriggeracc' || fieldName==='jumpmodaltriggerrouting' || fieldName ==='achtemplatecontainer'){
                this.viewModel.accountInfo[item.key as keyof IAchOnlyModel] = this.inputReference[item.value as keyof IInputReference]?.value;
            }            
        });        
    }
    setAddressViewModel(){
        if(this.inputReference.addressOption.checked === true) {
            this.channelService.channelData.customerDetails.address = this.inputReference.address.value;        
            this.channelService.channelData.customerDetails.addressLine2 = this.inputReference.addressLine2.value;        
            this.channelService.channelData.customerDetails.city = this.inputReference.city.value;        
            this.channelService.channelData.customerDetails.state = this.inputReference.state.value;        
            this.channelService.channelData.customerDetails.zip = this.inputReference.zipCode.value;   
        }              
    }
    isFormValid(isAllFormFieldValidMap: Map<string, boolean>): boolean {
        let flag = true;
        for(const value of isAllFormFieldValidMap.values()){
            if(!value){
                flag = false;
                this.dispatchErrorMessage(flag);
                break;
            }
        }  
        const isValidForm = this.isValid();
        if(isValidForm && flag) {
            return true;
        } else if(!flag || !isValidForm){
            return false;
        } else {
            return true;
        }
    }
    //TODO: refactor this method -- everytime getElementById....
    private getElementRef(selector: string) {
        let content:any;
        if(this.paymentType === PaymentType.CardOnly){
            content = document.getElementById('jump-card-only-container');
        }else if(this.paymentType === PaymentType.AchOnly){
            content = document.getElementById('jump-ach-only-container');
        }
        else if(this.paymentType === PaymentType.CardOrBank){
            if(this.channelService.channelData.selectedPaymentType === 'cardonly'){
                content = document.getElementById('jump-card-only-container');
            }else if(this.channelService.channelData.selectedPaymentType === 'achonly'){
                content = document.getElementById('jump-ach-only-container');
            }
        }else if(this.paymentType === PaymentType.MinCardOnly){
            content = document.getElementById('jump-min-card-only-container');
        }
        else if(this.paymentType === PaymentType.MinAchOnly){
            content = document.getElementById('jump-min-ach-only-container');
        }
        const result = content?.querySelector(selector);
        return result;
        //return document.querySelector(selector);
    }    
    private isValid():boolean {
        let flag = true;
        this.isAddressOverRideSetErrorMap(null); 
        for(const value of this.errorMap.values()){
            if(!value){
                flag = false;
                break;
            }
        }
        return flag;
    }
    validateKeyEntries():void {
        const itemKeyListCC = ['firstName', 'lastName', 'cc', 'expYY', 'expMM', 'cvv'];
        if(itemKeyListCC) {
            const channelData = this.global.appState.get('channelData');
            itemKeyListCC.forEach((itemKey:any) => {
                let flag:any;
                if(itemKey === 'firstName') {
                    flag = this.validations.validateFirstName(
                        this.inputReference.firstName.value,
                        channelData?.channelDetails?.customerClass
                    ).isValid;
                    this.errorMap.set(itemKey, flag);
                }
                if(itemKey === 'lastName') {
                    flag = this.validations.validateLastName(
                        this.inputReference.lastName.value,
                        channelData?.channelDetails?.customerClass, PaymentType[PaymentType.CardOnly].toLowerCase()
                    ).isValid;
                    this.errorMap.set(itemKey, flag);
                }
            });
        }
        return;
    }
    private validateCvv(): IError {
        const result = this.validations.validateExpCvv(this.inputReference.cvv.value, this.inputReference.cc.value);
        this.handleErrorClass('cvv', result.isValid, 'cvv', this.getErrorMessage(ErrorType.card_number,result.errorType));
        return result;
    }
    private validateCc(e:any): IError{
        //let flag = false;
        let result:IError = Object.assign({});
        const value = e.type ==='paste' ? pasteEvent(e) : e.target.value;
        this.bindCCValues(value,e.type);
        result = this.validations.validateCC(this.inputReference.cc.value);
        if((e.keyCode<= 47 || e.keyCode >= 57) &&  (!e.ctrlKey || !e.metaKey ) ){
            this.handleErrorClass('cc', false, 'cc', this.getErrorMessage(ErrorType.card_number, ErrorType.alpha_characters));
            result.errorType = ErrorType.alpha_characters;
            return result;
        }
        if(this.inputReference.cc.value.length === 4){
            this.displayCardThumbnail(this.inputReference.cc.value,e);
        }
        const cardType = getCardType(this.inputReference.cc.value);
        
        if(cardType.toLowerCase() === CPC_VISA  && value.length === MAX_LENGTH_VISA_AND_DISCOVER ){
            this.handleErrorClass('cc', false, 'cc', `${cardType} ${this.getErrorMessage(ErrorType.card_number, ErrorType.too_many_digits).replace('digits', MAX_LENGTH_VISA_AND_DISCOVER-MAX_LENGTH_VISA_AND_DISCOVER_TRAILS + ' digits')}`);
            console.log('visa max digits error' );
        }
        if(cardType.toLowerCase() === 'americanexpress'  && value.length === MAX_LENGTH_AMEX){
            this.handleErrorClass('cc', false, 'cc', `American Express ${this.getErrorMessage(ErrorType.card_number, ErrorType.too_many_digits).replace('digits', MAX_LENGTH_AMEX-MAX_LENGTH_AMEX_TRAILS + ' digits')}`);
            console.log('amex max digits error' );
        }
        if(cardType.toLowerCase() === 'mastercard'  && value.length === MAX_LENGTH_MASTERCARD){
            this.handleErrorClass('cc', false, 'cc', `Master Card ${this.getErrorMessage(ErrorType.card_number, ErrorType.too_many_digits).replace('digits', MAX_LENGTH_MASTERCARD-MAX_LENGTH_VISA_AND_DISCOVER_TRAILS + ' digits')}`);
            console.log('mastercard max digits error' );
        }
        if(cardType.toLowerCase() === 'discover'  && value.length === MAX_LENGTH_VISA_AND_DISCOVER){
            this.handleErrorClass('cc', false, 'cc', `${cardType} ${this.getErrorMessage(ErrorType.card_number, ErrorType.too_many_digits).replace('digits', MAX_LENGTH_VISA_AND_DISCOVER- MAX_LENGTH_VISA_AND_DISCOVER_TRAILS + ' digits')}`);
            console.log('discover max digits error' );
        }
        //this.handleErrorClass('cc', flag, 'ccNo', ERR_CC_INVALID);
        if(result.isValid){
            this.inputReference.cvv.disabled = false;
            if(cardType === 'invalid'){
                console.log('Invalid Card Provided');
                this.inputReference.cardType = '';
                this.viewModel.cardInfo.cardType = '';
                //this.handleErrorClass('cc', false, 'ccNo', ERR_CC_INVALID);
                //return;
            } else{
                this.inputReference.cardType = cardType;
                this.viewModel.cardInfo.cardType = cardType;
            }
        }else{
            this.inputReference.cvv.disabled = true;
        }        
        return result;
    }
    private bindCCValues(ccValue:any,evtType = ''): void {
        const cardTypeLabel: any = document.getElementsByName('jump-credit-card-img')[0];
        const cardNumber: any = document.getElementsByName('jump-credit-card')[0];
        if (typeof cardTypeLabel !== 'undefined') {
            getCardTypes(ccValue , cardTypeLabel , cardNumber, this.global, evtType);
        }
    }
    public bindCCValuesEdit(ccValue:any, cardType:string): void {
        const cardTypeLabel: any = document.getElementsByName('jump-credit-card-img')[0];
        const cardNumber: any = document.getElementsByName('jump-credit-card')[0];
        if (typeof cardTypeLabel !== 'undefined') {
            getCardTypesEdit(ccValue , cardTypeLabel , cardNumber, cardType);
        }
    }
    public bindAccountNoValuesEdit(accountNo:any): void {
        this.viewModel.accountInfo.accountNo = this.inputReference.accountNo.value = accountNo.replace(/[^0-9]/g, '*');
    }

    private displayCardThumbnail(value:any,event:any){
        const cardTypeLabel:any = this.inputReference.ccImg;
        const cardNumber:any = this.inputReference.cc;
        if (typeof cardTypeLabel !== 'undefined') {
            getCardTypes(value , cardTypeLabel , cardNumber, this.global, event.type);
        }
    }
    private removeErrorFeedback = (reference:string) => {
        const parentId = this.inputReference[reference  as keyof IInputReference]?.parentElement; 
        this.inputReference[reference as keyof IInputReference]?.setAttribute('aria-invalid','false');
        const errFeedback =  this.inputReference[reference  as keyof IInputReference]?.name;
        if(parentId){
            const selector = `[name='${errFeedback}-feedback']`;
            if(selector && parentId.querySelector(selector)) {
                parentId.querySelector(selector).remove();
            }
        }
    };
    private appendErrorFeedback = (reference:string, feedbackMsg: string) :any => {
        const nameField = this.inputReference[reference as keyof IInputReference].name;
        const span = document.createElement('span');
        span?.setAttribute('name', nameField + '-feedback');
        span?.classList?.add('invalid-feedback');
        span.innerHTML = feedbackMsg;
        this.inputReference[reference as keyof IInputReference]?.setAttribute('aria-labelledby',`${nameField}-label ${nameField}-feedback`);
        this.inputReference[reference as keyof IInputReference]?.setAttribute('aria-describedby',`${nameField}-feedback`);
        this.inputReference[reference as keyof IInputReference]?.setAttribute('aria-invalid','true');
        span?.setAttribute('id',`${nameField}-feedback`);
        return span;
    }; 
    private handleErrorClass = (reference: any, flag: boolean, model: string, err:any): void => {
        if (flag) {
            this.inputReference[reference as keyof IInputReference]?.classList.remove('is-invalid');
            this.removeErrorFeedback(reference);
        } else {
            this.removeErrorFeedback(reference);
            this.inputReference[reference as keyof IInputReference]?.classList.add('is-invalid');

            if(reference !== 'expYY') {
                if(this.paymentType === PaymentType.MinCardOnly || this.paymentType === PaymentType.MinCardOnlyWithEdit) {
                    const cpcMessage = this.errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.form, MessageType.error, err);
                    this.errorHandling.showError(cpcMessage, err);
                }else{
                    this.inputReference[reference as keyof IInputReference]?.parentElement.append(this.appendErrorFeedback(reference, err));
                }
            }
            console.log(err);
        }
    };
    private findErrorField(key:string): IKeyValuePair | undefined {
        return this.inputFieldErrPair.find(x => x.key === key);
    }
    private modifyErrorMessage(reference:any,errorField:string,result:ErrorType, cardType?:string){
        const field = this.findErrorField(reference);
        if(field){
            if(this.paymentType !== PaymentType.MinCardOnly && this.paymentType !== PaymentType.MinCardOnlyWithEdit){
                if(cardType){
                    field.value = this.getErrorMessage(result, cardType);
                }else{
                    field.value = this.getErrorMessage(errorField, result);
                }
            }            
        }
    }
    
    getErrorMessage(key:string, subKey?:string): string {       
        let errorMessage = '';
        switch(key){
        case ErrorType.card_number:            
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.card,ErrorType.card_number,subKey);
            break;
        case ErrorType.expiration_month_year:            
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.card,ErrorType.expiration_month_year,subKey);
            break;
        case ErrorType.routing_number:            
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.bank,ErrorType.routing_number,subKey);
            break;
        case ErrorType.bank_account_number:            
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.bank,ErrorType.bank_account_number,subKey);
            break;            
        case 'sc_' + ErrorType.alpha_characters:
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.card,ErrorType.security_code,subKey);
            break;
        case 'sc_' + ErrorType.no_value:
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.card,ErrorType.security_code,subKey);
            break;
        case ErrorType.not_enough_digits:        
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.card,ErrorType.security_code,key,subKey);
            break;
        case ErrorType.too_many_digits:        
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.card,ErrorType.security_code, key, subKey);
            break;
        case ErrorType.security_code:        
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.card,ErrorType.security_code,subKey);
            break;
        case 'fn_' + ErrorType.no_value:        
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.card,ErrorType.first_name,subKey);
            break;
        case 'fn_' + ErrorType.invalid:        
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.card,ErrorType.first_name,subKey);
            break;
        case 'ln_' + ErrorType.no_value:        
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.card,ErrorType.last_name,subKey);
            break;
        case 'ln_' + ErrorType.invalid:        
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.card,ErrorType.last_name,subKey);
            break;
        case 'add_' + ErrorType.no_value:        
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.card,ErrorType.address_line_1,subKey);
            break;
        case 'add_' + ErrorType.invalid:        
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.card,ErrorType.address_line_1,subKey);
            break;
        case 'ct_' + ErrorType.no_value:        
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.bank,ErrorType.city,subKey);
            break;
        case 'ct_' + ErrorType.invalid:        
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.bank,ErrorType.city,subKey);
            break;
        case 'zip_' + ErrorType.no_value:        
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.bank,ErrorType.zip,subKey);
            break;
        case 'zip_' + ErrorType.invalid:        
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.bank,ErrorType.zip,subKey);
            break;
        case 'routing_' + ErrorType.no_value:        
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.bank,ErrorType.routing_number,subKey);
            break;
        case 'routing_' + ErrorType.invalid:        
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.bank,ErrorType.routing_number,subKey);
            break;
        case 'routing_' + ErrorType.not_enough_digits:        
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.bank,ErrorType.routing_number,subKey);
            break;
        case 'routing_' + ErrorType.too_many_digits:        
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.bank,ErrorType.routing_number,subKey);
            break;
        case 'bank_' + ErrorType.no_value:        
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.bank,ErrorType.bank_account_number,subKey);
            break;
        case 'bank_' + ErrorType.invalid:        
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.bank,ErrorType.bank_account_number,subKey);
            break;
        case 'bank_' + ErrorType.too_many_digits:        
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.bank,ErrorType.too_many_digits,subKey);
            break;
        case 'bank_' + ErrorType.alpha_characters:        
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.bank,ErrorType.alpha_characters,subKey);
            break;
        }
        return errorMessage;
    }
    unDisableAcctType():any {
        document.getElementById('jump-acc-type-saving')?.removeAttribute('disabled');
        document.getElementById('jump-acc-type-checking')?.removeAttribute('disabled');
    }
}