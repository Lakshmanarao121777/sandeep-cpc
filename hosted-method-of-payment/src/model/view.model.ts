import { IguardPosition } from './channel-data';

export interface IViewModel{
  selectedPaymentType:string;
  firstName: any;
  lastName: any;
  cpcPageType: string;
  ccNo: any;
  cvv: any;
  cardType:string;
  expMonth: any;
  expYear: any;
  accountNo: any;
  routingNo: any;
  accountTypeChecking: any;
  accountTypeSaving: any;
  accountTypeCorporateChecking: any;
  template: ITemplates;
  channelData: IChannelData;
  encryptedCardNumber: string;
  encryptedAccountNumber: string;
  cardDetails: any;
}
export interface IViewModelEncrypted {
  firstName: string;
  lastName: string;
  cpcPageType: string;
  paytmentDetailType: string;
  paytmentDetail: any;
  channelData: any;

  //Billing info
  address: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;

}

export interface ITemplates {
  cc: any;
  ccContent: any;
  ach: any;
  achContent: any;
}

export interface IInputReference {    
    firstName:any;
    lastName:any;
    cc:any;
    ccImg:any;
    cardType:string;
    cvv:any;
    expMM:any;
    expYY:any;
    expiration:any;
    accountNo:any;
    routingNo:any;
    accountTypeChecking:any;
    accountTypeSaving:any;
    accountTypeCorporateChecking:any;

    //Billing info
    address: any;
    addressLine2: any;
    city: any;
    state: any;
    zipCode: any;

    addressOption:any;
    primaryAddressOption:any;
    secondaryAddressOption:any;
    newAddressOption:any;
    existingAddressInfo:any;
    addressTemplate:any;
    displayAddressOption:any;

    ccTemplateContainer:any;
    achTemplateContainer:any;
    ccModalPopupTrigger:any;
    jumpModalTrigger:any;
    jumpModalTriggerAcc:any;
    jumpModalTriggerRouting:any;
    minAchTemplateContainer:any;
    termsAndCondition:any;
    storedPayment:any;
    enrollInAutoPay:any;

    defaultPayment:any

