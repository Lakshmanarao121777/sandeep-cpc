export class ConfigData{
    public cpcPageType:string;
    constructor(cpcPageType:string){
        this.cpcPageType = cpcPageType;
    }
    getConfig(): any {
        const config = {
            cpcPageBorder: 'none',
            cpcEnv: 'local',
            channelTemplateMapping: [
                {
                    channel: 'XFINITY_MOBILE_LITE',
                    template: 'MinCardOnly',
                },
                {
                    channel: 'XFINITY_MOBILEBUS_LITE',
                    template: 'MinCardOnly',
                },
                {
                    channel: 'SMB_LITE',
                    template: 'CardOrBank',
                },
                {
                    channel: 'SMB_LITE',
                    template: 'CardOnly',
                },
                {
                    channel: 'SMB_LITE',
                    template: 'AchOnly',
                },
                {
                    channel: 'SMB',
                    template: 'CardOnly',
                },
                {
                    channel: 'SMB',
                    template: 'AchOnly',
                },
                {
                    channel: 'MMCES_LITE',
                    template: 'CardOrBank',
                },
                {
                    channel: 'MMCES_LITE',
                    template: 'CardOnly',
                },
                {
                    channel: 'MMCES_LITE',
                    template: 'AchOnly',
                },
                {
                    channel: 'MMCES_ONETIME',
                    template: 'CardOnly',
                },
                {
                    channel: 'MMCES_ONETIME',
                    template: 'AchOnly',
                },
                {
                    channel: 'CONSUMER_INT',
                    template: 'CardOrBank',
                },
                {
                    channel: 'CONSUMER_INT',
                    template: 'CardOnly',
                },
                {
                    channel: 'CONSUMER_INT',
                    template: 'AchOnly',
                },
                {
                    channel: 'CONSUMER_INT',
                    template: 'MinCardOnly',
                },
                {
                    channel: 'CONSUMER_INT',
                    template: 'MinCardOnlyWithEdit',
                },
            ],
            envConfig: {
                cpcEnv: 'http://localhost:8082/hosted-method-of-payment/index.html',
                methodOfPaymentServiceUrl: {
                    'url': 'https://common-payment.dev.xfinity.com/api/v2/MethodOfPaymentService/',
                    'addToWallet': 'addToWallet',
                    'getPublicKey': 'getPublicKey',
                    'getPaymentConfiguration': 'getPaymentConfiguration',
                    'getExistingPaymentInstrument': 'getExistingPaymentInstrument',
                    'updateExistingPaymentInstrument': 'updateExistingPaymentInstrument',
                    'getAllPaymentInstruments':'getAllPaymentInstruments',
                    'enrollInAutopay':'enrollInAutopay',
                }, 
                'orgId':'1snn5n9w',
                'cyberSourceDessionsManagerUrl':'https://h.online-metrix.net/fp/tags.js',
                'imageUrl':'https://common-payment.dev.xfinity.com/global-web-resources/images/cardtypes/',
                'cpcErrMappingUrl':'https://common-payment.dev.xfinity.com/global-web-resources/error_mapping/cpc-error-mapping.json',
                'templatesUrl':'https://common-payment.dev.xfinity.com/global-web-resources/templates/'
            },
            cpcPageHeight: '880px',
            cpcPageWidth: '90%',
            cpcPageType: this.cpcPageType,
            cpcPageLabelCase: 'CapOnlyFirst',
        };
        return config;
    }
    getChannelData(cpcMessageDisplayLocation:string):any{
        const channelDataInitTop = {
            'channelDetails': {
                'sourceServerId': 'localhost',
                'sourceSystemId': 'CONSUMER_INT',
                'timestamp': '2023-06-16T19:30:08.172Z',
                trackingId: '3',
                'partnerId': 'Comcast',
                sessionId: 'string',
                merchantId: 'string',
                'channelName': 'CONSUMER_INT',
                'enableFraudManager': true,
                deviceFingerprintId: 'string',
                ipAddress: 'string',
                'cpcMessageDisplayLocation': cpcMessageDisplayLocation,
                customerClass: 'string',
                'requirePaymentMethodSelection': true
            },
            'customerDetails': {
                'walletId': 'cust559903',
                'paymentToken': '6318136846436819704011',
                'billingArrangementId': '8919101010393451',
                'setDefaultPaymentInstrument': false,
                'firstName': 'Art',
                'lastName': 'Vandelay',
                'displayAddress': true,
                cimaUserToken: 'string',
                emailAddress: '',
                phone: '',
                ipAddress: '',
                addressLabel: 'string',
                defaultAddress: true,
                address: 'string',
                addressLine2: 'string',
                city: 'string',
                state: 'string',
                zip: 'string',
                isAddressChanged: true,
                storePaymentInstrumentLongTerm: true,
    
                'addressList': [
                    {
                        'addressLabel': 'Xfinity billing address on file',
                        'defaultAddress': false,
                        'address': '3940 Baltimore Avenue',
                        'addressLine2': 'Apt 2B',
                        'city': 'Philadelphia',
                        'state': 'PA',
                        'zip': '19104'
                    },
                    {
                        'addressLabel': 'Xfinity service address on file',
                        'defaultAddress': true,
                        'address': '1945 Chapmans Ln',
                        'addressLine2': 'Unit A225',
                        'city': 'Philadelphia',
                        'state': 'PA',
                        'zip': '19114'
                    }
                ]
            },
            'agentDetails': {
                'azureAdToken': ''
            },
            'config': {
                displayAutoPayEnroll: true, newPaymentDisplayType: 'button', displayStoredPaymentOption: true, displaySetDefault: true
                ,
                'displayAddressOverride': true,
                'iguard': {
                    'enableIguardIntegration': true,
                    'email': '',
                    'phoneNumber': '',
                    'agentDetails': {
                        'ntUser': 'CABLE\\svanga503'
                    },
                    'bypass': {
                        'enabled': true,
                        'keypad': false,
                        'nocall': false
                    },
                    'channelName': 'CAFEIG'
                },
                'paymentFrequency': 'onetime'
            },
            'paymentAmount': 9.99,
            'isSubmitPayment': true,
            'channelCustomData': {
                'channelCustomDataField1': '1945 Chapmans Ln',
                'channelCustomDataField2': 'Unit A225',
                'channelCustomDataField3': 'Philadelphia',
                'channelCustomDataField4': 'PA',
                'channelCustomDataField5': '19114',
                'channelCustomDataField6': 'null',
                'channelCustomDataField7': 'null',
                'channelCustomDataField8': 'TELESALES',
                'channelCustomDataField9': '',
                'channelCustomDataField10': '8919101010393451',
                'channelCustomDataField14': 'cust559903',
                'channelCustomDataField16': 'CONSUMER_INT',
                'channelCustomDataField20': 'RESIDENTIAL'
            },
            orderInfo: {
                orderItems: [],
                shipTo: {
                    address: {
                        'address': '3940 Baltimore Avenue',
                        'addressLine2': 'Apt 2B',
                        'city': 'Philadelphia',
                        'state': 'PA',
                        'zip': '19104'
                    },
                    contact: {
                        emailAddress: 'string',
                        phone: 'string'
                    },
                    name: {
                        firstName: 'string',
                        lastName: 'string'
                    },
                    shippingMethod: 'string'
                },
            },
            authToken: 'string',
            existingPaymentMethodSortOrder: 'asc',
            editForm: {
                firstName: 'sandeep',
                lastName: 'kumar',
                ccNo: 'string',
                accNo: 'string',
                address: 'string',
                addressLine2: 'string',
                city: 'string',
                state: 'string',
                zipCode: 'string',
            },
            header: {},
            selectedPaymentType: '10'
        };
    }

    getAddressObj():any {
        return {
            'fullAddress':{
                addressLine2: 'Cals dw',
                city: 'Philadelphia',
                state: 'PA',
                zip: '19103',
                address: '1701 JFK Blvd',
                addressLabel:'Primary Address'
            },
            'address':{
                city: 'Philadelphia',
                state: 'PA',
                zip: '19103',
                address: '1701 JFK Blvd',
                addressLabel:'Primary Address'
            }
        };
    }
}