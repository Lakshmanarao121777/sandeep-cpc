package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WalletBankResponse {
    private String bankAccountLast4Digits;
    private String bankAccountType;
    private String maskedAccountNumber;
    private String token;
}
