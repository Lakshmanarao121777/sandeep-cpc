package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentCardDetails {

    private Boolean defaultInstrument;
    private String customerDefinedName;
    private String token;
    private String paymentMode;
    private BillTo billTo;
    private String maskedAccountNumber;
    private String cardType;
    private String cvv;
    private String expirationDate;
    private String cardLast4Digits;
}
