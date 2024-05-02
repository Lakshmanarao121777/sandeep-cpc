import { STATES } from '../constant/payment.constant';
import { CUSTOMER_CLASS_BUSINESS, CUSTOMER_CLASS_RESIDENTIAL, BUSINESS_AUTO_PAY_CHANNEL_LIST, CPC_EXISTING_PAYMENT_OPTION_SELECTED, CPC_NEW_CARD_OPTION_SELECTED, CPC_NEW_BANK_OPTION_SELECTED, CPC_NEW_PAYMENT_OPTION_SELECTED, WALLET_MGMT_NO_AUTOPAY } from '../constant/app.constant';
import creditCardType from 'credit-card-type';
import { ErrorType, IError, PaymentType } from '../model/view.model';
import { Globals } from './globals';
import { UserRoleDetails } from '../model/channel-data';
import { getSelectedUserWalletId, isStoredPaymentComponentChecked } from '../service/viewModel/util/userrole-util';
/* eslint @typescript-eslint/no-var-requires: "off" */
const valid = require('card-validator');

export class Validation {
    public validateFirstName(value: string, customerClass:string): IError {
        let consecNumChar = 3;
        let totalNumChar = 6;
        switch(customerClass) {
        case CUSTOMER_CLASS_BUSINESS:
            consecNumChar = 5;
            totalNumChar = 8;
            break;
        case CUSTOMER_CLASS_RESIDENTIAL:
            consecNumChar = 3;
            totalNumChar = 6;
        default:
            break;
        }
        const result:IError = Object.assign({});
        let flag = false;
        if (value != '' && value.length > 0 && value.length <= 150 ) {
            flag = true;
            if (this.isNumeric(value)) {
                flag = false;
            }
            else {
                flag = this.validateNumbersLengths(value, totalNumChar, true, consecNumChar);
            }       
        }

        result.isValid = flag;
        result.value = value;
        if(!flag){
            if(!value.trim()){
                result.errorType = ErrorType.no_value;
            } else {
                result.errorType = ErrorType.invalid;
            } 
        }
        return result;
    }

    public validateLastName(value: any, customerClass:string, paymentType:string ): IError {
        const result:IError = Object.assign({});
        let flag = false;
        let consecNumChar = 3;
        let totalNumChar = 6;
        if(!customerClass) {
            customerClass = CUSTOMER_CLASS_RESIDENTIAL;
        }
        switch(customerClass) {
        case CUSTOMER_CLASS_BUSINESS:
            consecNumChar = 5;
            totalNumChar = 8;
            break;
        case CUSTOMER_CLASS_RESIDENTIAL:
            consecNumChar = 3;
            totalNumChar = 6;
        default:
            break;
        }
        if((paymentType.toLowerCase()===PaymentType[PaymentType.CardOnly].toLowerCase() || paymentType.toLowerCase()===PaymentType[PaymentType.CardOnlyWithEdit].toLowerCase())  && customerClass === CUSTOMER_CLASS_BUSINESS && !value){
            flag = true;
        }
        else if (customerClass === CUSTOMER_CLASS_RESIDENTIAL && value != '' && value.length > 0 && value.length <= 150 ) {
            flag = true;
            if (this.isNumeric(value)) {
                flag = false;
            }
            else {
                flag = this.validateNumbersLengths(value, totalNumChar, true, consecNumChar);
            }   
        }
        else if (customerClass === CUSTOMER_CLASS_BUSINESS && value != '' && value.length > 0 && value.length <= 150 ) {
            flag = true;
            if (this.isNumeric(value)) {
                flag = false;
            }
            else {
                flag = this.validateNumbersLengths(value, totalNumChar, true, consecNumChar);
            } 
        } 

        result.isValid = flag;
        result.value = value;
        if(!flag){
            if(!value.trim()){
                result.errorType = ErrorType.no_value;
            } else {
                result.errorType = ErrorType.invalid;
            } 
        }
        return result;
    }

