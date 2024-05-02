package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GetAllPaymentInstrumentsResponse {

    private String cpcStatus;
    private String psErrorCode;
    private String psErrorMessage;
    private String trackingId;
    private CustomerWalletDetails customerWalletDetails;

}
