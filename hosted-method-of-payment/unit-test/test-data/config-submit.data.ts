export class ConfigSubmitData{    
    getResponseChanelCustomData(channelName:string): any {
        const response = {
            'action': 'CPC_CONFIG_SUBMIT',
            'cpcMessage': 'Jump component cpc-ready.',
            'cpcStatus': 'SUCCESS',
            'channelData': {
                'key': 'CONSUMER_INT',
                'paymentAmount': 14.99,
                'isSubmitPayment': true,
                'requirePaymentMethodSelection': true,
                'existingPaymentMethodSortOrder': 'ATOZ',
                'config': {
                    'displayAutoPayEnroll': true,
                    'displayStoredPaymentOption': true,
                    'termsAndConditionsDisplayOption': 'modal',
                    'displayExistingListType': 'inline',
                    'storePaymentInstrumentLongTerm': true
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
                },
                'channelDetails': {
                    'sourceServerId': 'localhost',
                    'sourceSystemId': channelName,
                    'trackingId': 3,
                    'partnerId': 'Comcast',
                    'channelName': channelName,
                    'enableFraudManager': true,
                    'cpcMessageDisplayLocation': '',
                    'customerClass': 'residential',
                    'requirePaymentMethodSelection': true
                },
                'customerDetails': {
                    'walletId': 'cust559903',
                    'billingArrangementId': '8720101010393451',
                    'paymentToken': '6485859064326918803007',
                    'firstName': 'Art',
                    'lastName': 'Vandelay',
                    'displayAddress': true,
                    'address': '1701 JFK Blvd',
                    'addressLine2': 'Studio C',
                    'city': 'Philadelphia',
                    'state': 'PA',
                    'zip': '19103',
                    'displayAddressOverride': true,
                    'setDefaultPaymentInstrument': true,
                    'addressList': [
                        {
                            'addressLabel': 'Xfinity billing address on file',
                            'address': '3940 Baltimore Avenue',
                            'addressLine2': 'Apt 2B',
                            'city': 'Philadelphia',
                            'state': 'PA',
                            'zip': '19104'
                        },
                        {
                            'addressLabel': 'Xfinity service address on file',
                            'address': '1945 Chapmans Ln',
                            'addressLine2': 'Unit A225',
                            'city': 'Philadelphia',
                            'state': 'PA',
                            'zip': '19114'
                        }
                    ]
                },
                'agentDetails': {
                    'azureAdToken': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImpTMVhvMU9XRGpfNTJ2YndHTmd2UU8yVnpNYyJ9.eyJhdWQiOiJiMGRjODU4OC1jZDQzLTQ2NjEtYmExZi05MWE1ZmUxOTkzNDUiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vOTA2YWVmZTktNzZhNy00ZjY1LWI4MmQtNWVjMjA3NzVkNWFhL3YyLjAiLCJpYXQiOjE2NTI5MTI5MzksIm5iZiI6MTY1MjkxMjkzOSwiZXhwIjoxNjUyOTE2ODM5LCJhaW8iOiJFMlpnWU1oY0hTc3EySm9kdlg3V1NxNHVBY1pxQUE9PSIsImF6cCI6ImIwZGM4NTg4LWNkNDMtNDY2MS1iYTFmLTkxYTVmZTE5OTM0NSIsImF6cGFjciI6IjEiLCJvaWQiOiI5OTlkMWJiMi0xYmI5LTQ4ZTYtOTg5NC1hMmUwNmMyOTA1Y2UiLCJyaCI6IjAuQVEwQTZlOXFrS2QyWlUtNExWN0NCM1hWcW9pRjNMQkR6V0ZHdWgtUnBmNFprMFVOQUFBLiIsInJvbGVzIjpbIm1ldGhvZC1vZi1wYXltZW50LXNlcnZpY2UuYXBpLmFsbCJdLCJzdWIiOiI5OTlkMWJiMi0xYmI5LTQ4ZTYtOTg5NC1hMmUwNmMyOTA1Y2UiLCJ0aWQiOiI5MDZhZWZlOS03NmE3LTRmNjUtYjgyZC01ZWMyMDc3NWQ1YWEiLCJ1dGkiOiI4TmFFWTJLbG0wYWNRVVhGZGNnVUFBIiwidmVyIjoiMi4wIn0.QcJ8sAnI9lyad7Tadc9xaSQJzBGjuqn4PXJEGxaoCwf23JK_HYpY3x9KAURvZwbukz6TRFkH7wHosGW7zeuzKJg9WEz2Fvg9KKHfjZ2w7bq7DrTj-RAp7jIWXLVzY58O_Mi85XRVsRsaQ3GZSddcFJnWuN6Tfduc5uFZRqwZ-zhi5K2no5-DzhNLPbUVtrAt4NFRP-5jiWz4UTjkZzB7YF-gIkCoVRuz_Ca0eO61Q17baAPLDan-9R4rMUulAjlriDlRUEiUF1piQYFgUDLboX6TaHcsu0Ccod05z0y7MGVt4YClv5ec_r118cJNM4sb1Fr1HSAUPdT48-dUhzY6PA'
                }
            }
        };
        return response;
    }

    getResponseChanel(channelName:string): any {
        const response = {
            'action': 'CPC_CONFIG_SUBMIT',
            'cpcMessage': 'Jump component cpc-ready.',
            'cpcStatus': 'SUCCESS',
            'channelData': {
                'key': 'CONSUMER_INT',
                'paymentAmount': 14.99,
                'isSubmitPayment': true,
                'requirePaymentMethodSelection': true,
                'existingPaymentMethodSortOrder': 'ATOZ',
                'config': {
                    'displayAutoPayEnroll': true,
                    'displayStoredPaymentOption': true,
                    'termsAndConditionsDisplayOption': 'modal',
                    'displayExistingListType': 'inline',
                    'storePaymentInstrumentLongTerm': true
                },
                'channelDetails': {
                    'sourceServerId': 'localhost',
                    'sourceSystemId': channelName,
                    'trackingId': 3,
                    'partnerId': 'Comcast',
                    'channelName': channelName,
                    'enableFraudManager': true,
                    'cpcMessageDisplayLocation': '',
                    'customerClass': 'residential',
                    'requirePaymentMethodSelection': true
                },
                'customerDetails': {
                    'walletId': 'cust559903',
                    'billingArrangementId': '8720101010393451',
                    'paymentToken': '6485859064326918803007',
                    'firstName': 'Art',
                    'lastName': 'Vandelay',
                    'displayAddress': true,
                    'address': '1701 JFK Blvd',
                    'addressLine2': 'Studio C',
                    'city': 'Philadelphia',
                    'state': 'PA',
                    'zip': '19103',
                    'displayAddressOverride': true,
                    'setDefaultPaymentInstrument': true,
                    'addressList': [
                        {
                            'addressLabel': 'Xfinity billing address on file',
                            'address': '3940 Baltimore Avenue',
                            'addressLine2': 'Apt 2B',
                            'city': 'Philadelphia',
                            'state': 'PA',
                            'zip': '19104'
                        },
                        {
                            'addressLabel': 'Xfinity service address on file',
                            'address': '1945 Chapmans Ln',
                            'addressLine2': 'Unit A225',
                            'city': 'Philadelphia',
                            'state': 'PA',
                            'zip': '19114'
                        }
                    ]
                },
                'agentDetails': {
                    'azureAdToken': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImpTMVhvMU9XRGpfNTJ2YndHTmd2UU8yVnpNYyJ9.eyJhdWQiOiJiMGRjODU4OC1jZDQzLTQ2NjEtYmExZi05MWE1ZmUxOTkzNDUiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vOTA2YWVmZTktNzZhNy00ZjY1LWI4MmQtNWVjMjA3NzVkNWFhL3YyLjAiLCJpYXQiOjE2NTI5MTI5MzksIm5iZiI6MTY1MjkxMjkzOSwiZXhwIjoxNjUyOTE2ODM5LCJhaW8iOiJFMlpnWU1oY0hTc3EySm9kdlg3V1NxNHVBY1pxQUE9PSIsImF6cCI6ImIwZGM4NTg4LWNkNDMtNDY2MS1iYTFmLTkxYTVmZTE5OTM0NSIsImF6cGFjciI6IjEiLCJvaWQiOiI5OTlkMWJiMi0xYmI5LTQ4ZTYtOTg5NC1hMmUwNmMyOTA1Y2UiLCJyaCI6IjAuQVEwQTZlOXFrS2QyWlUtNExWN0NCM1hWcW9pRjNMQkR6V0ZHdWgtUnBmNFprMFVOQUFBLiIsInJvbGVzIjpbIm1ldGhvZC1vZi1wYXltZW50LXNlcnZpY2UuYXBpLmFsbCJdLCJzdWIiOiI5OTlkMWJiMi0xYmI5LTQ4ZTYtOTg5NC1hMmUwNmMyOTA1Y2UiLCJ0aWQiOiI5MDZhZWZlOS03NmE3LTRmNjUtYjgyZC01ZWMyMDc3NWQ1YWEiLCJ1dGkiOiI4TmFFWTJLbG0wYWNRVVhGZGNnVUFBIiwidmVyIjoiMi4wIn0.QcJ8sAnI9lyad7Tadc9xaSQJzBGjuqn4PXJEGxaoCwf23JK_HYpY3x9KAURvZwbukz6TRFkH7wHosGW7zeuzKJg9WEz2Fvg9KKHfjZ2w7bq7DrTj-RAp7jIWXLVzY58O_Mi85XRVsRsaQ3GZSddcFJnWuN6Tfduc5uFZRqwZ-zhi5K2no5-DzhNLPbUVtrAt4NFRP-5jiWz4UTjkZzB7YF-gIkCoVRuz_Ca0eO61Q17baAPLDan-9R4rMUulAjlriDlRUEiUF1piQYFgUDLboX6TaHcsu0Ccod05z0y7MGVt4YClv5ec_r118cJNM4sb1Fr1HSAUPdT48-dUhzY6PA'
                }
            }
        };
        return response;
    }
}