    /**
   *
   * @param value Input Validation of Credit/Debit Card
   * @returns true or false
   */
    public validateCC(value: string): IError {
        const result:IError = Object.assign({});
        const cardName = valid.number(value).card?.type;
        let flag = false;
        if(cardName !== null && (cardName === 'american-express' || cardName === 'visa'
        || cardName === 'discover' || cardName === 'mastercard')) {
            flag = valid.number(value).isValid;
        } else {
            flag = false;
        }
        result.isValid = flag;
        if(!flag){
            result.errorType = ErrorType.invalid;
        } 
        return result;
    }
    public validExpirationCheck(value:string):boolean {
        let flag = false;
        const expirationArr = value.split('/');
        const today = new Date();
        const getYear =  today.getFullYear(); // get current year
        const currentCentury = getYear.toString().substring(0, 2);
        const expMM = expirationArr[0];
        const expYY = currentCentury+expirationArr[1];
        const someday = new Date();
        someday.setFullYear(parseInt(expYY), parseInt(expMM), 1);
        if (someday > today  && parseInt(expMM) <= 12 && expirationArr[1].length === 2) {
            flag = true;
        }
        return flag;
    }
    public validateExpMM(value: string, expYY: string): boolean {
        let flag = false;
        const date = new Date();
        const YY = date.getFullYear();
        const MM = date.getMonth() + 1;
        if (/^\d{2}$/.test(value) && value !== '' && expYY !== '') {
            if (expYY !== '' && parseInt(expYY) === YY) {
                if (parseInt(value) >= MM) {
                    flag = true;
                }
            } else {
                flag = true;
            }
        }
        return flag;
    }
    public validateExpYY(value: string, expMM: string): boolean {
        const date = new Date();
        const YY = date.getFullYear();
        const mm = date.getMonth() + 1;
        let flag = false;
        if (parseInt(value) === YY) {
            if (expMM !== '') {
                if (parseInt(expMM) > mm || parseInt(expMM) === mm) {
                    flag = true;
                } else {
                    flag = false;
                }
            } else {
                flag = false;
            }
        } else if (parseInt(value) > YY && expMM !== '') {
            flag = true;
        } else {
            flag = false;
        }
        return flag;
    }
    public validateExpCvv(value: string, ccno: string): IError {
        let flag = false;
        const cvv:any = document.querySelector('[name="jump-cvv"]');
        const cvvLength = valid.number(ccno).card?.code?.size;
        if(cvv && cvv.value){
            cvv.value = cvv.value.substr(0,cvvLength);
        }
        if(value){
            value = value?.toString().substr(0,cvvLength);
        }
        
        const cvvValidateLength = cvvLength === value.toString()?.length? true: false;
        const validateCCVAE = (cvvValidateLength && /^\d{4}$/.test(value) && value != '');
        const validateCVV = (cvvValidateLength && /^\d{3}$/.test(value) && value != '');
        const cardResult = this.validateCC(ccno);
        const result:IError = Object.assign({});
        result.isValid = false;
        let cardErrorType:ErrorType = Object.assign({});
        result.value = value;
        const cardTypeObj: any = creditCardType(ccno);
        if (cardResult && cardResult.isValid) {            
            switch (cardTypeObj[0].type.toLowerCase()) {
            case 'american-express':
                flag = validateCCVAE;
                cardErrorType = ErrorType.american_express;
                break;
            case 'discover':
                flag = validateCVV;
                cardErrorType = ErrorType.discover;
                break;
            case 'mastercard':
                flag = validateCVV;
                cardErrorType = ErrorType.mastercard;
                break;
            case 'visa':
                flag = validateCVV;
                cardErrorType = ErrorType.visa;
                break;
            default:
                break;
            }
        }
        result.isValid = flag;
        if(!flag){
            if(!value.trim()){
                result.errorType = ErrorType.no_value;
            } else if(value.length<3 && cardTypeObj[0]?.type!=='american-express'){
                result.errorType = cardErrorType;
            }else if(value.length<4 && cardTypeObj[0]?.type==='american-express'){
                result.errorType = cardErrorType;
            } else if(!this.isNumeric(value)){
                result.errorType = ErrorType.alpha_characters;
            } else{
                result.errorType = ErrorType.too_many_digits;
            }
        }
        return result;
    }
    /**
   *
   * @param value Input Validation of Account/ACH form
   * @returns true or false
   */
    public validateAccountNo(value: string): IError {
        const result:IError = Object.assign({});
        let flag = false;
        
        const symbolVal = value.split('').slice(0,2).join('');
        // TODO: Move this to a common place to be re-used
        const validBankAccountRegex = new RegExp('^[0-9]{4,17}$');
        if(symbolVal === '**') {
            result.isValid = true;
        } else{
            if (validBankAccountRegex.test(value)) {
                flag = true;
            }
            result.isValid = flag;
            if(!value.trim()){
                result.errorType = ErrorType.no_value;
            } else if(!this.isNumeric(value)){
                result.errorType = ErrorType.alpha_characters;
            } else if(value.length>17){
                result.errorType = ErrorType.too_many_digits;
            } else if(!flag){
                result.errorType = ErrorType.invalid;
            } 
        }
        return result;
    }
    public validateRoutingNo(value: string): IError {
        const result:IError = Object.assign({});
        if (!value) {
            //all 0's is technically a valid routing number, but it's inactive
            //empty message
            result.isValid = false;
            result.errorType = ErrorType.no_value;
            return result;
        }
        const routing = value.toString();

        //gotta be 9  digits
        const match = routing.match('^\\d{9}$');
        if (!match) {
            //length check message
            result.isValid = false;
            if(value.length<9){
                result.errorType = ErrorType.not_enough_digits;
            } else if(value.length>9){
                result.errorType = ErrorType.too_many_digits;
            } else if(!this.isNumeric(value)){
                result.errorType = ErrorType.alpha_characters;
            }else{
                result.errorType = ErrorType.invalid;
            }            
            return result;
        }
        //The first two digits of the nine digit RTN must be in the ranges 00 through 12, 21 through 32, 61 through 72, or 80.
        const firstTwo = parseInt(routing.substring(0, 2));
        const firstTwoValid =
      (0 <= firstTwo && firstTwo <= 12) ||
      (21 <= firstTwo && firstTwo <= 32) ||
      (61 <= firstTwo && firstTwo <= 72) ||
      firstTwo === 80;
        if (!firstTwoValid) {
            //first two characters not in rnage 00 through 12, 21 through 32, 61 through 72, or 80.
            result.isValid = false;
            result.errorType = ErrorType.invalid;
            return result;
        }
        //this is the checksum
        //http://www.siccolo.com/Articles/SQLScripts/how-to-create-sql-to-calculate-routing-check-digit.html
        const weights = [3, 7, 1];
        let sum = 0;
        for (let i = 0; i < 8; i++) {
            sum += parseInt(routing[i]) * weights[i % 3];
        }
        const valid = (10 - (sum % 10)) % 10 === parseInt(routing[8]);
        result.isValid = valid;
        if(!valid){                        
            if(value.length<9){
                result.errorType = ErrorType.not_enough_digits;
            } else if(value.length>9){
                result.errorType = ErrorType.too_many_digits;
            } else if(!this.isNumeric(value)){
                result.errorType = ErrorType.alpha_characters;
            }else{
                result.errorType = ErrorType.invalid;
            }            
        }        
        return result;
    }
    public formatExpDate(e:any):any {
        const code = e.keyCode;
        const allowedKeys = [8];
        if (allowedKeys.indexOf(code) !== -1) {
            return  {
                'flag':false,
                'message': 'empty'
            };
        }
      
        e.target.value = e.target.value.replace(
            /^([1-9]\/|[2-9])$/g, '0$1/' // 3 > 03/
        ).replace(
            /^(0[1-9]|1[0-2])$/g, '$1/' // 11 > 11/
        ).replace(
            /^([0-1])([3-9])$/g, '0$1/$2' // 13 > 01/3
        ).replace(
            /^(0?[1-9]|1[0-2])([0-9]{2})$/g, '$1/$2' // 141 > 01/41
        ).replace(
            /^([0]+)\/|[0]+$/g, '0' // 0/ > 0 and 00 > 0
        ).replace(
            /[^\d\/]|^[\/]*$/g, '' // To allow only digits and `/`
        ).replace(
            /\/\//g, '/' // Prevent entering more than 1 `/`
        );

        if(e.target.value.length === 5){
            const flag = this.validExpirationCheck(e.target.value);
            return {
                'flag': flag,
                'message': 'invalid'
            };
        }
        return {
            'flag': true,
            'message': ''
        };
    }
    public validateAccountTypeChecking(value: string): boolean {
        let flag = false;
        if (value !== '') {
            flag = true;
        }
        return flag;
    }
    public validateAccountTypeSaving(value: string): boolean {
        let flag = false;
        if (value !== '') {
            flag = true;
        }
        return flag;
    }

