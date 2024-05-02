package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AutopayTokenizeRequest {
    private BillingInfo billingInfo;
    private String customerId;
    private String keyName;
    private PaymentCard paymentCard;
    private Bank bank;
    private Boolean secure;
}
