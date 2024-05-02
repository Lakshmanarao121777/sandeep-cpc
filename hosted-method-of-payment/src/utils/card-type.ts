import { 
    ACCEPTED_CARDS,
    CPC_AMERICAN_EXPRESS, 
    CPC_DISCOVER, 
    CPC_GLOBAL_IMAGES_CARD_URL, 
    CPC_GLOBAL_IMAGES_ICONS_URL, 
    CPC_GLOBAL_IMAGES_POPUP_URL, 
    CPC_MASTERCARD, 
    CPC_VISA,
    JUMP_ERROR_MESSAGE_LOADED, 
    MAX_LENGTH_AMEX, 
    MAX_LENGTH_AMEX_TRAILS, 
    MAX_LENGTH_MASTERCARD, 
    MAX_LENGTH_MASTERCARD_TRAILS, 
    MAX_LENGTH_VISA_AND_DISCOVER,
    MAX_LENGTH_VISA_AND_DISCOVER_TRAILS} from '../constant/app.constant';
import creditCardType from 'credit-card-type';
import { Globals } from './globals';
import { PaymentType } from '../model/view.model';

const global = Globals.getInstance();    


const getImageDetails = (): any => {        
    const imageDetails = {
        'mastercard': {
            img: 'mastercard.png',
            full_name: 'Mastercard',
            name : 'MasterCard',
        },
        'visa': {
            img: 'visa.png',
            full_name: 'Visa',
            name : 'Visa',
        },
        'discover': {
            img: 'discover.png',
            full_name: 'Discover',
            name :'Discover',
        },
        'american-express': {
            img: 'amex.png',
            full_name: 'American Express',
            name : 'AmericanExpress'
        },
        invalid: {
            img: 'invalid.png',
            full_name: 'Invalid',
            name : 'Invalid'
        },
    };
    return imageDetails;
};

export const getCardTypes = (value: any , cardTypeLabel: any , cardNumber: any , global:any, evtType = ''): void => { 
    const cardTypeObj: any = creditCardType(value);
    let cType = 'invalid';
    const CARD_TYPES = getImageDetails();
    const config = global.appState.get('config');
    const cardTypeimageUrl = config.envConfig.globalUrl+CPC_GLOBAL_IMAGES_CARD_URL;
    const cardAccepted = ACCEPTED_CARDS;
    if(cardTypeObj.length > 0 && cardAccepted.includes(cardTypeObj[0].type) === true) {
        cType = cardTypeObj[0].type;
    }
    let formatted = '';
    global.appState.set('cardNiceType',translatePsTypeToNiceType(cType));
    if (cType === CPC_VISA || cType === CPC_DISCOVER || cType === 'invalid') {
        value = value.replace(/ /g, '').slice(0,MAX_LENGTH_VISA_AND_DISCOVER-MAX_LENGTH_VISA_AND_DISCOVER_TRAILS);
        cardNumber.maxLength = MAX_LENGTH_VISA_AND_DISCOVER.toString();
        const v = value.replace(/[^\d]/g, '').match(/.{1,4}/g);
        formatted = v ? v.join(' ') : '';
    } else if (cType == CPC_AMERICAN_EXPRESS) {
        value = value.replace(/ /g, '').slice(0,MAX_LENGTH_AMEX-MAX_LENGTH_AMEX_TRAILS);
        cardNumber.maxLength = MAX_LENGTH_AMEX.toString();
        const v = formatAmex(value.replace(/[^\d]/g, ''));
        formatted = v ? v.join('') : '';
    } else if (cType === CPC_MASTERCARD) {
        value = value.replace(/ /g, '').slice(0,MAX_LENGTH_MASTERCARD-MAX_LENGTH_MASTERCARD_TRAILS);
        cardNumber.maxLength = MAX_LENGTH_MASTERCARD.toString();
        const v = value.replace(/[^\d]/g, '').match(/.{1,4}/g);
        formatted = v ? v.join(' ') : '';
    }
    
    cardNumber.value = formatted;

    if(config.cpcPageType.toLowerCase() === PaymentType[PaymentType.MinCardOnly].toString().toLowerCase() || config.cpcPageType.toLowerCase() === PaymentType[PaymentType.MinCardOnlyWithEdit].toString().toLowerCase()){
        if (value.length === 4) {
            if (cardTypeObj.length > 0 && cType !== 'invaild') {
                if(cardTypeLabel.innerHTML !== '<img class="image-height" src="'+cardTypeimageUrl+CARD_TYPES[cardTypeObj[0]?.type]['img']+'" alt="'+CARD_TYPES[cardTypeObj[0].type]['full_name']+'">'){
                    global.appState.set('cardImgUrl', cardTypeimageUrl+CARD_TYPES[cardTypeObj[0]?.type]['img']);
                    cardTypeLabel.innerHTML = '<img class="image-height" src="'+cardTypeimageUrl+CARD_TYPES[cardTypeObj[0]?.type]['img']+'" alt="'+CARD_TYPES[cardTypeObj[0].type]['full_name']+'">';
                }
            }
        } else if (value.length < 4 ) {
            if( cardTypeLabel.innerHTML !== '<img class="image-height" src="'+cardTypeimageUrl+CARD_TYPES['invalid']['img']+'" alt="'+CARD_TYPES['invalid']['full_name']+'">'){
                global.appState.set('cardImgUrl', cardTypeimageUrl+CARD_TYPES['invalid']['img']);
                cardTypeLabel.innerHTML = '<img class="image-height" src="'+cardTypeimageUrl+CARD_TYPES['invalid']['img']+'" alt="'+CARD_TYPES['invalid']['full_name']+'">';
            }
        }
    }else{
        if (value.length >= 4 && cardTypeLabel.innerHTML === '') {
            if (cardTypeObj.length > 0 && cType !== 'invaild' && CARD_TYPES[cardTypeObj[0]?.type]) {
                global.appState.set('cardImgUrl', cardTypeimageUrl+CARD_TYPES[cardTypeObj[0]?.type]['img']);
                cardTypeLabel.innerHTML = '<img class="image-height" src="'+cardTypeimageUrl+CARD_TYPES[cardTypeObj[0]?.type]['img']+'" alt="'+CARD_TYPES[cardTypeObj[0]?.type]['full_name']+'">';
            }
        } else if (value.length < 4) {
            cardTypeLabel.innerHTML = '';
        }
    }
    
    if(evtType === 'paste' && value.length >= 4 && cardTypeObj.length>0 && CARD_TYPES[cardTypeObj[0]?.type]) {
        global.appState.set('cardImgUrl', cardTypeimageUrl+CARD_TYPES[cardTypeObj[0]?.type]['img']);
        cardTypeLabel.innerHTML = '<img class="image-height" src="'+cardTypeimageUrl+CARD_TYPES[cardTypeObj[0]?.type]['img']+'" alt="'+CARD_TYPES[cardTypeObj[0]?.type]['full_name']+'">';
    }
};