    /**
   *
   * @param value Input Validation of Address
   * @returns true or false
   */
    public validateAddress(value: string): IError {
        let flag = false;
        const result:IError = Object.assign({});
        if (value != '' && value.length > 0 && value.length <= 150 ) {
            flag = true;
            flag = this.validateNumbersLengths(value, 12, true, 8);
        }
        result.isValid = flag;
        result.value = value;
        if(!flag){
            if(!value.trim()){
                result.errorType = ErrorType.no_value;
            } else {
                result.errorType = ErrorType.invalid;
            } 
        }
        return result;
    }
    public validateAddressLine2(value: string): boolean {
        let flag = false;
        if (value !== '') {
            if (value != '' && value.length > 0 && value.length <= 150 ) {
                flag = true;
                flag = this.validateNumbersLengths(value, 12, true, 8);
            }
        } else {
            flag = true;
        }
        return flag;
    }
    public validateCity(value: string): IError {
        let flag = false;
        const result:IError = Object.assign({});
        if (/^[A-Za-z\s]{2,20}$/.test(value) && value != '') {
            flag = true;
            flag = this.validateNumbersLengths(value, 0, true, 0);
        }
        result.isValid = flag;
        result.value = value;
        if(!flag){
            if(!value.trim()){
                result.errorType = ErrorType.no_value;
            } else {
                result.errorType = ErrorType.invalid;
            } 
        }
        return result;
    }
    public validateState(value: string): boolean {
        let flag = false;
        if (/^[A-Za-z]{2}$/.test(value) && value != '') {
            flag = true;
            flag = STATES.indexOf(value) > -1;
        }
        return flag;
    }
    public validateZipcode(value: string): IError {
        let flag = false;
        const result:IError = Object.assign({});
        if (/(^[0-9]{5}(?:-[0-9]{4})?$)/.test(value) || /(^[0-9]{5}(?:[0-9]{4})?$)/.test(value)) {
            flag = true;
        }
        // if (/(^\d{5}$)|(^\d{5} \d{4}$)/.test(value)) {
        //     flag = true;
        // }
        const newVal = value.split('');
        const firstFiveDigitZipCode = newVal.slice(0,5).join('');
        const lastFourDigitZipCode = newVal.slice(-4,newVal.length).join('');
        if(firstFiveDigitZipCode === '00000' || (value.length > 4 && lastFourDigitZipCode === '0000')) {
            flag = false;
        }
        
        result.isValid = flag;
        result.value = value;
        if(!flag){
            if(!value.trim()){
                result.errorType = ErrorType.no_value;
            } else {
                result.errorType = ErrorType.invalid;
            } 
        }
        return result;
    }


