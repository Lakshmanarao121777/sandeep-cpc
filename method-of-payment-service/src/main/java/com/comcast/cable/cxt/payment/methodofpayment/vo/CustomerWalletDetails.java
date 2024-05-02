package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CustomerWalletDetails {

    private List<WalletBankDetails> banks;
    private List<WalletCardDetails> paymentCards;
    private String walletId;

}
