package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GetExistingPaymentInstrumentRequest {

    private String billingArrangementId;
    private String channel;
    private String customerId;
    private String paymentToken;

    @Override
    public String toString() {
        return "GetExistingPaymentInstrumentRequest [billingArrangementId=" + billingArrangementId + ", channel=" + channel + ", customerId=" + customerId + ", paymentToken=" + paymentToken +"]";
    }
}
