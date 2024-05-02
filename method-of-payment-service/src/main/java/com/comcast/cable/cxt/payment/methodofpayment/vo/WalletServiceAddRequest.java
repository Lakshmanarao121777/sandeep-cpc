package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WalletServiceAddRequest {

    private BillingInfo billingInfo;
    private String customerId;
    private Boolean enableDecisionManager;
    private String deviceFingerprintId;
    private String keyName;
    private Boolean secure;
    private PaymentCard paymentCard;
    private Bank bank;

}
