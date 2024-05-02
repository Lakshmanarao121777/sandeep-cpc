package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GetExistingPaymentInstrumentResponse {

    private String cpcStatus;
    private String psErrorCode;
    private String psErrorMessage;
    private String trackingId;
    private WalletCardDetails walletCardDetails;
    private WalletBankDetails walletBankDetails;
}
