package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AutopayEnrollmentResponse {

    private long autoPayId;
    private String token;
    private String maskedAccountNumber;
    private String bankAccountType;
    private String bankAccountLast4Digits;
    private String avsCode;
    private String cardType;
    private String cardLast4Digits;
    private String expirationDate;
    private String debitDate;
    private String customerId;
    private SubmissionDetails submissionDetails;

}