    userrole:any
}
export interface IConfig {
  templateUrl: string;
  achTemplateUrl: string;
  cpcPageCssUrl:string;
  cpcEnv: string;
  cpcPageType:PaymentType;
  envConfig: IEnvironmentConfig
  cpcName:string;
  cpcPageLabelCase:LabelCase;
  cpcPageAccountType:string;
  channelTemplateMapping: IChannelTemplateMaping[];
  channelEnvironmentKeynameMapping:channelKeynameMapping[];
}
export interface channelKeynameMapping {
  channel:string,
  keyName:string,
  iguardEnvironment:string
}
export enum ENV_VARIABLES {
  local = 'local',
  development = 'development',
  integration = 'integration',
  preproduction = 'preproduction',
  production = 'production'
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

export interface IViewModelExternal {
  firstName: string;
  lastName: string;
  ccNo: string;
  accNo: string;
  address: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
}
export interface IEnvironmentConfig {
  iGuardUrl: any;
  cpcEnv: string;
  methodOfPaymentServiceUrl: IServiceOperation;
  orgId: string;
  cyberSourceDessionsManagerUrl: string;
  globalUrl:string;
}
export interface IServiceOperation {
  url: string;
  addToWallet: string;
  getPublicKey: string;
  getPaymentConfiguration: string;
  getExistingPaymentInstrument:string;
  getAllPaymentInstruments:string;
  updateExistingPaymentInstrument:string;
  deleteExistingPaymentInstrument:string;
  enrollInAutopay:string;
}
export interface IChannelTemplateMaping{
  channel: string;
  template: string;
  accountType: string;
}
export interface IEnvironment {
  local:IEnvironmentConfig[];
  development: IEnvironmentConfig;
  integration: IEnvironmentConfig;
  preproduction:IEnvironmentConfig[];
  production: IEnvironmentConfig;
}
export interface AddressDetails {
  addressLabel:string;
  address: string,
  addressLine2: string,
  city: string,
  state:string
  zip:string,
  defaultAddress:boolean
}
export interface IChannelData {
    config: {
      displayAddressOverride: boolean,
      paymentFrequency:any,
      enableManualEntry:boolean,
      enableMultipleUserSelection:boolean,
      displayAutoPayEnroll: boolean,
      newPaymentDisplayType: string,
      displayStoredPaymentOption:boolean,
      displaySetDefault: boolean,
      iguard:{
        enableIguardIntegration: boolean,
        email:string,
        phoneNumber:string,
        agentDetails:{
          ntUser:string,
        },
        bypass:{
          enabled: boolean,
          keypad: boolean,
          nocall:boolean, 
        },
        channelName:string, 
        position?:IguardPosition
      },
    }
    channelDetails: {
        sourceServerId: string, 
        sourceSystemId: string, 
        timestamp: string, // timestamp
        trackingId: string, 
        partnerId: string,
        sessionId: string,
        merchantId: string,
        channelName: string,
        enableFraudManager: boolean,
        deviceFingerprintId: string,
        ipAddress: string,
        cpcMessageDisplayLocation: string, 
        customerClass: string,
        requirePaymentMethodSelection: boolean;
    },
    customerDetails: {
        cimaUserToken: string,
        walletId: string,
        paymentToken: string,
        billingArrangementId: string,
        setDefaultPaymentInstrument: boolean;
        firstName: string,
        lastName: string,
        emailAddress: string,
        phone: string,
        ipAddress: string,
        displayAddress: boolean,
        addressList:Array<AddressDetails>,
        addressLabel: string,
        defaultAddress:boolean,
        address: string,
        addressLine2: string,
        city: string,
        state: string,
        zip: string
        isAddressChanged:boolean
    },
    agentDetails: {
      azureAdToken: string,
    },
    channelCustomData:{
      [key: string]: string
    },
    orderInfo: {
      orderItems:Array<OrderItemDetail>,
      shipTo: ShipToDetail,
    },
    authToken: string;
    paymentAmount:number;
    isSubmitPayment:boolean;
    existingPaymentMethodSortOrder:string;
    editForm:IViewModelExternal;
    header: any;
  }

export interface OrderItemDetail {
    productCode: string,
    productName: string, 
    productSKU: string,
    quantity: number,
    unitPrice: number
}

export interface ShipToDetail {
  address: ShipToAddressDetail,
  contact: ContactDetail,
  name: NameDetail,
  shippingMethod: string
}

export interface ShipToAddressDetail {
  address: string,
  addressLine2: string,
  city: string,
  state: string
  zip: string
}

export interface ContactDetail {
    emailAddress: string,
    phone: string
}

export interface NameDetail {
    firstName: string,
    lastName: string
}

export interface IKeyValuePair {
  key:string;
  value:string;
}
export interface IFormError {
  isFormValid:boolean | null;
  action:string;
  type:string;
  message:string;
  detail:any;
  level:string;
}

export enum MessageType {
  info = 'info',
  error = 'error',
  warning = 'warning',
  form = 'form',
  config = 'config',
  backend = 'backend'
}

export interface IUpdateInstrumentResponse {
  submissionDetails : {
    cpcStatus: string,
    cpcMessage: string,
    psErrorCode: string,
    psErrorMessage: string,
    trackingId: string,
    actionTaken: string,
    methodOfPaymentType: string,
  }
  customerDetails : any;
  cardDetails: any;
  bankDetails: any;
}

export interface IEventInfo{
  action:string;
  type?:string;
  currentValue?:any;
  dataLayerKey?:string;
  data:any;
}
export enum ErrorType {
  channel='channel',
  system='system',
  form='form',
  service='service',
  communication='communication',  
  default='default',
  card_block='card_block',
  bank_block='bank_block',
  card_and_bank_block='card_and_bank_block',
  channel_template_block='channel_template_block',
  payment_type='payment_type',
  bank='bank',
  card='card',
  invalid='invalid',
  no_value='no_value',
  first_name='first_name',
  last_name='last_name',
  address_line_1='address_line_1',
  address_line_2='address_line_2',
  city='city',
  state='state',
  zip='zip',
  account_type='account_type',
  bank_account_number='bank_account_number',
  routing_number='routing_number',
  alpha_characters='alpha_characters',
  too_many_digits='too_many_digits',
  not_enough_digits='not_enough_digits',
  card_number='card_number',
  expiration_month_year='expiration_month_year',
  date_in_past='date_in_past',
  security_code='security_code',
  american_express='american-express',
  discover='discover',
  mastercard='mastercard',
  visa='visa',
  autoPay='autoPay',
  stored_payment='stored_payment',
  userrole='user_role',
}
export interface IError{
  isValid:boolean;
  errorType:ErrorType;
  value?:string;
}
export enum CPCContentType {
  customer_class_residential='residential',
  customer_class_business='business',
  card_only_base_template = 'card-only-base-template',
  first_name='jump-first-name-label',
  last_name='jump-last-name-label',
  auto_pay = 'auto-pay-base-template',
  auto_pay_modal_title = 'auto-pay-modal-title',
  terms_conditions = 'terms-conditions-base-template',
  terms_conditions_modal_title = 'terms-conditions-modal-title',
  user_selection_base_title = 'user-selection-base-title',
  user_selection_title = 'user-selection-title',
  terms_conditions_base_template = 'terms-conditions-base-template',
  terms_conditions_title = 'terms-conditions-title',
  stored_payment_base_tooltip_content = 'stored-payment-base-tooltip-content',
  stored_payment_tooltip_content = 'stored-payment-tooltip-content',
}
