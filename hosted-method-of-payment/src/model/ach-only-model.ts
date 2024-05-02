export interface IAchOnlyModel{
    accountNo:string;
    routingNo:string;
    bankAccountLast4Digits: string,
    bankAccountType: string,
    maskedAccountNumber: string,
    encryptedAccountNumber:string;
    accountTypeChecking:string;
    accountTypeSaving:string;
    accountTypeCorporateChecking:string;
    jumpModalTriggerAcc:string;
    jumpModalTriggerRouting:string;
    achTemplateContainer:string;
    token:string;
}