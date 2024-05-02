package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AutopayEnrollmentRequest {

    private String channel;
    private String customerId;
    private BillingInfo billingInfo;
    private String bankAccountType;
    private String cardType;
    private String token;

}
