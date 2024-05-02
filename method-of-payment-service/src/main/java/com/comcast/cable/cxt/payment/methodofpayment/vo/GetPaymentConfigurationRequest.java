package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GetPaymentConfigurationRequest {

    private String channel;
    private String billingArrangementId;
    private String paymentFrequency;

    @Override
    public String toString() {
        return "GetPaymentConfigurationRequest [channel=" + channel + ", billingArrangementId=" + billingArrangementId + ", paymentFrequency=" + paymentFrequency +"]";
    }
}
