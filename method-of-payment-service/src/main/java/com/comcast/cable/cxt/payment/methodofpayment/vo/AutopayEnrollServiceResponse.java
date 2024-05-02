package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AutopayEnrollServiceResponse {

    private int autoPayId;
    private String token;
    private String customerId;
    private String debitDate;
    private String maskedAccountNumber;
    private String bankAccountLast4Digits;
    private String bankAccountType;
    private String avsCode;
    private String cardLast4Digits;
    private String cardType;
    private String expirationDate;

}
