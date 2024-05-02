export class AddToWalletResponseData{   
    public cpcPageType:string;
    
    constructor(cpcPageType:string){
        this.cpcPageType = cpcPageType;
    }
 
    getResponse(): any {
        const response = {
            customerDetails: {
                firstName: 'saeed',
                lastName: 'ahmed',
            },
            submissionDetails: {
                cpcStatus: 'SUCCESS',
                cpcMessage: 'Tokenization Successful.',
                psErrorCode: null,
                psErrorMessage: null,
                trackingId: '3',
                actionTaken: 'tokenize',
                methodOfPaymentType: 'card',
            },
            cardDetails: {
                token: '6318136846436819704011',
                cardLast4Digits: '4448',
                cardType: 'Visa',
                expirationDate: '0123',
                avsCode: null,
                maskedCardNumber: '************4448',
            },
            bankDetails: {
                token: null,
                bankAccountLast4Digits: null,
                bankAccountType: null,
                maskedAccountNumber: null,
            },
        };
        return response;
    }

    getAddToWalletResponse(): any {
        const response = 
            {
                'customerDetails':{'firstName':'s','lastName':''},
                'submissionDetails':{'cpcStatus':'SUCCESS','psErrorCode':null,'psErrorMessage':null,'trackingId':'3','actionTaken':'tokenize','methodOfPaymentType':'card'},
                'cardDetails':{'token':'6318136846436819704011','cardLast4Digits':'4448','cardType':'Visa','expirationDate':'0123','avsCode':null,'maskedCardNumber':'************4448'},
                'bankDetails':{'token':null,'bankAccountLast4Digits':null,'bankAccountType':null,'maskedAccountNumber':null}};
        
        return response;
    }
}