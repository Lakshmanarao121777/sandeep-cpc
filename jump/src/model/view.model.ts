export interface IConfig {
    templateUrl: string;
    achTemplateUrl: string;
    cpcPageCssUrl:string;
    cpcEnv: string;
    cpcPageType:PaymentType;
    cpcPageHeight:string;
    cpcPageWidth:string;
    cpcPageBorder:string;
    cpcPageLabelCase:LabelCase;
    envConfig: IEnvironmentConfig;
    channelTemplateMapping: IChannelTemplateMaping[];  
    channelEnvironmentKeynameMapping: channelKeynameMapping[]  
}
export interface channelKeynameMapping {
    channel:string,
    keyName:string,
    iguardEnvironment:string
  }

export enum PaymentType {
    CardOnly = 1,
    AchOnly = 2,
    CardOrBank = 3,
    MinCardOnly = 4,
    MinCardOnlyWithEdit = 5,
    MinAchOnly = 6,
    CardOnlyWithEdit=7,
    AchOnlyWithEdit=8,
    CardOrExisting = 9,
    CardBankOrExisting = 10,
    WalletMgmtNoAutopay = 11,
    BankOrCard = 12,
    BankCardOrExisting = 13,
    CardExpirationEdit = 14,
}
export enum LabelCase {
    CapOnlyFirst = 1,
    CapAllFirst = 2
}
export interface IFrame {
    height: string;
    width: string;
    border: string;
    overflow:string;
    position:string;
}
export interface IEnvironmentConfig{
    cpcEnv: string;
    methodOfPaymentServiceUrl:IServiceOperation; 
    orgId: string; 
    cyberSourceDessionsManagerUrl: string;
    iGuardUrl:string;
}
export interface IChannelTemplateMaping{
    channel: string;
    template: string;
}
export interface IServiceOperation{
    url: string;
    addToWallet:string;
    getPublicKey: string;
    getPaymentConfiguration: string;
    getExistingPaymentInstrument:string;
    updateExistingPaymentInstrument:string;
    deleteExistingPaymentInstrument: string;
    getAllPaymentInstruments:string
    enrollInAutopay:string

}
export interface IEnvironment{
    development:IEnvironmentConfig;
    integration:IEnvironmentConfig;
    production:IEnvironmentConfig;
}
export interface IFormError{
    isFormValid:boolean | null;
    action:string;
    type:string;
    message:string;
    }
export enum MessageType{
    Info = 'info',
    Error = 'error',
    Warning = 'warning',
    Form = 'form',
    Config = 'config',
    Backend = 'backend',
    }