export function getCardTypesEdit(value: any , cardTypeLabel: any , cardNumber: any, cType:string): void { 
    const global = Globals.getInstance();
    const config = global.appState.get('config');
    const cardTypeimageUrl = config.envConfig.globalUrl+CPC_GLOBAL_IMAGES_CARD_URL;
    if(!cType) {
        cType = 'invalid';
    }
    cType = matchCardType(cType);
    const cardType = cType.toLowerCase();
    const CARD_TYPES = getImageDetails();
    global.appState.set('cardNiceType',translatePsTypeToNiceType(cType));
    if(cardType !== 'invalid'){
        global.appState.set('cardImgUrl', cardTypeimageUrl+CARD_TYPES[cardType]['img']);
        cardTypeLabel.innerHTML = '<img class="image-height" src="'+cardTypeimageUrl+CARD_TYPES[cardType]['img']+'" alt="'+CARD_TYPES[cardType]['full_name']+'">';
    }else{
        if(config.cpcPageType.toLowerCase() === PaymentType[PaymentType.MinCardOnly].toString().toLowerCase() || config.cpcPageType.toLowerCase() === PaymentType[PaymentType.MinCardOnlyWithEdit].toString().toLowerCase()){
            if(cardTypeLabel.innerHTML !== '<img class="image-height" src="'+cardTypeimageUrl+CARD_TYPES['invalid']['img']+'" alt="'+CARD_TYPES['invalid']['full_name']+'">'){
                global.appState.set('cardImgUrl', cardTypeimageUrl+CARD_TYPES['invalid']['img']);
                cardTypeLabel.innerHTML = '<img class="image-height" src="'+cardTypeimageUrl+CARD_TYPES['invalid']['img']+'" alt="'+CARD_TYPES['invalid']['full_name']+'">';
            }
        }
    }
    let formatted = '';
    if (cType === CPC_VISA || cType === CPC_DISCOVER || cType === 'invalid') {
        cardNumber.maxLength = MAX_LENGTH_VISA_AND_DISCOVER.toString();
        const v = value.replace(/[^\d^\*]/g, '').match(/.{1,4}/g);
        formatted = v ? v.join(' ') : '';
    } else if (cType == CPC_AMERICAN_EXPRESS) {
        cardNumber.maxLength = MAX_LENGTH_AMEX.toString();
        // const v = value.replace(/[^\d^\*]/g, '');
        formatted = value.replace(/(\W{4})(\W{6})(\W{1})/, '$1 $2 $3');
    }
    else if (cType === CPC_MASTERCARD) {
        cardNumber.maxLength = MAX_LENGTH_MASTERCARD.toString();
        const v = value.replace(/[^\d^\*]/g, '').match(/.{1,4}/g);
        formatted = v ? v.join(' ') : '';
    }
    if(config.cpcPageType.toLowerCase() === PaymentType[PaymentType.MinCardOnly].toString().toLowerCase() || config.cpcPageType.toLowerCase() === PaymentType[PaymentType.MinCardOnlyWithEdit].toString().toLowerCase()){
        cardNumber.value = formatted.replace(/\*/g,'#');
    }else{
        cardNumber.value = formatted;

    }
    
}

