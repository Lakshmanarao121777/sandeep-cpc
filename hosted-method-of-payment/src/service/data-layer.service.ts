import { CPC_BANK_ACCOUNT_TYPE_SELECT, CPC_BANK_ADDRESS_SELECT, CPC_BANK_API_SUBMIT, CPC_BANK_SUBMIT, CPC_CREDIT_CARD_ADDRESS_SELECT, CPC_CREDIT_CARD_API_SUBMIT, CPC_CARD_SUBMIT, CPC_MIN_CARD_API_SUBMIT, CPC_MIN_CARD_EDIT_API_SUBMIT, CPC_MIN_CARD_EDIT_SUBMIT, CPC_MIN_CARD_SUBMIT, EVN_CPC_INFO_EVENT, CPC_PAYMENT_METHOD_CARD_SELECT, CPC_PAYMENT_METHOD_BANK_SELECT, CPC_BANK_STATE_SELECT, CPC_CARD_STATE_SELECT, CPC_CARD_EXP_MM_SELECT, CPC_CARD_EXP_YY_SELECT, CPC_MIN_BANK_SUBMIT, CPC_MIN_BANK_API_SUBMIT, CURRENT_CHANNEL_DOMAIN, CPC_CARD_AUTO_PAY_SELECTED, CPC_BANK_AUTO_PAY_SELECTED, CPC_BANK_TERMS_AND_CONDITION_SELECTED, CPC_CARD_TERMS_AND_CONDITION_SELECTED,CPC_NEW_BANK_OPTION_SELECTED, CPC_NEW_CARD_OPTION_SELECTED, CPC_NEW_PAYMENT_OPTION_SELECTED, CPC_EXISTING_PAYMENT_OPTION_SELECTED, CPC_CARD_PRIMARY_ADDRESS_OPTION_SELECT, CPC_BANK_PRIMARY_ADDRESS_OPTION_SELECT, CPC_CARD_SECONDARY_ADDRESS_OPTION_SELECT, CPC_BANK_SECONDARY_ADDRESS_OPTION_SELECT, CPC_WALLET_MGMT_NO_AUTOPAY_EDIT_API_SUBMIT, CPC_WALLET_MGMT_NO_AUTOPAY_EDIT_SELECTED, CPC_WALLET_MGMT_NO_AUTOPAY_REMOVE_SELECTED, CPC_WALLET_MGMT_NO_AUTOPAY_UPDATE, CPC_WALLET_MGMT_NO_AUTOPAY_BANK_FORM_CANCELED, CPC_WALLET_MGMT_NO_AUTOPAY_CARD_FORM_CANCELED, CPC_CARD_OR_BANK_PAYMENT_TYPE_NOT_SELECTED, CPC_CARD_BANK_OR_EXISTING_PAYMENT_TYPE_NOT_SELECTED, CPC_BANK_OR_CARD_PAYMENT_TYPE_NOT_SELECTED, CPC_BANK_CARD_OR_EXISTING_PAYMENT_TYPE_NOT_SELECTED, CPC_CARD_OR_EXISTING_PAYMENT_TYPE_NOT_SELECTED, CPC_CREDIT_CARD_USERROLE_SELECT, CPC_BANK_USERROLE_SELECT, CPC_CARD_EXPIRATION_EDIT_CANCEL_SELECTED, CPC_CARD_EXPIRATION_EDIT_UPDATE_SELECTED, CPC_CARD_EXPIRATION_EDIT_EDIT_SELECTED, CPC_CARD_EXPIRATION_EDIT_REMOVE_SELECTED } from '../constant/app.constant';
import { IEventInfo } from '../model/view.model';
import { dataLayerEventInfoMap} from '../model/data-layer.model';
export class DataLayerService {    
    dispatchInfoEvent(key:string, val?:any){
        const eventInfo:IEventInfo = Object.assign({});
        let data:any = Object.assign({});
        eventInfo.action = EVN_CPC_INFO_EVENT;        
        eventInfo.type = dataLayerEventInfoMap.get(key)?.key;                
        eventInfo.dataLayerKey = dataLayerEventInfoMap.get(key)?.dataLayerKey;
        eventInfo.currentValue = this.parseCurrentValue(key, val);
        data[dataLayerEventInfoMap.get(key)?.dataLayerKey] = {
            type: eventInfo.type,
            currentValue: eventInfo.currentValue
        };
        data  = this.transformData(key, val, data);
        eventInfo.data = data;
        console.log('EventInfo ', eventInfo);
        parent.postMessage(JSON.stringify(eventInfo), CURRENT_CHANNEL_DOMAIN.URI);
    }
    transformData(key:string, value:string, data:any): any {
        let result = Object.assign({});
        let actionName = '';

        switch(key) {
        case CPC_PAYMENT_METHOD_CARD_SELECT:
            data.eventName = 'click';
            data.eventAction = 'add a new credit card';
            data.eventMethod = 'send-Event';
            result = {
                'event': [
                    {
                        'eventInfo': data
                    }
                ]
            };
            break;
        case CPC_PAYMENT_METHOD_BANK_SELECT:
            data.eventName = 'click';
            data.eventAction = 'add a new bank account';
            data.eventMethod = 'send-Event';
            result = {
                'event': [
                    {
                        'eventInfo': data
                    }
                ]
            };
            break;
        case CPC_CREDIT_CARD_ADDRESS_SELECT:
            actionName = value.toString()==='true'? ':checked':':unchecked';
            data.eventName = 'click';
            data.eventAction = 'use a different address' + actionName;
            data.eventMethod = 'send-Event';
            result = {
                'event': [
                    {
                        'eventInfo': data
                    }
                ]
            };
            break;
        case CPC_BANK_ADDRESS_SELECT:
            actionName = value.toString()==='true'? ':checked':':unchecked';
            data.eventName = 'click';
            data.eventAction = 'use a different address' + actionName;
            data.eventMethod = 'send-Event';
            result = {
                'event': [
                    {
                        'eventInfo': data
                    }
                ]
            };
            break;
        case CPC_CARD_PRIMARY_ADDRESS_OPTION_SELECT:
            data.eventName = 'click';
            data.eventAction = value;
            data.eventMethod = 'send-Event';
            result = {
                'event': [
                    {
                        'eventInfo': data
                    }
                ]
            };
            break;
        case CPC_BANK_PRIMARY_ADDRESS_OPTION_SELECT:
            data.eventName = 'click';
            data.eventAction = value;
            data.eventMethod = 'send-Event';
            result = {
                'event': [
                    {
                        'eventInfo': data
                    }
                ]
            };
            break;
        case CPC_CARD_SECONDARY_ADDRESS_OPTION_SELECT:
            data.eventName = 'click';
            data.eventAction = value;
            data.eventMethod = 'send-Event';
            result = {
                'event': [
                    {
                        'eventInfo': data
                    }
                ]
            };
            break;
        case CPC_BANK_SECONDARY_ADDRESS_OPTION_SELECT:
            data.eventName = 'click';
            data.eventAction = value;
            data.eventMethod = 'send-Event';
            result = {
                'event': [
                    {
                        'eventInfo': data
                    }
                ]
            };
            break;
        case CPC_BANK_ACCOUNT_TYPE_SELECT:
            data.eventName = 'click';
            data.eventAction = value;
            data.eventMethod = 'send-Event';
            result = {
                'event': [
                    {
                        'eventInfo': data
                    }
                ]
            };
            break;
        case CPC_CARD_STATE_SELECT:
            data.eventName = 'click';
            data.eventAction = 'state:' + value;
            data.eventMethod = 'send-Event';
            result = {
                'event': [
                    {
                        'eventInfo': data
                    }
                ]
            };
            break;
        case CPC_BANK_STATE_SELECT:
            data.eventName = 'click';
            data.eventAction = 'state:' + value;
            data.eventMethod = 'send-Event';
            result = {
                'event': [
                    {
                        'eventInfo': data
                    }
                ]
            };
            break;
        case CPC_CARD_EXP_MM_SELECT:
        case CPC_CARD_EXP_YY_SELECT:
            data.eventName = 'click';
            data.eventAction ='expiration:' +  value;
            data.eventMethod = 'send-Event';
            result = {
                'event': [
                    {
                        'eventInfo': data
                    }
                ]
            };
            break;
        case CPC_BANK_AUTO_PAY_SELECTED:
            data.eventName = 'click';
            data.eventAction = value;
            data.eventMethod = 'send-Event';
            result = {
                'event': [
                    {
                        'eventInfo': data
                    }
                ]
            };
            break;
        case CPC_CARD_AUTO_PAY_SELECTED:
            data.eventName = 'click';
            data.eventAction = value;
            data.eventMethod = 'send-Event';
            result = {
                'event': [
                    {
                        'eventInfo': data
                    }
                ]
            };
            break;
        case CPC_BANK_TERMS_AND_CONDITION_SELECTED:
            data.eventName = 'click';
            data.eventAction = value;
            data.eventMethod = 'send-Event';
            result = {
                'event': [
                    {
                        'eventInfo': data
                    }
                ]
            };
            break;
        case CPC_CARD_TERMS_AND_CONDITION_SELECTED:
            data.eventName = 'click';
            data.eventAction = value;
            data.eventMethod = 'send-Event';
            result = {
                'event': [
                    {
                        'eventInfo': data
                    }
                ]
            };
            break;
        case CPC_NEW_BANK_OPTION_SELECTED:
            data.eventName = 'click';
            data.eventAction = 'add a new bank account';
            data.eventMethod = 'send-Event';
            result = {
                'event': [
                    {
                        'eventInfo': data
                    }
                ]
            };
            break;
        case CPC_NEW_CARD_OPTION_SELECTED:
            data.eventName = 'click';
            data.eventAction = 'add a new credit card';
            data.eventMethod = 'send-Event';
            result = {
                'event': [
                    {
                        'eventInfo': data
                    }
                ]
            };
            break;
        case CPC_NEW_PAYMENT_OPTION_SELECTED:
            data.eventName = 'click';
            data.eventAction = value;
            data.eventMethod = 'send-Event';
            result = {
                'event': [
                    {
                        'eventInfo': data
                    }
                ]
            };
            break;
        case CPC_EXISTING_PAYMENT_OPTION_SELECTED:
            data.eventName = 'click';
            data.eventAction = value;
            data.eventMethod = 'send-Event';
            result = {
                'event': [
                    {
                        'eventInfo': data
                    }
                ]
            };
            break;
        case CPC_WALLET_MGMT_NO_AUTOPAY_EDIT_SELECTED:
            data.eventName = 'click';
            data.eventAction = value;
            data.eventMethod = 'send-Event';
            result = {
                'event': [
                    {
                        'eventInfo': data
                    }
                ]
            };
            break;
        case CPC_WALLET_MGMT_NO_AUTOPAY_REMOVE_SELECTED:
            data.eventName = 'click';
            data.eventAction = value;
            data.eventMethod = 'send-Event';
            result = {
                'event': [
                    {
                        'eventInfo': data
                    }
                ]
            };
            break;
        case CPC_WALLET_MGMT_NO_AUTOPAY_UPDATE:
            data.eventName = 'click';
            data.eventAction = value;
            data.eventMethod = 'send-Event';
            result = {
                'event': [
                    {
                        'eventInfo': data
                    }
                ]
            };
            break;
        case CPC_WALLET_MGMT_NO_AUTOPAY_UPDATE:
            data.eventName = 'click';
            data.eventAction = value;
            data.eventMethod = 'send-Event';
            result = {
                'event': [
                    {
                        'eventInfo': data
                    }
                ]
            };
            break;
        case CPC_WALLET_MGMT_NO_AUTOPAY_BANK_FORM_CANCELED:
            data.eventName = 'click';
            data.eventAction = value;
            data.eventMethod = 'send-Event';
            result = {
                'event': [
                    {
                        'eventInfo': data
                    }
                ]
            };
            break;
        case CPC_WALLET_MGMT_NO_AUTOPAY_CARD_FORM_CANCELED:
            data.eventName = 'click';
            data.eventAction = value;
            data.eventMethod = 'send-Event';
            result = {
                'event': [
                    {
                        'eventInfo': data
                    }
                ]
            };
            break;
        case CPC_CARD_OR_BANK_PAYMENT_TYPE_NOT_SELECTED:
            data.eventName = 'click';
            data.eventAction = value;
            data.eventMethod = 'send-Event';
            result = {
                'event': [
                    {
                        'eventInfo': data
                    }
                ]
            };
            break;
        case CPC_CARD_BANK_OR_EXISTING_PAYMENT_TYPE_NOT_SELECTED:
            data.eventName = 'click';
            data.eventAction = value;
            data.eventMethod = 'send-Event';
            result = {
                'event': [
                    {
                        'eventInfo': data
                    }
                ]
            };
            break;
        case CPC_BANK_OR_CARD_PAYMENT_TYPE_NOT_SELECTED:
            data.eventName = 'click';
            data.eventAction = value;
            data.eventMethod = 'send-Event';
            result = {
                'event': [
                    {
                        'eventInfo': data
                    }
                ]
            };
            break;
        case CPC_BANK_CARD_OR_EXISTING_PAYMENT_TYPE_NOT_SELECTED:
            data.eventName = 'click';
            data.eventAction = value;
            data.eventMethod = 'send-Event';
            result = {
                'event': [
                    {
                        'eventInfo': data
                    }
                ]
            };
            break;
        case CPC_CARD_OR_EXISTING_PAYMENT_TYPE_NOT_SELECTED:
            data.eventName = 'click';
            data.eventAction = value;
            data.eventMethod = 'send-Event';
            result = {
                'event': [
                    {
                        'eventInfo': data
                    }
                ]
            };
            break;
        case CPC_CARD_EXPIRATION_EDIT_CANCEL_SELECTED:
            data.eventName = 'click';
            data.eventAction = value;
            data.eventMethod = 'send-Event';
            result = {
                'event': [
                    {
                        'eventInfo': data
                    }
                ]
            };
            break;
        case CPC_CARD_EXPIRATION_EDIT_UPDATE_SELECTED:
            data.eventName = 'click';
            data.eventAction = value;
            data.eventMethod = 'send-Event';
            result = {
                'event': [
                    {
                        'eventInfo': data
                    }
                ]
            };
            break;
        case CPC_CARD_EXPIRATION_EDIT_REMOVE_SELECTED:
            data.eventName = 'click';
            data.eventAction = value;
            data.eventMethod = 'send-Event';
            result = {
                'event': [
                    {
                        'eventInfo': data
                    }
                ]
            };
            break;
        case CPC_CARD_EXPIRATION_EDIT_EDIT_SELECTED:
            data.eventName = 'click';
            data.eventAction = value;
            data.eventMethod = 'send-Event';
            result = {
                'event': [
                    {
                        'eventInfo': data
                    }
                ]
            };
            break;
        case CPC_CREDIT_CARD_USERROLE_SELECT:
        case CPC_BANK_USERROLE_SELECT:
            data.eventName = 'click';
            data.eventAction = value;
            data.eventMethod = 'send-Event';
            result = {
                'event': [
                    {
                        'eventInfo': data
                    }
                ]
            };
            break;
        
        default:
            result = {
                'page': {
                    'pageInfo': data
                }
            };
            break;
        }
        return result;
        
    }
    parseCurrentValue(key:string, val?:any): any {
        let currentValue = '';
        switch(key) {
        case CPC_CARD_SUBMIT:
        case CPC_BANK_SUBMIT:
        case CPC_MIN_BANK_SUBMIT:
        case CPC_MIN_CARD_SUBMIT:
        case CPC_MIN_CARD_EDIT_SUBMIT:
            currentValue = this.transformErrors(val);
            break;
        case CPC_CARD_PRIMARY_ADDRESS_OPTION_SELECT:
        case CPC_BANK_PRIMARY_ADDRESS_OPTION_SELECT: 
        case CPC_CARD_SECONDARY_ADDRESS_OPTION_SELECT: 
        case CPC_BANK_SECONDARY_ADDRESS_OPTION_SELECT:
        case CPC_CREDIT_CARD_ADDRESS_SELECT:
        case CPC_BANK_ADDRESS_SELECT:
            currentValue = this.transformAddress(val);
            break;
        case CPC_CREDIT_CARD_API_SUBMIT:
        case CPC_BANK_API_SUBMIT:
        case CPC_MIN_BANK_API_SUBMIT:
        case CPC_BANK_ACCOUNT_TYPE_SELECT:
        case CPC_MIN_CARD_API_SUBMIT:
        case CPC_MIN_CARD_EDIT_API_SUBMIT:
        case CPC_WALLET_MGMT_NO_AUTOPAY_EDIT_API_SUBMIT:
        case CPC_CARD_STATE_SELECT:
        case CPC_BANK_STATE_SELECT:
        case CPC_CARD_EXP_MM_SELECT:
        case CPC_CARD_EXP_YY_SELECT:
        case CPC_BANK_AUTO_PAY_SELECTED:
        case CPC_CARD_AUTO_PAY_SELECTED:
        case CPC_BANK_TERMS_AND_CONDITION_SELECTED:
        case CPC_CARD_TERMS_AND_CONDITION_SELECTED:
        case CPC_NEW_PAYMENT_OPTION_SELECTED:
        case CPC_EXISTING_PAYMENT_OPTION_SELECTED:
        case CPC_WALLET_MGMT_NO_AUTOPAY_EDIT_SELECTED: 
        case CPC_WALLET_MGMT_NO_AUTOPAY_REMOVE_SELECTED: 
        case CPC_WALLET_MGMT_NO_AUTOPAY_UPDATE:
        case CPC_WALLET_MGMT_NO_AUTOPAY_BANK_FORM_CANCELED:
        case CPC_WALLET_MGMT_NO_AUTOPAY_CARD_FORM_CANCELED:
        case CPC_CARD_OR_BANK_PAYMENT_TYPE_NOT_SELECTED:
        case CPC_CARD_BANK_OR_EXISTING_PAYMENT_TYPE_NOT_SELECTED:
        case CPC_BANK_OR_CARD_PAYMENT_TYPE_NOT_SELECTED:
        case CPC_BANK_CARD_OR_EXISTING_PAYMENT_TYPE_NOT_SELECTED:
        case CPC_CARD_OR_EXISTING_PAYMENT_TYPE_NOT_SELECTED:
        case CPC_CARD_EXPIRATION_EDIT_CANCEL_SELECTED: 
        case CPC_CARD_EXPIRATION_EDIT_UPDATE_SELECTED:
        case CPC_CARD_EXPIRATION_EDIT_EDIT_SELECTED:
        case CPC_CARD_EXPIRATION_EDIT_REMOVE_SELECTED:
        case CPC_CREDIT_CARD_USERROLE_SELECT:
        case CPC_BANK_USERROLE_SELECT:    
            currentValue = val;
            break;
        default:
            currentValue = dataLayerEventInfoMap.get(key)?.value;
            break;
        }
        return currentValue;
    }
    transformAddress(val?:any) {
        let curValue = '';
        if(val === true) {
            curValue = 'User entered address used';
        } else {
            curValue = 'External address used';
        }
        return curValue;
    }
    transformErrors(val?:any): any{
        const data:Map<string, boolean> = Object.assign(val);
        const errorMessageList = new Array<string>();
        if(data) {
            //let msg = '';
            for(const [key, value] of data.entries()){
                if(key){
                    switch (key){
                    case 'firstName':
                        if(!data.get(key)){
                            errorMessageList.push('First name is invalid');
                        }                        
                        break;
                    case 'lastName':
                        if(!data.get(key)){
                            errorMessageList.push('Last name is invalid');
                        }                        
                        break;
                    case 'cc':
                        if(!data.get(key)){
                            errorMessageList.push('Card number is invalid');
                        }                        
                        break;
                    case 'expMM':
                        if(!data.get(key)){
                            errorMessageList.push('Expiration month is invalid');
                        }                        
                        break;
                    case 'expYY':
                        if(!data.get(key)){
                            errorMessageList.push('Expiration year is invalid');
                        }                        
                        break;
                    case 'cvv':
                        if(!data.get(key)){
                            errorMessageList.push('Security code is invalid');
                        }                        
                        break;
                    case 'accountNo':
                        if(!data.get(key)){
                            errorMessageList.push('Account number is invalid');
                        }
                        break;
                    case 'routingNo':
                        if(!data.get(key)){
                            errorMessageList.push('Routing number is invalid');
                        }
                        break;
                    case 'accountType':
                        if(!data.get(key)){
                            errorMessageList.push('Account type is invalid');
                        }
                        break;
                    case 'address':
                        if(!data.get(key)){
                            errorMessageList.push('Address line1 is invalid');
                        }
                        break;
                    case 'addressLine2':
                        // if(!data.get(key)){
                        //     errorMessageList.push('Address line2 is invalid');
                        // }
                        break;
                    case 'city':
                        if(!data.get(key)){
                            errorMessageList.push('City is invalid');
                        }
                        break;
                    case 'state':
                        if(!data.get(key)){
                            errorMessageList.push('State is invalid');
                        }
                        break;
                    case 'zipCode':
                        if(!data.get(key)){
                            errorMessageList.push('Zip code is invalid');
                        }
                        break;            
                    case 'expiration':
                        if(!data.get(key)){
                            errorMessageList.push('Expiration (MM/YY) is invalid');
                        }
                        break;
                    default:
                        break;
                    }
                }
            }
        }
        return errorMessageList;
    }
}