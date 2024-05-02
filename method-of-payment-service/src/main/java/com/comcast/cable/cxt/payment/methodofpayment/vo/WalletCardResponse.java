package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WalletCardResponse {

   private String token;
    private String cardLast4Digits;
    private String cardType;
    private String expirationDate;
    private String avsCode;
    private String maskedAccountNumber;
}
