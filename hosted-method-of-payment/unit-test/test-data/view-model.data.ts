import { IAchOnlyModel } from '../../src/model/ach-only-model';
import { ICardOnlyModel } from '../../src/model/card-only-model';
import { IPersonalInfoModel } from '../../src/model/personal-info-model';

export class ViewModelData{
    public cpcPageType:string;
    
    constructor(cpcPageType:string){
        this.cpcPageType = cpcPageType;
    }
    getChannelData(): any {
        const vm = {
            channelDetails: {
                sourceServerId: 'localhost',
                sourceSystemId: 'CONSUMER_INT',
                timestamp: '2022-04-25T18:10:55.007Z',
                trackingId: 3,
                partnerId: 'Comcast',
                channelName: 'CONSUMER_INT',
                enableFraudManager: true,
                cpcMessageDisplayLocation: '',
                customerClass: 'residential',
            },
            customerDetails: {
                walletId: 'cust559903',
                paymentToken: '6318136846436819704011',
                billingArrangementId: '8720101010393451',
                firstName: 'Art',
                lastName: 'Vandelay',
                displayAddress: true,
                addressLine2: '',
                city: 'Philadelphia',
                state: 'PA',
                zip: '19103',
                address: '1701 JFK Blvd',
                userRoleList: [
                    {
                        defaultUserRole: false,
                        userId: 'Not Available',
                        role: 'Account holder',
                        walletId: 'BA8069100012014634',
                    },
                    {
                        defaultUserRole: false,
                        userId: 'testkotti123',
                        role: 'Primary user',
                        walletId: '9e9146cc-344c-4918-ad57-cea299dac3c4001',
                    },
                    {
                        defaultUserRole: false,
                        userId: '20211027091240949',
                        role: 'Account manager',
                        walletId: 'OPNHSMPYMF1635325961RI',
                    },
                ],
            },
            channelCustomData: {
                'channelCustomDataField1': 'field1value',
                'channelCustomDataField2': 'field2value'
            },
            agentDetails: {
                azureAdToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImpTMVhvMU9XRGpfNTJ2YndHTmd2UU8yVnpNYyJ9.eyJhdWQiOiJiMGRjODU4OC1jZDQzLTQ2NjEtYmExZi05MWE1ZmUxOTkzNDUiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vOTA2YWVmZTktNzZhNy00ZjY1LWI4MmQtNWVjMjA3NzVkNWFhL3YyLjAiLCJpYXQiOjE2NTI5MTI5MzksIm5iZiI6MTY1MjkxMjkzOSwiZXhwIjoxNjUyOTE2ODM5LCJhaW8iOiJFMlpnWU1oY0hTc3EySm9kdlg3V1NxNHVBY1pxQUE9PSIsImF6cCI6ImIwZGM4NTg4LWNkNDMtNDY2MS1iYTFmLTkxYTVmZTE5OTM0NSIsImF6cGFjciI6IjEiLCJvaWQiOiI5OTlkMWJiMi0xYmI5LTQ4ZTYtOTg5NC1hMmUwNmMyOTA1Y2UiLCJyaCI6IjAuQVEwQTZlOXFrS2QyWlUtNExWN0NCM1hWcW9pRjNMQkR6V0ZHdWgtUnBmNFprMFVOQUFBLiIsInJvbGVzIjpbIm1ldGhvZC1vZi1wYXltZW50LXNlcnZpY2UuYXBpLmFsbCJdLCJzdWIiOiI5OTlkMWJiMi0xYmI5LTQ4ZTYtOTg5NC1hMmUwNmMyOTA1Y2UiLCJ0aWQiOiI5MDZhZWZlOS03NmE3LTRmNjUtYjgyZC01ZWMyMDc3NWQ1YWEiLCJ1dGkiOiI4TmFFWTJLbG0wYWNRVVhGZGNnVUFBIiwidmVyIjoiMi4wIn0.QcJ8sAnI9lyad7Tadc9xaSQJzBGjuqn4PXJEGxaoCwf23JK_HYpY3x9KAURvZwbukz6TRFkH7wHosGW7zeuzKJg9WEz2Fvg9KKHfjZ2w7bq7DrTj-RAp7jIWXLVzY58O_Mi85XRVsRsaQ3GZSddcFJnWuN6Tfduc5uFZRqwZ-zhi5K2no5-DzhNLPbUVtrAt4NFRP-5jiWz4UTjkZzB7YF-gIkCoVRuz_Ca0eO61Q17baAPLDan-9R4rMUulAjlriDlRUEiUF1piQYFgUDLboX6TaHcsu0Ccod05z0y7MGVt4YClv5ec_r118cJNM4sb1Fr1HSAUPdT48-dUhzY6PA'
            },
            config:{
                displayStoredPaymentOption:true,
                enableMultipleUserSelection:false
            }
        };    
        return vm;

    }
    getViewModel(): any {
        const personalInfo:IPersonalInfoModel = Object.assign({});
        const cardInfo:ICardOnlyModel = Object.assign({});
        const achInfo:IAchOnlyModel = Object.assign({});
        const cpcPageType = 'cardonly';
        const templateContent:any = Object.assign({});
        personalInfo.firstName = 'Saeed';
        personalInfo.lastName = 'Ahmed';
        personalInfo.addressInfo = Object.assign({});
        personalInfo.addressInfo.address = '1701 JFK Blvd';
        personalInfo.addressInfo.addressLine2 = 'Studio C,';
        personalInfo.addressInfo.city = 'Philadelphia';
        personalInfo.addressInfo.state = 'PA';
        personalInfo.addressInfo.zipCode = '19103';
        
    
        cardInfo.ccNo = '4444 4444 4444 4448';
        cardInfo.expMonth = '01';
        cardInfo.expYear = '2029';
        cardInfo.cvv = '333';
        cardInfo.cardType = 'Visa';
    
        const vm = {
            personalInfo:personalInfo,
            cardInfo:cardInfo,
            accountInfo:achInfo,
            cpcPageType:cpcPageType, 
            templateContent:templateContent,
            channelData: this.getChannelData(),
            formSubmitChannelData: {
                paymentAmount: 14.99,
                isSubmitPayment: true,
                authToken:
            'CgNPQVQQARgCIoABp8Djp5UV32D-2rBKfy5gGGwj4tRComPHDHh5hgCaWqWk7v-QnN2JhXW_itNprD9AgwZI3eb9nKfsreiGEV4CR3rv1qCcWUfmr6Nvb7sbrM4Lr8BJTj_70bysJNbSpGralS9HWhVDrhFUVvpqJETyBZdReE8AdonQssYPoy6KkFcqEJgPq2v5SlbmpPgf3vesMy8yUQoodXJuOmNpbWE6b2F1dGg6djI6YWNjZXNzLXRva2VuOmVuY3J5cHQ6MRIldXJuOmNpbWE6b2F1dGg6djI6YWNjZXNzLXRva2VuOnNpZ246MTqAA4jaZKMrpgqrSDcd1nNfhY7eM7-iz4Fg7Cm3jBv1nazkGagbauE_Ipzc3YzfBrc5qSAcx7i7RJRCud_5RJT6aj_3HCt7CgAKwSLbemtxh9jx_A7_wABeuXMwQI0HV0_sVpeoq3VV5GusDvSBJKpmH7sFt3r1r_elONoMwNx48DRa9_IpY_p3qyLPG0oNwM0fq4vnvjSOQehBnU5vVPohg4BtyiGOMEOWEUIoO6Wo7NXAD-ZLkMohWMMHiJu2n60fgWcgQE384JH0tZ0TjPt8TyxboEmsX2KcHVMAQTJeyGVgvZytEcJpnHATmkpr7Rmkev4AkinGHu3XCUUk6Oy-uP7LLK2dS-4e3igD_HdNulVEQkrcAgFjxfhykLac-pZqDuOgzl8mV97TAYHByuJqIxrrdzP-XOTf_hu1OCs5ZEkql-ljLQCzdNxZlK7ziE1ETLcrPCoXovlcWcNqrJ7ZGvLpF9Yob0Q5szn9chyn4C-48OhHT9dtB_QjebYPF0B3Qg**',
                requestBody:
            'CgNPQVQQARgCIoABp8Djp5UV32D-2rBKfy5gGGwj4tRComPHDHh5hgCaWqWk7v-QnN2JhXW_itNprD9AgwZI3eb9nKfsreiGEV4CR3rv1qCcWUfmr6Nvb7sbrM4Lr8BJTj_70bysJNbSpGralS9HWhVDrhFUVvpqJETyBZdReE8AdonQssYPoy6KkFcqEJgPq2v5SlbmpPgf3vesMy8yUQoodXJuOmNpbWE6b2F1dGg6djI6YWNjZXNzLXRva2VuOmVuY3J5cHQ6MRIldXJuOmNpbWE6b2F1dGg6djI6YWNjZXNzLXRva2VuOnNpZ246MTqAA4jaZKMrpgqrSDcd1nNfhY7eM7-iz4Fg7Cm3jBv1nazkGagbauE_Ipzc3YzfBrc5qSAcx7i7RJRCud_5RJT6aj_3HCt7CgAKwSLbemtxh9jx_A7_wABeuXMwQI0HV0_sVpeoq3VV5GusDvSBJKpmH7sFt3r1r_elONoMwNx48DRa9_IpY_p3qyLPG0oNwM0fq4vnvjSOQehBnU5vVPohg4BtyiGOMEOWEUIoO6Wo7NXAD-ZLkMohWMMHiJu2n60fgWcgQE384JH0tZ0TjPt8TyxboEmsX2KcHVMAQTJeyGVgvZytEcJpnHATmkpr7Rmkev4AkinGHu3XCUUk6Oy-uP7LLK2dS-4e3igD_HdNulVEQkrcAgFjxfhykLac-pZqDuOgzl8mV97TAYHByuJqIxrrdzP-XOTf_hu1OCs5ZEkql-ljLQCzdNxZlK7ziE1ETLcrPCoXovlcWcNqrJ7ZGvLpF9Yob0Q5szn9chyn4C-48OhHT9dtB_QjebYPF0B3Qg**',
                requirePaymentMethodSelection: true,
                channelDetails: {
                    sourceServerId: 'localhost',
                    sourceSystemId: 'CONSUMER_INT',
                    timestamp: '2022-04-25T18:10:55.007Z',
                    trackingId: 3,
                    partnerId: 'Comcast',
                    channelName: 'CONSUMER_INT',
                    enableFraudManager: true,
                    cpcMessageDisplayLocation: '',
                    customerClass: 'residential',
                },
                customerDetails: {
                    walletId: 'cust559903',
                    paymentToken: '6318136846436819704011',
                    billingArrangementId: '8720101010393451',
                    firstName: 'Art',
                    lastName: 'Vandelay',
                    displayAddress: true,
                    addressLine2: '',
                    city: 'Philadelphia',
                    state: 'PA',
                    zip: '19103',
                    address: '1701 JFK Blvd',
                },
                channelCustomData: {
                    'channelCustomDataField1': 'field1value',
                    'channelCustomDataField2': 'field2value'
                }
            }
        };    
        return vm;
    }
}