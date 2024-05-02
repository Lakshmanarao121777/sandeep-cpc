export class CommonTest {

    public init(pageType:string): any { 
        const url = 'https://common-payment.int.xfinity.com/2.1.0/hosted-method-of-payment/template/base/'+pageType+'.html';
        return url;
    }

    public prepareFormSubmitResponse(response:any,cpcPageType:string) : any{
        const formResponse:any = {
            'action': 'CPC_FORM_SUBMIT',
            'cpcPageType': cpcPageType,
            'channelData': {},
        };
        if(response.channelData){
            formResponse.channelData.isSubmitPayment = true;
            
            if(response.channelData.orderInfo) {
                formResponse.channelData.orderInfo = response.channelData.orderInfo;
            }
            if(response.channelData.channelDetails) {
                formResponse.channelData.channelDetails = response.channelData.channelDetails;
            }
            if(response.channelData.customerDetails) {
                formResponse.channelData.customerDetails = response.channelData.customerDetails;
            }
            if(response.channelData.channelCustomData) {
                formResponse.channelData.channelCustomData = response.channelData.channelCustomData;
            }

        }
        return formResponse;
    }
}