export const  getCardType = (value:any):string =>{
    value = value.replace(/\D/g, '');
    const cardTypeObj: any = creditCardType(value);
    let cType = 'invalid';
    const CARD_TYPES = getImageDetails();
    const cardAccepted = ACCEPTED_CARDS;
    if(cardTypeObj.length > 0 && cardAccepted.includes(cardTypeObj[0].type) === true) {
        cType = cardTypeObj[0].type;
    }

    if (value.length >= 4 ) {
        if (cardTypeObj.length > 0 && cType !== 'invalid') {
            cType = CARD_TYPES[cardTypeObj[0].type].name;
        }
    } else if (value.length <= 4) {
        cType = 'invalid';
    }
    return cType;
};
export const setCCImage= (cardTypeLabel:any) =>{
    const global = Globals.getInstance();
    const config = global.appState.get('config');
    const CARD_TYPES = getImageDetails();
    const cardTypeimageUrl = config.envConfig.globalUrl+CPC_GLOBAL_IMAGES_CARD_URL;
    if(cardTypeLabel.innerHTML !== '<img class="image-height" src="'+cardTypeimageUrl+CARD_TYPES['invalid']['img']+'" alt="'+CARD_TYPES['invalid']['full_name']+'">'){
        global.appState.set('cardImgUrl', cardTypeimageUrl+CARD_TYPES['invalid']['img']);
        cardTypeLabel.innerHTML = '<img class="image-height" src="'+cardTypeimageUrl+CARD_TYPES['invalid']['img']+'" alt="'+CARD_TYPES['invalid']['full_name']+'">';
    }
};
export function setPopupIcon(imgElement:any, fieldName:string){
    const config = Globals.getInstance().appState.get('config');
    const popupImageUrl = config.envConfig.globalUrl+CPC_GLOBAL_IMAGES_POPUP_URL;
    switch(fieldName){
    case 'cvv':
    case 'account-no':
    case 'routing-no':
    case 'stored-payment':
        imgElement.src = popupImageUrl + 'info-icon.svg';
        break;     
    case 'account-no-min-card':
    case 'routing-no-min-card':        
    case 'cvv-min-card':
        imgElement.src = popupImageUrl + 'info-q-icon.svg';
        break;   
    }
    
}
export function formatAmex(cardNum:string) {
    const cardNumArray = cardNum.split('');
    const formatCCNum = [];
    for(let i = 0; i < cardNumArray.length; i++) {
        if(i === 4) {
            const temp = cardNumArray[i];
            formatCCNum[i] = ' ';
            formatCCNum[i+1] = temp;
        } else if(i === 10) {
            const temp = cardNumArray[i];
            formatCCNum[i+1] = ' ';
            formatCCNum[i+2] = temp;
        } else {
            formatCCNum.push(cardNumArray[i]);
        }
    }
    return formatCCNum;
}
export function matchCardType(type:string) {
    const cType = type.replace(/-|\s/g,'').toLowerCase();
    const cardTypes = [CPC_VISA, CPC_MASTERCARD, CPC_DISCOVER, CPC_AMERICAN_EXPRESS, 'invalid'];
    // future cases JCB, Diners Club and UnionPay
    for(let i = 0; i < cardTypes.length; i++) {
        if(cType === cardTypes[i].replace(/-|\s/g,'').toLowerCase()) {
            return cardTypes[i];
        }
    }
    return 'invalid';
}
export function setIcon(imgElement:any, fieldName:string, event:any):void{
    const config = event.global.appState.get('config');
    const iconsUrl = config.envConfig.globalUrl+CPC_GLOBAL_IMAGES_ICONS_URL;
    if(!imgElement) {
        event.global.actionObserverService.fire(event,{detail:{action:JUMP_ERROR_MESSAGE_LOADED}});
    }
    switch(fieldName){
    case 'check-circle-fill':
        imgElement.src = iconsUrl + 'check-circle-fill.svg';
        break;
    case 'plus-circle':
        imgElement.src = iconsUrl + 'plus-circle.svg';
        break;
    case 'pencil-square':
        imgElement.src = iconsUrl + 'pencil-square.svg';
        break;
    case 'trash':
        imgElement.src = iconsUrl + 'trash.svg';
        break;    
    default:
        break;
    }
}
export function translatePsTypeToNiceType(type:string) {
    const cardType = type;
    if(cardType === 'MasterCard' || cardType === 'mastercard')
    {
        return 'Mastercard';
    }
    else if(cardType === 'AmericanExpress' || cardType === 'american-express')
    {
        return 'American Express';
    }
    else if(cardType === 'DinersClub')
    {
        return  'Diners Club';
    }
    else if(cardType === 'ChinaUnionPay')
    {
        return 'UnionPay';
    }   
    else
    {
        return cardType;
    }
}
