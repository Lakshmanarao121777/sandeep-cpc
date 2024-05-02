import { DEFAULT_ACCOUNT_TYPE, CORPORATE_DEFAULT_ACCOUNT_TYPE, CORPORATE_ACCOUNT_TYPE } from '../constant/app.constant';
export const SERVICE_SAVINGS_VALUE = 'Saving';
export const SERVICE_CHECKING_VALUE = 'Checking';
export const SERVICE_CORPORATE_CHECKING_VALUE = 'CorporateChecking';

export const LABEL_PERSONAL_SAVINGS = 'Personal Savings';
export const LABEL_PERSONAL_CHECKING = 'Personal Checking';
export const LABEL_SAVINGS = 'Savings';
export const LABEL_CHECKING = 'Checking';
export const LABEL_CORPORATE_CHECKING = 'Corporate Checking';

interface Residential {
    LABEL_SAVINGS:string;
    LABEL_CHECKING:string;
    SERVICE_SAVINGS_VALUE:string;
    SERVICE_CHECKING_VALUE:string;
}
export const residential: Residential = {
    LABEL_SAVINGS:LABEL_SAVINGS,
    LABEL_CHECKING:LABEL_CHECKING,
    SERVICE_SAVINGS_VALUE:SERVICE_SAVINGS_VALUE,
    SERVICE_CHECKING_VALUE:SERVICE_CHECKING_VALUE,
};

interface Business {
    LABEL_CORPORATE_CHECKING:string;
    SERVICE_CORPORATE_CHECKING_VALUE:string;
}
export const business: Business = {
    LABEL_CORPORATE_CHECKING: LABEL_CORPORATE_CHECKING,
    SERVICE_CORPORATE_CHECKING_VALUE: SERVICE_CORPORATE_CHECKING_VALUE,
};

interface CBPC {
    LABEL_PERSONAL_SAVINGS:string;
    LABEL_PERSONAL_CHECKING:string;
    LABEL_CORPORATE_CHECKING:string;
    SERVICE_SAVINGS_VALUE:string;
    SERVICE_CHECKING_VALUE:string;
    SERVICE_CORPORATE_CHECKING_VALUE:string
}
export const cbpc: CBPC = {
    LABEL_PERSONAL_SAVINGS:LABEL_PERSONAL_SAVINGS,
    LABEL_PERSONAL_CHECKING: LABEL_PERSONAL_CHECKING,
    LABEL_CORPORATE_CHECKING: LABEL_CORPORATE_CHECKING, 
    SERVICE_SAVINGS_VALUE:SERVICE_SAVINGS_VALUE,
    SERVICE_CHECKING_VALUE:SERVICE_CHECKING_VALUE,
    SERVICE_CORPORATE_CHECKING_VALUE:SERVICE_CORPORATE_CHECKING_VALUE,
};

export const translatePaymentServiceBankAccountTypeToLabel = (accountType:string, channelType:any, channelName:any): string => {
    if(channelType) {
        channelType.forEach((accountInfo:any):any => {
            if(accountInfo.channel === channelName && (accountInfo.accountType === CORPORATE_DEFAULT_ACCOUNT_TYPE || accountInfo.accountType === CORPORATE_ACCOUNT_TYPE)) {
                if(accountType === SERVICE_SAVINGS_VALUE) {
                    accountType = LABEL_PERSONAL_SAVINGS;
                    return accountType;
                }
                if(accountType === SERVICE_CHECKING_VALUE) {
                    accountType = LABEL_PERSONAL_CHECKING;
                    return accountType;
                }
                if(accountType === SERVICE_CORPORATE_CHECKING_VALUE) {
                    accountType = LABEL_CORPORATE_CHECKING;
                    return accountType;
                }
            } else if(accountInfo.channel === channelName && accountInfo.accountType === DEFAULT_ACCOUNT_TYPE) {
                if(accountType === SERVICE_CORPORATE_CHECKING_VALUE) {
                    accountType = LABEL_CORPORATE_CHECKING;
                    return accountType;
                }
                if(accountType === SERVICE_CHECKING_VALUE) {
                    accountType = LABEL_CHECKING;
                    return accountType;
                }
                if(accountType === SERVICE_SAVINGS_VALUE) {
                    accountType = LABEL_SAVINGS;
                    return accountType;
                }
            }
        });
    }
    return accountType;
};

export const translateLabelBankAccountTypeToPaymentService = (accountType:string): any =>  {
    if(accountType === LABEL_PERSONAL_CHECKING) {
        accountType = 'Checking';
        return accountType;
    }
    if(accountType === LABEL_PERSONAL_SAVINGS) {
        accountType = 'Saving';
        return accountType;
    }
    if(accountType === LABEL_CORPORATE_CHECKING) {
        accountType ='CorporateChecking';
        return accountType;
    }
    return accountType;
};