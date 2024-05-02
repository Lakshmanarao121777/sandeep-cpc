package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CpcBankResponse {
    private String token;
    private boolean defaultInstrument;
    private String bankAccountLast4Digits;
    private String bankAccountType;
    private String maskedAccountNumber;
    private String routingNumber;
}
