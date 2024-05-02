import { CC } from '../constant/app.constant';
import { IChannelData } from '../model/channel-data';
import { IPersonalInfoModel } from '../model/personal-info-model';
import { Validation } from './validation';

export const derivePreAuthorization = (channelData: IChannelData, isStoredPaymentTermsCheckboxChecked: boolean) => {
    let returnValue:any = false;
    if(channelData?.customerDetails?.storePaymentInstrumentLongTerm !== null
        && channelData?.customerDetails?.storePaymentInstrumentLongTerm !== undefined) {
        returnValue = channelData.customerDetails.storePaymentInstrumentLongTerm;
    } else {
        returnValue = null;
    }
    if(channelData?.config?.displayStoredPaymentOption || channelData?.config?.displayAutoPayEnroll) {
        returnValue = isStoredPaymentTermsCheckboxChecked;
    } 
    return returnValue;
};

export const deriveAutopayEnroll = (channelData: IChannelData, isAutoPaySelected: boolean) => {
    let returnValue = false;

    if (channelData?.config?.displayAutoPayEnroll) {
        if(isAutoPaySelected) {
            returnValue = true;
        }
    } else if (channelData?.customerDetails?.enrollInAutopay) {
        returnValue = true;
    }
    
    return returnValue;
};

export const getPersonalInfo = (response: any, channelData: IChannelData, paymentType:string): IPersonalInfoModel => {
    const billDetailsBank = response?.walletBankDetails?.billTo?.name; 
    const billDetailsCard = response?.walletCardDetails?.billTo?.name;
    const details = paymentType === CC ?  billDetailsCard : billDetailsBank;
    const personalInfo = Object.assign({});
    const validations = new Validation();
    if (validations.isValidValue(details?.firstName)) {
        personalInfo.firstName = details?.firstName;
    } else {
        personalInfo.firstName = channelData.customerDetails.firstName;
    }
    if (validations.isValidValue(details?.lastName)) {
        personalInfo.lastName = details?.lastName;
    } else {
        personalInfo.lastName = channelData.customerDetails.lastName;
    }
    return personalInfo;
};

export const isWalletIdDWallet = (walletId: string): boolean => {
    let isDWallet = false;

    const DWalletIdRegex = /^([Dd][\d]{10,11}|[Dd][\d]{16})$/;
    if (walletId && DWalletIdRegex.test(walletId)) {
        isDWallet = true;
    }

    return isDWallet;
};