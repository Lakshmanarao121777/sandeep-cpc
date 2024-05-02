package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CpcUpdateCardDetails {

    private Boolean defaultInstrument;
    private String cardLast4Digits;
    private String cardType;
    private String expirationDate;
    private String token;
    private String maskedCardNumber;

}
