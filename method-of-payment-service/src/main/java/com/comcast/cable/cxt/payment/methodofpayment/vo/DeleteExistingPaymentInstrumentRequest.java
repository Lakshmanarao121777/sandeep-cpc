package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class DeleteExistingPaymentInstrumentRequest {

    private String channel;
    private String paymentToken;
    private BillTo billTo;
    private String customerId;
    private CpcUpdateBankDetails bankDetails;
    private CpcUpdateCardDetails cardDetails;

}
