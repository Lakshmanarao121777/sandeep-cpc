package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AutopayServiceCardRequest {

    private BillingInfo billingInfo;
    private String cardType;
    private String customerId;

}
