package com.comcast.cable.cxt.payment.methodofpayment.config;

import lombok.extern.log4j.Log4j2;
import com.comcast.cable.cxt.payment.methodofpayment.domains.MethodOfServiceConstants;

@Log4j2
public enum PaymentKeyEnum {

    BSD_DIGITAL_SALES("I_BSDCPC_001", "P_BSDCPC_001"),
    CAFE("I_CAFE_CPC001", "P_CAFE_CPC001"),
    CBPC_ONETIME("I_CBONETIME_CPC001", "P_CBONETIME_CPC001"),
    CBPC_QUICKPAY("I_CB_QUICKPAY_CPC001", "P_CB_QUICKPAY_CPC001"),
    CBPC_RECURRING("I_CB_RECUR_CPC001", "P_CB_RECUR_CPC001"),
    CONSUMER_INT("FUSION_1701", "NA"),
    EINSTEIN_TKN("I_EINSTEIN_CPC001", "P_EINSTEIN_CPC001"),
    MMCES_LITE("I_MMCESLITE_CPC001", "P_MMCESLITE_CPC001"),
    MMCES_ONETIME("I_MMCESOT_CPC001", "P_MMCESOT_CPC001"),
    PREPAID_TKN("I_PREPAID_CPC001", "P_PREPAID_CPC001"),
    PREPAID_LITE("I_PREPAIDLITE_CPC001", "P_PREPAIDLITE_CPC001"),
    SMB("I_SMB_CPC001", "P_SMB_CPC001"),
    SMB_LITE("I_SMBLITE_CPC001", "P_SMBLITE_CPC001"),
    XFINITY_MOBILE_TKN("I_XM_CPC001", "P_XM_CPC001"),
    XFINITY_MOBILE_LITE_TKN("I_XMLITE_CPC001", "P_XMLITE_CPC001"),
    XFINITY_MOBILEBUS("I_XMBUS_CPC001", "P_XMBUS_CPC001"),
    XFINITY_MOBILEBUS_LITE("I_XMBUSLITE_CPC001", "P_XMBUSLITE_CPC001"),
    WEB_MY_ACCT("I_WMACCT_CPC001", "P_WMACCT_CPC001"),
    WEB_LITE_MY_ACCT("I_WMACCTLITE_CPC001", "P_WMACCTLITE_CPC001");

    private final String nonProdKeyName;
    private final String prodKeyName;

    PaymentKeyEnum(String nonProdKeyName, String prodKeyName) {
        this.nonProdKeyName = nonProdKeyName;
        this.prodKeyName = prodKeyName;
    }

    public static String getKeyName(String channelName, String environment) {
        String channelKeyName = "NO_KEY_CONFIGURED";
        log.info(new StringBuilder("Getting Key from CPC-PaymentKeyEnum for ").append(channelName).append("-").append(environment).toString());
        for (PaymentKeyEnum key : PaymentKeyEnum.values()) {
            if (key.name().equalsIgnoreCase(channelName) && environment.contains(MethodOfServiceConstants.PRODUCTION_ENVIRONMENT)) {
                return key.prodKeyName;
            } else if (key.name().equalsIgnoreCase(channelName) && !environment.contains(MethodOfServiceConstants.PRODUCTION_ENVIRONMENT)) {
                return key.nonProdKeyName;
            }
        }

        return channelKeyName;
    }


}
