package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AutopayServiceBankRequest {

    private String bankAccountType;
    private BillingInfo billingInfo;
    private String customerId;

}
