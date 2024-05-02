package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class WalletDetails {

    private List<PaymentCardDetails> paymentCards;
    private List<PaymentBankDetails> banks;
    private String walletId;
}