    /**
   *
   * @param value INput Validation dependency Functions
   * @returns true or false
   */
    private validateNumbersLengths(
        val: string,
        max_allowd: number,
        numberRecursive = true,
        consecutive: number,
    ): boolean {
        let flag = false;
        if (val.replace(/[^.\d]/g, '').length <= max_allowd) {
            flag = numberRecursive ? this.haveConsecutive(val, consecutive) : true;
        }
        return flag;
    }
    haveConsecutive(val:any, consLimit:number) {
        let flag = true;
        let count = 0;
        const name= val.split('');
        if(consLimit === 0) return true;
        for(let i = 0; i < name.length; i++ ) {
            if(typeof +name[i] === 'number') count +=1;
            if(name[i] === ' ') count = 0;
            if(isNaN(name[i]) === true) count = 0;
            if(count > consLimit) {
                flag= false;
                break;
            }
        }
        return flag;
    }
    private isNumeric(value:string) {
        return /^\d+$/.test(value);
    }
    public validateAutoPayAndStoredPaymentACH(): boolean {
        const global = Globals.getInstance();
        const channelName = global.appState.get('channelData')?.channelDetails.channelName;
        const allowedChannelList = this.isBusinessChannelNameAllowed(channelName);
        const displayStoredPaymentOption = document.querySelector('#jump-ach-web-component [name="jump-tc-checkbox"]') as HTMLInputElement;
        const cpcPageType:any = global.appState.get('config').cpcPageType.toLowerCase();
        const isStoredPaymentRequired = cpcPageType === WALLET_MGMT_NO_AUTOPAY.toLowerCase();
        if (isStoredPaymentRequired) {
            return displayStoredPaymentOption?.checked;
        }
        const displayAutoPayEnroll = document.querySelector('#jump-ach-web-component [name="jump-auto-pay-checkbox"]') as HTMLInputElement;
        const config = this.setStoredPaymentValidationSelectionRequirement();
        const storedPaymentValidationSelection = this.setStoredPaymentValidationSelection(config.displayAutoPayEnroll, config.displayStoredPaymentMethod, config.requireStoredPaymentSelection, config.selectStoredPaymentOnLoad);
        const isValid:any = this.validateAutoPay(displayAutoPayEnroll?.checked, displayStoredPaymentOption?.checked, allowedChannelList, storedPaymentValidationSelection);
        return isValid;
    }
    // Stored Payment Selection Validation
    public validateAutoPayAndStoredPaymentCC(): boolean {
        const global = Globals.getInstance();
        const channelName = global.appState.get('channelData')?.channelDetails.channelName;
        const allowedChannelList = this.isBusinessChannelNameAllowed(channelName);
        const displayStoredPaymentOption = document.querySelector('#jump-cc-web-component [name="jump-tc-checkbox"]') as HTMLInputElement;
        
        const cpcPageType:any = global.appState.get('config').cpcPageType.toLowerCase();
        const isStoredPaymentRequired = cpcPageType === WALLET_MGMT_NO_AUTOPAY.toLowerCase();
        if (isStoredPaymentRequired) {
            return displayStoredPaymentOption?.checked;
        }
        const displayAutoPayEnroll = document.querySelector('#jump-cc-web-component [name="jump-auto-pay-checkbox"]') as HTMLInputElement;
        const config = this.setStoredPaymentValidationSelectionRequirement();
        const storedPaymentValidationSelection = this.setStoredPaymentValidationSelection(config.displayAutoPayEnroll, config.displayStoredPaymentMethod, config.requireStoredPaymentSelection, config.selectStoredPaymentOnLoad);
        const isValid:any = this.validateAutoPay(displayAutoPayEnroll?.checked, displayStoredPaymentOption?.checked, allowedChannelList, storedPaymentValidationSelection);
        return isValid;
    }
   
