package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AutopayWithdrawRequest {

    private String channel;
    private BillingInfo billingInfo;

}
