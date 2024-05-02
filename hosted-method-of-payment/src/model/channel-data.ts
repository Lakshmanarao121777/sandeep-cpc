export interface IChannelData {
    config: {
        displayAddressOverride: boolean,
        displayAutoPayEnroll: boolean,
        newPaymentDisplayType: string,
        displayStoredPaymentOption:boolean,
        displaySetDefault: boolean,
        paymentFrequency:any,
        enableManualEntry:boolean,
        disableCardChange:any,
        enableMultipleUserSelection:boolean,
        enableIguardIntegration: boolean;
        iguard:{
            enableIguardIntegration: boolean;
            email:string;
            phoneNumber:string;
            agentDetails:{
              ntUser:string;
            },
            bypass:{
                enabled: boolean,
                keypad: boolean,
                nocall:boolean
            },
            channelName:string,
            dontClearTags?:boolean,
            position?:IguardPosition
          }
    },
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
        zip: string,
        isAddressChanged:boolean,
        storePaymentInstrumentLongTerm:boolean,
        enrollInAutopay: boolean,
        userRoleList: Array<UserRoleDetails>
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
    editForm:any;
    selectedPaymentType:string;
    header: any;
}

interface IChannelDetails {
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
}

export interface AddressDetails {
    addressLabel: string;
    address: string,
    addressLine2: string,
    city: string,
    state: string
    zip: string,
    defaultAddress: boolean
}
export interface UserRoleDetails{
    role: string,
    userId: string
    walletId: string,
    defaultUserRole : boolean
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
export interface IguardPosition{
    left :number,
    top:number,
    width:number,
    height:number
}

