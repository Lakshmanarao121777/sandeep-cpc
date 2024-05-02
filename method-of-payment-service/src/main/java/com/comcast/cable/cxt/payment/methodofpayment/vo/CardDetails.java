package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CardDetails {

    private String encryptedCardNumber;
    private String cardType;
    private String cvv;
    private String expirationDate;
    private String customerDefinedName;
}
