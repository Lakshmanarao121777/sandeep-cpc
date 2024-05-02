package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CpcUpdateBankDetails {

    private Boolean defaultInstrument;
    private String bankAccountType;
    private String bankAccountLast4Digits;
    private String token;
    private String maskedAccountNumber;
}
