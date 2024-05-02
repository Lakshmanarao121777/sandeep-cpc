export class FormSubmitData{    
    getResponseWithCustomData(channelName:string, cpcPageType:string): any {
        const response = {
            'action': 'CPC_FORM_SUBMIT',
            'cpcPageType': cpcPageType,
            'channelData': {
                'isSubmitPayment': true,
                'channelDetails': {
                    'sourceServerId': 'www.stg.xfinity.com',
                    'sourceSystemId': channelName,
                    'timestamp': '2023-05-12T14:02:09.418Z',
                    'partnerId': 'Comcast',
                    'trackingId': '60ca8bc7-7473-443b-96e1-daa2b909afc1',
                    'sessionId': '60ca8bc7-7473-443b-96e1-daa2b909afc1',
                    'deviceFingerprintId': '1683900086075',
                    'channelName': 'XFINITY_MOBILE_TKN',
                    'cpcMessageDisplayLocation': 'top',
                    'enableFraudManager': true,
                    'requirePaymentMethodSelection': true,
                    'merchantId': 'xfinitymobile'
                },
                'customerDetails': {
                    'walletId': 'ZAMJGTCDCK1598371137RI',
                    'cimaUserToken': 'CgNPQVQQARgCIoABeMY3COoAUttpC4-S02fFVqKCTR0KN4ylKr21v_DY-RuU4oB5kjyeFDXgs9TcvF3VLUWWwLczEjRqpf4XD8QssFIKFqTzqGMKA0QdlA2YxgBc91_RTclDyRj57pXsaJ0kdgi65JWbAdjEcQuWnGCqGdA7k7dHBLyjA_4oXBBts8EqELGbdPPCwcLRChSEZv1P4o8yUQoodXJuOmNpbWE6b2F1dGg6djI6YWNjZXNzLXRva2VuOmVuY3J5cHQ6MRIldXJuOmNpbWE6b2F1dGg6djI6YWNjZXNzLXRva2VuOnNpZ246MTrQAmssxi7d75kKqrMnwD3BOkyq5QEpZxWpOW7-L9Sz_Oo3mqC2Y1uJFQRvxbm6qv3ykDcS7p35WljkiP-luZIYSvxWyuFcuriZr9kUnr-B1gLOxcJaTzuHTk8RqRRPD_K5ZeEBW9rrEt-HvJI16hpsQEy7qBcDyoX4wz8GFseoumut0R46EHxmu9bbzO2FuaDRauQP2EKmpjn7YU_AwK0qUQN44-3nY2gUcSUbQ0IsfPaY830pucUyUbdxYW6ZoWkF6AGI4MqNPniFIDP8Tdyfe7O4oBjpmdp0FqW8e32wtI87UCQn82tBdrC3xe20qnysGmxdKCRKZirkNDjVVTFs_Yh_JRT-LzG50S7IISq4jSWQ3ZHwn6ubJ0tHJlzsNvxfp-KVgn0UIXXHOFwQrNWi3je3Pt_bWv9Bza85PPTl9vgjPmMHrZHIzWRjTALQ01PpVw**',
                    'customerGuid': 'ZAMJGTCDCK1598371137RI',
                    'billingArrangementId': '537405353',
                    'displayAddress': false,
                    'firstName': 'MODESTOERVPK',
                    'lastName': 'AUTOEQUZ',
                    'address': ' 100  N 18TH ST ',
                    'addressLine2': 'APT B73840 ',
                    'city': 'PHILADELPHIA',
                    'state': 'PA',
                    'zip': '19103'
                },
                'channelCustomData': {
                    'channelCustomDataField1': ' 100  N 18TH ST ',
                    'channelCustomDataField2': 'APT B73840 ',
                    'channelCustomDataField3': 'PHILADELPHIA',
                    'channelCustomDataField4': 'PA',
                    'channelCustomDataField5': '19103',
                    'channelCustomDataField6': '6101855555',
                    'channelCustomDataField7': '0',
                    'channelCustomDataField8': 'Online',
                    'channelCustomDataField10': '537405353',
                    'channelCustomDataField14': 'ZAMJGTCDCK1598371137RI',
                    'channelCustomDataField16': 'xfinitymobile',
                    'channelCustomDataField17': 'NoAgent',
                    'channelCustomDataField18': 'Online',
                    'channelCustomDataField20': 'RESIDENTIAL'
                },
                'orderInfo': {
                    'orderItems': [
                        {
                            'productCode': 'electronic',
                            'productName': 'BYOD',
                            'productSKU': '190198786043',
                            'quantity': 1,
                            'unitPrice': 699.99
                        }
                    ],
                    'shipTo': {
                        'contact': {
                            'emailAddress': 'Modesto_3515613@comcast.net',
                            'phone': '6101855555'
                        },
                        'name': {
                            'firstName': '',
                            'lastName': ''
                        },
                        'shippingMethod': ''
                    }
                }
            }
        };
        return response;
    }
    getResponse(channelName:string, cpcPageType:string): any {
        const response = {
            'action': 'CPC_FORM_SUBMIT',
            'cpcPageType': cpcPageType,
            'channelData': {
                'isSubmitPayment': true,
                'channelDetails': {
                    'sourceServerId': 'www.stg.xfinity.com',
                    'sourceSystemId': channelName,
                    'timestamp': '2023-05-12T14:02:09.418Z',
                    'partnerId': 'Comcast',
                    'trackingId': '60ca8bc7-7473-443b-96e1-daa2b909afc1',
                    'sessionId': '60ca8bc7-7473-443b-96e1-daa2b909afc1',
                    'deviceFingerprintId': '1683900086075',
                    'channelName': 'XFINITY_MOBILE_TKN',
                    'cpcMessageDisplayLocation': 'top',
                    'enableFraudManager': true,
                    'requirePaymentMethodSelection': true,
                    'merchantId': 'xfinitymobile'
                },
                'customerDetails': {
                    'walletId': 'ZAMJGTCDCK1598371137RI',
                    'cimaUserToken': 'CgNPQVQQARgCIoABeMY3COoAUttpC4-S02fFVqKCTR0KN4ylKr21v_DY-RuU4oB5kjyeFDXgs9TcvF3VLUWWwLczEjRqpf4XD8QssFIKFqTzqGMKA0QdlA2YxgBc91_RTclDyRj57pXsaJ0kdgi65JWbAdjEcQuWnGCqGdA7k7dHBLyjA_4oXBBts8EqELGbdPPCwcLRChSEZv1P4o8yUQoodXJuOmNpbWE6b2F1dGg6djI6YWNjZXNzLXRva2VuOmVuY3J5cHQ6MRIldXJuOmNpbWE6b2F1dGg6djI6YWNjZXNzLXRva2VuOnNpZ246MTrQAmssxi7d75kKqrMnwD3BOkyq5QEpZxWpOW7-L9Sz_Oo3mqC2Y1uJFQRvxbm6qv3ykDcS7p35WljkiP-luZIYSvxWyuFcuriZr9kUnr-B1gLOxcJaTzuHTk8RqRRPD_K5ZeEBW9rrEt-HvJI16hpsQEy7qBcDyoX4wz8GFseoumut0R46EHxmu9bbzO2FuaDRauQP2EKmpjn7YU_AwK0qUQN44-3nY2gUcSUbQ0IsfPaY830pucUyUbdxYW6ZoWkF6AGI4MqNPniFIDP8Tdyfe7O4oBjpmdp0FqW8e32wtI87UCQn82tBdrC3xe20qnysGmxdKCRKZirkNDjVVTFs_Yh_JRT-LzG50S7IISq4jSWQ3ZHwn6ubJ0tHJlzsNvxfp-KVgn0UIXXHOFwQrNWi3je3Pt_bWv9Bza85PPTl9vgjPmMHrZHIzWRjTALQ01PpVw**',
                    'customerGuid': 'ZAMJGTCDCK1598371137RI',
                    'billingArrangementId': '537405353',
                    'displayAddress': false,
                    'firstName': 'MODESTOERVPK',
                    'lastName': 'AUTOEQUZ',
                    'address': ' 100  N 18TH ST ',
                    'addressLine2': 'APT B73840 ',
                    'city': 'PHILADELPHIA',
                    'state': 'PA',
                    'zip': '19103'
                }
            }
        };
        return response;
    }
}