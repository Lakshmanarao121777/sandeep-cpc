package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentConfigurationDetails {

    private String cpcStatus;
    private String psErrorCode;
    private String psErrorMessage;
    private String trackingId;
    private String billingArrangementId;
    private String paymentFrequency;
    private boolean bankblockStatus;
    private boolean cardblockStatus;

}
