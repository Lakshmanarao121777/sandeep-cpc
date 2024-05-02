package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubmissionDetails {

    private String cpcStatus;
    private String psErrorCode;
    private String psErrorMessage;
    private String trackingId;
    private String actionTaken;
    private String methodOfPaymentType;

}