    validateAutoPay(displayAutoPayEnroll:boolean, displayStoredPaymentOption: boolean, allowedChannelList:boolean, storedPaymentValidationSelection:any) {
        let isValid = false;
        if(!displayAutoPayEnroll && !displayStoredPaymentOption && storedPaymentValidationSelection?.userSelectCheckboxRequired)  {
            return false;
        }
        if(!displayAutoPayEnroll && displayStoredPaymentOption && storedPaymentValidationSelection?.userSelectCheckboxRequired)  {
            return true;
        }
        if(!displayAutoPayEnroll && !displayStoredPaymentOption && (allowedChannelList || !allowedChannelList)) {
            isValid = true;
            return isValid;
        } else if(displayAutoPayEnroll  && !displayStoredPaymentOption  && allowedChannelList) {
            isValid = true;
            return isValid;
        } else if(displayAutoPayEnroll  && !displayStoredPaymentOption && !allowedChannelList) {
            isValid = false;
            return isValid;
        } else if(displayAutoPayEnroll && displayStoredPaymentOption && (allowedChannelList || !allowedChannelList)) {
            isValid = true;
            return isValid;
        } else if (!displayAutoPayEnroll && displayStoredPaymentOption && (allowedChannelList || !allowedChannelList)) {
            isValid = true;
            return isValid;
        }
        return isValid;
    }
    isCheckBoxSelected(reference:string):boolean {
        let flag = false;
        const autoPayCheckbox = document.querySelector(reference) as HTMLInputElement;
        if(autoPayCheckbox?.checked) {
            flag = true;
        }
        return flag;
    }
    isBusinessChannelNameAllowed(channelName: string): boolean{
        const allowedList:Array<string> =  BUSINESS_AUTO_PAY_CHANNEL_LIST;
        let flag = false;
        if(channelName) {
            for(let i=0; i<allowedList.length; i++) {
                if(channelName.indexOf(allowedList[i])>=0) {
                    flag = true;
                    break;
                }
            }
        }
        return flag;
    }
    isSetStoredPayment() {
        const global = Globals.getInstance();
        let displayTermsCondition = global.appState.get('channelData')?.config?.displayStoredPaymentOption;
        const displayAutoPayEnroll = global.appState.get('channelData')?.config?.displayAutoPayEnroll;
        const channelName = global.appState.get('channelData')?.channelDetails.channelName;
        const allowedChannelList = this.isBusinessChannelNameAllowed(channelName);
        const cpcPageType:any = global.appState.get('config').cpcPageType.toLowerCase();
        const isWalletRequired = cpcPageType === WALLET_MGMT_NO_AUTOPAY.toLowerCase();
        
        if(isWalletRequired === true) {
            displayTermsCondition = true;
        }
        const config = this.setStoredPaymentValidationSelectionRequirement();
        const storedPaymentValidationSelection = this.setStoredPaymentValidationSelection(config.displayAutoPayEnroll, config.displayStoredPaymentMethod, config.requireStoredPaymentSelection, config.selectStoredPaymentOnLoad);
        let isValid = false;
        if(storedPaymentValidationSelection?.displayStorePaymentComponent) {
            isValid = true;
            return isValid;
        }
        if(!displayAutoPayEnroll && !displayTermsCondition && (allowedChannelList || !allowedChannelList)) {
            isValid = false;
            return isValid;
        } else if(!displayAutoPayEnroll  && displayTermsCondition  && !allowedChannelList) {
            isValid = true;
            return isValid;
        } else if(displayAutoPayEnroll  && !displayTermsCondition  && allowedChannelList) {
            isValid = false;
            return isValid;
        } else if(displayAutoPayEnroll  && displayTermsCondition  && !allowedChannelList) {
            isValid = true;
            return isValid;
        } 
        else if(displayAutoPayEnroll  && !displayTermsCondition  && !allowedChannelList) {
            isValid = true;
            return isValid;
        }
        return isValid;
    }
    // isdisplayStoredPaymentOptionRequired
    isdisplayStoredPaymentOptionRequired() {
        const global = Globals.getInstance();
        const channelName = global.appState.get('channelData')?.channelDetails.channelName;
        const config = global.appState.get('channelData')?.config;
        const displayStoredPaymentMethod = config?.displayStoredPaymentOption;        
        let displayStoredPaymentContainer = false;
        
        if(!this.isBusinessChannelNameAllowed(channelName)) {
            if(!config?.displayAutoPayEnroll && !config?.displayStoredPaymentMethod && !config?.requireStoredPaymentSelection && !config?.selectStoredPaymentOnLoad) {
                displayStoredPaymentContainer = false;
                return displayStoredPaymentContainer;
            }
            if(!config?.displayAutoPayEnroll && !config?.displayStoredPaymentMethod && !config?.requireStoredPaymentSelection && config?.selectStoredPaymentOnLoad) {
                displayStoredPaymentContainer = false;
                return displayStoredPaymentContainer;
            }
            if(!displayStoredPaymentMethod || displayStoredPaymentMethod) {
                displayStoredPaymentContainer = true;
                return displayStoredPaymentContainer;
            }
        }
        return displayStoredPaymentContainer;
    }
    // default selectStoredPaymentOnLoad
    defaultSelectStoredPaymentOnLoad() {
        const global = Globals.getInstance();
        let selectStoredPaymentOnLoad = global.appState.get('channelData')?.config?.selectStoredPaymentOnLoad;
        if(selectStoredPaymentOnLoad !== false) {
            selectStoredPaymentOnLoad = true;
            return selectStoredPaymentOnLoad;
        } else {
            selectStoredPaymentOnLoad = false;
            return selectStoredPaymentOnLoad;
        }
    }
    setStoredPaymentValidationSelectionRequirement() {
        const global = Globals.getInstance();
        const displayAutoPayEnroll = global.appState.get('channelData')?.config?.displayAutoPayEnroll;
        const displayStoredPaymentMethod = this.isdisplayStoredPaymentOptionRequired();
        const requireStoredPaymentSelection = global.appState.get('channelData')?.config?.requireStoredPaymentSelection;
        const selectStoredPaymentOnLoad = this.defaultSelectStoredPaymentOnLoad();
        const channelName = global.appState.get('channelData')?.channelDetails?.channelName;
        const storeConfig = Object.assign({});
        storeConfig.displayAutoPayEnroll = displayAutoPayEnroll;
        storeConfig.displayStoredPaymentMethod = displayStoredPaymentMethod;
        storeConfig.requireStoredPaymentSelection = requireStoredPaymentSelection;
        storeConfig.selectStoredPaymentOnLoad  = selectStoredPaymentOnLoad ;
        storeConfig.channelName = channelName;
        return storeConfig;
    }
    setStoredPaymentValidationSelection(displayAutoPayEnroll:any,displayStoredPaymentMethod:any, requireStoredPaymentSelection:any, selectStoredPaymentOnLoad:any) {
        const storedPayment = Object.assign({});
        if(displayAutoPayEnroll && displayStoredPaymentMethod && requireStoredPaymentSelection && selectStoredPaymentOnLoad) {
            //A Stored payment checkbox selected on render, cannot be unselected
            storedPayment.checkboxSelectedOnload = true;
            storedPayment.displayStorePaymentComponent = true;
            return storedPayment;
        } else if(displayAutoPayEnroll && !displayStoredPaymentMethod && requireStoredPaymentSelection && selectStoredPaymentOnLoad) {
            //A Stored payment checkbox selected on render, cannot be unselected
            storedPayment.checkboxSelectedOnload = true;
            storedPayment.displayStorePaymentComponent = false;
            return storedPayment;
        }   else if(!displayAutoPayEnroll && displayStoredPaymentMethod && requireStoredPaymentSelection && selectStoredPaymentOnLoad) {
            //B Stored payment checkbox selected on render, cannot be unselected
            storedPayment.checkboxSelectedOnload = true;
            storedPayment.displayStorePaymentComponent = true;
            return storedPayment;
        } else if(!displayAutoPayEnroll && displayStoredPaymentMethod && !requireStoredPaymentSelection && selectStoredPaymentOnLoad) {
            //C Stored payment checkbox not selected on render, form can be submitted with it checked or not
            storedPayment.checkboxSelectedOnload = false;
            storedPayment.displayStorePaymentComponent = true;
            storedPayment.userSelectCheckboxRequired = false;
            return storedPayment;
        } else if(!displayAutoPayEnroll && displayStoredPaymentMethod && !requireStoredPaymentSelection && !selectStoredPaymentOnLoad) {
            //C Stored payment checkbox not selected on render, form can be submitted with it checked or not
            storedPayment.checkboxSelectedOnload = false;
            storedPayment.displayStorePaymentComponent = true;
            storedPayment.userSelectCheckboxRequired = false;
        
            return storedPayment;
        } else if(!displayAutoPayEnroll && displayStoredPaymentMethod && requireStoredPaymentSelection && !selectStoredPaymentOnLoad) {
            //D Stored payment checkbox not selected on render. If form is submitted unchecked a stored_payment form validation message is displayed before this component requiring the user to check it.
            storedPayment.checkboxSelectedOnload = false;
            storedPayment.displayStorePaymentComponent = true;
            storedPayment.userSelectCheckboxRequired = true;
            return storedPayment;
        }  else if(displayAutoPayEnroll && displayStoredPaymentMethod && requireStoredPaymentSelection && !selectStoredPaymentOnLoad) {
            //E Stored payment checkbox not selected on render. If form is submitted unchecked a stored_payment form validation message is displayed before this component requiring the user to check it. If auto pay checkbox is selected this is already behaving as expected. See attachment for expected behavior when autopay is not checked.
            storedPayment.checkboxSelectedOnload = false;
            storedPayment.displayStorePaymentComponent = true;
            storedPayment.userSelectCheckboxRequired = true;
            return storedPayment;
        } else if(!displayAutoPayEnroll && !displayStoredPaymentMethod && !requireStoredPaymentSelection && !selectStoredPaymentOnLoad) {
            //F Stored payment checkbox should not be displayed when displayAutoPayEnroll requireStoredPaymentSelection selectStoredPaymentOnLoad is false.
            storedPayment.checkboxSelectedOnload = false;
            storedPayment.displayStorePaymentComponent = false;
            storedPayment.userSelectCheckboxRequired = false;
            return storedPayment;
        } else if(!displayAutoPayEnroll && !displayStoredPaymentMethod && !requireStoredPaymentSelection && selectStoredPaymentOnLoad) {
            //H Stored payment checkbox selected on render, can be unselected
            storedPayment.checkboxSelectedOnload = true;
            storedPayment.displayStorePaymentComponent = true;
            storedPayment.userSelectCheckboxRequired = false;
            return storedPayment;
        }{
            storedPayment.checkboxSelectedOnload;
            storedPayment.displayStorePaymentComponent;
            return storedPayment;
        }
    }
    disPatchInfoEvent(paymentMethodType:string,paymentMethodID:string, dataLayerService:any):any { 
        switch(paymentMethodType) {
        case 'visa':
            dataLayerService.dispatchInfoEvent(CPC_EXISTING_PAYMENT_OPTION_SELECTED,paymentMethodID + ' ' + paymentMethodType);
            break;
        case 'discover':
            dataLayerService.dispatchInfoEvent(CPC_EXISTING_PAYMENT_OPTION_SELECTED,paymentMethodID + ' ' + paymentMethodType);
            break;
        case 'mastercard':
            dataLayerService.dispatchInfoEvent(CPC_EXISTING_PAYMENT_OPTION_SELECTED,paymentMethodID + ' ' + paymentMethodType);
            break;
        case 'americanexpress':
            dataLayerService.dispatchInfoEvent(CPC_EXISTING_PAYMENT_OPTION_SELECTED,paymentMethodID + ' ' + paymentMethodType);
            break;
        case 'bank':
            dataLayerService.dispatchInfoEvent(CPC_EXISTING_PAYMENT_OPTION_SELECTED,paymentMethodID + ' ' + paymentMethodType);
            break;
        default:
            break;
        }
        switch(paymentMethodID) {
        case 'jump-new-card-option':
            dataLayerService.dispatchInfoEvent(CPC_NEW_CARD_OPTION_SELECTED, paymentMethodID);
            break;
        case 'jump-new-bank-option':
            dataLayerService.dispatchInfoEvent(CPC_NEW_BANK_OPTION_SELECTED, paymentMethodID);
            break;
        case 'jump-new-payment-option':
            dataLayerService.dispatchInfoEvent(CPC_NEW_PAYMENT_OPTION_SELECTED, paymentMethodType);
            break;
        default:
            break;         
        }
    }
    isValidValue (value: any): boolean  {
        let flag = false;
        if (value && value !== null && typeof value !== undefined && value !== 'undefined' && value !== '') {
            flag = true;
        }
        return flag;
    }
    isUserRoleValid(value:string, pageType:string, formSubmitWalletId?:string):boolean{
        let flag = true;
        const global = Globals.getInstance();
        const channelData = global.appState.get('channelData');
        let selectedUserWalletId = '';
        if(isStoredPaymentComponentChecked(pageType.toLowerCase())){
            if ( channelData?.config?.enableMultipleUserSelection) {
                if(channelData.customerDetails?.userRoleList && Array.isArray(channelData.customerDetails?.userRoleList) && channelData.customerDetails?.userRoleList.length > 0){
                    channelData.customerDetails?.userRoleList?.map((userrole: UserRoleDetails) => {
                        const walletId = getSelectedUserWalletId(pageType, userrole);
                        if(walletId) {
                            selectedUserWalletId = walletId;
                            flag = true;
                        }
                    });
                }  else{
                    selectedUserWalletId = channelData.customerDetails.walletId;
                    flag = true;
                }
            } else{
                selectedUserWalletId = channelData.customerDetails.walletId;
                flag = true;
            }
        }else{
            selectedUserWalletId = channelData.customerDetails.walletId;
            flag = true;
        }
        if(formSubmitWalletId){
            selectedUserWalletId = formSubmitWalletId;
        }
        flag = this.isValidValue(selectedUserWalletId);

        return flag;
    }
}
