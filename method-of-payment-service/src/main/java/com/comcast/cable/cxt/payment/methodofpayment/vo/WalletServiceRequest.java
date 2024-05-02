package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WalletServiceRequest {
    private BillingInfo billingInfo;
    private String customerId;
    private Boolean enableDecisionManager;
    private String deviceFingerprintId;
    private String ipAddress;
    private String keyName;
    private OrderInfo orderInfo;
    private Boolean preAuthorization;
    private Boolean secure;
    private PaymentCard paymentCard;
    private Bank bank;

}
