package com.comcast.cable.cxt.payment.paymentContract.config;

import com.comcast.cable.cxt.payment.paymentContract.domains.PaymentContractServiceConstants;

public enum PaymentTermsEnum {

    BSD_DIGITAL_SALES("BCP05", "BCP11"),
    CAFE("BCP05", "BCP11"),
    CBPC_ONETIME("NA","CC15"),
    CBPC_RECURRING("NA", "CC15"),
    CONSUMER_INT("CMA11", "CMA11"),
    EINSTEIN_TKN("CCO2", "CC15"),
    PREPAID_TKN("NA", "CC15"),
    SMB("BCP05", "BCP11"),
    WEB_MY_ACCT("CCO2", "CC15");
    private final String autoPayTermID;
    private final String walletTermId;

    PaymentTermsEnum(String autoPayTermID, String walletTermId) {
        this.autoPayTermID = autoPayTermID;
        this.walletTermId = walletTermId;
    }

    public static String getTermIdForChannel(String channelName, String contractType){
        String termIdValue = "NO_CONFIGURED";

        for (PaymentTermsEnum termId : PaymentTermsEnum.values()) {
            if (termId.name().equalsIgnoreCase(channelName) && contractType.equalsIgnoreCase(PaymentContractServiceConstants.AUTOPAY)){
                termIdValue = termId.autoPayTermID;
            }else if(termId.name().equalsIgnoreCase(channelName) && contractType.equalsIgnoreCase(PaymentContractServiceConstants.WALLET)){
                termIdValue = termId.walletTermId;
            }
        }
        return termIdValue;
    }

}
