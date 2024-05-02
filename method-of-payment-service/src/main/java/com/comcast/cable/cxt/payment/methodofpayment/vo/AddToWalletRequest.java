package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddToWalletRequest {

    private String channel;
    private AddInstrumentToWallet addInstrumentToWallet;
    private BillingInfo billingInfo;
    private OrderInfo orderInfo;
    private String customerId;
    private Boolean enableDecisionManager;
    private String deviceFingerprintId;
    private String ipAddress;
    private Boolean storePaymentInstrumentLongTerm;
    private Boolean enrollInAutopay;
    private BankDetails bankDetails;
    private CardDetails cardDetails;
    private BillTo billTo;

}
